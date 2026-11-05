// ==============================================================================
// VALIXEN SECURE XP AWARD API (/api/v1/gamification/award)
// Server-validated XP allocation with strict anti-tampering and idempotency
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { GamificationService, XpActivityType } from '@/server/services/gamification.service';
import { getAuthenticatedUserId } from '@/lib/api/auth-helper';

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    const body = await request.json();

    const { activityType, referenceId, customDescription } = body;

    const validTypes: XpActivityType[] = [
      'COURSE_COMPLETION',
      'QUIZ_PASSED',
      'BUDGETING_CHALLENGE',
      'PLANNING_HABIT',
      'SAVINGS_GOAL_REACHED',
      'EDUCATIONAL_ACTIVITY',
    ];

    if (!activityType || !validTypes.includes(activityType)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ACTIVITY_TYPE',
            message: `Activity type must be one of: ${validTypes.join(', ')}`,
          },
        },
        { status: 400 }
      );
    }

    if (!referenceId || typeof referenceId !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_REFERENCE_ID',
            message: 'A unique referenceId is strictly required to prevent duplicate XP rewards.',
          },
        },
        { status: 400 }
      );
    }

    const result = await GamificationService.awardXp({
      userId,
      activityType,
      referenceId: referenceId.trim(),
      customDescription,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'XP_AWARD_ERROR',
          message: error.message || 'Failed to award XP.',
        },
      },
      { status: 500 }
    );
  }
}
