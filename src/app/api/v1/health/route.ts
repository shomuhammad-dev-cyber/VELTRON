// ==============================================================================
// VELTRON SYSTEM HEALTH & SUPABASE DATABASE KEEP-ALIVE API (/api/v1/health)
// Runs periodic database keep-alive queries to prevent Supabase inactivity pausing
// ==============================================================================

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const startTime = Date.now();
  let dbStatus = 'DISCONNECTED';
  let userCount = 0;
  let dbLatencyMs = 0;

  try {
    // Run real database query on Supabase
    userCount = await db.user.count();
    dbLatencyMs = Date.now() - startTime;
    dbStatus = 'CONNECTED';
  } catch (error: any) {
    dbStatus = 'ERROR: ' + (error.message || 'Unknown database error');
  }

  const responsePayload = {
    service: 'VELTRON_ENTERPRISE_API',
    status: dbStatus === 'CONNECTED' ? 'HEALTHY' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    database: {
      provider: 'SUPABASE_POSTGRESQL',
      region: 'ap-southeast-1 (Singapore)',
      status: dbStatus,
      latencyMs: dbLatencyMs,
      totalRegisteredUsers: userCount,
    },
    telegramBot: {
      botUsername: '@VeltronAI_Bot',
      webhookEndpoint: '/api/v1/telegram/webhook',
      status: 'OPERATIONAL',
    },
    uptimeSeconds: Math.floor(process.uptime()),
  };

  return NextResponse.json(responsePayload, {
    status: dbStatus === 'CONNECTED' ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
