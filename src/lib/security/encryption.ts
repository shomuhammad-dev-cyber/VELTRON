// ==============================================================================
// VALIXEN FINANCIAL ENCRYPTION & DATA SANITIZATION ENGINE
// AES-256-GCM Envelope Encryption & PCI-DSS CVV/PIN Blocking Safeguards
// ==============================================================================

import crypto from 'crypto';
import { ValidationError } from '@/lib/api/errors';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH_BYTES = 12; // 96-bit IV recommended for GCM
const AUTH_TAG_LENGTH_BYTES = 16; // 128-bit auth tag

export interface EncryptedField {
  ciphertext: string; // Base64
  iv: string; // Base64
  authTag: string; // Base64
  keyVersion: number;
}

/**
 * Derives a 256-bit symmetric key from master secret using HKDF (RFC 5869)
 */
function getDerivedKey(purpose: string = 'financial_field_encryption'): Buffer {
  const masterKey =
    process.env.ENCRYPTION_MASTER_KEY ||
    process.env.AUTH_SECRET ||
    'valixen-default-fallback-master-key-must-be-configured-in-production-env';

  return Buffer.from(
    crypto.hkdfSync('sha256', Buffer.from(masterKey), Buffer.from('valixen-salt'), Buffer.from(purpose), 32)
  );
}

/**
 * Encrypts a sensitive plaintext string with AES-256-GCM authenticated encryption
 */
export function encryptField(plaintext: string, purpose?: string): EncryptedField {
  const key = getDerivedKey(purpose);
  const iv = crypto.randomBytes(IV_LENGTH_BYTES);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH_BYTES,
  });

  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    ciphertext: encrypted.toString('base64'),
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
    keyVersion: 1,
  };
}

/**
 * Decrypts an AES-256-GCM encrypted field and verifies cryptographic integrity
 */
export function decryptField(field: EncryptedField, purpose?: string): string {
  const key = getDerivedKey(purpose);
  const iv = Buffer.from(field.iv, 'base64');
  const authTag = Buffer.from(field.authTag, 'base64');
  const ciphertext = Buffer.from(field.ciphertext, 'base64');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH_BYTES,
  });

  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString('utf8');
}

// ==============================================================================
// PCI-DSS FINANCIAL DATA SAFEGUARDS: STRICT CVV/PIN PREVENTION
// ==============================================================================

// Prohibited field patterns matching CVV, CVC, CID, PIN, or Card Security Codes
const PROHIBITED_SENSITIVE_KEYS = [
  /cvv/i,
  /cvc/i,
  /cvn/i,
  /cid/i,
  /security_?code/i,
  /card_?code/i,
  /verification_?value/i,
  /card_?pin/i,
  /atm_?pin/i,
];

// Regex matching raw 13-19 digit credit card numbers (Visa, Mastercard, Amex, Discover)
const CREDIT_CARD_PAN_REGEX = /\b(?:\d[ -]*?){13,19}\b/;

/**
 * Deep inspection scanner ensuring NO raw CVV, PIN, or unencrypted PAN enters the platform
 */
export function sanitizeFinancialPayload<T>(payload: T): T {
  if (!payload || typeof payload !== 'object') {
    return payload;
  }

  function inspectNode(node: any, path: string = ''): void {
    if (!node || typeof node !== 'object') {
      if (typeof node === 'string' && CREDIT_CARD_PAN_REGEX.test(node.replace(/[\s-]/g, ''))) {
        throw new ValidationError(
          `PCI-DSS VIOLATION: Raw credit card Primary Account Number (PAN) detected at path '${path}'. Financial card numbers must be tokenized via an authorized payment gateway (e.g., Stripe, Adyen).`
        );
      }
      return;
    }

    for (const [key, value] of Object.entries(node)) {
      const currentPath = path ? `${path}.${key}` : key;

      // Check if key corresponds to prohibited CVV/PIN parameters
      for (const regex of PROHIBITED_SENSITIVE_KEYS) {
        if (regex.test(key)) {
          throw new ValidationError(
            `PCI-DSS COMPLIANCE ENFORCEMENT: Parameter '${currentPath}' violates platform security. Storing or processing raw card CVV, CVC, or PINs is strictly prohibited.`
          );
        }
      }

      // Check nested objects and arrays recursively
      inspectNode(value, currentPath);
    }
  }

  inspectNode(payload);
  return payload;
}

/**
 * Tokenized Payment Instrument reference structure (No sensitive card data stored)
 */
export interface TokenizedPaymentInstrument {
  token: string; // e.g., 'tok_1N23xValixenPCI'
  brand: 'VISA' | 'MASTERCARD' | 'AMEX' | 'DISCOVER';
  last4: string; // Safe truncated reference
  expMonth: number;
  expYear: number;
  provider: 'STRIPE' | 'ADYEN' | 'PLAID' | 'CIRCLE';
}
