import { Router, type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../../../config/database';
import { sendSuccess, sendPaginated, calculatePagination } from '../../../shared/utils';
import { auditFromReq } from '../audit/audit.service';

export const couponsAdminRouter = Router();

// GET /admin/coupons
couponsAdminRouter.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { skip, take, page, limit } = calculatePagination(Number(req.query.page), Number(req.query.limit));
    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({ skip, take, orderBy: { createdAt: 'desc' }, include: { _count: { select: { usageLogs: true } } } }),
      prisma.coupon.count(),
    ]);
    sendPaginated(res, coupons, page, limit, total);
  } catch (error) { next(error); }
});

// POST /admin/coupons
couponsAdminRouter.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const coupon = await prisma.coupon.create({ data: req.body });
    auditFromReq(req, 'CREATE', 'Coupon', coupon.id, coupon.code);
    sendSuccess(res, coupon, 201);
  } catch (error) { next(error); }
});

// PUT /admin/coupons/:id
couponsAdminRouter.put('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const coupon = await prisma.coupon.update({ where: { id: req.params.id }, data: req.body });
    auditFromReq(req, 'UPDATE', 'Coupon', coupon.id, coupon.code);
    sendSuccess(res, coupon);
  } catch (error) { next(error); }
});

// DELETE /admin/coupons/:id
couponsAdminRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const coupon = await prisma.coupon.delete({ where: { id: req.params.id } });
    auditFromReq(req, 'DELETE', 'Coupon', req.params.id, coupon.code);
    sendSuccess(res, { deleted: true });
  } catch (error) { next(error); }
});
