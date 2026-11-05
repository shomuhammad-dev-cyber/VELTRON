// ==============================================================================
// VALIXEN GAMIFIED CHALLENGES API (/api/v1/gamification/challenges)
// Weekly & Monthly Structured Behavioral Protocols & XP Milestones
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { GamificationService } from '@/server/services/gamification.service';
import { getAuthenticatedUserId } from '@/lib/api/auth-helper';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cadence = searchParams.get('cadence') as 'WEEKLY' | 'MONTHLY' | null;

    const userId = await getAuthenticatedUserId();
    const challenges = await GamificationService.getCadenceChallenges(
      userId,
      cadence === 'WEEKLY' || cadence === 'MONTHLY' ? cadence : undefined
    );

    return NextResponse.json({
      success: true,
      data: {
        challenges,
        total: challenges.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CHALLENGES_FETCH_ERROR',
          message: error.message || 'Failed to retrieve gamified challenges.',
        },
      },
      { status: 500 }
    );
  }
}
