import { Router, type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../../../config/database';
import { sendSuccess, sendPaginated, calculatePagination } from '../../../shared/utils';
import { auditFromReq } from '../audit/audit.service';
import slugify from 'slugify';

export const brandsAdminRouter = Router();

// GET /admin/brands
brandsAdminRouter.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { skip, take, page, limit } = calculatePagination(Number(req.query.page), Number(req.query.limit));
    const [brands, total] = await Promise.all([
      prisma.brand.findMany({
        skip, take, orderBy: { sortOrder: 'asc' },
        include: { _count: { select: { products: true } } },
      }),
      prisma.brand.count(),
    ]);
    sendPaginated(res, brands, page, limit, total);
  } catch (error) { next(error); }
});

// POST /admin/brands
brandsAdminRouter.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, logoUrl, bannerUrl, country, website, isPremium, isActive, sortOrder, metaTitle, metaDesc } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    const brand = await prisma.brand.create({
      data: { name, slug, description, logoUrl, bannerUrl, country, website, isPremium: isPremium ?? false, isActive: isActive ?? true, sortOrder: sortOrder || 0, metaTitle, metaDesc },
    });
    auditFromReq(req, 'CREATE', 'Brand', brand.id, brand.name);
    sendSuccess(res, brand, 201);
  } catch (error) { next(error); }
});

// PUT /admin/brands/:id
brandsAdminRouter.put('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = { ...req.body };
    if (data.name) data.slug = slugify(data.name, { lower: true, strict: true });
    const brand = await prisma.brand.update({ where: { id: req.params.id }, data });
    auditFromReq(req, 'UPDATE', 'Brand', brand.id, brand.name);
    sendSuccess(res, brand);
  } catch (error) { next(error); }
});

// DELETE /admin/brands/:id
brandsAdminRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const brand = await prisma.brand.delete({ where: { id: req.params.id } });
    auditFromReq(req, 'DELETE', 'Brand', req.params.id, brand.name);
    sendSuccess(res, { deleted: true });
  } catch (error) { next(error); }
});
