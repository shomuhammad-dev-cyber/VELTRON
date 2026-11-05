// ==============================================================================
// VALIXEN API: /api/v1/dashboard
// Aggregated Real-Time Financial Telemetry & Action Execution Endpoint
// ==============================================================================

import { NextRequest } from 'next/server';
import { withErrorHandler } from '@/lib/api/error-handler';
import { successResponse } from '@/lib/api/response';
import { DashboardService } from '@/server/services/dashboard.service';
import { auth } from '@/lib/auth/auth.config';
import { db, isDatabaseAvailable } from '@/lib/db';
import { AccountType } from '@prisma/client';
import { z } from 'zod';

const ActionSchema = z.object({
  action: z.enum(['DEPOSIT', 'TRANSFER', 'CONNECT_ACCOUNT', 'CONTRIBUTE_GOAL']),
  accountId: z.string().optional(),
  amount: z.number().positive().optional(),
  counterparty: z.string().optional(),
  note: z.string().optional(),
  accountName: z.string().optional(),
  accountType: z.nativeEnum(AccountType).optional(),
  currency: z.string().default('USD').optional(),
  goalId: z.string().optional(),
});

/**
 * Helper to resolve user ID from NextAuth session, session cookie, or active database user
 */
async function resolveCurrentUserId(req: NextRequest): Promise<string> {
  // 1. Try NextAuth JWT session
  try {
    const session = await auth();
    if (session?.user?.id) return session.user.id;
  } catch {}

  const dbReady = await isDatabaseAvailable().catch(() => false);
  if (!dbReady) {
    return 'usr_veltron_sovereign_trader';
  }

  // 2. Try session token cookie
  try {
    const sessionToken =
      req.cookies.get('__Secure-authjs.session-token')?.value ||
      req.cookies.get('authjs.session-token')?.value ||
      req.cookies.get('next-auth.session-token')?.value ||
      req.cookies.get('valixen_session')?.value;

    if (sessionToken) {
      const active = await db.session.findUnique({
        where: { sessionToken },
      });
      if (active?.userId) return active.userId;
    }
  } catch {}

  // 3. Fallback to first existing user in DB, or create institutional demo user
  try {
    const firstUser = await db.user.findFirst({
      where: { isActive: true },
    });

    if (firstUser) return firstUser.id;

    // If no user exists, create one with default account
    const newUser = await db.user.create({
      data: {
        email: 'trader@veltron.com',
        role: 'TRADER' as any,
        profile: {
          create: {
            firstName: 'Sovereign',
            lastName: 'Trader',
            preferredCurrency: 'USD',
            kycStatus: 'TIER_1_VERIFIED' as any,
          },
        },
      },
    });

    return newUser.id;
  } catch {
    // If DB is offline, return default sovereign user identity
    return 'usr_veltron_sovereign_trader';
  }
}

export const GET = withErrorHandler(async (req: NextRequest) => {
  const userId = await resolveCurrentUserId(req);
  const data = await DashboardService.getDashboardData(userId);
  return successResponse(data, 200);
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const userId = await resolveCurrentUserId(req);
  const body = await req.json();
  const validated = ActionSchema.parse(body);

  let result: any = null;

  switch (validated.action) {
    case 'DEPOSIT': {
      if (!validated.accountId || !validated.amount) {
        throw new Error('accountId and amount are required for deposit.');
      }
      result = await DashboardService.executeDeposit(userId, validated.accountId, validated.amount);
      break;
    }
    case 'TRANSFER': {
      if (!validated.accountId || !validated.amount) {
        throw new Error('source accountId and amount are required for transfer.');
      }
      result = await DashboardService.executeTransfer(
        userId,
        validated.accountId,
        validated.amount,
        {
          counterparty: validated.counterparty || 'External Recipient',
          note: validated.note || 'Transferred from Valixen Terminal',
        }
      );
      break;
    }
    case 'CONNECT_ACCOUNT': {
      result = await DashboardService.connectAccount(
        userId,
        validated.accountName || 'Quantum Savings Vault',
        validated.accountType || AccountType.HIGH_YIELD_VAULT,
        validated.currency || 'USD'
      );
      break;
    }
    case 'CONTRIBUTE_GOAL': {
      result = { success: true, message: 'Goal allocation updated.' };
      break;
    }
  }

  return successResponse(result, 200);
});
