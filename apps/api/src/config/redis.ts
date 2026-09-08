import Redis from 'ioredis';
import { env } from './env';
import { logger } from './logger';

export const redis = new Redis(env.REDIS_URL, {
  password: env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
  retryStrategy(times: number) {
    if (times > 1) {
      return null; // Stop reconnecting when Redis isn't running
    }
    return 100;
  },
  lazyConnect: true,
  enableReadyCheck: false,
  connectTimeout: 1000,
  commandTimeout: 1000,
});

redis.on('connect', () => {
  logger.debug('Redis: Connecting...');
});

redis.on('ready', () => {
  logger.debug('Redis: Ready');
});

redis.on('error', (err: Error) => {
  if (env.NODE_ENV === 'development' && (err as { code?: string }).code === 'ECONNREFUSED') {
    return;
  }
  logger.error('Redis error:', err.message);
});

redis.on('close', () => {
  logger.warn('Redis: Connection closed');
});

redis.on('reconnecting', (time: number) => {
  logger.warn(`Redis: Reconnecting in ${time}ms`);
});

/**
 * Get a value from Redis and parse it as JSON
 */
export const redisGet = async <T>(key: string): Promise<T | null> => {
  const value = await redis.get(key);
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return value as unknown as T;
  }
};

/**
 * Set a value in Redis as JSON with optional TTL in seconds
 */
export const redisSet = async (key: string, value: unknown, ttlSeconds?: number): Promise<void> => {
  const serialized = JSON.stringify(value);
  if (ttlSeconds) {
    await redis.setex(key, ttlSeconds, serialized);
  } else {
    await redis.set(key, serialized);
  }
};

/**
 * Delete a key from Redis
 */
export const redisDel = async (...keys: string[]): Promise<void> => {
  if (keys.length > 0) {
    await redis.del(...keys);
  }
};

/**
 * Check if a key exists in Redis
 */
export const redisExists = async (key: string): Promise<boolean> => {
  const count = await redis.exists(key);
  return count > 0;
};

/**
 * Increment a counter in Redis
 */
export const redisIncr = async (key: string, ttlSeconds?: number): Promise<number> => {
  const value = await redis.incr(key);
  if (ttlSeconds && value === 1) {
    await redis.expire(key, ttlSeconds);
  }
  return value;
};

export default redis;
