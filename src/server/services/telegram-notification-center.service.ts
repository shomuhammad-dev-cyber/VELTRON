// ==============================================================================
// VELTRON ADVANCED TELEGRAM NOTIFICATION CENTER SERVICE
// Granular 10-Category Opt-In Preferences, Resilient Job Queue, Idempotency & Retries
// ==============================================================================

import crypto from 'crypto';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { TelegramBotService } from './telegram.service';

export type TelegramNotificationCategory =
  | 'MARKET_PRICE'
  | 'CURRENCY_EXCHANGE'
  | 'PORTFOLIO_SUMMARY'
  | 'WEEKLY_REPORTS'
  | 'EDUCATIONAL_COURSES'
  | 'CHALLENGE_REMINDERS'
  | 'ACHIEVEMENTS'
  | 'RANKING_UPDATES'
  | 'SECURITY_NOTIFICATIONS'
  | 'ACCOUNT_ACTIVITY';

export interface TelegramNotificationPreferences {
  enabled: boolean;
  marketPrice: boolean;
  currencyExchange: boolean;
  portfolioSummary: boolean;
  weeklyReports: boolean;
  educationalCourses: boolean;
  challengeReminders: boolean;
  achievementAlerts: boolean;
  rankingUpdates: boolean;
  securityAlerts: boolean;
  accountActivity: boolean;
}

export interface EnqueueNotificationParams {
  userId: string;
  category: TelegramNotificationCategory;
  title: string;
  message: string;
  idempotencyKey?: string;
  actionUrl?: string;
  priority?: 'HIGH' | 'NORMAL' | 'CRITICAL';
}

export interface DeliveryLogRecord {
  id: string;
  userId: string;
  chatId: string;
  category: string;
  title: string;
  message: string;
  status: 'DELIVERED' | 'FAILED' | 'SKIPPED' | 'PENDING';
  attempts: number;
  maxAttempts: number;
  lastError?: string | null;
  deliveredAt?: string | null;
  createdAt: string;
}

// In-memory queue buffer for resilience and testing
const inMemoryPreferences = new Map<string, TelegramNotificationPreferences>();
const inMemoryDeliveryLogs = new Map<string, DeliveryLogRecord>();
const inMemoryLinkedUsers = new Map<string, { chatId: string; username: string }>();
const activeJobQueue: Array<{
  deliveryId: string;
  chatId: string;
  text: string;
  replyMarkup?: any;
  attempts: number;
  maxAttempts: number;
}> = [];

let isQueueWorkerRunning = false;

export class TelegramNotificationCenterService {
  private static get appUrl(): string {
    return process.env.NEXT_PUBLIC_APP_URL || 'https://veltron.com';
  }

  /**
   * Mock / in-memory linking registration for test and offline resilience
   */
  public static setMockLinkedUser(userId: string, chatId: string, username = 'allocator') {
    inMemoryLinkedUsers.set(userId, { chatId, username });
  }

  /**
   * Retrieves or initializes the 10-category notification preferences for a user
   */
  public static async getPreferences(userId: string): Promise<{
    isLinked: boolean;
    telegramChatId: string | null;
    telegramUsername: string | null;
    preferences: TelegramNotificationPreferences;
  }> {
    let profile: any = null;
    let prefRecord: any = null;

    try {
      profile = await (db as any).userProfile.findUnique({
        where: { userId },
      });

      prefRecord = await (db as any).telegramNotificationPreference.findUnique({
        where: { userId },
      });
    } catch {
      // In-memory fallback
    }

    const defaultPrefs: TelegramNotificationPreferences = {
      enabled: true,
      marketPrice: true,
      currencyExchange: true,
      portfolioSummary: true,
      weeklyReports: true,
      educationalCourses: true,
      challengeReminders: true,
      achievementAlerts: true,
      rankingUpdates: true,
      securityAlerts: true,
      accountActivity: true,
    };

    const inMem = inMemoryPreferences.get(userId);
    const resolvedPrefs = prefRecord
      ? {
          enabled: prefRecord.enabled,
          marketPrice: prefRecord.marketPrice,
          currencyExchange: prefRecord.currencyExchange,
          portfolioSummary: prefRecord.portfolioSummary,
          weeklyReports: prefRecord.weeklyReports,
          educationalCourses: prefRecord.educationalCourses,
          challengeReminders: prefRecord.challengeReminders,
          achievementAlerts: prefRecord.achievementAlerts,
          rankingUpdates: prefRecord.rankingUpdates,
          securityAlerts: prefRecord.securityAlerts,
          accountActivity: prefRecord.accountActivity,
        }
      : inMem || defaultPrefs;

    const memLink = inMemoryLinkedUsers.get(userId);
    const isLinked = Boolean(profile?.isTelegramLinked || memLink);
    const telegramChatId = profile?.telegramChatId || memLink?.chatId || null;
    const telegramUsername = profile?.telegramUsername || memLink?.username || null;

    return {
      isLinked,
      telegramChatId,
      telegramUsername,
      preferences: resolvedPrefs,
    };
  }

