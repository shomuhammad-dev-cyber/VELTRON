// ==============================================================================
// VELTRON TELEGRAM WEBHOOK API (/api/v1/telegram/webhook)
// Secure Telegram Bot Webhook endpoint with Secret Token Verification
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { TelegramBotService, TelegramUpdate } from '@/server/services/telegram.service';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    // 1. Verify Telegram Webhook Secret Token
    const secretHeader = request.headers.get('x-telegram-bot-api-secret-token');
    const isSecretValid = TelegramBotService.verifyWebhookSecret(secretHeader);

    if (!isSecretValid) {
      logger.warn('Unauthorized Telegram webhook attempt with invalid or missing secret token.');
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED_WEBHOOK',
            message: 'Invalid X-Telegram-Bot-Api-Secret-Token header signature.',
          },
        },
        { status: 401 }
      );
    }

    // 2. Parse and Validate Update
    const body: TelegramUpdate = await request.json();

    if (!body || typeof body.update_id !== 'number') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_UPDATE_PAYLOAD',
            message: 'Malformed update payload missing update_id.',
          },
        },
        { status: 400 }
      );
    }

    // 3. Process Update Idempotently
    const result = await TelegramBotService.processWebhookUpdate(body);

    logger.info(`[TELEGRAM WEBHOOK PROCESSED] update_id: ${body.update_id} | command: ${result.command || 'none'}`);

    // Always respond 200 OK to Telegram server to acknowledge receipt
    return NextResponse.json({
      ok: true,
      handled: result.handled,
      update_id: body.update_id,
    });
  } catch (err: any) {
    logger.error('Error handling Telegram webhook update', err);
    // Return 200 with error payload to prevent Telegram backoff flood
    return NextResponse.json(
      {
        ok: false,
        error: err.message || 'Internal webhook processing error.',
      },
      { status: 200 }
    );
  }
}

// Telegram occasionally tests webhook connectivity with GET/HEAD probes
export async function GET() {
  return NextResponse.json({
    status: 'ACTIVE',
    service: 'VELTRON_TELEGRAM_BOT_WEBHOOK',
    timestamp: new Date().toISOString(),
  });
}
