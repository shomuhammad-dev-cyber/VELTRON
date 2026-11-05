// ==============================================================================
// VALIXEN VIRTUAL TRADES ROUTE HANDLER
// ==============================================================================

import { NextRequest } from 'next/server';
import { withErrorHandler } from '@/lib/api/error-handler';
import { successResponse } from '@/lib/api/response';
import { CreateTradeOrderSchema } from '@/lib/api/validator';
import { TradeService } from '@/server/services/trade.service';
import { enforceRateLimit } from '@/server/middleware/rate-limiter';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';
  await enforceRateLimit(clientIp);

  const demoUserId = 'demo-institutional-user';
  const portfolioId = req.nextUrl.searchParams.get('portfolioId') || undefined;

  const trades = await TradeService.getTradeHistory(demoUserId, portfolioId);
  return successResponse(trades);
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';
  await enforceRateLimit(clientIp);

  const body = await req.json();
  const validated = CreateTradeOrderSchema.parse(body);

  const demoUserId = 'demo-institutional-user';
  const executedTrade = await TradeService.executeVirtualTrade(demoUserId, validated);

  return successResponse(executedTrade, 201);
});
