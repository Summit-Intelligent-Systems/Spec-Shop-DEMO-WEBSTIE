import type { NextFunction, Request, Response } from 'express';

import { ForbiddenError, UnauthorizedError } from '../shared/errors/AppError';

// User roles as string constants (enums come from Prisma after generate)
const ROLE = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  CUSTOMER: 'CUSTOMER',
} as const;
type UserRole = (typeof ROLE)[keyof typeof ROLE];

/**
 * Role-Based Access Control middleware.
 * Must be used AFTER the `authenticate` middleware.
 *
 * @example
 * // Only Super Admin and Admin can access
 * router.delete('/products/:id', authenticate, rbac([UserRole.SUPER_ADMIN, UserRole.ADMIN]), deleteProduct);
 *
 * // Any authenticated user
 * router.get('/me', authenticate, rbac(), getProfile);
 */
export const rbac = (allowedRoles?: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError('Authentication required'));
      return;
    }

    // If no roles specified, any authenticated user is allowed
    if (!allowedRoles || allowedRoles.length === 0) {
      next();
      return;
    }

    const userRole = req.user.role as UserRole;

    // Super Admin always has access
    if (userRole === ROLE.SUPER_ADMIN) {
      next();
      return;
    }

    if (!allowedRoles.includes(userRole)) {
      next(
        new ForbiddenError(
          `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${userRole}`,
        ),
      );
      return;
    }

    next();
  };
};

// ─── Convenience Role Guards ──────────────────────────────────────────────────

/** Only Super Admin */
export const superAdminOnly = rbac([ROLE.SUPER_ADMIN]);

/** Super Admin or Admin */
export const adminOnly = rbac([ROLE.SUPER_ADMIN, ROLE.ADMIN]);

/** Super Admin, Admin, or Staff */
export const staffOrAbove = rbac([ROLE.SUPER_ADMIN, ROLE.ADMIN, ROLE.STAFF]);

/** Customer or above (any authenticated user) */
export const customerOrAbove = rbac();

/** Dynamic role check by role names */
export const requireRole = (...roles: any[]) => rbac(roles.length ? roles : undefined);

/**
 * Resource ownership guard.
 * Ensures the authenticated user owns the resource,
 * unless they are an Admin or above.
 *
 * @param getResourceUserId - Function to extract the owner's user ID from the request
 */
export const ownerOrAdmin = (
  getResourceUserId: (req: Request) => string | Promise<string | null>,
) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        next(new UnauthorizedError());
        return;
      }

      const userRole = req.user.role;

      // Admins and above bypass ownership check
      if (userRole === ROLE.SUPER_ADMIN || userRole === ROLE.ADMIN) {
        next();
        return;
      }

      const resourceOwnerId = await getResourceUserId(req);

      if (!resourceOwnerId || resourceOwnerId !== req.user.id) {
        next(new ForbiddenError('You do not have permission to access this resource'));
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