  /**
   * Updates specific category preferences for a user
   */
  public static async updatePreferences(
    userId: string,
    updates: Partial<TelegramNotificationPreferences>
  ): Promise<TelegramNotificationPreferences> {
    const current = (await this.getPreferences(userId)).preferences;
    const merged: TelegramNotificationPreferences = {
      ...current,
      ...updates,
    };

    try {
      await (db as any).telegramNotificationPreference.upsert({
        where: { userId },
        create: {
          userId,
          ...merged,
        },
        update: merged,
      });
    } catch {
      // DB offline, persist in memory
    }

    inMemoryPreferences.set(userId, merged);
    logger.info(`[TMA NOTIFICATION PREFERENCES UPDATED] User: ${userId}`, { ...merged });

    return merged;
  }

  /**
   * Sanitizes message to strictly enforce zero sensitive credentials in notification payloads
   */
  private static sanitizeMessage(text: string): string {
    const forbiddenPatterns = [
      /password\s*[:=]\s*['"`]?[^\s'"`]+['"`]?/gi,
      /cvv\s*[:=]\s*\d{3,4}/gi,
      /pin\s*[:=]\s*\d{4,6}/gi,
      /private_key\s*[:=]/gi,
      /card_number\s*[:=]\s*\d{12,19}/gi,
    ];

    let sanitized = text;
    for (const pattern of forbiddenPatterns) {
      if (pattern.test(sanitized)) {
        sanitized = sanitized.replace(pattern, '[REDACTED_SENSITIVE_DATA]');
      }
    }
    return sanitized;
  }

  /**
   * Checks if user has opted in for the given category
   */
  private static isCategoryOptedIn(
    category: TelegramNotificationCategory,
    prefs: TelegramNotificationPreferences
  ): boolean {
    if (!prefs.enabled) return false;

    switch (category) {
      case 'MARKET_PRICE':
        return prefs.marketPrice;
      case 'CURRENCY_EXCHANGE':
        return prefs.currencyExchange;
      case 'PORTFOLIO_SUMMARY':
        return prefs.portfolioSummary;
      case 'WEEKLY_REPORTS':
        return prefs.weeklyReports;
      case 'EDUCATIONAL_COURSES':
        return prefs.educationalCourses;
      case 'CHALLENGE_REMINDERS':
        return prefs.challengeReminders;
      case 'ACHIEVEMENTS':
        return prefs.achievementAlerts;
      case 'RANKING_UPDATES':
        return prefs.rankingUpdates;
      case 'SECURITY_NOTIFICATIONS':
        return prefs.securityAlerts;
      case 'ACCOUNT_ACTIVITY':
        return prefs.accountActivity;
      default:
        return false;
    }
  }

  /**
   * Formats Telegram notification message template with emojis and action buttons
   */
  public static formatCategoryMessage(
    category: TelegramNotificationCategory,
    title: string,
    message: string,
    actionUrl?: string
  ): { text: string; replyMarkup: any } {
    const categoryHeaders: Record<TelegramNotificationCategory, { icon: string; badge: string }> = {
      MARKET_PRICE: { icon: '📈', badge: 'MARKET PRICE ALERT' },
      CURRENCY_EXCHANGE: { icon: '💱', badge: 'FX & CURRENCY BULLETIN' },
      PORTFOLIO_SUMMARY: { icon: '💼', badge: 'PORTFOLIO TELEMETRY' },
      WEEKLY_REPORTS: { icon: '📊', badge: 'WEEKLY WEALTH DIGEST' },
      EDUCATIONAL_COURSES: { icon: '🎓', badge: 'NEW ACADEMY COURSE' },
      CHALLENGE_REMINDERS: { icon: '🎯', badge: 'CHALLENGE SPRINT REMINDER' },
      ACHIEVEMENTS: { icon: '🏆', badge: 'ACHIEVEMENT UNLOCKED' },
      RANKING_UPDATES: { icon: '🥇', badge: 'ALLOCATOR RANKING SHIFT' },
      SECURITY_NOTIFICATIONS: { icon: '🚨', badge: 'CRITICAL SECURITY EVENT' },
      ACCOUNT_ACTIVITY: { icon: '⚡', badge: 'ACCOUNT ACTIVITY NOTICE' },
    };

    const meta = categoryHeaders[category] || { icon: '📢', badge: 'VELTRON NOTIFICATION' };
    const sanitizedTitle = this.sanitizeMessage(title);
    const sanitizedBody = this.sanitizeMessage(message);

    const text = `
╔══════════════════════════════════════╗
║ ${meta.icon} VELTRON ${meta.badge} ║
╚══════════════════════════════════════╝

<b>${sanitizedTitle}</b>
${sanitizedBody}

⏱️ <i>Universal Telemetry Time: ${new Date().toUTCString()}</i>
`;

    const effectiveActionUrl = actionUrl
      ? actionUrl.startsWith('http')
        ? actionUrl
        : `${this.appUrl}${actionUrl}`
      : `${this.appUrl}/tma?startapp=${category.toLowerCase()}`;

    const replyMarkup = {
      inline_keyboard: [
        [
          { text: '⚡ Open in Mini App', web_app: { url: effectiveActionUrl } },
          { text: '⚙️ Settings', url: `${this.appUrl}/notifications` },
        ],
      ],
    };

    return { text, replyMarkup };
  }

  /**
   * Enqueues a notification into the background delivery queue with strict opt-in & idempotency
   */
  public static async enqueueNotification(params: EnqueueNotificationParams): Promise<{
    queued: boolean;
    status: 'PENDING' | 'DELIVERED' | 'SKIPPED' | 'DUPLICATE_SKIPPED' | 'FAILED';
    deliveryId?: string;
    reason?: string;
  }> {
    const { userId, category, title, message, actionUrl } = params;

    // 1. Check user Telegram link state
    const userState = await this.getPreferences(userId);
    if (!userState.isLinked || !userState.telegramChatId) {
      logger.info(`[TMA NOTIFY SKIPPED] User ${userId} is not linked to Telegram.`);
      return {
        queued: false,
        status: 'SKIPPED',
        reason: 'User account is not linked to Telegram.',
      };
    }

    // 2. Respect user opt-in preferences for this category
    const isOptedIn = this.isCategoryOptedIn(category, userState.preferences);
    if (!isOptedIn) {
      logger.info(`[TMA NOTIFY SKIPPED] User ${userId} opted out of ${category}.`);
      return {
        queued: false,
        status: 'SKIPPED',
        reason: `User opted out of category: ${category}.`,
      };
    }

    // 3. Prevent duplicate notifications using Idempotency Key
    const idempotencyKey =
      params.idempotencyKey ||
      crypto
        .createHash('sha256')
        .update(`${userId}:${category}:${title}:${Math.floor(Date.now() / 60000)}`)
        .digest('hex');

    // Check DB or in-memory cache for idempotency
    try {
      const existing = await (db as any).telegramNotificationDelivery.findUnique({
        where: { idempotencyKey },
      });

      if (existing) {
        logger.info(`[TMA NOTIFY DUPLICATE] IdempotencyKey ${idempotencyKey} already exists.`);
        return {
          queued: false,
          status: 'DUPLICATE_SKIPPED',
          deliveryId: existing.id,
          reason: 'Duplicate notification suppressed by idempotency guard.',
        };
      }
    } catch {
      if (inMemoryDeliveryLogs.has(idempotencyKey)) {
        return {
          queued: false,
          status: 'DUPLICATE_SKIPPED',
          reason: 'Duplicate notification in memory.',
        };
      }
    }

    // 4. Create Delivery Log Record
    const deliveryId = 'tnd_' + crypto.randomBytes(16).toString('hex');
    const { text, replyMarkup } = this.formatCategoryMessage(category, title, message, actionUrl);

    const logRecord: DeliveryLogRecord = {
      id: deliveryId,
      userId,
      chatId: userState.telegramChatId,
      category,
      title,
      message,
      status: 'PENDING',
      attempts: 0,
      maxAttempts: 3,
      createdAt: new Date().toISOString(),
    };

    inMemoryDeliveryLogs.set(idempotencyKey, logRecord);

    try {
      await (db as any).telegramNotificationDelivery.create({
        data: {
          id: deliveryId,
          userId,
          chatId: userState.telegramChatId,
          category,
          title,
          message,
          idempotencyKey,
          status: 'PENDING',
          attempts: 0,
          maxAttempts: 3,
        },
      });
    } catch {
      // In-memory fallback persisted
    }

    // 5. Enqueue Job for Background Worker
    activeJobQueue.push({
      deliveryId,
      chatId: userState.telegramChatId,
      text,
      replyMarkup,
      attempts: 0,
      maxAttempts: 3,
    });

    // Trigger and await background worker process
    await this.processQueue();

    const currentRecord = inMemoryDeliveryLogs.get(idempotencyKey);
    const resolvedStatus = currentRecord ? currentRecord.status : 'DELIVERED';

    return {
      queued: true,
      status: resolvedStatus,
      deliveryId,
    };
  }

  /**
   * Background Queue Worker: Processes pending notification dispatches with retries & error handling
   */
  public static async processQueue(): Promise<void> {
    if (isQueueWorkerRunning) return;
    isQueueWorkerRunning = true;

    try {
      while (activeJobQueue.length > 0) {
        const job = activeJobQueue.shift();
        if (!job) break;

        job.attempts++;

        try {
          // Attempt dispatch via Telegram Bot Service
          const result = await TelegramBotService.sendMessage({
            chatId: job.chatId,
            text: job.text,
            parseMode: 'HTML',
            replyMarkup: job.replyMarkup,
          });

          if (result.success) {
            // Update Delivery Status to DELIVERED
            const deliveredAt = new Date().toISOString();
            try {
              await (db as any).telegramNotificationDelivery.update({
                where: { id: job.deliveryId },
                data: {
                  status: 'DELIVERED',
                  attempts: job.attempts,
                  deliveredAt: new Date(),
                },
              });
            } catch {
              for (const record of inMemoryDeliveryLogs.values()) {
                if (record.id === job.deliveryId) {
                  record.status = 'DELIVERED';
                  record.deliveredAt = deliveredAt;
                  record.attempts = job.attempts;
                }
              }
            }

            logger.info(`[TMA NOTIFY DELIVERED] DeliveryId: ${job.deliveryId} to Chat: ${job.chatId}`);
          } else {
            throw new Error(result.error || 'Telegram API returned failure');
          }
        } catch (err: any) {
          logger.warn(`[TMA NOTIFY ATTEMPT ${job.attempts} FAILED] DeliveryId: ${job.deliveryId}`, err.message);

          if (job.attempts < job.maxAttempts) {
            // Re-enqueue job with retry
            activeJobQueue.push(job);
            await new Promise((r) => setTimeout(r, 50)); // Short backoff
          } else {
            // Exhausted max attempts: Mark as FAILED
            try {
              await (db as any).telegramNotificationDelivery.update({
                where: { id: job.deliveryId },
                data: {
                  status: 'FAILED',
                  attempts: job.attempts,
                  lastError: err.message,
                },
              });
            } catch {
              for (const record of inMemoryDeliveryLogs.values()) {
                if (record.id === job.deliveryId) {
                  record.status = 'FAILED';
                  record.attempts = job.attempts;
                  record.lastError = err.message;
                }
              }
            }
          }
        }
      }
    } finally {
      isQueueWorkerRunning = false;
    }
  }

  /**
   * Retrieves notification delivery history for a user
   */
  public static async getDeliveryHistory(userId: string, limit = 20): Promise<DeliveryLogRecord[]> {
    try {
      const records = await (db as any).telegramNotificationDelivery.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      if (records && records.length > 0) {
        return records.map((r: any) => ({
          id: r.id,
          userId: r.userId,
          chatId: r.chatId,
          category: r.category,
          title: r.title,
          message: r.message,
          status: r.status,
          attempts: r.attempts,
          maxAttempts: r.maxAttempts,
          lastError: r.lastError,
          deliveredAt: r.deliveredAt ? r.deliveredAt.toISOString() : null,
          createdAt: r.createdAt.toISOString(),
        }));
      }
    } catch {
      // In-memory fallback
    }

    const memRecords = Array.from(inMemoryDeliveryLogs.values())
      .filter((r) => r.userId === userId)
      .slice(0, limit);

    return memRecords;
  }
}
