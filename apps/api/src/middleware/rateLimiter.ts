import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

import { redis } from '../config/redis';
import { env } from '../config/env';
import { RateLimitError } from '../shared/errors/AppError';

/**
 * Create a rate limiter middleware with Redis backing.
 */
const createLimiter = (options: {
  windowMs: number;
  max: number;
  keyPrefix?: string;
  message?: string;
}) => {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      // Use authenticated user ID if available, otherwise IP
      const userId = (req as { user?: { id: string } }).user?.id;
      const prefix = options.keyPrefix || 'global';
      return `rl:${prefix}:${userId ?? req.ip}`;
    },
    passOnStoreError: true,
    store: new RedisStore({
      // @ts-expect-error - Type mismatch between versions but works correctly
      sendCommand: (...args: string[]) => redis.call(...args),
      prefix: `xyz:rl:${options.keyPrefix || 'global'}:`,
    }),
    handler: (_req, _res, next) => {
      next(new RateLimitError(options.message));
    },
    skip: () => env.NODE_ENV === 'test',
  });
};

export const rateLimiter = {
  /** Global rate limit — 100 requests per 15 minutes */
  global: createLimiter({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS,
    keyPrefix: 'global',
    message: 'Too many requests. Please slow down.',
  }),

  /** Auth endpoints — 10 attempts per 15 minutes */
  auth: createLimiter({
    windowMs: 15 * 60 * 1000,
    max: env.RATE_LIMIT_AUTH_MAX,
    keyPrefix: 'auth',
    message: 'Too many authentication attempts. Please wait 15 minutes.',
  }),

  /** Password reset — 5 attempts per hour */
  passwordReset: createLimiter({
    windowMs: 60 * 60 * 1000,
    max: 5,
    keyPrefix: 'pwd_reset',
    message: 'Too many password reset attempts. Please wait 1 hour.',
  }),

  /** API-level rate limit — 1000 req/15min for authenticated users */
  api: createLimiter({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    keyPrefix: 'api',
  }),

  /** Search — 60 requests per minute */
  search: createLimiter({
    windowMs: 60 * 1000,
    max: 60,
    keyPrefix: 'search',
  }),

  /** Media upload — 20 uploads per hour */
  upload: createLimiter({
    windowMs: 60 * 60 * 1000,
    max: 20,
    keyPrefix: 'upload',
    message: 'Upload limit reached. Please wait 1 hour.',
  }),
};
