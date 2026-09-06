import type { Response } from 'express';
import crypto from 'crypto';

export interface ApiResponse<T = unknown> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T = unknown> {
  success: true;
  data: T[];
  pagination: PaginatedMeta;
}

/**
 * Send standard JSON success response
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode = 200,
  meta?: Record<string, unknown>,
): Response => {
  const responseBody: ApiResponse<T> = {
    success: true,
    data,
    ...(meta && { meta }),
  };
  return res.status(statusCode).json(responseBody);
};

/**
 * Send standard paginated success response
 */
export const sendPaginated = <T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  statusCode = 200,
): Response => {
  const totalPages = Math.ceil(total / limit);
  const responseBody: PaginatedResponse<T> = {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
  return res.status(statusCode).json(responseBody);
};

/**
 * Calculate skip and take for Prisma pagination
 */
export const calculatePagination = (
  page = 1,
  limit = 20,
  maxLimit = 100,
): { skip: number; take: number; page: number; limit: number } => {
  const safePage = Math.max(1, Number(page) || 1);
  const parsedLimit = Number(limit);
  const safeLimit = Math.min(
    maxLimit,
    Math.max(1, Number.isNaN(parsedLimit) || limit === undefined ? 20 : parsedLimit),
  );
  const skip = (safePage - 1) * safeLimit;
  return { skip, take: safeLimit, page: safePage, limit: safeLimit };
};

/**
 * Generate secure crypto random token (hex string)
 */
export const generateSecureToken = (bytes = 32): string => {
  return crypto.randomBytes(bytes).toString('hex');
};

/**
 * Hash a token with SHA-256 (useful for storing reset tokens securely)
 */
export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
