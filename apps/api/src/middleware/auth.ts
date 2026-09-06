import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '../config/env';
import { prisma } from '../config/database';
import { UnauthorizedError } from '../shared/errors/AppError';

export interface JwtPayload {
  sub: string; // user ID
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

/**
 * Verify JWT access token and attach user to request.
 * Required for all protected routes.
 */
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = extractToken(req);
    if (!token) {
      throw new UnauthorizedError('Authentication required', 'AUTH_004');
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    // Optionally validate user still exists and is active
    // (skip in high-throughput routes, enable for sensitive ones)
    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Account not found or deactivated', 'AUTH_003');
    }

    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional authentication — attaches user if token is present but doesn't fail if not.
 * Use for routes that work for both guests and authenticated users.
 */
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = extractToken(req);
    if (token) {
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      req.user = { id: decoded.sub, email: decoded.email, role: decoded.role };
    }
    next();
  } catch {
    // Silently ignore invalid tokens for optional auth
    next();
  }
};

/**
 * Extract bearer token from Authorization header or cookie.
 */
const extractToken = (req: Request): string | null => {
  // 1. Authorization header: "Bearer <token>"
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  // 2. Cookie: "access_token=<token>"
  if (req.cookies?.access_token) {
    return req.cookies.access_token as string;
  }
  return null;
};
