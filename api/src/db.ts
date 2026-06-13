import pg from 'pg';
import { config } from './config.js';

// ─── Postgres with graceful in-memory fallback ────────────────────────────
// When DATABASE_URL is unset or unreachable, the API runs against an in-memory
// store so it never hard-fails (logged in STATUS.md). Production sets the URL.

export interface UserRow {
  id: string;
  handle: string;
  email: string;
  password_hash: string;
  onboarded: boolean;
  interests: string[];
  xp: number;
  created_at: string;
}

let pool: pg.Pool | null = null;
export let dbMode: 'postgres' | 'memory' = 'memory';

const memUsers = new Map<string, UserRow>(); // keyed by email

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id           TEXT PRIMARY KEY,
  handle       TEXT NOT NULL,
  email        TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  onboarded    BOOLEAN NOT NULL DEFAULT false,
  interests    JSONB NOT NULL DEFAULT '[]',
  xp           INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS solves (
  user_id     TEXT NOT NULL,
  room_id     TEXT NOT NULL,
  question_id TEXT NOT NULL,
  points      INTEGER NOT NULL DEFAULT 0,
  solved_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, room_id, question_id)
);
`;

export async function initDb(log: (m: string) => void): Promise<void> {
  if (!config.databaseUrl) {
    log('[db] DATABASE_URL not set — using in-memory store (mock mode).');
    return;
  }
  try {
    pool = new pg.Pool({ connectionString: config.databaseUrl, max: 8 });
    await pool.query('SELECT 1');
    await pool.query(SCHEMA);
    dbMode = 'postgres';
    log('[db] connected to Postgres and ensured schema.');
  } catch (e) {
    pool = null;
    dbMode = 'memory';
    log(`[db] Postgres unavailable (${(e as Error).message}) — falling back to memory.`);
  }
}

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  if (dbMode === 'postgres' && pool) {
    const r = await pool.query<UserRow>('SELECT * FROM users WHERE email=$1', [email]);
    return r.rows[0] ?? null;
  }
  return memUsers.get(email) ?? null;
}

export async function createUser(u: UserRow): Promise<UserRow> {
  if (dbMode === 'postgres' && pool) {
    await pool.query(
      `INSERT INTO users (id, handle, email, password_hash, onboarded, interests, xp)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [u.id, u.handle, u.email, u.password_hash, u.onboarded, JSON.stringify(u.interests), u.xp],
    );
    return u;
  }
  memUsers.set(u.email, u);
  return u;
}

export async function recordSolve(
  userId: string,
  roomId: string,
  questionId: string,
  points: number,
): Promise<void> {
  if (dbMode === 'postgres' && pool) {
    await pool.query(
      `INSERT INTO solves (user_id, room_id, question_id, points)
       VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING`,
      [userId, roomId, questionId, points],
    );
    await pool.query('UPDATE users SET xp = xp + $1 WHERE id=$2', [points, userId]);
  }
  // memory mode: progress is tracked client-side; nothing to persist here.
}

export async function closeDb(): Promise<void> {
  await pool?.end();
}
