import type { Request } from 'express';
import { prisma } from '../../../config/database';
import { logger } from '../../../config/logger';

export interface AuditLogInput {
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId?: string;
  entityName?: string;
  details?: Record<string, unknown>;
  req?: Request;
}

/**
 * Create an audit log entry.
 * Fire-and-forget — errors are logged but don't block the request.
 */
export const createAuditLog = async (input: AuditLogInput): Promise<void> => {
  try {
    await prisma.auditLog.create({
      data: {
        userId: input.userId,
        userName: input.userName,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId,
        entityName: input.entityName,
        details: (input.details as any) ?? undefined,
        ipAddress: input.req?.ip ?? input.req?.headers['x-forwarded-for']?.toString(),
        userAgent: input.req?.headers['user-agent'],
      },
    });
  } catch (error) {
    logger.error('Failed to create audit log:', error);
  }
};

/**
 * Helper to build audit log from request context.
 */
export const auditFromReq = (
  req: Request,
  action: string,
  entity: string,
  entityId?: string,
  entityName?: string,
  details?: Record<string, unknown>,
): void => {
  if (!req.user) return;

  createAuditLog({
    userId: req.user.id,
    userName: req.user.email,
    action,
    entity,
    entityId,
    entityName,
    details,
    req,
  });
};

/**
 * Fetch recent audit log entries.
 */
export const getRecentActivity = async (limit = 20) => {
  return prisma.auditLog.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      userName: true,
      action: true,
      entity: true,
      entityId: true,
      entityName: true,
      createdAt: true,
    },
  });
};
