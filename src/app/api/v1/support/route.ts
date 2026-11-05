// ==============================================================================
// VELTRON API: /api/v1/support
// Institutional Client Support & Direct Admin Telemetry Dispatch
// ==============================================================================

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { withErrorHandler } from '@/lib/api/error-handler';
import { successResponse } from '@/lib/api/response';
import { TelegramBotService } from '@/server/services/telegram.service';
import crypto from 'crypto';

const SupportTicketSchema = z.object({
  email: z.string().email('Please provide a valid institutional email address.'),
  subject: z.string().min(3, 'Subject must be at least 3 characters.').max(150),
  message: z.string().min(10, 'Message must be at least 10 characters.').max(2000),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL'),
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  const validated = SupportTicketSchema.parse(body);

  const ticketId = 'vlt_sup_' + crypto.randomBytes(6).toString('hex');

  // Notify designated Telegram Admin Chat (7552517378)
  await TelegramBotService.notifyAdminSupportTicket({
    ticketId,
    userEmail: validated.email,
    subject: validated.subject,
    priority: validated.priority,
  }).catch(() => {});

  return successResponse(
    {
      ticketId,
      status: 'SUBMITTED',
      message: 'Support dispatch received by VELTRON operations. An engineering allocator will review your ticket.',
      receivedAt: new Date().toISOString(),
    },
    201
  );
});
