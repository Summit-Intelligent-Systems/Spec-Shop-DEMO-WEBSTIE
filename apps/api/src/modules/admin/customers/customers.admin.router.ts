import { Router, type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../../../config/database';
import { sendSuccess, sendPaginated, calculatePagination } from '../../../shared/utils';
import { auditFromReq } from '../audit/audit.service';

export const customersAdminRouter = Router();

// GET /admin/customers
customersAdminRouter.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { skip, take, page, limit } = calculatePagination(Number(req.query.page), Number(req.query.limit));
    const where: Record<string, unknown> = { role: 'CUSTOMER' };
    if (req.query.search) {
      where.OR = [
        { email: { contains: req.query.search as string, mode: 'insensitive' } },
        { profile: { firstName: { contains: req.query.search as string, mode: 'insensitive' } } },
        { profile: { lastName: { contains: req.query.search as string, mode: 'insensitive' } } },
      ];
    }
    if (req.query.isActive === 'true') where.isActive = true;
    if (req.query.isActive === 'false') where.isActive = false;

    const [customers, total] = await Promise.all([
      prisma.user.findMany({
        where: where as any, skip, take, orderBy: { createdAt: 'desc' },
        select: {
          id: true, email: true, role: true, isActive: true, isVerified: true, lastLoginAt: true, createdAt: true,
          profile: { select: { firstName: true, lastName: true, phone: true, avatarUrl: true } },
          _count: { select: { orders: true, reviews: true } },
        },
      }),
      prisma.user.count({ where: where as any }),
    ]);
    sendPaginated(res, customers, page, limit, total);
  } catch (error) { next(error); }
});

// GET /admin/customers/:id
customersAdminRouter.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const customer = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        profile: true, addresses: true, membership: { include: { plan: true } },
        orders: { take: 10, orderBy: { createdAt: 'desc' }, select: { id: true, orderNumber: true, status: true, total: true, createdAt: true } },
        reviews: { take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, rating: true, title: true, status: true, createdAt: true } },
        _count: { select: { orders: true, reviews: true, wishlist: true } },
      },
    });
    if (!customer) { res.status(404).json({ success: false, message: 'Customer not found' }); return; }
    sendSuccess(res, customer);
  } catch (error) { next(error); }
});

// PATCH /admin/customers/:id
customersAdminRouter.patch('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { isActive, role } = req.body;
    const data: Record<string, unknown> = {};
    if (isActive !== undefined) data.isActive = isActive;
    if (role !== undefined) data.role = role;
    const user = await prisma.user.update({ where: { id: req.params.id }, data: data as any });
    auditFromReq(req, 'UPDATE', 'Customer', user.id, user.email, data);
    sendSuccess(res, user);
  } catch (error) { next(error); }
});
