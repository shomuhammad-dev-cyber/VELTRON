// ==============================================================================
// VALIXEN ANTI-CSRF (CROSS-SITE REQUEST FORGERY) ENGINE
// Cryptographic HMAC Double-Submit Token Architecture for State-Changing Mutators
// ==============================================================================

import crypto from 'crypto';
import { NextRequest } from 'next/server';
import { ForbiddenError } from '@/lib/api/errors';

const CSRF_SECRET =
  process.env.CSRF_SECRET ||
  process.env.AUTH_SECRET ||
  'valixen-csrf-master-signing-key-entropy-min32chars';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const CSRF_HEADER_NAME = 'x-csrf-token';
const CSRF_COOKIE_NAME = 'valixen_csrf_token';

/**
 * Generates an HMAC-signed CSRF token pair (token + cookie signature)
 */
export function generateCsrfToken(): { token: string; cookieValue: string } {
  const nonce = crypto.randomBytes(24).toString('base64url');
  const timestamp = Date.now().toString(36);
  const payload = `${nonce}.${timestamp}`;

  const hmac = crypto.createHmac('sha256', CSRF_SECRET);
  hmac.update(payload);
  const signature = hmac.digest('base64url');

  const token = `${payload}.${signature}`;
  return {
    token,
    cookieValue: token,
  };
}

/**
 * Verifies the validity and cryptographic signature of a CSRF token
 */
export function verifyCsrfToken(submittedToken: string, cookieToken?: string): boolean {
  if (!submittedToken) return false;

  const parts = submittedToken.split('.');
  if (parts.length !== 3) return false;

  const [nonce, timestamp, signature] = parts;
  const payload = `${nonce}.${timestamp}`;

  // Recalculate signature
  const hmac = crypto.createHmac('sha256', CSRF_SECRET);
  hmac.update(payload);
  const expectedSignature = hmac.digest('base64url');

  // Verify HMAC signature in constant time
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSignature);

  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return false;
  }

  // If double-submit cookie is provided, verify match
  if (cookieToken) {
    const subBuf = Buffer.from(submittedToken);
    const cookBuf = Buffer.from(cookieToken);
    if (subBuf.length !== cookBuf.length || !crypto.timingSafeEqual(subBuf, cookBuf)) {
      return false;
    }
  }

  // Verify token expiry (default 24 hours)
  const tokenTime = parseInt(timestamp, 36);
  if (isNaN(tokenTime) || Date.now() - tokenTime > 24 * 60 * 60 * 1000) {
    return false;
  }

  return true;
}

/**
 * Guard assertion for state-changing HTTP requests.
 * Exempts safe methods (GET, HEAD, OPTIONS) and enforces token on POST, PUT, DELETE, PATCH.
 */
export function assertCsrfValid(req: NextRequest): void {
  if (SAFE_METHODS.has(req.method.toUpperCase())) {
    return;
  }

  // Check header or custom form body
  const headerToken =
    req.headers.get(CSRF_HEADER_NAME) ||
    req.headers.get('csrf-token') ||
    req.headers.get('x-xsrf-token');

  const cookieToken = req.cookies.get(CSRF_COOKIE_NAME)?.value;

  if (!headerToken) {
    throw new ForbiddenError(
      'CSRF INTEGRITY FAULT: Missing anti-CSRF security token on state-changing request.'
    );
  }

  const isValid = verifyCsrfToken(headerToken, cookieToken);
  if (!isValid) {
    throw new ForbiddenError(
      'CSRF INTEGRITY FAULT: Invalid, expired, or forged anti-CSRF token signature.'
    );
  }
}
