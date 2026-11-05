// ==============================================================================
// VALIXEN API: POST /api/v1/auth/verify-email
// Verifies user email via cryptographic token
// ==============================================================================

import { NextRequest } from 'next/server';
import { withErrorHandler } from '@/lib/api/error-handler';
import { successResponse } from '@/lib/api/response';
import { AuthService } from '@/server/services/auth.service';
import { VerifyEmailSchema } from '@/lib/auth/validation';

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  const validated = VerifyEmailSchema.parse(body);

  await AuthService.verifyEmail(validated.token);

  return successResponse(
    {
      message: 'Email successfully verified. Institutional features have been unlocked.',
    },
    200
  );
});
