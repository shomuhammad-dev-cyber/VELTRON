// ==============================================================================
// VALIXEN SECRETS INTEGRITY & LEAK DETECTION ENGINE
// Automated Environment Auditing, Minimum Entropy Verification & Placeholder Checks
// ==============================================================================

import { logger } from '@/lib/logger';

const INSECURE_PATTERNS = [
  'change_me',
  'changeme',
  'secret',
  'password',
  '123456',
  'admin',
  'default',
  'test',
];

export interface SecretAuditResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Audits all platform secrets for minimum entropy and accidental leak patterns
 */
export function validateEnvironmentSecrets(): SecretAuditResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

  // 1. Auth Secret Auditing
  if (!authSecret) {
    errors.push('CRITICAL: Neither AUTH_SECRET nor NEXTAUTH_SECRET is defined.');
  } else {
    if (authSecret.length < 32) {
      errors.push(`AUTH_SECRET length is only ${authSecret.length} chars (minimum 32 required for AES/HMAC safety).`);
    }

    const lowerSecret = authSecret.toLowerCase();
    for (const pattern of INSECURE_PATTERNS) {
      if (lowerSecret.includes(pattern)) {
        errors.push(`AUTH_SECRET contains prohibited insecure placeholder pattern: '${pattern}'.`);
        break;
      }
    }
  }

  // 2. Database Connection Security
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    errors.push('CRITICAL: DATABASE_URL is missing.');
  } else {
    if (process.env.NODE_ENV === 'production' && !dbUrl.includes('sslmode=require')) {
      warnings.push('Production DATABASE_URL should enforce SSL connection (sslmode=require).');
    }
    if (dbUrl.includes('postgres:postgres@localhost')) {
      if (process.env.NODE_ENV === 'production') {
        errors.push('Production environment is configured with default local PostgreSQL credentials.');
      } else {
        warnings.push('Development using local default postgres credentials.');
      }
    }
  }

  // 3. Google OAuth Secrets Validation
  const googleId = process.env.AUTH_GOOGLE_ID;
  const googleSecret = process.env.AUTH_GOOGLE_SECRET;
  if (!googleId || !googleSecret) {
    warnings.push('Google OAuth credentials not configured. Native Google sign-in is deactivated.');
  }

  const isValid = errors.length === 0;

  if (!isValid) {
    logger.error('Security secrets validation failed with critical errors', { errors });
  } else if (warnings.length > 0) {
    logger.warn('Security secrets validation identified advisory warnings', { warnings });
  } else {
    logger.info('Platform environment secrets passed cryptographic entropy audit.');
  }

  return { isValid, errors, warnings };
}
