import { describe, it, expect } from 'vitest';
import {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
} from './AppError';

describe('AppError hierarchy', () => {
  it('should instantiate base AppError with correct defaults', () => {
    const err = new AppError('Server fault');
    expect(err.message).toBe('Server fault');
    expect(err.statusCode).toBe(500);
    expect(err.code).toBe('SRV_001');
    expect(err.isOperational).toBe(true);
  });

  it('should instantiate BadRequestError with 400', () => {
    const err = new BadRequestError('Invalid input');
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('VAL_001');
  });

  it('should instantiate UnauthorizedError with 401', () => {
    const err = new UnauthorizedError();
    expect(err.statusCode).toBe(401);
  });

  it('should instantiate ForbiddenError with 403', () => {
    const err = new ForbiddenError();
    expect(err.statusCode).toBe(403);
  });

  it('should instantiate NotFoundError with 404', () => {
    const err = new NotFoundError('Product');
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('Product not found');
  });

  it('should instantiate ConflictError with 409', () => {
    const err = new ConflictError('Email already taken');
    expect(err.statusCode).toBe(409);
  });

  it('should instantiate ValidationError with field error list', () => {
    const err = new ValidationError(
      [{ field: 'email', message: 'Email is invalid' }],
      'Validation error',
    );
    expect(err.statusCode).toBe(422);
    expect(err.errors).toHaveLength(1);
    expect(err.errors[0].field).toBe('email');
  });
});
