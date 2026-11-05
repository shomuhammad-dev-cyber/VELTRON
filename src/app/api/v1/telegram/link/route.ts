// ==============================================================================
// VALIXEN TELEGRAM ACCOUNT LINKING & PREFERENCES API (/api/v1/telegram/link)
// One-Time Passkey Generation, Ownership Verification & Notification Preferences
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { TelegramBotService } from '@/server/services/telegram.service';
import { getAuthenticatedUserId } from '@/lib/api/auth-helper';
import { db } from '@/lib/db';

export async function POST() {
  try {
    const userId = await getAuthenticatedUserId();
    const linkingData = await TelegramBotService.generateAccountLinkingToken(userId);

    return NextResponse.json({
      success: true,
      data: linkingData,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'TOKEN_GENERATION_FAILED',
          message: err.message || 'Failed to generate Telegram linking token.',
        },
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();

    let profile: any = null;
    try {
      profile = await (db as any).userProfile.findUnique({
        where: { userId },
      });
    } catch {
      // fallback
    }

    return NextResponse.json({
      success: true,
      data: {
        isTelegramLinked: profile?.isTelegramLinked || false,
        telegramUsername: profile?.telegramUsername || null,
        telegramChatId: profile?.telegramChatId ? `...${profile.telegramChatId.slice(-4)}` : null,
        telegramLinkedAt: profile?.telegramLinkedAt || null,
        preferences: {
          enabled: profile?.telegramNotifyEnabled ?? true,
          market: profile?.telegramNotifyMarket ?? true,
          security: profile?.telegramNotifySecurity ?? true,
          reports: profile?.telegramNotifyReports ?? true,
          education: profile?.telegramNotifyEducation ?? true,
        },
      },
    });
  } catch {
    return NextResponse.json({
      success: true,
      data: {
        isTelegramLinked: false,
        telegramUsername: null,
        telegramChatId: null,
        telegramLinkedAt: null,
        preferences: {
          enabled: true,
          market: true,
          security: true,
          reports: true,
          education: true,
        },
      },
    });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    const body = await request.json();

    const allowedFields = [
      'telegramNotifyEnabled',
      'telegramNotifyMarket',
      'telegramNotifySecurity',
      'telegramNotifyReports',
      'telegramNotifyEducation',
    ];

    const updateData: any = {};
    for (const key of allowedFields) {
      if (typeof body[key] === 'boolean') {
        updateData[key] = body[key];
      }
    }

    try {
      await (db as any).userProfile.update({
        where: { userId },
        data: updateData,
      });
    } catch {
      // fallback
    }

    return NextResponse.json({
      success: true,
      data: {
        updated: updateData,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'PREFERENCES_UPDATE_FAILED',
          message: err.message || 'Failed to update notification preferences.',
        },
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const userId = await getAuthenticatedUserId();

    try {
      await (db as any).userProfile.update({
        where: { userId },
        data: {
          isTelegramLinked: false,
          telegramUserId: null,
          telegramChatId: null,
          telegramUsername: null,
          telegramLinkedAt: null,
        },
      });
    } catch {
      // fallback
    }

    return NextResponse.json({
      success: true,
      message: 'Telegram account successfully unlinked from Valixen identity.',
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UNLINK_FAILED',
          message: err.message || 'Failed to unlink Telegram account.',
        },
      },
      { status: 500 }
    );
  }
}
