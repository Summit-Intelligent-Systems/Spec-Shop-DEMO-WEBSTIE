import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { adminOnly } from '../../middleware/rbac';
import { dashboardRouter } from './dashboard/dashboard.router';
import { productsAdminRouter } from './products/products.admin.router';
import { categoriesAdminRouter } from './categories/categories.admin.router';
import { brandsAdminRouter } from './brands/brands.admin.router';
import { inventoryAdminRouter } from './inventory/inventory.admin.router';
import { ordersAdminRouter } from './orders/orders.admin.router';
import { customersAdminRouter } from './customers/customers.admin.router';
import { reviewsAdminRouter } from './reviews/reviews.admin.router';
import { couponsAdminRouter } from './coupons/coupons.admin.router';
import { promotionsAdminRouter } from './promotions/promotions.admin.router';
import { cmsAdminRouter } from './cms/cms.admin.router';
import { pagesAdminRouter } from './pages/pages.admin.router';
import { mediaAdminRouter } from './media/media.admin.router';
import { navigationAdminRouter } from './navigation/navigation.admin.router';
import { seoAdminRouter } from './seo/seo.admin.router';
import { settingsAdminRouter } from './settings/settings.admin.router';
import { analyticsAdminRouter } from './analytics/analytics.admin.router';

/**
 * Admin Router — Central hub for all admin/CMS API endpoints.
 * All routes require authentication + admin role.
 *
 * Mounted at: /api/v1/admin
 */
export const adminRouter = Router();

// ─── Auth Guard (applies to all admin routes) ─────────────────────────────────
adminRouter.use(authenticate, adminOnly);

// ─── Sub-Routers ──────────────────────────────────────────────────────────────
adminRouter.use('/dashboard', dashboardRouter);
adminRouter.use('/products', productsAdminRouter);
adminRouter.use('/categories', categoriesAdminRouter);
adminRouter.use('/brands', brandsAdminRouter);
adminRouter.use('/inventory', inventoryAdminRouter);
adminRouter.use('/orders', ordersAdminRouter);
adminRouter.use('/customers', customersAdminRouter);
adminRouter.use('/reviews', reviewsAdminRouter);
adminRouter.use('/coupons', couponsAdminRouter);
adminRouter.use('/promotions', promotionsAdminRouter);
adminRouter.use('/cms', cmsAdminRouter);
adminRouter.use('/pages', pagesAdminRouter);
adminRouter.use('/media', mediaAdminRouter);
adminRouter.use('/navigation', navigationAdminRouter);
adminRouter.use('/seo', seoAdminRouter);
adminRouter.use('/settings', settingsAdminRouter);
adminRouter.use('/analytics', analyticsAdminRouter);

