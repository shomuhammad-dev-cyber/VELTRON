// ==============================================================================
// VALIXEN API: POST /api/v1/auth/reset-password
// Resets password using Argon2id and revokes all active sessions
// ==============================================================================

import { NextRequest } from 'next/server';
import { withErrorHandler } from '@/lib/api/error-handler';
import { successResponse } from '@/lib/api/response';
import { AuthService } from '@/server/services/auth.service';
import { ResetPasswordSchema } from '@/lib/auth/validation';

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  const validated = ResetPasswordSchema.parse(body);

  const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0] || undefined;
  await AuthService.resetPassword(validated, { ipAddress });

  return successResponse(
    {
      message: 'Password successfully updated. All prior sessions have been revoked. Please log in with your new credentials.',
    },
    200
  );
});
