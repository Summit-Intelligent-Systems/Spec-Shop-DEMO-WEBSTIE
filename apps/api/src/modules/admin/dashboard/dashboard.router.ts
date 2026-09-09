import { Router, type Request, type Response, type NextFunction } from 'express';
import { sendSuccess } from '../../../shared/utils';
import {
  getDashboardStats,
  getRecentOrders,
  getRevenueChart,
  getTopProducts,
} from './dashboard.service';
import { getRecentActivity } from '../audit/audit.service';

export const dashboardRouter = Router();

/**
 * GET /admin/dashboard/stats
 * Live KPI metrics
 */
dashboardRouter.get('/stats', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const stats = await getDashboardStats();
    sendSuccess(res, stats);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /admin/dashboard/recent-orders
 * Last N orders for the dashboard feed
 */
dashboardRouter.get('/recent-orders', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const orders = await getRecentOrders(limit);
    sendSuccess(res, orders);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /admin/dashboard/revenue-chart
 * Daily revenue data for current month
 */
dashboardRouter.get('/revenue-chart', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const chartData = await getRevenueChart();
    sendSuccess(res, chartData);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /admin/dashboard/top-products
 * Top selling products
 */
dashboardRouter.get('/top-products', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const limit = Math.min(Number(req.query.limit) || 5, 20);
    const products = await getTopProducts(limit);
    sendSuccess(res, products);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /admin/dashboard/activity
 * Recent audit log entries
 */
dashboardRouter.get('/activity', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const activity = await getRecentActivity(limit);
    sendSuccess(res, activity);
  } catch (error) {
    next(error);
  }
});
