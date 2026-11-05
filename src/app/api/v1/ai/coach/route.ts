// ==============================================================================
// VALIXEN API: /api/v1/ai/coach
// Behavioral Finance Diagnostics, Debt Optimization & Daily Action Workouts
// ==============================================================================

import { NextRequest } from 'next/server';
import { withErrorHandler } from '@/lib/api/error-handler';
import { successResponse } from '@/lib/api/response';
import { AiFinancialCoachService } from '@/server/services/ai-coach.service';
import { resolveUserId } from '@/lib/api/auth-helper';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const userId = await resolveUserId(req);
  const audit = await AiFinancialCoachService.getCoachDiagnostic(userId);
  return successResponse(audit, 200);
});
