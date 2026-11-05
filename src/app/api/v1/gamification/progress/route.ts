// ==============================================================================
// VALIXEN USER GAMIFICATION PROGRESS API (/api/v1/gamification/progress)
// Profile XP, Levels, Multi-Dimensional Ranks & Opt-Out Settings
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { GamificationService } from '@/server/services/gamification.service';
import { getAuthenticatedUserId } from '@/lib/api/auth-helper';

export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();
    const progress = await GamificationService.getUserProgress(userId);

    return NextResponse.json({
      success: true,
      data: progress,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'PROGRESS_FETCH_ERROR',
          message: error.message || 'Failed to retrieve user progress.',
        },
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    const body = await request.json();

    if (typeof body.isOptedOut !== 'boolean') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: "Field 'isOptedOut' must be a boolean.",
          },
        },
        { status: 400 }
      );
    }

    const result = await GamificationService.setLeaderboardOptOut(userId, body.isOptedOut);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SETTINGS_UPDATE_ERROR',
          message: error.message || 'Failed to update leaderboard privacy settings.',
        },
      },
      { status: 500 }
    );
  }
}
