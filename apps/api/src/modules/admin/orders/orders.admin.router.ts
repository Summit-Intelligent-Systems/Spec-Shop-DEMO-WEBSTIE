import { Router, type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../../../config/database';
import { sendSuccess, sendPaginated, calculatePagination } from '../../../shared/utils';
import { auditFromReq } from '../audit/audit.service';
import { ORDERS_STORE } from '../../orders/orders.router';

export const ordersAdminRouter = Router();

// GET /admin/orders — Paginated with filters
ordersAdminRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  const { skip, take, page, limit } = calculatePagination(Number(req.query.page), Number(req.query.limit));
  const where: Record<string, unknown> = {};
  if (req.query.status) where.status = req.query.status;
  if (req.query.paymentStatus) where.paymentStatus = req.query.paymentStatus;
  if (req.query.search) {
    where.OR = [
      { orderNumber: { contains: req.query.search as string, mode: 'insensitive' } },
      { user: { email: { contains: req.query.search as string, mode: 'insensitive' } } },
    ];
  }

  try {
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: where as any, skip, take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { email: true, profile: { select: { firstName: true, lastName: true } } } },
          items: { take: 2, select: { productName: true, quantity: true, unitPrice: true } },
        },
      }),
      prisma.order.count({ where: where as any }),
    ]);

    if (orders && orders.length > 0) {
      sendPaginated(res, orders, page, limit, total);
      return;
    }
  } catch {
    // Database offline or query issue — fall back to in-memory store
  }

  // Graceful fallback to ORDERS_STORE
  let filtered = [...ORDERS_STORE];
  if (req.query.status && req.query.status !== 'ALL') {
    filtered = filtered.filter((o) => o.status === req.query.status);
  }
  if (req.query.paymentStatus && req.query.paymentStatus !== 'ALL') {
    filtered = filtered.filter((o) => o.paymentStatus === req.query.paymentStatus);
  }
  if (req.query.search) {
    const q = (req.query.search as string).toLowerCase();
    filtered = filtered.filter(
      (o) =>
        o.orderNumber?.toLowerCase().includes(q) ||
        o.customerEmail?.toLowerCase().includes(q) ||
        o.customerName?.toLowerCase().includes(q),
    );
  }

  sendPaginated(res, filtered.slice(skip, skip + take), page, limit, filtered.length);
});

// GET /admin/orders/:id — Full order detail
ordersAdminRouter.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { email: true, profile: true } },
        shippingAddress: true,
        billingAddress: true,
        items: { include: { product: { select: { name: true, slug: true, media: { take: 1 } } } } },
        returns: true,
        notifications: { take: 10, orderBy: { createdAt: 'desc' } },
      },
    });
    if (order) {
      sendSuccess(res, order);
      return;
    }
  } catch {
    // Fallback to memory store
  }

  const fallbackOrder = ORDERS_STORE.find((o) => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!fallbackOrder) {
    res.status(404).json({ success: false, message: 'Order not found' });
    return;
  }
  sendSuccess(res, fallbackOrder);
});

// PATCH /admin/orders/:id/status
ordersAdminRouter.patch('/:id/status', async (req: Request, res: Response): Promise<void> => {
  const { status, adminNotes } = req.body;
  const data: Record<string, unknown> = { status };
  if (adminNotes) data.adminNotes = adminNotes;
  if (status === 'SHIPPED') data.shippedAt = new Date();
  if (status === 'DELIVERED') data.deliveredAt = new Date();
  if (status === 'CANCELLED') { data.cancelledAt = new Date(); data.cancelReason = req.body.reason; }

  // Update in-memory store
  const memOrder = ORDERS_STORE.find((o) => o.id === req.params.id || o.orderNumber === req.params.id);
  if (memOrder) {
    memOrder.status = status;
    memOrder.updatedAt = new Date().toISOString();
  }

  try {
    const order = await prisma.order.update({ where: { id: req.params.id }, data: data as any });
    auditFromReq(req, 'STATUS_CHANGE', 'Order', order.id, order.orderNumber, { status });
    sendSuccess(res, order);
    return;
  } catch {
    if (memOrder) {
      sendSuccess(res, memOrder);
      return;
    }
  }

  res.status(404).json({ success: false, message: 'Order not found' });
});

// PATCH /admin/orders/:id/tracking
ordersAdminRouter.patch('/:id/tracking', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { trackingNumber, trackingUrl, shippingProvider, estimatedDelivery } = req.body;
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { trackingNumber, trackingUrl, shippingProvider, estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : undefined },
    });
    auditFromReq(req, 'UPDATE', 'Order', order.id, order.orderNumber, { trackingNumber });
    sendSuccess(res, order);
  } catch (error) { next(error); }
});
