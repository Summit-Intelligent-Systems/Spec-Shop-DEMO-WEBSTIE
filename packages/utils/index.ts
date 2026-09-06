/**
 * @xyz-eyewear/utils
 * Shared utility functions used across web and api apps.
 */

// ─── Currency & Number Formatting ────────────────────────────────────────────

/**
 * Format a number as Indian Rupee currency
 */
export const formatCurrency = (
  amount: number,
  currency = 'INR',
  locale = 'en-IN',
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a number with commas (Indian format)
 */
export const formatNumber = (num: number, locale = 'en-IN'): string => {
  return new Intl.NumberFormat(locale).format(num);
};

/**
 * Calculate discount percentage between original and sale price
 */
export const calculateDiscountPercent = (original: number, sale: number): number => {
  if (original <= 0) return 0;
  return Math.round(((original - sale) / original) * 100);
};

// ─── Date & Time ─────────────────────────────────────────────────────────────

/**
 * Format date to readable string
 */
export const formatDate = (
  date: string | Date,
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' },
  locale = 'en-IN',
): string => {
  return new Intl.DateTimeFormat(locale, options).format(new Date(date));
};

/**
 * Format relative time (e.g. "2 days ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const now = Date.now();
  const diff = new Date(date).getTime() - now;
  const diffSeconds = diff / 1000;
  const diffMinutes = diffSeconds / 60;
  const diffHours = diffMinutes / 60;
  const diffDays = diffHours / 24;

  if (Math.abs(diffSeconds) < 60) {
    return rtf.format(Math.round(diffSeconds), 'second');
  } else if (Math.abs(diffMinutes) < 60) {
    return rtf.format(Math.round(diffMinutes), 'minute');
  } else if (Math.abs(diffHours) < 24) {
    return rtf.format(Math.round(diffHours), 'hour');
  } else if (Math.abs(diffDays) < 30) {
    return rtf.format(Math.round(diffDays), 'day');
  } else {
    return formatDate(date);
  }
};

/**
 * Add days to a date
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Check if a date is in the past
 */
export const isPast = (date: string | Date): boolean => {
  return new Date(date) < new Date();
};

/**
 * Check if a date is in the future
 */
export const isFuture = (date: string | Date): boolean => {
  return new Date(date) > new Date();
};

// ─── String Utilities ─────────────────────────────────────────────────────────

/**
 * Convert a string to a URL-friendly slug
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Capitalize first letter of each word
 */
export const titleCase = (text: string): string => {
  return text.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
};

/**
 * Truncate text to a given length with ellipsis
 */
export const truncate = (text: string, maxLength: number, suffix = '...'): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length).trimEnd() + suffix;
};

/**
 * Generate a random alphanumeric string
 */
export const generateId = (length = 12): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

/**
 * Generate an order number (e.g. XYZ-2024-A1B2C3)
 */
export const generateOrderNumber = (): string => {
  const year = new Date().getFullYear();
  const random = generateId(6).toUpperCase();
  return `XYZ-${year}-${random}`;
};

/**
 * Mask email for privacy (e.g. j***@example.com)
 */
export const maskEmail = (email: string): string => {
  const [local, domain] = email.split('@');
  const masked = local.charAt(0) + '***';
  return `${masked}@${domain}`;
};

/**
 * Mask phone number (e.g. +91 98***1234)
 */
export const maskPhone = (phone: string): string => {
  return phone.replace(/(\+?\d{2,3})\s?(\d{2,3})\d+(\d{4})/, '$1 $2***$3');
};

// ─── Validation Utilities ─────────────────────────────────────────────────────

export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  return /^[6-9]\d{9}$/.test(phone.replace(/\s+/g, ''));
};

export const isValidPincode = (pincode: string): boolean => {
  return /^[1-9][0-9]{5}$/.test(pincode);
};

/**
 * Password strength checker (returns 0-4 score)
 */
export const getPasswordStrength = (password: string): number => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  return score;
};

// ─── Array & Object Utilities ─────────────────────────────────────────────────

/**
 * Remove duplicates from an array
 */
export const unique = <T>(arr: T[]): T[] => [...new Set(arr)];

/**
 * Group array of objects by a key
 */
export const groupBy = <T extends Record<string, unknown>>(
  arr: T[],
  key: keyof T,
): Record<string, T[]> => {
  return arr.reduce(
    (groups, item) => {
      const groupKey = String(item[key]);
      return { ...groups, [groupKey]: [...(groups[groupKey] || []), item] };
    },
    {} as Record<string, T[]>,
  );
};

/**
 * Pick specified keys from an object
 */
export const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> => {
  return keys.reduce(
    (result, key) => {
      if (key in obj) result[key] = obj[key];
      return result;
    },
    {} as Pick<T, K>,
  );
};

/**
 * Omit specified keys from an object
 */
export const omit = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result as Omit<T, K>;
};

// ─── Image Utilities ──────────────────────────────────────────────────────────

/**
 * Build Cloudinary URL with transformations
 */
export const buildCloudinaryUrl = (
  baseUrl: string,
  transformations?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png' | 'auto';
    crop?: 'fill' | 'fit' | 'crop' | 'thumb';
  },
): string => {
  if (!transformations) return baseUrl;
  const { width, height, quality = 80, format = 'auto', crop = 'fill' } = transformations;
  const transforms = [
    `q_${quality}`,
    `f_${format}`,
    crop && `c_${crop}`,
    width && `w_${width}`,
    height && `h_${height}`,
  ]
    .filter(Boolean)
    .join(',');
  return baseUrl.replace('/upload/', `/upload/${transforms}/`);
};

/**
 * Get image placeholder (blur data URL)
 */
export const getBlurDataUrl = (): string => {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmMGVkZTgiLz48L3N2Zz4=';
};

// ─── Cart Utilities ───────────────────────────────────────────────────────────

/**
 * Calculate cart totals
 */
export const calculateCartTotals = (
  subtotal: number,
  shippingThreshold = 999,
  shippingCharge = 99,
  taxRate = 0.18,
  discount = 0,
): {
  subtotal: number;
  discount: number;
  shippingCharge: number;
  tax: number;
  total: number;
} => {
  const afterDiscount = subtotal - discount;
  const shipping = afterDiscount >= shippingThreshold ? 0 : shippingCharge;
  const tax = Math.round(afterDiscount * taxRate);
  const total = afterDiscount + shipping + tax;

  return {
    subtotal,
    discount,
    shippingCharge: shipping,
    tax,
    total,
  };
};

// ─── URL Utilities ────────────────────────────────────────────────────────────

/**
 * Build URL with query parameters
 */
export const buildUrl = (base: string, params: Record<string, unknown>): string => {
  const url = new URL(base, 'http://placeholder');
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((v) => url.searchParams.append(key, String(v)));
      } else {
        url.searchParams.set(key, String(value));
      }
    }
  });
  return url.pathname + url.search;
};

/**
 * Parse query string into object
 */
export const parseQueryString = (search: string): Record<string, string | string[]> => {
  const params = new URLSearchParams(search);
  const result: Record<string, string | string[]> = {};
  params.forEach((value, key) => {
    if (key in result) {
      const existing = result[key];
      result[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
    } else {
      result[key] = value;
    }
  });
  return result;
};

// ─── Misc ─────────────────────────────────────────────────────────────────────

/**
 * Sleep for a given number of milliseconds (useful in dev/tests)
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const isBrowser = typeof globalThis !== 'undefined' && 'window' in (globalThis as object);

/**
 * Safe JSON parse with fallback
 */
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
};

/**
 * Debounce a function
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};
