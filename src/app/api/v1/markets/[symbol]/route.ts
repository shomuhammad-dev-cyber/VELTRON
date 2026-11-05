// ==============================================================================
// VALIXEN API: GET /api/v1/markets/[symbol]
// Detailed Asset Intelligence, Historical Candles & Official CBU Telemetry
// ==============================================================================

import { NextRequest } from 'next/server';
import { withErrorHandler } from '@/lib/api/error-handler';
import { successResponse } from '@/lib/api/response';
import { NotFoundError } from '@/lib/api/errors';
import { MarketIntelligenceService } from '@/server/services/market.service';

export const GET = withErrorHandler(
  async (req: NextRequest, context: { params: Promise<{ symbol: string }> }) => {
    const { symbol } = await context.params;
    if (!symbol) {
      throw new NotFoundError('Asset symbol parameter is required.');
    }

    const assetDetails = await MarketIntelligenceService.getAssetDetails(symbol);

    if (!assetDetails) {
      throw new NotFoundError('Financial asset', symbol.toUpperCase());
    }

    return successResponse(assetDetails, 200);
  }
);
