// ==============================================================================
// VALIXEN API: GET /api/v1/markets
// Real-Time CBU & Crypto Market Overview Feed
// ==============================================================================

import { NextRequest } from 'next/server';
import { withErrorHandler } from '@/lib/api/error-handler';
import { successResponse } from '@/lib/api/response';
import { MarketIntelligenceService } from '@/server/services/market.service';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const assets = await MarketIntelligenceService.getAllAssetsOverview();
  return successResponse(assets, 200);
});
