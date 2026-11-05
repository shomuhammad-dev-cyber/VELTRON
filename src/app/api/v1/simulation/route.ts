// ==============================================================================
// VALIXEN API: /api/v1/simulation
// Virtual Paper Trading Order Routing, Positions & Analytics API
// ==============================================================================

import { NextRequest } from 'next/server';
import { withErrorHandler } from '@/lib/api/error-handler';
import { successResponse } from '@/lib/api/response';
import { SimulationService, SimulationOrderInput } from '@/server/services/simulation.service';
import { auth } from '@/lib/auth/auth.config';
import { db, isDatabaseAvailable } from '@/lib/db';
import { AssetClass } from '@prisma/client';
import { z } from 'zod';

const OrderPayloadSchema = z.object({
  action: z.enum(['ORDER', 'RESET']),
  symbol: z.string().optional(),
  assetClass: z.nativeEnum(AssetClass).default(AssetClass.CRYPTO).optional(),
  tradeType: z.enum(['BUY', 'SELL']).optional(),
  orderType: z.enum(['MARKET', 'LIMIT']).default('MARKET').optional(),
  quantity: z.number().positive().optional(),
  targetPrice: z.number().positive().optional(),
  notes: z.string().optional(),
});

async function resolveUserId(req: NextRequest): Promise<string> {
  try {
    const isAvailable = await isDatabaseAvailable();
    if (!isAvailable) return 'offline-trader-id';

    const session = await auth();
    if (session?.user?.id) return session.user.id;

    const sessionToken =
      req.cookies.get('__Secure-authjs.session-token')?.value ||
      req.cookies.get('authjs.session-token')?.value ||
      req.cookies.get('next-auth.session-token')?.value ||
      req.cookies.get('valixen_session')?.value;

    if (sessionToken) {
      const active = await db.session.findUnique({ where: { sessionToken } });
      if (active?.userId) return active.userId;
    }

    const firstUser = await db.user.findFirst({ where: { isActive: true } });
    if (firstUser) return firstUser.id;

    return 'offline-trader-id';
  } catch {
    return 'offline-trader-id';
  }
}

export const GET = withErrorHandler(async (req: NextRequest) => {
  const userId = await resolveUserId(req);
  const state = await SimulationService.getSimulationState(userId);
  return successResponse(state, 200);
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const userId = await resolveUserId(req);
  const body = await req.json();
  const validated = OrderPayloadSchema.parse(body);

  if (validated.action === 'RESET') {
    const resetResult = await SimulationService.resetSimulation(userId);
    return successResponse(resetResult, 200);
  }

  if (!validated.symbol || !validated.quantity || !validated.tradeType) {
    throw new Error('Symbol, quantity, and tradeType are required for virtual orders.');
  }

  const tradeResult = await SimulationService.executeVirtualOrder(userId, {
    symbol: validated.symbol,
    assetClass: validated.assetClass || AssetClass.CRYPTO,
    tradeType: validated.tradeType,
    orderType: validated.orderType || 'MARKET',
    quantity: validated.quantity,
    targetPrice: validated.targetPrice,
    notes: validated.notes,
  });

  return successResponse(tradeResult, 201);
});
