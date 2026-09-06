import 'dotenv/config';
import { app } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { prisma } from './config/database';
import { redis } from './config/redis';

const PORT = env.API_PORT;

async function bootstrap() {
  try {
    // Test DB connection
    try {
      await prisma.$connect();
      logger.info('✅ PostgreSQL connected');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.warn(`⚠️ PostgreSQL offline (${msg.substring(0, 80)}...). API running in fallback mode.`);
    }

    // Test Redis connection
    try {
      await redis.connect();
      logger.info('✅ Redis connected');
    } catch {
      logger.warn('⚠️ Redis offline. Rate limiting using in-memory store.');
      redis.disconnect(false);
    }

    const server = app.listen(PORT, () => {
      logger.info(`🚀 XYZ Eyewear API running on http://localhost:${PORT}`);
      logger.info(`📖 API Docs: http://localhost:${PORT}/api-docs`);
      logger.info(`🌍 Environment: ${env.NODE_ENV}`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        await prisma.$disconnect();
        try {
          await redis.quit();
        } catch {
          // ignore if already disconnected
        }
        logger.info('Server closed. Database and Redis disconnected.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => void shutdown('SIGTERM'));
    process.on('SIGINT', () => void shutdown('SIGINT'));

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      if (env.NODE_ENV === 'production') {
        void shutdown('UNHANDLED_REJECTION');
      }
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      void shutdown('UNCAUGHT_EXCEPTION');
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

void bootstrap();
