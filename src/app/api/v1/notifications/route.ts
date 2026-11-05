// ==============================================================================
// VALIXEN API: /api/v1/notifications
// Personalized Security & Market Notification Center Telemetry
// ==============================================================================

import { NextRequest } from 'next/server';
import { withErrorHandler } from '@/lib/api/error-handler';
import { successResponse } from '@/lib/api/response';
import { PersonalizedNotificationsService } from '@/server/services/notifications.service';
import { resolveUserId } from '@/lib/api/auth-helper';
import { z } from 'zod';

const NotificationActionSchema = z.object({
  action: z.enum(['MARK_READ', 'MARK_ALL_READ', 'DELETE']),
  notificationId: z.string().optional(),
});

export const GET = withErrorHandler(async (req: NextRequest) => {
  const userId = await resolveUserId(req);
  const data = await PersonalizedNotificationsService.getNotifications(userId);
  return successResponse(data, 200);
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const userId = await resolveUserId(req);
  const body = await req.json();
  const { action, notificationId } = NotificationActionSchema.parse(body);

  if (action === 'MARK_ALL_READ') {
    const res = await PersonalizedNotificationsService.markAllAsRead();
    return successResponse(res, 200);
  }

  if (action === 'MARK_READ') {
    if (!notificationId) throw new Error('notificationId is required.');
    const res = await PersonalizedNotificationsService.markAsRead(notificationId);
    return successResponse(res, 200);
  }

  if (action === 'DELETE') {
    if (!notificationId) throw new Error('notificationId is required.');
    const res = await PersonalizedNotificationsService.deleteNotification(notificationId);
    return successResponse(res, 200);
  }

  return successResponse({ success: true }, 200);
});
