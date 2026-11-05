// ==============================================================================
// VALIXEN API: POST /api/v1/admin/actions
// Privileged administrative operations endpoint with secondary confirmation & RBAC
// ==============================================================================

import { NextRequest } from 'next/server';
import { withErrorHandler } from '@/lib/api/error-handler';
import { successResponse } from '@/lib/api/response';
import { AdminSecurityService, AdminActionInput } from '@/server/services/admin.service';
import { auth } from '@/lib/auth/auth.config';
import { UnauthorizedError } from '@/lib/api/errors';
import { UserRole } from '@/types/database';
import { z } from 'zod';

const AdminActionSchema = z.object({
  action: z.enum(['FREEZE_ACCOUNT', 'UNFREEZE_ACCOUNT', 'UPDATE_USER_ROLE', 'EMERGENCY_SHUTDOWN']),
  targetUserId: z.string().optional(),
  targetAccountId: z.string().optional(),
  assignedRole: z.nativeEnum(UserRole).optional(),
  reason: z.string().min(5, 'Operational reason is required.'),
  confirmationSignature: z.string().min(1, 'Secondary confirmation signature is required.'),
  mfaCode: z.string().length(6, '6-digit MFA code is required.'),
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  // 1. Session verification
  const session = await auth();
  if (!session?.user?.id) {
    throw new UnauthorizedError('Administrative authorization required.');
  }

  const body = await req.json();
  const validated = AdminActionSchema.parse(body);

  const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0] || undefined;
  const userAgent = req.headers.get('user-agent') || undefined;

  const result = await AdminSecurityService.executeAdminOperation(
    {
      id: session.user.id,
      role: (session.user.role as UserRole) || UserRole.USER,
      email: session.user.email,
      isMfaEnabled: true,
      isMfaVerifiedThisSession: true,
    },
    validated as AdminActionInput,
    { ipAddress, userAgent }
  );

  return successResponse(result, 200);
});
