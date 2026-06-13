import Fastify from 'fastify';
import websocket from '@fastify/websocket';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { getProfile } from './profiles.js';
import {
  initDocker,
  provision,
  teardown,
  attachPty,
  dockerAvailable,
  type ProvisionedNode,
} from './docker.js';

const PORT = Number(process.env.BROKER_PORT ?? 8090);
const HOST = process.env.BROKER_HOST ?? '0.0.0.0';

interface Session {
  id: string;
  userId: string;
  profileId: string;
  nodes: ProvisionedNode[];
  expiresAt: number;
  simulated: boolean;
  timer: NodeJS.Timeout;
}

const sessions = new Map<string, Session>();

const app = Fastify({ logger: true });
const log = (m: string) => app.log.info(m);
await app.register(websocket);

app.get('/health', async () => ({
  status: 'ok',
  service: 'nethex-lab-broker',
  docker: dockerAvailable ? 'available' : 'simulated',
  active: sessions.size,
}));

const deploySchema = z.object({ profileId: z.string(), userId: z.string() });

app.post('/sessions', async (req, reply) => {
  const parsed = deploySchema.safeParse(req.body);
  if (!parsed.success) return reply.code(400).send({ error: 'invalid_input' });
  const { profileId, userId } = parsed.data;
  const profile = getProfile(profileId);
  if (!profile) return reply.code(404).send({ error: 'unknown_profile' });

  // Enforce per-user concurrent quota.
  const active = [...sessions.values()].filter((s) => s.userId === userId).length;
  if (active >= profile.maxPerUser) {
    return reply.code(429).send({ error: 'quota_exceeded', max: profile.maxPerUser });
  }

  const id = randomUUID().slice(0, 12);
  let result;
  try {
    result = await provision(id, profile, log);
  } catch (e) {
    log(`[broker] provision failed: ${(e as Error).message}`);
    return reply.code(500).send({ error: 'provision_failed' });
  }

  const expiresAt = Date.now() + profile.ttlSeconds * 1000;
  const timer = setTimeout(() => void destroy(id), profile.ttlSeconds * 1000);
  sessions.set(id, {
    id,
    userId,
    profileId,
    nodes: result.nodes,
    expiresAt,
    simulated: result.simulated,
    timer,
  });

  return {
    sessionId: id,
    status: 'running',
    expiresAt,
    nodes: result.nodes.map((n) => ({ hostname: n.hostname, role: n.role, ip: n.ip })),
    simulated: result.simulated,
  };
});

async function destroy(id: string): Promise<void> {
  const s = sessions.get(id);
  if (!s) return;
  clearTimeout(s.timer);
  sessions.delete(id);
  await teardown(id, log).catch(() => {});
}

app.delete('/sessions/:id', async (req) => {
  await destroy((req.params as { id: string }).id);
  return { ok: true };
});

// ── PTY over WebSocket ────────────────────────────────────────────────────
app.register(async (instance) => {
  instance.get('/ws/pty', { websocket: true }, async (socket, req) => {
    const url = new URL(req.url, 'http://localhost');
    const sessionId = url.searchParams.get('session') ?? '';
    const session = sessions.get(sessionId);

    if (!session) {
      socket.send('\r\n\x1b[31m[broker] session not found or expired\x1b[0m\r\n');
      socket.close();
      return;
    }

    // Pick the attacker node if present, else the first node.
    const primary = session.nodes.find((n) => n.role === 'attacker') ?? session.nodes[0];

    if (session.simulated || !primary?.containerId) {
      simulatedPty(socket, primary?.hostname ?? 'lab');
      return;
    }

    try {
      const stream = await attachPty(primary.containerId, 80, 24);
      stream.on('data', (d: Buffer) => socket.readyState === socket.OPEN && socket.send(d.toString('utf8')));
      stream.on('end', () => socket.close());
      socket.on('message', (d: Buffer) => stream.write(d));
      socket.on('close', () => stream.end());
    } catch (e) {
      log(`[broker] pty attach failed: ${(e as Error).message}`);
      simulatedPty(socket, primary?.hostname ?? 'lab');
    }
  });
});

// Minimal server-side echo PTY for simulated sessions.
function simulatedPty(socket: { send: (s: string) => void; on: (e: string, cb: (d: Buffer) => void) => void }, host: string) {
  socket.send(
    `\r\n\x1b[38;5;141m[broker] simulated PTY — Docker socket not mounted.\x1b[0m\r\n` +
      `\x1b[90mEgress: DROPPED · ephemeral session\x1b[0m\r\noperator@${host}:~$ `,
  );
  let line = '';
  socket.on('message', (d: Buffer) => {
    const s = d.toString();
    for (const ch of s) {
      if (ch === '\r') {
        const out = line === 'whoami' ? 'operator' : line === 'hostname' ? host : line ? `${line}: command not found` : '';
        socket.send(`\r\n${out ? out + '\r\n' : ''}operator@${host}:~$ `);
        line = '';
      } else if (ch === '\x7f') {
        line = line.slice(0, -1);
        socket.send('\b \b');
      } else {
        line += ch;
        socket.send(ch);
      }
    }
  });
}

async function start() {
  await initDocker(log);
  await app.listen({ port: PORT, host: HOST });
  log(`[nethex-lab-broker] listening on ${HOST}:${PORT}`);
}

const shutdown = async () => {
  for (const id of [...sessions.keys()]) await destroy(id);
  await app.close();
  process.exit(0);
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

start().catch((e) => {
  app.log.error(e);
  process.exit(1);
});
