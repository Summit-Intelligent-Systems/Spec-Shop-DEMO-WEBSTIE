import path from 'path';
import dotenv from 'dotenv';
import { z } from 'zod';

// Load .env from multiple potential monorepo root paths
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Zod-validated environment configuration.
 * Fails fast at startup if any required variable is missing.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().default(4000),
  API_URL: z.string().url().default('http://localhost:4000'),

  // Database
  // The demo API can boot without external services; production deployments
  // should override these with managed database and Redis URLs.
  DATABASE_URL: z.string().min(1).default('postgresql://localhost:5432/xyz_eyewear'),
  DATABASE_POOL_SIZE: z.coerce.number().default(10),

  // Redis
  REDIS_URL: z.string().min(1).default('redis://localhost:6379'),
  REDIS_PASSWORD: z.string().optional(),

  // JWT
  JWT_SECRET: z.string().min(32).default('demo-jwt-secret-change-in-production-32'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(32).default('demo-refresh-secret-change-in-production-32'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  JWT_EMAIL_VERIFY_SECRET: z.string().min(16).optional(),
  JWT_EMAIL_VERIFY_EXPIRES_IN: z.string().default('24h'),
  JWT_PASSWORD_RESET_SECRET: z.string().min(16).optional(),
  JWT_PASSWORD_RESET_EXPIRES_IN: z.string().default('1h'),

  // CORS
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
  RATE_LIMIT_AUTH_MAX: z.coerce.number().default(10),

  // Email
  SMTP_HOST: z.string().default('smtp.mailtrap.io'),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_SECURE: z.coerce.boolean().default(false),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM_NAME: z.string().default('XYZ Eyewear'),
  SMTP_FROM_EMAIL: z.string().email().default('noreply@xyzeyewear.com'),

  // Storage
  STORAGE_DRIVER: z.enum(['local', 's3', 'cloudinary']).default('local'),
  UPLOAD_DIR: z.string().default('uploads'),
  UPLOAD_MAX_SIZE_MB: z.coerce.number().default(10),

  // AWS S3
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().default('ap-south-1'),
  AWS_S3_BUCKET: z.string().optional(),
  AWS_S3_BASE_URL: z.string().optional(),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  CLOUDINARY_BASE_FOLDER: z.string().default('xyz-eyewear'),

  // Payment
  PAYMENT_DRIVER: z.enum(['mock', 'razorpay', 'stripe', 'paypal']).default('mock'),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  PAYPAL_CLIENT_ID: z.string().optional(),
  PAYPAL_CLIENT_SECRET: z.string().optional(),
  PAYPAL_MODE: z.enum(['sandbox', 'live']).default('sandbox'),

  // Security
  BCRYPT_SALT_ROUNDS: z.coerce.number().default(12),
  SESSION_SECRET: z.string().min(16).default('change_this_secret'),
  CSRF_SECRET: z.string().min(16).default('change_this_csrf_secret'),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('debug'),
  LOG_FORMAT: z.enum(['pretty', 'json']).default('pretty'),

  // Business
  DEFAULT_CURRENCY: z.string().default('INR'),
  TAX_RATE: z.coerce.number().default(18),
  FREE_SHIPPING_THRESHOLD: z.coerce.number().default(999),
  DEFAULT_SHIPPING_CHARGE: z.coerce.number().default(99),
  LOW_STOCK_THRESHOLD: z.coerce.number().default(5),
  PAGINATION_DEFAULT_LIMIT: z.coerce.number().default(24),

  // Feature Flags
  FEATURE_VIRTUAL_TRYON: z.coerce.boolean().default(false),
  FEATURE_EYE_TEST_BOOKING: z.coerce.boolean().default(true),
  FEATURE_MEMBERSHIP: z.coerce.boolean().default(true),
  FEATURE_BLOG: z.coerce.boolean().default(true),
  FEATURE_2FA: z.coerce.boolean().default(false),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;
