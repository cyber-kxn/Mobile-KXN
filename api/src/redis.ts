import Redis from 'ioredis';
import { config } from './config.js';

// Redis with in-memory fallback for rate limiting + lab leases.
let client: Redis | null = null;
export let redisMode: 'redis' | 'memory' = 'memory';

const memCounters = new Map<string, { n: number; exp: number }>();

export async function initRedis(log: (m: string) => void): Promise<void> {
  if (!config.redisUrl) {
    log('[redis] REDIS_URL not set — using in-memory counters.');
    return;
  }
  try {
    client = new Redis(config.redisUrl, { lazyConnect: true, maxRetriesPerRequest: 1 });
    await client.connect();
    await client.ping();
    redisMode = 'redis';
    log('[redis] connected.');
  } catch (e) {
    client = null;
    redisMode = 'memory';
    log(`[redis] unavailable (${(e as Error).message}) — falling back to memory.`);
  }
}

/** Fixed-window rate limit. Returns true if the action is allowed. */
export async function rateLimit(key: string, limit: number, windowSec: number): Promise<boolean> {
  if (redisMode === 'redis' && client) {
    const n = await client.incr(key);
    if (n === 1) await client.expire(key, windowSec);
    return n <= limit;
  }
  const now = Date.now();
  const rec = memCounters.get(key);
  if (!rec || rec.exp < now) {
    memCounters.set(key, { n: 1, exp: now + windowSec * 1000 });
    return true;
  }
  rec.n += 1;
  return rec.n <= limit;
}

export async function closeRedis(): Promise<void> {
  await client?.quit();
}
