// ==============================================================================
// VELTRON TELEGRAM MINI APP (TMA) AUTHENTICATION ENDPOINT
// POST /api/v1/telegram/webapp/auth
// Validates cryptographic signature and provisions/retrieves linked account
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { TelegramWebAppAuthService } from '@/server/services/telegram-webapp-auth.service';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { initData } = body;

    if (!initData || typeof initData !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing raw initData parameter. Client-side authentication requires authentic Telegram WebApp initData.',
        },
        { status: 400 }
      );
    }

    // 1. Cryptographically validate Telegram signature and timestamp
    const validation = TelegramWebAppAuthService.validateTelegramInitData(initData);
    if (!validation.valid || !validation.data) {
      logger.warn('[TMA AUTH REJECTED]', { error: validation.error });
      return NextResponse.json(
        {
          success: false,
          error: validation.error || 'Cryptographic validation failed.',
        },
        { status: 401 }
      );
    }

    // 2. Resolve or provision linked platform user account
    const userSession = await TelegramWebAppAuthService.authenticateOrProvisionUser(validation.data);

    // 3. Create response and attach secure session cookie
    const res = NextResponse.json({
      success: true,
      message: 'Telegram Mini App authenticated successfully.',
      data: {
        user: userSession,
        telegramUser: validation.data.user,
        startParam: validation.data.start_param || null,
        authenticatedAt: new Date().toISOString(),
      },
    });

    // Set cookie for subsequent API calls inside the WebApp
    res.cookies.set('veltron_tma_user', userSession.userId, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return res;
  } catch (err: any) {
    logger.error('[TMA AUTH ERROR]', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error while processing Telegram Mini App authentication.',
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    service: 'Veltron Telegram Mini App Authentication Node',
    version: '1.0.0',
    status: 'ACTIVE',
    supportedDeepLinks: [
      'https://t.me/VeltronAI_Bot?startapp=dashboard',
      'https://t.me/VeltronAI_Bot?startapp=markets',
      'https://t.me/VeltronAI_Bot?startapp=ranking',
      'https://t.me/VeltronAI_Bot?startapp=education',
      'https://t.me/VeltronAI_Bot?startapp=analytics',
    ],
  });
}
