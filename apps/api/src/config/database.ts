import { PrismaClient } from '@prisma/client';
import { env } from './env';
import { logger } from './logger';

// Singleton Prisma client to prevent connection pool exhaustion in dev
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === 'development'
        ? [
            { level: 'query', emit: 'event' },
            { level: 'error', emit: 'stdout' },
            { level: 'warn', emit: 'stdout' },
          ]
        : [{ level: 'error', emit: 'stdout' }],
    errorFormat: env.NODE_ENV === 'production' ? 'minimal' : 'pretty',
  });

// Log slow queries in development
if (env.NODE_ENV === 'development') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (prisma as any).$on('query', (e: { query: string; duration: number }) => {
    if (e.duration > 500) {
      logger.warn(`🐌 Slow query (${e.duration}ms): ${e.query}`);
    } else {
      logger.debug(`🔍 Query (${e.duration}ms): ${e.query.substring(0, 100)}`);
    }
  });
}

// Reuse across invocations and hot reloads (prevents connection pool exhaustion in serverless & dev)
globalForPrisma.prisma = prisma;

export default prisma;
