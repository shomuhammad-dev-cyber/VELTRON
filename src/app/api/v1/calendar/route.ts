// ==============================================================================
// VALIXEN API: /api/v1/calendar
// Global Macroeconomic Releases & Central Bank Policy Telemetry
// ==============================================================================

import { NextRequest } from 'next/server';
import { withErrorHandler } from '@/lib/api/error-handler';
import { successResponse } from '@/lib/api/response';
import { EconomicCalendarService } from '@/server/services/calendar.service';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const url = new URL(req.url);
  const countryCode = url.searchParams.get('country') || 'ALL';
  const impact = url.searchParams.get('impact') || 'ALL';
  const search = url.searchParams.get('search') || '';

  const events = await EconomicCalendarService.getEvents({
    countryCode,
    impact,
    search,
  });

  return successResponse({ events }, 200);
});
