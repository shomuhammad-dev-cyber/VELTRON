// ==============================================================================
// VALIXEN API: /api/v1/challenges
// Financial Education Challenges, Gamified Task Progression & XP Claims
// ==============================================================================

import { NextRequest } from 'next/server';
import { withErrorHandler } from '@/lib/api/error-handler';
import { successResponse } from '@/lib/api/response';
import { EducationChallengesService } from '@/server/services/challenges.service';
import { resolveUserId } from '@/lib/api/auth-helper';
import { z } from 'zod';

const TaskToggleSchema = z.object({
  challengeId: z.string(),
  taskId: z.string(),
});

export const GET = withErrorHandler(async (req: NextRequest) => {
  const userId = await resolveUserId(req);
  const challenges = await EducationChallengesService.getChallenges(userId);
  return successResponse({ challenges }, 200);
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const userId = await resolveUserId(req);
  const body = await req.json();
  const { challengeId, taskId } = TaskToggleSchema.parse(body);

  const result = await EducationChallengesService.toggleTask(userId, challengeId, taskId);
  return successResponse(result, 200);
});
