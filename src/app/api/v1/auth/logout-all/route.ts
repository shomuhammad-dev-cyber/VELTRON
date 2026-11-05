// ==============================================================================
// VALIXEN API: POST /api/v1/auth/logout-all
// Invalidation of all active sessions across all devices for the authenticated user
// ==============================================================================

import { NextRequest } from 'next/server';
import { withErrorHandler } from '@/lib/api/error-handler';
import { successResponse } from '@/lib/api/response';
import { AuthService } from '@/server/services/auth.service';
import { db } from '@/lib/db';
import { UnauthorizedError } from '@/lib/api/errors';
import { auth } from '@/lib/auth/auth.config';

export const POST = withErrorHandler(async (req: NextRequest) => {
  let userId: string | null = null;

  // 1. Try NextAuth JWT session
  try {
    const session = await auth();
    if (session?.user?.id) {
      userId = session.user.id;
    }
  } catch {
    // NextAuth may not be initialized if running standalone
  }

  // 2. If not found via NextAuth, check custom session cookie or Authorization header
  if (!userId) {
    const sessionToken =
      req.cookies.get('valixen_session')?.value ||
      req.headers.get('authorization')?.replace('Bearer ', '');

    if (sessionToken) {
      const activeSession = await db.session.findUnique({
        where: { sessionToken },
      });

      if (activeSession && activeSession.isValid && activeSession.expiresAt > new Date()) {
        userId = activeSession.userId;
      }
    }
  }

  if (!userId) {
    throw new UnauthorizedError('Authentication required to invalidate device sessions.');
  }

  // 3. Invalidate all active sessions for this user
  await AuthService.logoutAllDevices(userId);

  return successResponse(
    {
      message: 'All active sessions across all devices have been successfully revoked.',
    },
    200
  );
});
