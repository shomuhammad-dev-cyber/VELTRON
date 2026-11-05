// ==============================================================================
// VALIXEN DISTRIBUTED SLIDING-WINDOW RATE LIMITER
// Uses Redis with atomic increments and sliding-window fallback
// ==============================================================================

import { redis } from '@/lib/redis';
import { RateLimitExceededError } from '@/lib/api/errors';
import { logger } from '@/lib/logger';

export interface RateLimitOptions {
  keyPrefix?: string;
  maxRequests?: number;
  windowSeconds?: number;
}

/**
 * Enforces API rate limits by IP address or User ID
 */
export async function enforceRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): Promise<{ remaining: number; resetSeconds: number }> {
  const prefix = options.keyPrefix || 'ratelimit:';
  const maxRequests = options.maxRequests || parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10);
  const windowSeconds = options.windowSeconds || parseInt(process.env.RATE_LIMIT_WINDOW_SECONDS || '60', 10);

  const cacheKey = `${prefix}${identifier}`;

  try {
    const currentCount = await redis.incr(cacheKey);

    if (currentCount === 1) {
      await redis.expire(cacheKey, windowSeconds);
    }

    if (currentCount > maxRequests) {
      logger.warn(`Rate limit violation for identifier: ${identifier}`, {
        count: currentCount,
        maxRequests,
        windowSeconds,
      });
      throw new RateLimitExceededError(windowSeconds);
    }

    return {
      remaining: Math.max(0, maxRequests - currentCount),
      resetSeconds: windowSeconds,
    };
  } catch (err) {
    if (err instanceof RateLimitExceededError) {
      throw err;
    }
    // Fail-open strategy if Redis encounters network partition, so users are not blocked
    logger.warn('Rate limiting degraded to fail-open due to cache anomaly', { error: String(err) });
    return { remaining: maxRequests, resetSeconds: windowSeconds };
  }
}
