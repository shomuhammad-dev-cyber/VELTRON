// ==============================================================================
// VALIXEN XSS (CROSS-SITE SCRIPTING) & INJECTION DEFENSE ENGINE
// HTML Entity Encoding, Malicious Script Stripping & SQL Injection Guard
// ==============================================================================

import { ValidationError } from '@/lib/api/errors';

const HTML_ENTITY_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
};

/**
 * Encodes special characters to prevent Reflected and Stored XSS
 */
export function escapeHtml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe.replace(/[&<>"'/`]/g, (match) => HTML_ENTITY_MAP[match] || match);
}

/**
 * Strips dangerous HTML tags, javascript: schemes, and inline event handlers
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';

  let sanitized = input;

  // 1. Remove dangerous executable tags
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  sanitized = sanitized.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');

  // 2. Remove javascript: and vbscript: URIs
  sanitized = sanitized.replace(/javascript\s*:/gi, '');
  sanitized = sanitized.replace(/vbscript\s*:/gi, '');

  // 3. Remove inline DOM event handlers (e.g., onload, onerror, onclick, onmouseover)
  sanitized = sanitized.replace(/\bon\w+\s*=\s*(?:["'][^"']*["']|[^\s>]+)/gi, '');

  // 4. Strip null bytes
  sanitized = sanitized.replace(/\0/g, '');

  return sanitized.trim();
}

/**
 * Suspicious SQL injection token patterns
 */
const SQL_INJECTION_PATTERNS = [
  /(\b(UNION(\s+ALL)?)\b|\bSELECT\b.*\bFROM\b)/i,
  /(--|#|\/\*|\*\/)/,
  /;\s*(DROP|ALTER|CREATE|DELETE|UPDATE|TRUNCATE)\b/i,
  /\bOR\s+['"]?\w+['"]?\s*=\s*['"]?\w+['"]?/i,
  /\bAND\s+['"]?\w+['"]?\s*=\s*['"]?\w+['"]?/i,
  /('\s*OR\s*['"]?1['"]?\s*=\s*['"]?1['"]?|"\s*OR\s*['"]?1['"]?\s*=\s*['"]?1['"]?)/i,
];

/**
 * Evaluates a string for potential SQL injection tokens.
 * In production, parameterized queries via Prisma prevent injection; this acts as secondary defense.
 */
export function assertNoSqlInjection(input: string, fieldName: string = 'parameter'): void {
  if (!input || typeof input !== 'string') return;

  for (const pattern of SQL_INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      throw new ValidationError(
        `SECURITY REJECTION: Potential SQL injection signature detected in '${fieldName}'.`
      );
    }
  }
}
