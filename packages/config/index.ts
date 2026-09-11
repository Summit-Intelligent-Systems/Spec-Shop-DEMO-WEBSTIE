/**
 * @nayan-sukh-eyewear/config
 * Shared constants and configuration used across web and api apps.
 */

// ─── App Identity ─────────────────────────────────────────────────────────────

export const APP = {
  NAME: 'Nayan Sukh Eyewear',
  TAGLINE: 'See the World in Style',
  DESCRIPTION:
    'Premium eyewear crafted for those who see the world differently. Discover frames that define you.',
  URL: process.env.NEXT_PUBLIC_APP_URL || 'https://nayansukheyewear.com',
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  SUPPORT_EMAIL: 'support@nayansukheyewear.com',
  SUPPORT_PHONE: '+91 98765 43210',
  SOCIAL: {
    INSTAGRAM: 'https://instagram.com/nayansukheyewear',
    FACEBOOK: 'https://facebook.com/nayansukheyewear',
    TWITTER: 'https://twitter.com/nayansukheyewear',
    YOUTUBE: 'https://youtube.com/@nayansukheyewear',
    PINTEREST: 'https://pinterest.com/nayansukheyewear',
  },
} as const;

// ─── Business Rules ───────────────────────────────────────────────────────────

export const BUSINESS = {
  CURRENCY: 'INR',
  CURRENCY_SYMBOL: '₹',
  LOCALE: 'en-IN',
  TIMEZONE: 'Asia/Kolkata',
  TAX_RATE: 0.18, // 18% GST
  TAX_LABEL: 'GST (18%)',
  FREE_SHIPPING_THRESHOLD: 999,
  STANDARD_SHIPPING_CHARGE: 99,
  EXPRESS_SHIPPING_CHARGE: 199,
  LOW_STOCK_THRESHOLD: 5,
  PRESCRIPTION_VALIDITY_YEARS: 2,
  RETURN_WINDOW_DAYS: 15,
  WARRANTY_YEARS: 1,
} as const;

// ─── Pagination ───────────────────────────────────────────────────────────────

export const PAGINATION = {
  DEFAULT_LIMIT: 24,
  ADMIN_DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  PRODUCT_GRID_COLS: { sm: 2, md: 3, lg: 4 },
} as const;

// ─── Image Sizes ──────────────────────────────────────────────────────────────

export const IMAGE_SIZES = {
  THUMBNAIL: { width: 150, height: 150 },
  CARD_SMALL: { width: 300, height: 300 },
  CARD: { width: 500, height: 500 },
  CARD_LARGE: { width: 800, height: 800 },
  HERO: { width: 1920, height: 1080 },
  BANNER: { width: 1440, height: 600 },
  AVATAR: { width: 100, height: 100 },
  BRAND_LOGO: { width: 200, height: 80 },
} as const;

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const AUTH = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  EMAIL_VERIFY_TOKEN_EXPIRY_HOURS: 24,
  PASSWORD_RESET_TOKEN_EXPIRY_HOURS: 1,
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '30d',
  SESSION_EXPIRY_DAYS: 30,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MINUTES: 30,
  OTP_LENGTH: 6,
  OTP_EXPIRY_MINUTES: 10,
} as const;

// ─── Product Configuration ────────────────────────────────────────────────────

export const PRODUCT = {
  MAX_IMAGES: 10,
  MAX_VARIANTS: 20,
  MAX_TAGS: 20,
  SLUG_MAX_LENGTH: 100,
  NAME_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 5000,
  DEFAULT_FACE_SHAPES_PER_SHAPE: {
    ROUND: ['SQUARE', 'RECTANGLE', 'WAYFARER', 'GEOMETRIC'],
    SQUARE: ['ROUND', 'OVAL', 'CAT_EYE', 'AVIATOR'],
    OVAL: ['ROUND', 'SQUARE', 'RECTANGLE', 'AVIATOR', 'CAT_EYE'],
    HEART: ['AVIATOR', 'OVAL', 'ROUND', 'RIMLESS'],
    DIAMOND: ['CAT_EYE', 'OVAL', 'RIMLESS', 'RECTANGLE'],
    OBLONG: ['SQUARE', 'ROUND', 'WAYFARER', 'CLUBMASTER'],
    TRIANGLE: ['AVIATOR', 'CAT_EYE', 'ROUND', 'OVAL'],
  },
} as const;

// ─── SEO Defaults ─────────────────────────────────────────────────────────────

export const SEO_DEFAULTS = {
  TITLE_TEMPLATE: '%s | Nayan Sukh Eyewear',
  DEFAULT_TITLE: 'Nayan Sukh Eyewear — Premium Eyewear Brand',
  DEFAULT_DESCRIPTION:
    'Shop premium eyeglasses, sunglasses, and contact lenses at Nayan Sukh Eyewear. Virtual try-on, free eye tests, and exclusive designer collections.',
  OG_IMAGE: '/images/og-default.jpg',
  TWITTER_HANDLE: '@nayansukheyewear',
  TWITTER_CARD: 'summary_large_image',
  CANONICAL_URL: 'https://nayansukheyewear.com',
} as const;

// ─── Navigation ───────────────────────────────────────────────────────────────

