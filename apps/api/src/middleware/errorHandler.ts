import type { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

import { logger } from '../config/logger';
import { AppError, ValidationError } from '../shared/errors/AppError';
import { env } from '../config/env';

interface ErrorResponse {
  success: false;
  message: string;
  code?: string;
  statusCode: number;
  errors?: Array<{ field: string; message: string }>;
  stack?: string;
}

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let statusCode = 500;
  let message = 'An unexpected error occurred';
  let code = 'SRV_001';
  let errors: Array<{ field: string; message: string }> | undefined;

  // ─── AppError (our custom errors) ─────────────────────────────────────────
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    code = error.code;

    if (error instanceof ValidationError) {
      errors = error.errors;
    }

    if (!error.isOperational) {
      logger.error('Non-operational error:', error);
    } else {
      logger.warn(`AppError [${error.statusCode}]: ${error.message}`);
    }
  }

  // ─── Zod Validation Error ──────────────────────────────────────────────────
  else if (error instanceof ZodError) {
    statusCode = 422;
    message = 'Validation failed';
    code = 'VAL_001';
    errors = error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    logger.debug('Zod validation error:', errors);
  }

  // ─── Prisma Errors ─────────────────────────────────────────────────────────
  else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaError = error;
    switch (prismaError.code) {
      case 'P2002': {
        // Unique constraint violation
        const field = (prismaError.meta?.target as string[])?.join(', ') || 'field';
        statusCode = 409;
        message = `A record with this ${field} already exists`;
        code = 'RES_002';
        break;
      }
      case 'P2025':
        // Record not found
        statusCode = 404;
        message = 'Record not found';
        code = 'RES_001';
        break;
      case 'P2003':
        // Foreign key constraint failed
        statusCode = 400;
        message = 'Related record not found';
        code = 'VAL_001';
        break;
      default:
        logger.error('Prisma error:', error);
        statusCode = 500;
        message = 'Database operation failed';
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  else if ((error as any)?.constructor?.name === 'PrismaClientValidationError') {
    statusCode = 400;
    message = 'Invalid database input';
    code = 'VAL_001';
    logger.error('Prisma validation error:', error);
  }

  // ─── JWT Errors ────────────────────────────────────────────────────────────
  else if (error instanceof Error) {
    if (error.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid token';
      code = 'AUTH_005';
    } else if (error.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Token has expired';
      code = 'AUTH_004';
    } else if (error.name === 'MulterError') {
      statusCode = 400;
      message = error.message;
      code = 'VAL_001';
    } else {
      logger.error('Unhandled Error:', error);
    }
  } else {
    logger.error('Unknown error type:', error);
  }

  const response: ErrorResponse = {
    success: false,
    message,
    code,
    statusCode,
    ...(errors && { errors }),
    // Include stack trace in development only
    ...(env.NODE_ENV === 'development' && error instanceof Error && { stack: error.stack }),
  };

  res.status(statusCode).json(response);
};
