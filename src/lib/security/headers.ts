// ==============================================================================
// VALIXEN CYBERSECURITY: HTTP SECURITY HEADERS & CSP ARCHITECTURE
// Content Security Policy, HSTS, CORS Restriction & Clickjacking Mitigation
// ==============================================================================

import { NextResponse } from 'next/server';

// Strict Content Security Policy definition
export const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: https: blob:",
  "font-src 'self' https://fonts.gstatic.com data:",
  "connect-src 'self' https: wss:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "block-all-mixed-content",
  "upgrade-insecure-requests",
].join('; ');

// CORS Allowed Origins Whitelist with production environment expansion
const defaultAllowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://valixen.com',
  'https://terminal.valixen.com',
  'https://api.valixen.com',
];

const dynamicOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean)
  : [];

export const ALLOWED_ORIGINS = new Set([...defaultAllowedOrigins, ...dynamicOrigins]);

/**
 * Applies bank-grade HTTP security headers to any outgoing NextResponse
 */
export function applySecurityHeaders(
  response: NextResponse,
  requestOrigin?: string | null
): NextResponse {
  // 1. Clickjacking Protection
  response.headers.set('X-Frame-Options', 'DENY');

  // 2. MIME Sniffing Mitigation
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // 3. Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 4. Permissions / Feature Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
  );

  // In production, enforce strict CSP and Cross-Origin Isolation policies
  // (In local dev, strict COOP and CSP block Next.js HMR WebSockets and dev server error overlays)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Content-Security-Policy', CONTENT_SECURITY_POLICY);
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    );
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  }

  // 5. CORS Restriction (No Wildcards with credentials)
  if (requestOrigin && ALLOWED_ORIGINS.has(requestOrigin)) {
    response.headers.set('Access-Control-Allow-Origin', requestOrigin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Sentry-Trace'
    );
    response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours preflight cache
  }

  return response;
}
