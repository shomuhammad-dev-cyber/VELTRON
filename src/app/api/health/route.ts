// ==============================================================================
// VALIXEN HEALTH & TELEMETRY ROUTE HANDLER
// ==============================================================================

import { NextRequest } from 'next/server';
import { withErrorHandler } from '@/lib/api/error-handler';
import { successResponse } from '@/lib/api/response';
import { checkDatabaseHealth } from '@/lib/db';
import { redis } from '@/lib/redis';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const dbHealth = await checkDatabaseHealth();
  let redisStatus = 'healthy';

  try {
    await redis.ping();
  } catch {
    redisStatus = 'degraded_in_memory_fallback';
  }

  const telemetry = {
    service: 'veltron-core-api',
    status: dbHealth.isHealthy ? 'HEALTHY' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    uptimeSeconds: process.uptime(),
    memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    infrastructure: {
      database: {
        status: dbHealth.isHealthy ? 'CONNECTED' : 'DISCONNECTED',
        latencyMs: dbHealth.latencyMs,
      },
      cache: {
        status: redisStatus,
      },
    },
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  };

  return successResponse(telemetry, dbHealth.isHealthy ? 200 : 503);
});
