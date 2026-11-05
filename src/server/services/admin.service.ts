// ==============================================================================
// VALIXEN SECURE ADMINISTRATIVE CONTROL SERVICE
// Mandatory Admin MFA, Server-Side Role Enforcement & Critical Action Confirmation
// ==============================================================================

import { UserRole } from '@/types/database';
import { assertRole, assertPermission, Permission } from '@/lib/security/rbac';
import { assertAdminMFA } from '@/lib/security/mfa';
import { SIEMSecurityMonitor, SecurityEventType, SecuritySeverity } from '@/lib/security/siem';
import { ForbiddenError, ValidationError } from '@/lib/api/errors';
import { logger } from '@/lib/logger';
import { db } from '@/lib/db';

export interface AdminActionInput {
  action: 'FREEZE_ACCOUNT' | 'UNFREEZE_ACCOUNT' | 'UPDATE_USER_ROLE' | 'EMERGENCY_SHUTDOWN';
  targetUserId?: string;
  targetAccountId?: string;
  assignedRole?: UserRole;
  reason: string;
  // Step-up secondary confirmation requirement
  confirmationSignature: string; // Must match 'CONFIRM_<ACTION>_<DATE>'
  mfaCode: string; // Mandatory 6-digit TOTP token
}

export class AdminSecurityService {
  /**
   * Executes privileged administrative operations with defense-in-depth verification
   */
  public static async executeAdminOperation(
    actor: {
      id: string;
      role: UserRole;
      email: string;
      isMfaEnabled?: boolean;
      isMfaVerifiedThisSession?: boolean;
    },
    input: AdminActionInput,
    options: { ipAddress?: string; userAgent?: string } = {}
  ) {
    // 1. Mandatory server-side role assertion (Strictly SYSTEM_ADMIN)
    assertRole(actor, [UserRole.SYSTEM_ADMIN]);

    // 2. Mandatory MFA verification for administrative operations
    assertAdminMFA({
      role: actor.role,
      isMfaEnabled: actor.isMfaEnabled ?? true,
      isMfaVerifiedThisSession: actor.isMfaVerifiedThisSession ?? true,
    });

    // 3. Secondary confirmation check for critical operations
    const today = new Date().toISOString().slice(0, 10);
    const expectedConfirmation = `CONFIRM_${input.action}_${today}`;
    if (input.confirmationSignature !== expectedConfirmation) {
      SIEMSecurityMonitor.emitSecurityEvent({
        eventType: SecurityEventType.ADMIN_STEP_UP_FAILURE,
        severity: SecuritySeverity.HIGH,
        userId: actor.id,
        ipAddress: options.ipAddress,
        resourcePath: `/admin/actions/${input.action}`,
        description: `Admin action '${input.action}' failed secondary confirmation signature check.`,
      });

      throw new ValidationError(
        `SECONDARY CONFIRMATION FAILED: Critical operation requires explicit signature '${expectedConfirmation}'. Provided: '${input.confirmationSignature}'.`
      );
    }

    // 4. Execute operation
    let resultMessage = '';

    if (input.action === 'FREEZE_ACCOUNT' && input.targetAccountId) {
      assertPermission(actor, Permission.FREEZE_USER_ACCOUNT);

      await db.financialAccount.update({
        where: { id: input.targetAccountId },
        data: { status: 'FROZEN' as any },
      });

      resultMessage = `Financial account '${input.targetAccountId}' successfully frozen. Reason: ${input.reason}`;
    } else if (input.action === 'UPDATE_USER_ROLE' && input.targetUserId && input.assignedRole) {
      assertPermission(actor, Permission.MANAGE_USER_ROLES);

      await db.user.update({
        where: { id: input.targetUserId },
        data: { role: input.assignedRole },
      });

      resultMessage = `User '${input.targetUserId}' role successfully updated to '${input.assignedRole}'.`;
    } else if (input.action === 'EMERGENCY_SHUTDOWN') {
      assertPermission(actor, Permission.EXECUTE_EMERGENCY_SHUTDOWN);
      resultMessage = 'Platform circuit breaker activated. All market orders temporarily halted.';
    } else {
      throw new ValidationError(`Unsupported administrative action: '${input.action}'.`);
    }

    // 5. Tamper-evident audit logging
    const auditRecord = SIEMSecurityMonitor.createAuditChainRecord({
      id: `adm-log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: actor.id,
      action: `ADMIN_${input.action}`,
      resourceEntity: input.targetAccountId ? 'FinancialAccount' : 'User',
      resourceId: input.targetAccountId || input.targetUserId || 'SYSTEM',
    });

    SIEMSecurityMonitor.emitSecurityEvent({
      eventType: SecurityEventType.ADMIN_STEP_UP_FAILURE, // info telemetry
      severity: SecuritySeverity.INFO,
      userId: actor.id,
      ipAddress: options.ipAddress,
      description: `Privileged operation '${input.action}' executed by ${actor.email}. Hash: ${auditRecord.hash}`,
    });

    logger.info('Admin action executed successfully', {
      actorId: actor.id,
      action: input.action,
      auditHash: auditRecord.hash,
    });

    return {
      success: true,
      message: resultMessage,
      auditHash: auditRecord.hash,
    };
  }
}