export const NAV_CATEGORIES = [
  { label: 'Eyeglasses', slug: 'eyeglasses', href: '/shop/eyeglasses' },
  { label: 'Sunglasses', slug: 'sunglasses', href: '/shop/sunglasses' },
  { label: 'Computer Glasses', slug: 'computer-glasses', href: '/shop/computer-glasses' },
  { label: 'Contact Lenses', slug: 'contact-lenses', href: '/shop/contact-lenses' },
  { label: "Kids' Collection", slug: 'kids', href: '/shop/kids' },
  { label: 'Premium Collection', slug: 'premium', href: '/shop/premium' },
  { label: 'New Arrivals', slug: 'new-arrivals', href: '/shop/new-arrivals' },
  { label: 'Offers', slug: 'offers', href: '/offers' },
] as const;

// ─── Rating ───────────────────────────────────────────────────────────────────

export const RATING = {
  MAX: 5,
  MIN: 1,
  MIN_REVIEWS_FOR_DISPLAY: 1,
  VERIFIED_PURCHASE_BADGE_THRESHOLD: 1,
} as const;

// ─── Membership Plans ─────────────────────────────────────────────────────────

export const MEMBERSHIP_PLANS = [
  {
    slug: 'silver',
    name: 'Silver',
    price: 499,
    duration: 12,
    durationUnit: 'MONTHS',
    discountPercentage: 10,
    highlights: ['10% off all products', '1 free eye test', 'Priority support', 'Early access to sales'],
  },
  {
    slug: 'gold',
    name: 'Gold',
    price: 999,
    duration: 12,
    durationUnit: 'MONTHS',
    discountPercentage: 20,
    highlights: [
      '20% off all products',
      '2 free eye tests',
      'Free shipping always',
      'Exclusive collections',
      'Dedicated support',
    ],
  },
  {
    slug: 'platinum',
    name: 'Platinum',
    price: 1999,
    duration: 12,
    durationUnit: 'MONTHS',
    discountPercentage: 30,
    highlights: [
      '30% off all products',
      'Unlimited eye tests',
      'Free shipping + express',
      'Designer exclusives',
      'Personal style consultant',
      'Annual lens replacement',
    ],
  },
] as const;

// ─── Error Codes ──────────────────────────────────────────────────────────────

export const ERROR_CODES = {
  // Auth
  INVALID_CREDENTIALS: 'AUTH_001',
  ACCOUNT_NOT_VERIFIED: 'AUTH_002',
  ACCOUNT_SUSPENDED: 'AUTH_003',
  TOKEN_EXPIRED: 'AUTH_004',
  TOKEN_INVALID: 'AUTH_005',
  INSUFFICIENT_PERMISSIONS: 'AUTH_006',
  TWO_FACTOR_REQUIRED: 'AUTH_007',

  // Validation
  VALIDATION_ERROR: 'VAL_001',
  DUPLICATE_EMAIL: 'VAL_002',
  DUPLICATE_SKU: 'VAL_003',

  // Resource
  NOT_FOUND: 'RES_001',
  ALREADY_EXISTS: 'RES_002',
  CONFLICT: 'RES_003',

  // Payment
  PAYMENT_FAILED: 'PAY_001',
  PAYMENT_CANCELLED: 'PAY_002',
  INSUFFICIENT_STOCK: 'PAY_003',
  COUPON_INVALID: 'PAY_004',
  COUPON_EXPIRED: 'PAY_005',
  COUPON_EXHAUSTED: 'PAY_006',

  // Server
  INTERNAL_ERROR: 'SRV_001',
  SERVICE_UNAVAILABLE: 'SRV_002',
  RATE_LIMIT_EXCEEDED: 'SRV_003',
} as const;

// ─── HTTP Status Codes ────────────────────────────────────────────────────────

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// ─── API Routes ───────────────────────────────────────────────────────────────

export const API_PREFIX = '/api/v1';

export const API_ROUTES = {
  AUTH: {
    REGISTER: `${API_PREFIX}/auth/register`,
    LOGIN: `${API_PREFIX}/auth/login`,
    LOGOUT: `${API_PREFIX}/auth/logout`,
    REFRESH: `${API_PREFIX}/auth/refresh`,
    VERIFY_EMAIL: `${API_PREFIX}/auth/verify-email`,
    FORGOT_PASSWORD: `${API_PREFIX}/auth/forgot-password`,
    RESET_PASSWORD: `${API_PREFIX}/auth/reset-password`,
    CHANGE_PASSWORD: `${API_PREFIX}/auth/change-password`,
    ME: `${API_PREFIX}/auth/me`,
  },
  PRODUCTS: `${API_PREFIX}/products`,
  CATEGORIES: `${API_PREFIX}/categories`,
  BRANDS: `${API_PREFIX}/brands`,
  CART: `${API_PREFIX}/cart`,
  WISHLIST: `${API_PREFIX}/wishlist`,
  ORDERS: `${API_PREFIX}/orders`,
  REVIEWS: `${API_PREFIX}/reviews`,
  COUPONS: `${API_PREFIX}/coupons`,
  USERS: `${API_PREFIX}/users`,
  STORES: `${API_PREFIX}/stores`,
  PRESCRIPTIONS: `${API_PREFIX}/prescriptions`,
  APPOINTMENTS: `${API_PREFIX}/appointments`,
  MEMBERSHIP: `${API_PREFIX}/membership`,
  CMS: `${API_PREFIX}/cms`,
  MEDIA: `${API_PREFIX}/media`,
  ANALYTICS: `${API_PREFIX}/analytics`,
  NOTIFICATIONS: `${API_PREFIX}/notifications`,
  INVENTORY: `${API_PREFIX}/inventory`,
} as const;
