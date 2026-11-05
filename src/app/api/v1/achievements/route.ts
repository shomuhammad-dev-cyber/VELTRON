// ==============================================================================
// VALIXEN API: /api/v1/achievements
// Gamified Mastery Badges, User Level Tier Progression & XP Tracking
// ==============================================================================

import { NextRequest } from 'next/server';
import { withErrorHandler } from '@/lib/api/error-handler';
import { successResponse } from '@/lib/api/response';
import { AchievementsService } from '@/server/services/achievements.service';
import { resolveUserId } from '@/lib/api/auth-helper';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const userId = await resolveUserId(req);
  const progression = await AchievementsService.getUserProgression(userId);
  return successResponse(progression, 200);
});
