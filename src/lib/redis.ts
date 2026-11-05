// ==============================================================================
// VALIXEN HIGH-PERFORMANCE REDIS CLIENT & FALLBACK CACHE
// ==============================================================================

import Redis from 'ioredis';
import { logger } from './logger';

class InMemoryCacheFallback {
  private store = new Map<string, { value: string; expiresAt?: number }>();

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: string, mode?: string, duration?: number): Promise<'OK'> {
    let expiresAt: number | undefined;
    if (mode === 'EX' && duration) {
      expiresAt = Date.now() + duration * 1000;
    }
    this.store.set(key, { value, expiresAt });
    return 'OK';
  }

  async incr(key: string): Promise<number> {
    const item = await this.get(key);
    const count = item ? parseInt(item, 10) + 1 : 1;
    this.store.set(key, { value: count.toString() });
    return count;
  }

  async expire(key: string, seconds: number): Promise<number> {
    const item = this.store.get(key);
    if (!item) return 0;
    item.expiresAt = Date.now() + seconds * 1000;
    return 1;
  }

  async del(key: string): Promise<number> {
    const deleted = this.store.delete(key);
    return deleted ? 1 : 0;
  }

  async ping(): Promise<string> {
    return 'PONG (InMemory Fallback)';
  }
}

function initializeRedis(): Redis | InMemoryCacheFallback {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    logger.info('REDIS_URL not configured. Initializing in-memory cache fallback.');
    return new InMemoryCacheFallback();
  }

  try {
    const client = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
      lazyConnect: true,
      retryStrategy: () => null, // Do not spam retries if offline
    });

    client.on('error', (err: Error) => {
      logger.warn(`Redis connection unavailable: ${err.message}. Using cache fallback.`);
    });

    return client;
  } catch (err) {
    logger.warn('Failed to construct Redis client. Using in-memory fallback.', { error: String(err) });
    return new InMemoryCacheFallback();
  }
}

export const redis = initializeRedis();
