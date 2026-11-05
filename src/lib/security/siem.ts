// ==============================================================================
// VALIXEN SIEM (SECURITY INFORMATION & EVENT MANAGEMENT) & AUDIT LEDGER
// Cryptographic Hash Chaining for Tamper-Evident Security Log Integrity
// ==============================================================================

import crypto from 'crypto';
import { logger } from '@/lib/logger';

export enum SecuritySeverity {
  INFO = 'INFO',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum SecurityEventType {
  UNAUTHORIZED_ACCESS_ATTEMPT = 'UNAUTHORIZED_ACCESS_ATTEMPT',
  PRIVILEGE_ESCALATION_ATTEMPT = 'PRIVILEGE_ESCALATION_ATTEMPT',
  BRUTE_FORCE_DETECTED = 'BRUTE_FORCE_DETECTED',
  RATE_LIMIT_BREACH = 'RATE_LIMIT_BREACH',
  ADMIN_STEP_UP_FAILURE = 'ADMIN_STEP_UP_FAILURE',
  TAMPER_DETECTED = 'TAMPER_DETECTED',
  FINANCIAL_CVV_BLOCKED = 'FINANCIAL_CVV_BLOCKED',
  CROSS_USER_ACCESS_ATTEMPT = 'CROSS_USER_ACCESS_ATTEMPT',
  SUSPICIOUS_IP_ACTIVITY = 'SUSPICIOUS_IP_ACTIVITY',
}

export interface SecurityEventPayload {
  eventType: SecurityEventType;
  severity: SecuritySeverity;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  resourcePath?: string;
  metadata?: Record<string, any>;
  description: string;
}

export interface ChainedAuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  resourceEntity: string;
  resourceId: string;
  previousHash: string;
  hash: string;
}

export class SIEMSecurityMonitor {
  private static lastHash: string = 'GENESIS_VALIXEN_SECURITY_LEDGER_BLOCK_0';

  /**
   * Emits and records a security telemetry event to structured logs and alerting
   */
  public static emitSecurityEvent(event: SecurityEventPayload): void {
    const timestamp = new Date().toISOString();

    const logPayload = {
      ...event,
      timestamp,
      environment: process.env.NODE_ENV || 'development',
    };

    if (event.severity === SecuritySeverity.CRITICAL || event.severity === SecuritySeverity.HIGH) {
      logger.error(`[SIEM ALERT - ${event.severity}] ${event.description}`, logPayload);
      try {
        import('@/server/services/telegram.service')
          .then(({ TelegramBotService }) => {
            TelegramBotService.notifyAdminSecurityEvent({
              eventType: event.eventType,
              severity: event.severity,
              description: event.description,
              ipAddress: event.ipAddress,
            }).catch(() => {});
          })
          .catch(() => {});
      } catch {}
    } else if (event.severity === SecuritySeverity.MEDIUM) {
      logger.warn(`[SIEM WARNING] ${event.description}`, logPayload);
    } else {
      logger.info(`[SIEM EVENT] ${event.description}`, logPayload);
    }
  }

  /**
   * Computes a cryptographic SHA-256 hash chaining an audit record to the preceding block
   */
  public static computeChainedHash(
    entry: Omit<ChainedAuditEntry, 'hash'>,
    previousHash: string
  ): string {
    const dataString = `${entry.id}|${entry.timestamp}|${entry.userId}|${entry.action}|${entry.resourceEntity}|${entry.resourceId}|${previousHash}`;
    return crypto.createHash('sha256').update(dataString).digest('hex');
  }

  /**
   * Creates a tamper-evident audit record with cryptographic hash chaining
   */
  public static createAuditChainRecord(
    entry: Omit<ChainedAuditEntry, 'hash' | 'previousHash'>
  ): ChainedAuditEntry {
    const previousHash = this.lastHash;
    const hash = this.computeChainedHash(
      {
        ...entry,
        previousHash,
      },
      previousHash
    );

    this.lastHash = hash;

    return {
      ...entry,
      previousHash,
      hash,
    };
  }

  /**
   * Verifies the cryptographic chain of an audit log series to detect any unauthorized modification or deletion
   */
  public static verifyAuditChain(chain: ChainedAuditEntry[]): {
    isIntact: boolean;
    brokenIndex?: number;
    reason?: string;
  } {
    if (!chain || chain.length === 0) {
      return { isIntact: true };
    }

    for (let i = 0; i < chain.length; i++) {
      const current = chain[i];
      const expectedPrevHash =
        i === 0 ? 'GENESIS_VALIXEN_SECURITY_LEDGER_BLOCK_0' : chain[i - 1].hash;

      if (current.previousHash !== expectedPrevHash) {
        return {
          isIntact: false,
          brokenIndex: i,
          reason: `Chain broken at block ${i}: expected previousHash '${expectedPrevHash}', found '${current.previousHash}'. Possible log deletion or insertion detected.`,
        };
      }

      const recalculatedHash = this.computeChainedHash(
        {
          id: current.id,
          timestamp: current.timestamp,
          userId: current.userId,
          action: current.action,
          resourceEntity: current.resourceEntity,
          resourceId: current.resourceId,
          previousHash: current.previousHash,
        },
        current.previousHash
      );

      if (recalculatedHash !== current.hash) {
        return {
          isIntact: false,
          brokenIndex: i,
          reason: `Data tampering detected at block ${i}: content has been modified after ledger recording.`,
        };
      }
    }

    return { isIntact: true };
  }
}
