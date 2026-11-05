// ==============================================================================
// VALIXEN TELEGRAM NOTIFICATION SETTINGS API
// GET /api/v1/telegram/notifications/settings
// PATCH /api/v1/telegram/notifications/settings
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUserId } from '@/lib/api/auth-helper';
import { TelegramNotificationCenterService } from '@/server/services/telegram-notification-center.service';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);
    const data = await TelegramNotificationCenterService.getPreferences(userId);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: any) {
    logger.error('Failed to get Telegram notification settings', err);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve notification settings.' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);
    const body = await req.json().catch(() => ({}));

    const updated = await TelegramNotificationCenterService.updatePreferences(userId, body);

    return NextResponse.json({
      success: true,
      message: 'Telegram notification preferences updated successfully.',
      data: updated,
    });
  } catch (err: any) {
    logger.error('Failed to update Telegram notification settings', err);
    return NextResponse.json(
      { success: false, error: 'Failed to update notification settings.' },
      { status: 500 }
    );
  }
}
