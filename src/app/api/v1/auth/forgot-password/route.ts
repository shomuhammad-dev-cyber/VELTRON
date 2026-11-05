// ==============================================================================
// VALIXEN API: POST /api/v1/auth/forgot-password
// Generates secure 1-hour password reset token (with Anti-Enumeration)
// ==============================================================================

import { NextRequest } from 'next/server';
import { withErrorHandler } from '@/lib/api/error-handler';
import { successResponse } from '@/lib/api/response';
import { AuthService } from '@/server/services/auth.service';
import { ForgotPasswordSchema } from '@/lib/auth/validation';

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  const validated = ForgotPasswordSchema.parse(body);

  const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0] || undefined;
  const result = await AuthService.requestPasswordReset(validated, { ipAddress });

  return successResponse(result, 200);
});
