// ==============================================================================
// VALIXEN PRISMA ORM SINGLETON & DATABASE CONNECTION MANAGER
// ==============================================================================

import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

declare global {
  // eslint-disable-next-line no-var
  var globalPrisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const client = new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'event', level: 'error' },
      { emit: 'event', level: 'info' },
      { emit: 'event', level: 'warn' },
    ],
  });

  // Attach structured logging listeners
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (client as any).$on('error', (e: { message: string; target?: string }) => {
    logger.error('Prisma connection error', undefined, { target: e.target, message: e.message });
  });

  return client;
}

/**
 * Global singleton pattern prevents connection pool exhaustion in Next.js hot reload
 */
export const db = globalThis.globalPrisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.globalPrisma = db;
}

let lastDbCheckTime = 0;
let isDbHealthyCache = false;
let dbCheckInProgress: Promise<boolean> | null = null;

/**
 * Fast cached check to verify if the primary PostgreSQL cluster is responsive
 * Avoids long 4-12 second connection timeouts when running in offline/standalone mode
 */
export async function isDatabaseAvailable(): Promise<boolean> {
  const now = Date.now();
  if (now - lastDbCheckTime < 20000) {
    return isDbHealthyCache;
  }

  if (dbCheckInProgress) {
    return dbCheckInProgress;
  }

  dbCheckInProgress = (async () => {
    try {
      await Promise.race([
        db.$queryRaw`SELECT 1`,
        new Promise((_, reject) => setTimeout(() => reject(new Error('DB_TIMEOUT')), 500)),
      ]);
      isDbHealthyCache = true;
    } catch {
      isDbHealthyCache = false;
    } finally {
      lastDbCheckTime = Date.now();
      dbCheckInProgress = null;
    }
    return isDbHealthyCache;
  })();

  return dbCheckInProgress;
}

/**
 * Health check utility to probe database connectivity
 */
export async function checkDatabaseHealth(): Promise<{ isHealthy: boolean; latencyMs: number }> {
  const start = Date.now();
  try {
    const isAvailable = await isDatabaseAvailable();
    return { isHealthy: isAvailable, latencyMs: Date.now() - start };
  } catch (error) {
    logger.error('Database ping check failed', error);
    return { isHealthy: false, latencyMs: Date.now() - start };
  }
}
