// ==============================================================================
// VALIXEN MULTI-FACTOR AUTHENTICATION (MFA / 2FA - RFC 6238 TOTP)
// Native Cryptographic Time-Based One-Time Password Engine with Admin Enforcement
// ==============================================================================

import crypto from 'crypto';
import { UserRole } from '@/types/database';
import { ForbiddenError, UnauthorizedError } from '@/lib/api/errors';

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const TOTP_TIME_STEP_SECONDS = 30;
const TOTP_DIGITS = 6;

/**
 * Encodes a buffer into RFC 4648 Base32 string
 */
export function base32Encode(buffer: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;

    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }

  return output;
}

/**
 * Decodes an RFC 4648 Base32 string into a Buffer
 */
export function base32Decode(base32: string): Buffer {
  const cleanStr = base32.toUpperCase().replace(/[\s=-]/g, '');
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (let i = 0; i < cleanStr.length; i++) {
    const val = BASE32_ALPHABET.indexOf(cleanStr[i]);
    if (val === -1) {
      throw new Error(`Invalid Base32 character: ${cleanStr[i]}`);
    }

    value = (value << 5) | val;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

/**
 * Generates a new 160-bit cryptographically secure Base32 secret for TOTP setup
 */
export function generateTOTPSecret(): { secret: string; backupCodes: string[] } {
  const randomBytes = crypto.randomBytes(20); // 160 bits (RFC recommended)
  const secret = base32Encode(randomBytes);

  // Generate 8 alphanumeric 8-character single-use emergency backup recovery codes
  const backupCodes: string[] = [];
  for (let i = 0; i < 8; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    backupCodes.push(`${code.slice(0, 4)}-${code.slice(4, 8)}`);
  }

  return { secret, backupCodes };
}

/**
 * Generates an otpauth:// URI for QR code integration with Google Authenticator / 1Password
 */
export function generateTOTPUri(email: string, secret: string, issuer: string = 'VALIXEN'): string {
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedAccount = encodeURIComponent(email);
  return `otpauth://totp/${encodedIssuer}:${encodedAccount}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=${TOTP_DIGITS}&period=${TOTP_TIME_STEP_SECONDS}`;
}

/**
 * Computes a TOTP token for a given counter value
 */
function computeTokenForCounter(keyBuffer: Buffer, counter: number): string {
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigInt64BE(BigInt(counter));

  const hmac = crypto.createHmac('sha1', keyBuffer);
  hmac.update(counterBuffer);
  const digest = hmac.digest();

  // Dynamic truncation (RFC 4226)
  const offset = digest[digest.length - 1] & 0xf;
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  const otp = binary % Math.pow(10, TOTP_DIGITS);
  return otp.toString().padStart(TOTP_DIGITS, '0');
}

/**
 * Validates a user-supplied TOTP code with time drift window (default +/- 1 step = 30s)
 */
export function verifyTOTP(
  secret: string,
  userToken: string,
  driftSteps: number = 1
): boolean {
  if (!secret || !userToken || userToken.length !== TOTP_DIGITS) {
    return false;
  }

  try {
    const keyBuffer = base32Decode(secret);
    const currentCounter = Math.floor(Date.now() / 1000 / TOTP_TIME_STEP_SECONDS);

    // Check current step and allowable clock drift steps
    for (let i = -driftSteps; i <= driftSteps; i++) {
      const expectedToken = computeTokenForCounter(keyBuffer, currentCounter + i);

      // Constant-time comparison to prevent timing attacks
      const expectedBuf = Buffer.from(expectedToken);
      const userBuf = Buffer.from(userToken);

      if (expectedBuf.length === userBuf.length && crypto.timingSafeEqual(expectedBuf, userBuf)) {
        return true;
      }
    }
  } catch {
    return false;
  }

  return false;
}

/**
 * MANDATORY MFA ENFORCEMENT GUARD FOR ADMINISTRATORS
 * Rejects administrative access if MFA is not enabled or unverified this session
 */
export function assertAdminMFA(user: {
  id?: string;
  role?: UserRole;
  isMfaEnabled?: boolean;
  isMfaVerifiedThisSession?: boolean;
}): void {
  if (!user || !user.role) {
    throw new UnauthorizedError('Authentication required.');
  }

  const isPrivileged =
    user.role === UserRole.SYSTEM_ADMIN || user.role === UserRole.COMPLIANCE_OFFICER;

  if (isPrivileged) {
    if (!user.isMfaEnabled) {
      throw new ForbiddenError(
        'SECURITY VIOLATION: Multi-Factor Authentication (MFA) is strictly mandatory for all administrative and compliance personnel. Please enroll your hardware/TOTP device.'
      );
    }

    if (user.isMfaVerifiedThisSession === false) {
      throw new ForbiddenError(
        'SECURITY VIOLATION: Current session requires step-up MFA verification before executing privileged administrative operations.'
      );
    }
  }
}
