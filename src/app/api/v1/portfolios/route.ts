// ==============================================================================
// VALIXEN PORTFOLIOS ROUTE HANDLER
// ==============================================================================

import { NextRequest } from 'next/server';
import { withErrorHandler } from '@/lib/api/error-handler';
import { successResponse } from '@/lib/api/response';
import { PortfolioService } from '@/server/services/portfolio.service';
import { enforceRateLimit } from '@/server/middleware/rate-limiter';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';
  await enforceRateLimit(clientIp);

  const demoUserId = 'demo-institutional-user';
  const portfolios = await PortfolioService.getUserPortfolios(demoUserId);

  return successResponse(portfolios);
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';
  await enforceRateLimit(clientIp);

  const body = await req.json();
  const demoUserId = 'demo-institutional-user';

  const newPortfolio = await PortfolioService.createPortfolio({
    userId: demoUserId,
    name: body.name || 'Alpha Simulation Vault',
    description: body.description,
    isVirtual: body.isVirtual ?? true,
    baseCurrency: body.baseCurrency || 'USD',
  });

  return successResponse(newPortfolio, 201);
});
