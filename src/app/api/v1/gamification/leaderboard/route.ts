// ==============================================================================
// VALIXEN LEADERBOARD API (/api/v1/gamification/leaderboard)
// Scope-based gamified rankings with privacy opt-out compliance
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { GamificationService, LeaderboardScope } from '@/server/services/gamification.service';
import { getAuthenticatedUserId } from '@/lib/api/auth-helper';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scopeParam = (searchParams.get('scope') || 'GLOBAL').toUpperCase() as LeaderboardScope;
    const countryCode = searchParams.get('country') || 'ALL';
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const validScopes: LeaderboardScope[] = ['GLOBAL', 'COUNTRY', 'WEEKLY', 'MONTHLY', 'EDUCATION', 'DISCIPLINE'];
    const scope: LeaderboardScope = validScopes.includes(scopeParam) ? scopeParam : 'GLOBAL';

    const currentUserId = await getAuthenticatedUserId();

    const data = await GamificationService.getLeaderboard(scope, {
      countryCode,
      limit,
      currentUserId,
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'LEADERBOARD_ERROR',
          message: error.message || 'Failed to retrieve rankings data.',
        },
      },
      { status: 500 }
    );
  }
}
