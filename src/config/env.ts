// ==============================================================================
// VALIXEN ENVIRONMENT CONFIGURATION VALIDATOR
// Ensures runtime fail-fast safety if critical variables are missing
// ==============================================================================

import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_APP_NAME: z.string().default('VALIXEN'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required for Prisma database connectivity.'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  REDIS_KEY_PREFIX: z.string().default('valixen:'),
  NEXTAUTH_URL: z.string().url().default('http://localhost:3000'),
  NEXTAUTH_SECRET: z.string().min(16, 'NEXTAUTH_SECRET must be at least 16 characters for token encryption.').default('valixen_default_development_secret_32_chars_min'),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW_SECONDS: z.coerce.number().default(60),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
});

function parseEnv() {
  const result = EnvSchema.safeParse(process.env);
  if (!result.success) {
    // eslint-disable-next-line no-console
    console.error('CRITICAL: Environment variable validation failed:', result.error.format());
    // In production we throw to fail immediately, in dev we fallback safely
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Environment validation failure.');
    }
  }
  return result.success ? result.data : EnvSchema.parse({});
}

export const env = parseEnv();
