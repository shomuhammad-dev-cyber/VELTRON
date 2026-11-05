// ==============================================================================
// VALIXEN API: POST /api/v1/auth/register
// Registers user with Argon2id hashing and auto-provisions financial accounts
// ==============================================================================

import { NextRequest } from 'next/server';
import { withErrorHandler } from '@/lib/api/error-handler';
import { successResponse } from '@/lib/api/response';
import { AuthService } from '@/server/services/auth.service';
import { RegisterSchema } from '@/lib/auth/validation';

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  const validated = RegisterSchema.parse(body);

  const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
  const userAgent = req.headers.get('user-agent') || undefined;

  const result = await AuthService.register(validated, { ipAddress, userAgent });

  return successResponse(
    {
      userId: result.userId,
      email: result.email,
      message: 'Account successfully created. Please verify your email to unlock all features.',
    },
    201
  );
});
