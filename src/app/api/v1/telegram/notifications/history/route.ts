// ==============================================================================
// VALIXEN TELEGRAM NOTIFICATION DELIVERY HISTORY API
// GET /api/v1/telegram/notifications/history
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUserId } from '@/lib/api/auth-helper';
import { TelegramNotificationCenterService } from '@/server/services/telegram-notification-center.service';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const history = await TelegramNotificationCenterService.getDeliveryHistory(userId, limit);

    return NextResponse.json({
      success: true,
      data: {
        history,
        total: history.length,
      },
    });
  } catch (err: any) {
    logger.error('Failed to get Telegram notification history', err);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve delivery history.' },
      { status: 500 }
    );
  }
}
