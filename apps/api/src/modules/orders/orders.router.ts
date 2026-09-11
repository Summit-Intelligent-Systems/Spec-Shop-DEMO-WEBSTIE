import { Router, type Request, type Response, type NextFunction } from 'express';
import { optionalAuth, authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { sendSuccess, sendPaginated, calculatePagination } from '../../shared/utils';
import { NotFoundError } from '../../shared/errors/AppError';

export const ordersRouter = Router();

export const ORDERS_STORE: any[] = [
  {
    id: 'NS-892104',
    orderNumber: 'NS-892104',
    userId: 'user-001',
    customerName: 'Devan Sharma',
    customerEmail: 'devan.sharma@example.com',
    customerPhone: '+91 98765 43210',
    shippingAddress: {
      line1: '42, Indiranagar 100ft Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
    },
    items: [
      {
        id: 'ord_item_1',
        name: 'The Sovereign Round',
        color: 'Dark Amber Tortoise',
        quantity: 1,
        price: 3499,
        lensConfig: {
          lensType: 'Single Vision (Distance)',
          lensPackage: 'High-Index Thin 1.60',
          coatings: ['sapphire-ar', 'blue-shield'],
          price: 1798,
        },
      },
    ],
    subtotal: 5297,
    shippingCharge: 0,
    discount: 0,
    total: 5297,
    status: 'MILLING', // CONFIRMED -> MILLING -> QC_PASSED -> SHIPPED -> DELIVERED
    paymentStatus: 'PAID',
    paymentMethod: 'UPI',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'NS-741982',
    orderNumber: 'NS-741982',
    userId: 'user-001',
    customerName: 'Devan Sharma',
    customerEmail: 'devan.sharma@example.com',
    customerPhone: '+91 98765 43210',
    shippingAddress: {
      line1: '42, Indiranagar 100ft Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
    },
    items: [
      {
        id: 'ord_item_2',
        name: 'The Aviator Prime',
        color: 'Champagne Gold',
        quantity: 1,
        price: 4999,
        lensConfig: {
          lensType: 'Polarized Sun Prescription',
          lensPackage: 'Standard Clarity 1.50',
          coatings: ['sapphire-ar'],
          price: 1999,
        },
      },
    ],
    subtotal: 6998,
    shippingCharge: 0,
    discount: 500,
    total: 6498,
    status: 'DELIVERED',
    paymentStatus: 'PAID',
    paymentMethod: 'CARD',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
];

ordersRouter.post('/', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  const { customer, shippingAddress, items, subtotal, shippingCharge, discount, total, paymentMethod, paymentStatus, deliveryMethod } = req.body;
  const orderNumber = `NS-${Math.floor(100000 + Math.random() * 900000)}`;

  const determinedPaymentStatus = paymentStatus || (paymentMethod === 'COD' ? 'PENDING' : 'PAID');

  const newOrder = {
    id: orderNumber,
    orderNumber,
    userId: req.user?.id || 'guest',
    customerName: customer?.name || `${customer?.firstName || 'Valued'} ${customer?.lastName || 'Client'}`.trim(),
    customerEmail: customer?.email || 'client@example.com',
    customerPhone: customer?.phone || '+91 98765 00000',
    shippingAddress: shippingAddress || {},
    items: items || [],
    subtotal: Number(subtotal) || 0,
    shippingCharge: Number(shippingCharge) || 0,
    discount: Number(discount) || 0,
    total: Number(total) || 0,
    status: 'CONFIRMED',
    paymentStatus: determinedPaymentStatus,
    paymentMethod: paymentMethod || 'UPI',
    deliveryMethod: deliveryMethod || 'STANDARD',
    createdAt: new Date().toISOString(),
  };

  // Try saving to database asynchronously if available
  try {
    const { prisma } = await import('../../config/database');
    if (prisma?.order) {
      await (prisma.order as any).create({
        data: {
          orderNumber,
          userId: req.user?.id || 'user-001',
          status: 'PENDING',
          paymentStatus: determinedPaymentStatus,
          paymentMethod: paymentMethod || 'UPI',
          shippingAddressId: shippingAddress?.id || 'addr-default',
          subtotal: newOrder.subtotal,
          shippingCharge: newOrder.shippingCharge,
          discount: newOrder.discount,
          total: newOrder.total,
        },
      }).catch(() => null);
    }
  } catch {
    // Database offline/unreachable; in-memory store handles persistence
  }

  ORDERS_STORE.unshift(newOrder);
  sendSuccess(res, newOrder, 201);
});

ordersRouter.get('/', optionalAuth, (req: Request, res: Response): void => {
  const { page, limit } = req.query;
  const pagination = calculatePagination(Number(page) || 1, Number(limit) || 20);
  const userId = req.user?.id;

  // Filter orders by user if customer, or all if admin
  const list = req.user?.role === 'SUPER_ADMIN' || req.user?.role === 'ADMIN'
    ? ORDERS_STORE
    : ORDERS_STORE.filter((o) => !userId || o.userId === userId || o.userId === 'user-001' || o.userId === 'guest');

  sendPaginated(res, list.slice(pagination.skip, pagination.skip + pagination.take), pagination.page, pagination.limit, list.length);
});

ordersRouter.get('/:id', optionalAuth, (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;
  const order = ORDERS_STORE.find((o) => o.id === id || o.orderNumber === id);
  if (!order) {
    return next(new NotFoundError(`Order ${id} not found`, 'ORD_001'));
  }
  sendSuccess(res, order);
});

ordersRouter.patch(
  '/:id/status',
  authenticate,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  (req: Request, res: Response, next: NextFunction): void => {
    const { id } = req.params;
    const { status } = req.body;
    const order = ORDERS_STORE.find((o) => o.id === id || o.orderNumber === id);
    if (!order) {
      return next(new NotFoundError(`Order ${id} not found`, 'ORD_001'));
    }
    order.status = status;
    order.updatedAt = new Date().toISOString();
    sendSuccess(res, order);
  },
);
