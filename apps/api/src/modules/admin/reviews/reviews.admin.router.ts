import { Router, type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../../../config/database';
import { sendSuccess, sendPaginated, calculatePagination } from '../../../shared/utils';
import { auditFromReq } from '../audit/audit.service';

export const reviewsAdminRouter = Router();

// GET /admin/reviews
reviewsAdminRouter.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { skip, take, page, limit } = calculatePagination(Number(req.query.page), Number(req.query.limit));
    const where: Record<string, unknown> = {};
    if (req.query.status) where.status = req.query.status;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: where as any, skip, take, orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { email: true, profile: { select: { firstName: true, lastName: true } } } },
          product: { select: { id: true, name: true, slug: true, media: { take: 1, select: { url: true } } } },
        },
      }),
      prisma.review.count({ where: where as any }),
    ]);
    sendPaginated(res, reviews, page, limit, total);
  } catch (error) { next(error); }
});

// PATCH /admin/reviews/:id — Approve/reject
reviewsAdminRouter.patch('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, adminNotes } = req.body;
    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: { status, adminNotes, moderatedAt: new Date() },
    });
    auditFromReq(req, 'STATUS_CHANGE', 'Review', review.id, review.title, { status });
    sendSuccess(res, review);
  } catch (error) { next(error); }
});

// DELETE /admin/reviews/:id
reviewsAdminRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.review.delete({ where: { id: req.params.id } });
    auditFromReq(req, 'DELETE', 'Review', req.params.id);
    sendSuccess(res, { deleted: true });
  } catch (error) { next(error); }
});
