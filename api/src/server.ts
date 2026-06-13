import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import websocket from '@fastify/websocket';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { WebSocket } from 'ws';
import { z } from 'zod';
import { config } from './config.js';
import { initDb, closeDb, findUserByEmail, createUser, recordSolve, dbMode, type UserRow } from './db.js';
import { initRedis, closeRedis, rateLimit, redisMode } from './redis.js';
import { loadContent, getCatalog, checkAnswer } from './content.js';
import { mentorReply } from './ai.js';

const app = Fastify({ logger: { level: config.env === 'production' ? 'info' : 'debug' } });
const log = (m: string) => app.log.info(m);

await app.register(cors, { origin: config.corsOrigins, credentials: true });
await app.register(jwt, { secret: config.jwtSecret });
await app.register(websocket);

function publicUser(u: UserRow) {
  return {
    id: u.id,
    handle: u.handle,
    email: u.email,
    avatarSeed: u.handle,
    onboarded: u.onboarded,
    interests: u.interests,
  };
}

// ── Health ────────────────────────────────────────────────────────────────
app.get('/health', async () => ({
  status: 'ok',
  service: 'nethex-api',
  db: dbMode,
  redis: redisMode,
  ai: config.anthropicKey ? 'anthropic' : 'fallback',
  time: new Date().toISOString(),
}));

// ── Auth ────────────────────────────────────────────────────────────────
const registerSchema = z.object({
  handle: z.string().min(2).max(32),
  email: z.string().email(),
  password: z.string().min(6).max(200),
});

app.post('/auth/register', async (req, reply) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return reply.code(400).send({ error: 'invalid_input', details: parsed.error.flatten() });
  const { handle, email, password } = parsed.data;
  if (await findUserByEmail(email)) return reply.code(409).send({ error: 'email_taken' });
  const user: UserRow = {
    id: randomUUID(),
    handle,
    email,
    password_hash: await bcrypt.hash(password, config.bcryptRounds),
    onboarded: false,
    interests: [],
    xp: 0,
    created_at: new Date().toISOString(),
  };
  await createUser(user);
  const token = app.jwt.sign({ sub: user.id, handle }, { expiresIn: config.jwtExpiresIn });
  return { token, user: publicUser(user) };
});

const loginSchema = z.object({ email: z.string().email(), password: z.string() });

app.post('/auth/login', async (req, reply) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return reply.code(400).send({ error: 'invalid_input' });
  const user = await findUserByEmail(parsed.data.email);
  if (!user || !(await bcrypt.compare(parsed.data.password, user.password_hash)))
    return reply.code(401).send({ error: 'invalid_credentials' });
  const token = app.jwt.sign({ sub: user.id, handle: user.handle }, { expiresIn: config.jwtExpiresIn });
  return { token, user: publicUser(user) };
});

// Auth guard
async function requireUser(req: any, reply: any) {
  try {
    await req.jwtVerify();
  } catch {
    return reply.code(401).send({ error: 'unauthorized' });
  }
}

// ── Content ────────────────────────────────────────────────────────────────
app.get('/content/catalog', async () => getCatalog());

// ── Flag validation (server-side hashes) ─────────────────────────────────
const flagSchema = z.object({
  roomId: z.string(),
  questionId: z.string(),
  answer: z.string().min(1).max(500),
});

app.post('/flags/validate', { preHandler: requireUser }, async (req, reply) => {
  const parsed = flagSchema.safeParse(req.body);
  if (!parsed.success) return reply.code(400).send({ error: 'invalid_input' });
  const { roomId, questionId, answer } = parsed.data;
  const userId = (req.user as { sub: string }).sub;
  // basic anti-bruteforce
  const ok = await rateLimit(`flag:${userId}`, 30, 60);
  if (!ok) return reply.code(429).send({ error: 'rate_limited' });

  const { correct } = checkAnswer(roomId, questionId, answer);
  let points = 0;
  if (correct) {
    points = 50; // canonical points resolved from catalog in production
    await recordSolve(userId, roomId, questionId, points);
  }
  return { correct, points };
});

// ── Labs (proxy to broker, simulated fallback) ───────────────────────────
app.post('/labs/deploy', { preHandler: requireUser }, async (req, reply) => {
  const userId = (req.user as { sub: string }).sub;
  const allowed = await rateLimit(`lab:${userId}`, 10, 60);
  if (!allowed) return reply.code(429).send({ error: 'rate_limited' });
  const body = (req.body ?? {}) as { profileId?: string };
  try {
    const res = await fetch(`${config.brokerUrl}/sessions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ profileId: body.profileId, userId }),
    });
    if (!res.ok) throw new Error(`broker ${res.status}`);
    return await res.json();
  } catch (e) {
    log(`[labs] broker unavailable (${(e as Error).message}) — returning simulated session.`);
    return {
      sessionId: 'sim-' + randomUUID().slice(0, 8),
      status: 'running',
      expiresAt: Date.now() + 3600_000,
      nodes: [{ hostname: 'target', role: 'target', ip: '10.10.20.10' }],
      simulated: true,
    };
  }
});

app.delete('/labs/:id', { preHandler: requireUser }, async (req) => {
  const { id } = req.params as { id: string };
  try {
    await fetch(`${config.brokerUrl}/sessions/${id}`, { method: 'DELETE' });
  } catch {
    /* simulated session — nothing to tear down */
  }
  return { ok: true };
});

// ── AI mentor proxy (rate-limited) ───────────────────────────────────────
app.post('/ai/mentor', { preHandler: requireUser }, async (req, reply) => {
  const userId = (req.user as { sub: string }).sub;
  const ok = await rateLimit(`ai:${userId}`, config.aiRateLimitPerMin, 60);
  if (!ok) return reply.code(429).send({ error: 'rate_limited', reply: 'You are sending messages too quickly — give the mentor a moment.' });
  const r = await mentorReply((req.body ?? {}) as any);
  return r;
});

// ── Terminal WS bridge (PTY ↔ broker) ────────────────────────────────────
app.register(async (instance) => {
  instance.get('/ws/terminal', { websocket: true }, (socket, req) => {
    const url = new URL(req.url, 'http://localhost');
    const session = url.searchParams.get('session') ?? '';
    // Bridge to the broker's PTY websocket; if it fails, close so the client
    // falls back to its built-in simulated shell.
    const brokerWsBase = config.brokerUrl.replace(/^http/, 'ws');
    let upstream: WebSocket | null = null;
    try {
      upstream = new WebSocket(`${brokerWsBase}/ws/pty?session=${encodeURIComponent(session)}`);
      upstream.on('open', () => socket.send('\r\n\x1b[32m[connected to lab PTY]\x1b[0m\r\n'));
      upstream.on('message', (d) => socket.send(d.toString()));
      upstream.on('close', () => socket.close());
      upstream.on('error', () => socket.close());
      socket.on('message', (d: Buffer) => upstream?.readyState === WebSocket.OPEN && upstream.send(d.toString()));
    } catch {
      socket.close();
    }
    socket.on('close', () => upstream?.close());
  });
});

// ── Boot ────────────────────────────────────────────────────────────────
async function start() {
  await initDb(log);
  await initRedis(log);
  await loadContent(log);
  await app.listen({ port: config.port, host: config.host });
  log(`[nethex-api] listening on ${config.host}:${config.port} (db=${dbMode}, redis=${redisMode})`);
}

const shutdown = async () => {
  await app.close();
  await closeDb();
  await closeRedis();
  process.exit(0);
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

start().catch((e) => {
  app.log.error(e);
  process.exit(1);
});
