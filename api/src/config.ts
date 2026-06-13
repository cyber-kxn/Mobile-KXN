// Centralized config with safe fallbacks — the API boots even with no secrets.
export const config = {
  env: process.env.NODE_ENV ?? 'development',
  appName: process.env.APP_NAME ?? 'NETHEX',
  port: Number(process.env.API_PORT ?? 8080),
  host: process.env.API_HOST ?? '0.0.0.0',
  corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:5173,http://localhost:4173')
    .split(',')
    .map((s) => s.trim()),
  jwtSecret: process.env.JWT_SECRET ?? 'dev-only-change-me-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS ?? 10),
  databaseUrl: process.env.DATABASE_URL ?? '',
  redisUrl: process.env.REDIS_URL ?? '',
  brokerUrl: process.env.BROKER_URL ?? 'http://localhost:8090',
  anthropicKey: process.env.ANTHROPIC_API_KEY ?? '',
  anthropicModel: process.env.ANTHROPIC_MODEL ?? 'claude-opus-4-8',
  aiRateLimitPerMin: Number(process.env.AI_RATE_LIMIT_PER_MIN ?? 20),
  // Server-side salt for flag hashing (override in production).
  flagSalt: process.env.FLAG_SALT ?? 'nethex-default-salt',
};
