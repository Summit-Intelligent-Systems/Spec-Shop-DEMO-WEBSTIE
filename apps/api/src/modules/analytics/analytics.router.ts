import { Router, type Request, type Response } from 'express';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { sendSuccess } from '../../shared/utils';

export const analyticsRouter = Router();

analyticsRouter.get(
  '/dashboard',
  authenticate,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  (_req: Request, res: Response): void => {
    const kpis = {
      grossRevenue: 1845200,
      totalOrders: 342,
      averageOrderValue: 5395,
      conversionRate: 3.42,
      pendingPrescriptions: 7,
      activeAppointments: 14,
      returnRate: 0.8,
      salesTimeline: [
        { month: 'Apr', revenue: 240000, orders: 48 },
        { month: 'May', revenue: 310000, orders: 62 },
        { month: 'Jun', revenue: 395000, orders: 74 },
        { month: 'Jul', revenue: 420000, orders: 81 },
        { month: 'Aug', revenue: 480200, orders: 89 },
      ],
      topSellingFrames: [
        { name: 'The Sovereign Round', unitsSold: 142, revenue: 496858 },
        { name: 'The Aviator Prime', unitsSold: 89, revenue: 444911 },
        { name: 'The Kensington Square', unitsSold: 114, revenue: 341886 },
        { name: 'The Marais Cat-Eye', unitsSold: 76, revenue: 303924 },
      ],
    };
    sendSuccess(res, kpis);
  },
);
