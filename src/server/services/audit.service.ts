// ==============================================================================
// VALIXEN AUDIT & COMPLIANCE LOGGING SERVICE
// Tracks critical financial transactions and security state changes
// ==============================================================================

import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { AuditAction } from '@prisma/client';

export interface RecordAuditParams {
  userId?: string;
  action: AuditAction;
  ipAddress?: string;
  userAgent?: string;
  resourceEntity?: string;
  resourceId?: string;
  details?: Record<string, unknown>;
}

export class AuditService {
  /**
   * Appends an immutable audit event to the security ledger
   */
  public static async recordEvent(params: RecordAuditParams): Promise<void> {
    try {
      await db.auditLog.create({
        data: {
          userId: params.userId,
          action: params.action,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
          resourceEntity: params.resourceEntity,
          resourceId: params.resourceId,
          detailsJson: params.details as object,
        },
      });

      logger.info(`Audit log recorded: ${params.action}`, {
        userId: params.userId,
        action: params.action,
        resourceEntity: params.resourceEntity,
        resourceId: params.resourceId,
      });
    } catch (err) {
      // Audit log failures should never crash primary user flow, but MUST be logged with highest severity
      logger.error('CRITICAL: Failed to write audit record to database', err, {
        action: params.action,
        userId: params.userId,
      });
    }
  }
}
