/**
 * Base application error class.
 * All custom errors should extend this class.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode = 500,
    code = 'SRV_001',
    isOperational = true,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Bad Request — validation errors, malformed input
 */
export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', code = 'VAL_001') {
    super(message, 400, code);
  }
}

/**
 * 401 Unauthorized — missing or invalid authentication
 */
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', code = 'AUTH_004') {
    super(message, 401, code);
  }
}

/**
 * 403 Forbidden — authenticated but not permitted
 */
export class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden', code = 'AUTH_006') {
    super(message, 403, code);
  }
}

/**
 * 404 Not Found — resource doesn't exist
 */
export class NotFoundError extends AppError {
  constructor(resource = 'Resource', code = 'RES_001') {
    super(`${resource} not found`, 404, code);
  }
}

/**
 * 409 Conflict — duplicate resource
 */
export class ConflictError extends AppError {
  constructor(message = 'Resource already exists', code = 'RES_002') {
    super(message, 409, code);
  }
}

/**
 * 422 Unprocessable Entity — business logic validation failed
 */
export class ValidationError extends AppError {
  public readonly errors: Array<{ field: string; message: string }>;

  constructor(
    errors: Array<{ field: string; message: string }>,
    message = 'Validation failed',
  ) {
    super(message, 422, 'VAL_001');
    this.errors = errors;
  }
}

/**
 * 429 Too Many Requests
 */
export class RateLimitError extends AppError {
  constructor(message = 'Too many requests. Please try again later.') {
    super(message, 429, 'SRV_003');
  }
}

/**
 * 500 Internal Server Error — unexpected errors
 */
export class InternalError extends AppError {
  constructor(message = 'An unexpected error occurred') {
    super(message, 500, 'SRV_001', false);
  }
}

/**
 * Check if an error is an operational error (expected)
 */
export const isOperationalError = (error: unknown): boolean => {
  return error instanceof AppError && error.isOperational;
};
