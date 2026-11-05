// ==============================================================================
// VALIXEN TELEGRAM NOTIFICATION TEST DISPATCH API
// POST /api/v1/telegram/notifications/test
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUserId } from '@/lib/api/auth-helper';
import {
  TelegramNotificationCenterService,
  TelegramNotificationCategory,
} from '@/server/services/telegram-notification-center.service';
import { logger } from '@/lib/logger';

const SAMPLE_ALERTS: Record<
  TelegramNotificationCategory,
  { title: string; message: string; actionUrl: string }
> = {
  MARKET_PRICE: {
    title: 'BTC/USD Crossed $95,000 Milestone',
    message: 'Bitcoin has established a new momentum benchmark at $95,240.00 (+4.8% 24h). Virtual equity valuation updated.',
    actionUrl: '/trading',
  },
  CURRENCY_EXCHANGE: {
    title: 'CBU Refinancing Rate Confirmed at 13.50%',
    message: 'Central Bank of Uzbekistan monetary board maintains headline policy rate. Commercial bank spreads recalibrated.',
    actionUrl: '/wallet',
  },
  PORTFOLIO_SUMMARY: {
    title: 'Daily Sovereign Risk Telemetry',
    message: 'Virtual simulation capital: $102,450.00. Sharpe Ratio: 2.14. Max portfolio drawdown: -4.20%.',
    actionUrl: '/analytics',
  },
  WEEKLY_REPORTS: {
    title: 'Weekly Wealth & Sovereign Runway Digest',
    message: 'Net capital capture velocity: 22.4%. Discretionary spend down 14%. Emergency reserve runway: 6.4 months.',
    actionUrl: '/reports',
  },
  EDUCATIONAL_COURSES: {
    title: 'New Course Live: "Central Banking & Macro Currencies"',
    message: 'Master monetary policy transmission mechanisms and FX hedging. Earn +450 XP upon module completion.',
    actionUrl: '/education',
  },
  CHALLENGE_REMINDERS: {
    title: 'Day 5 of 7-Day Zero Impulse Spending Protocol',
    message: 'Maintain your 48-hour purchasing pause. You are 2 days away from unlocking the "Iron Sentinel" medal.',
    actionUrl: '/challenges',
  },
  ACHIEVEMENTS: {
    title: 'Honor Unlocked: "Sovereign Accumulator"',
    message: 'Congratulations! You have maintained automated savings contributions for 30 consecutive days. +850 XP awarded.',
    actionUrl: '/achievements',
  },
  RANKING_UPDATES: {
    title: 'National Podium Movement: Rank #4 in Uzbekistan',
    message: 'Your merit rank has climbed to Top 4 in Uzbekistan. Total verified merit: 3,850 XP.',
    actionUrl: '/ranking',
  },
  SECURITY_NOTIFICATIONS: {
    title: 'SOC Center Verification: Zero Anomalous Sessions',
    message: 'Tamper-evident audit chain verified. Argon2id salt hashing and multi-factor assertions verified intact.',
    actionUrl: '/admin/security',
  },
  ACCOUNT_ACTIVITY: {
    title: 'Paper Trading Simulated Order Filled',
    message: 'Order filled: Bought 0.25 BTC at $94,820.00. Execution slippage: 0.01%. Order ID: #ORD-774921.',
    actionUrl: '/trading',
  },
};

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);
    const body = await req.json().catch(() => ({}));
    const category: TelegramNotificationCategory = body.category || 'MARKET_PRICE';

    const sample = SAMPLE_ALERTS[category] || SAMPLE_ALERTS.MARKET_PRICE;

    const result = await TelegramNotificationCenterService.enqueueNotification({
      userId,
      category,
      title: sample.title,
      message: sample.message,
      actionUrl: sample.actionUrl,
      idempotencyKey: `test_${userId}_${category}_${Date.now()}`,
    });

    return NextResponse.json({
      success: true,
      message: `Test notification for ${category} queued successfully.`,
      data: result,
    });
  } catch (err: any) {
    logger.error('Failed to trigger test notification', err);
    return NextResponse.json(
      { success: false, error: 'Failed to dispatch test notification.' },
      { status: 500 }
    );
  }
}
