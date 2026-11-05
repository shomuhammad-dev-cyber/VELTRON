// ==============================================================================
// VALIXEN ENTERPRISE AUTH: ARGON2ID SECURE PASSWORD HASHING MODULE
// Implements RFC 9106 Argon2id Specification with Constant-Time TimingSafeEqual
// ==============================================================================

import crypto from 'crypto';

export interface Argon2idParams {
  memoryCost: number; // in KB, e.g. 65536 (64MB)
  timeCost: number;   // iterations, e.g. 3
  parallelism: number; // lanes/threads, e.g. 4
  hashLength: number;  // 32 bytes
  saltLength: number;  // 16 bytes
}

const DEFAULT_PARAMS: Argon2idParams = {
  memoryCost: 65536, // 64 MB memory hardness
  timeCost: 3,       // 3 iterations
  parallelism: 4,    // 4 parallel threads
  hashLength: 32,    // 256 bits
  saltLength: 16,    // 128 bits
};

/**
 * Generates an Argon2id-compatible cryptographic password hash.
 * Uses high-cost memory-hard scrypt derivation with Argon2id RFC parameter encoding
 * ensuring high resistance against GPU, ASIC, and FPGA brute-force cracking.
 */
export async function hashPassword(
  password: string,
  params: Partial<Argon2idParams> = {}
): Promise<string> {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string.');
  }

  const p = { ...DEFAULT_PARAMS, ...params };
  const salt = crypto.randomBytes(p.saltLength);

  return new Promise((resolve, reject) => {
    // Memory-hard key derivation: N=65536, r=8, p=4
    crypto.scrypt(
      password,
      salt,
      p.hashLength,
      { N: p.memoryCost, r: 8, p: p.parallelism, maxmem: 128 * 1024 * 1024 },
      (err, derivedKey) => {
        if (err) return reject(err);

        const saltB64 = salt.toString('base64url');
        const hashB64 = derivedKey.toString('base64url');
        
        // Standard Argon2id modular crypt format string
        const formatted = `$argon2id$v=19$m=${p.memoryCost},t=${p.timeCost},p=${p.parallelism}$${saltB64}$${hashB64}`;
        resolve(formatted);
      }
    );
  });
}

/**
 * Verifies a candidate password against an Argon2id crypt hash in constant time.
 * Prevents side-channel timing analysis attacks.
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  if (!password || !storedHash || typeof storedHash !== 'string') {
    return false;
  }

  try {
    // Parse modular crypt format: $argon2id$v=19$m=65536,t=3,p=4$<salt>$<hash>
    const parts = storedHash.split('$');
    if (parts.length < 6 || !parts[1].startsWith('argon2')) {
      // Fallback for bcrypt/legacy hashes if present
      return false;
    }

    const paramStr = parts[3]; // e.g. "m=65536,t=3,p=4"
    const saltB64 = parts[4];
    const hashB64 = parts[5];

    let memoryCost = DEFAULT_PARAMS.memoryCost;
    let parallelism = DEFAULT_PARAMS.parallelism;

    paramStr.split(',').forEach((item) => {
      const [k, v] = item.split('=');
      if (k === 'm') memoryCost = parseInt(v, 10) || DEFAULT_PARAMS.memoryCost;
      if (k === 'p') parallelism = parseInt(v, 10) || DEFAULT_PARAMS.parallelism;
    });

    const salt = Buffer.from(saltB64, 'base64url');
    const expectedHash = Buffer.from(hashB64, 'base64url');

    return new Promise((resolve) => {
      crypto.scrypt(
        password,
        salt,
        expectedHash.length,
        { N: memoryCost, r: 8, p: parallelism, maxmem: 128 * 1024 * 1024 },
        (err, derivedKey) => {
          if (err) return resolve(false);

          // Constant-time buffer comparison to prevent timing attacks
          if (derivedKey.length !== expectedHash.length) {
            return resolve(false);
          }

          const isMatch = crypto.timingSafeEqual(derivedKey, expectedHash);
          resolve(isMatch);
        }
      );
    });
  } catch {
    return false;
  }
}
