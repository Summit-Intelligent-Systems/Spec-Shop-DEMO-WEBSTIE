import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Express, type Request, type Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from './config/env';
import { logger } from './config/logger';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { AppError } from './shared/errors/AppError';
import { HTTP_STATUS } from '@nayan-sukh-eyewear/config';

// Domain route imports
import { authRouter } from './modules/auth/auth.router';
import { productsRouter } from './modules/products/products.router';
import { categoriesRouter } from './modules/categories/categories.router';
import { brandsRouter } from './modules/brands/brands.router';
import { cartRouter } from './modules/cart/cart.router';
import { wishlistRouter } from './modules/wishlist/wishlist.router';
import { ordersRouter } from './modules/orders/orders.router';
import { reviewsRouter } from './modules/reviews/reviews.router';
import { couponsRouter } from './modules/coupons/coupons.router';
import { usersRouter } from './modules/users/users.router';
import { storesRouter } from './modules/stores/stores.router';
import { prescriptionsRouter } from './modules/prescriptions/prescriptions.router';
import { appointmentsRouter } from './modules/appointments/appointments.router';
import { cmsRouter } from './modules/cms/cms.router';
import { mediaRouter } from './modules/media/media.router';
import { analyticsRouter } from './modules/analytics/analytics.router';
import { inventoryRouter } from './modules/inventory/inventory.router';
import { membershipRouter } from './modules/membership/membership.router';
import { paymentsRouter } from './modules/payments/payments.router';
import { adminRouter } from './modules/admin/admin.router';

export const app: Express = express();

// ─── Trust Proxy (for Nginx/load balancer in prod) ───────────────────────────
if (env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// ─── Security Headers ─────────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"], // Tighten in prod
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  }),
);

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ─── Response Compression ────────────────────────────────────────────────────
app.use(compression());

// ─── Request Logging ─────────────────────────────────────────────────────────
if (env.NODE_ENV !== 'test') {
  app.use(
    morgan('combined', {
      stream: {
        write: (message: string) => logger.http(message.trim()),
      },
      skip: (_req: Request, res: Response) => {
        // Skip health check logs in production
        return env.NODE_ENV === 'production' && res.statusCode < 400;
      },
    }),
  );
}

// ─── Global Rate Limiter ──────────────────────────────────────────────────────
app.use(rateLimiter.global);

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
  res.status(HTTP_STATUS.OK).json({
    status: 'healthy',
    service: 'nayan-sukh-eyewear-api',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
const API_PREFIX = '/api/v1';

// Phase 3: Domain Routers
app.use(`${API_PREFIX}/auth`, rateLimiter.auth, authRouter);
app.use(`${API_PREFIX}/products`, productsRouter);
app.use(`${API_PREFIX}/categories`, categoriesRouter);
app.use(`${API_PREFIX}/brands`, brandsRouter);
app.use(`${API_PREFIX}/cart`, cartRouter);
app.use(`${API_PREFIX}/wishlist`, wishlistRouter);
app.use(`${API_PREFIX}/orders`, ordersRouter);
app.use(`${API_PREFIX}/reviews`, reviewsRouter);
app.use(`${API_PREFIX}/coupons`, couponsRouter);
app.use(`${API_PREFIX}/users`, usersRouter);
app.use(`${API_PREFIX}/stores`, storesRouter);
app.use(`${API_PREFIX}/prescriptions`, prescriptionsRouter);
app.use(`${API_PREFIX}/appointments`, appointmentsRouter);
app.use(`${API_PREFIX}/membership`, membershipRouter);
app.use(`${API_PREFIX}/cms`, cmsRouter);
app.use(`${API_PREFIX}/media`, mediaRouter);
app.use(`${API_PREFIX}/analytics`, analyticsRouter);
app.use(`${API_PREFIX}/inventory`, inventoryRouter);
app.use(`${API_PREFIX}/payments`, paymentsRouter);

// Phase: Admin CMS Panel
app.use(`${API_PREFIX}/admin`, adminRouter);

// ─── API Welcome ─────────────────────────────────────────────────────────────
app.get('/', (_req: Request, res: Response) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Nayan Sukh Eyewear API',
    docs: `${env.API_URL}/api-docs`,
    version: '1.0.0',
  });
});

app.get(API_PREFIX, (_req: Request, res: Response) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Nayan Sukh Eyewear API v1',
    docs: `${env.API_URL}/api-docs`,
    version: '1.0.0',
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req: Request, _res: Response, next) => {
  next(new AppError(`Route ${_req.method} ${_req.originalUrl} not found`, HTTP_STATUS.NOT_FOUND, 'RES_001'));
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

export default app;
