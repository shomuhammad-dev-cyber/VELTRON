// ==============================================================================
// VALIXEN SECURE ENCRYPTED BACKUP UTILITY (AES-256-GCM ENVELOPE)
// Cryptographic Snapshotting & Cold Storage Archival Architecture
// ==============================================================================

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export interface BackupManifest {
  backupId: string;
  createdAt: string;
  database: string;
  algorithm: string;
  originalSha256Checksum: string;
  encryptedSize: number;
  iv: string; // Base64
  authTag: string; // Base64
  encryptedDataKey: string; // Base64 (envelope key)
}

/**
 * Creates an AES-256-GCM encrypted database snapshot archive with envelope key encryption
 */
export function createEncryptedBackupBuffer(
  sqlDumpContent: Buffer,
  masterKey: string
): { encryptedArchive: Buffer; manifest: BackupManifest } {
  // 1. Calculate unencrypted SHA-256 integrity checksum
  const originalSha256Checksum = crypto.createHash('sha256').update(sqlDumpContent).digest('hex');

  // 2. Generate ephemeral 256-bit data encryption key (DEK)
  const dek = crypto.randomBytes(32);
  const iv = crypto.randomBytes(12); // 96-bit IV for GCM

  // 3. Encrypt payload with DEK
  const cipher = crypto.createCipheriv('aes-256-gcm', dek, iv, { authTagLength: 16 });
  const encryptedArchive = Buffer.concat([cipher.update(sqlDumpContent), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // 4. Wrap DEK with Master Key (Key Encryption Key - KEK)
  const kek = crypto.createHash('sha256').update(masterKey).digest();
  const wrapIv = crypto.randomBytes(12);
  const wrapCipher = crypto.createCipheriv('aes-256-gcm', kek, wrapIv, { authTagLength: 16 });
  const wrappedDek = Buffer.concat([
    wrapIv,
    wrapCipher.update(dek),
    wrapCipher.final(),
    wrapCipher.getAuthTag(),
  ]);

  const backupId = `vx-backup-${Date.now()}`;
  const manifest: BackupManifest = {
    backupId,
    createdAt: new Date().toISOString(),
    database: 'valixen_db',
    algorithm: 'AES-256-GCM-ENVELOPE',
    originalSha256Checksum,
    encryptedSize: encryptedArchive.length,
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
    encryptedDataKey: wrappedDek.toString('base64'),
  };

  return { encryptedArchive, manifest };
}

/**
 * Restores and verifies an encrypted database backup snapshot
 */
export function restoreEncryptedBackupBuffer(
  encryptedArchive: Buffer,
  manifest: BackupManifest,
  masterKey: string
): Buffer {
  // 1. Unwrap DEK using Master Key
  const kek = crypto.createHash('sha256').update(masterKey).digest();
  const wrappedDekBuffer = Buffer.from(manifest.encryptedDataKey, 'base64');
  const wrapIv = wrappedDekBuffer.subarray(0, 12);
  const wrappedCiphertext = wrappedDekBuffer.subarray(12, wrappedDekBuffer.length - 16);
  const wrapAuthTag = wrappedDekBuffer.subarray(wrappedDekBuffer.length - 16);

  const wrapDecipher = crypto.createDecipheriv('aes-256-gcm', kek, wrapIv, { authTagLength: 16 });
  wrapDecipher.setAuthTag(wrapAuthTag);
  const dek = Buffer.concat([wrapDecipher.update(wrappedCiphertext), wrapDecipher.final()]);

  // 2. Decrypt archive with unwrapped DEK
  const iv = Buffer.from(manifest.iv, 'base64');
  const authTag = Buffer.from(manifest.authTag, 'base64');

  const decipher = crypto.createDecipheriv('aes-256-gcm', dek, iv, { authTagLength: 16 });
  decipher.setAuthTag(authTag);
  const decryptedDump = Buffer.concat([decipher.update(encryptedArchive), decipher.final()]);

  // 3. Verify SHA-256 Checksum against original manifest
  const decryptedChecksum = crypto.createHash('sha256').update(decryptedDump).digest('hex');
  if (decryptedChecksum !== manifest.originalSha256Checksum) {
    throw new Error('BACKUP CORRUPTION: Restored backup SHA-256 checksum does not match manifest.');
  }

  return decryptedDump;
}
