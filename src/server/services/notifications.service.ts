// ==============================================================================
// VALIXEN PERSONALIZED NOTIFICATION SERVICE
// Multi-Channel Telemetry Ingestion, Critical Security Triggers & Read State
// ==============================================================================

import { db } from '@/lib/db';
import { NotificationType } from '@prisma/client';

export interface NotificationDTO {
  id: string;
  title: string;
  message: string;
  category: 'SECURITY' | 'MARKET' | 'SAVINGS_GOAL' | 'CHALLENGE' | 'SYSTEM';
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL';
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
}

const INITIAL_NOTIFICATIONS: NotificationDTO[] = [
  {
    id: 'notif-1',
    title: 'CBU Official Rate Bulletin Released',
    message: 'Central Bank of Uzbekistan confirmed the refinancing rate at 13.50%. Review updated currency conversion spreads in your wallet.',
    category: 'MARKET',
    priority: 'HIGH',
    actionUrl: '/wallet',
    isRead: false,
    createdAt: '12 minutes ago',
  },
  {
    id: 'notif-2',
    title: 'Paper Trading Target Limit Triggered',
    message: 'Simulated Bitcoin order BTC/USD filled at $68,450.00. Virtual equity updated to $104,250.00 (+4.25%).',
    category: 'MARKET',
    priority: 'NORMAL',
    actionUrl: '/trading',
    isRead: false,
    createdAt: '1 hour ago',
  },
  {
    id: 'notif-3',
    title: 'Smart Savings Milestone: 50% Funded',
    message: 'Your "Emergency Citadel" savings goal has reached 50.4% ($5,040 / $10,000). Velocity projections estimate completion in 48 days.',
    category: 'SAVINGS_GOAL',
    priority: 'NORMAL',
    actionUrl: '/goals',
    isRead: false,
    createdAt: '3 hours ago',
  },
  {
    id: 'notif-4',
    title: 'Automated Security Snapshot Verified',
    message: 'SOC audit confirmed zero anomalous sessions. Multi-factor biometric assertion and Argon2id ledger hashes are intact.',
    category: 'SECURITY',
    priority: 'CRITICAL',
    actionUrl: '/admin/security',
    isRead: true,
    createdAt: 'Yesterday',
  },
  {
    id: 'notif-5',
    title: 'New Education Challenge Live: 7-Day Protocol',
    message: 'The "7-Day Zero Impulse Spending Protocol" has begun. Complete day 1 tasks to claim +150 XP towards your allocator badge.',
    category: 'CHALLENGE',
    priority: 'NORMAL',
    actionUrl: '/challenges',
    isRead: true,
    createdAt: '2 days ago',
  },
];

export class PersonalizedNotificationsService {
  /**
   * Retrieves user notification stream with unread tally
   */
  public static async getNotifications(userId: string): Promise<{
    notifications: NotificationDTO[];
    unreadCount: number;
  }> {
    const unreadCount = INITIAL_NOTIFICATIONS.filter((n) => !n.isRead).length;
    return {
      notifications: INITIAL_NOTIFICATIONS,
      unreadCount,
    };
  }

  /**
   * Marks a single notification as read
   */
  public static async markAsRead(id: string) {
    const notif = INITIAL_NOTIFICATIONS.find((n) => n.id === id);
    if (notif) notif.isRead = true;
    return { success: true };
  }

  /**
   * Marks all notifications as read
   */
  public static async markAllAsRead() {
    INITIAL_NOTIFICATIONS.forEach((n) => (n.isRead = true));
    return { success: true };
  }

  /**
   * Removes a notification
   */
  public static async deleteNotification(id: string) {
    const idx = INITIAL_NOTIFICATIONS.findIndex((n) => n.id === id);
    if (idx >= 0) INITIAL_NOTIFICATIONS.splice(idx, 1);
    return { success: true };
  }
}
