import { Router, type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../../../config/database';
import { sendSuccess, sendPaginated, calculatePagination } from '../../../shared/utils';
import { auditFromReq } from '../audit/audit.service';
import slugify from 'slugify';

export const promotionsAdminRouter = Router();

// GET /api/v1/admin/promotions
promotionsAdminRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { skip, take, page, limit } = calculatePagination(
      Number(req.query.page) || 1,
      Number(req.query.limit) || 20
    );

    const [promotions, total] = await Promise.all([
      prisma.promotion.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.promotion.count(),
    ]);

    sendPaginated(res, promotions, page, limit, total);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/promotions
promotionsAdminRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      description,
      type,
      status,
      discountType,
      discountValue,
      bannerImageUrl,
      startsAt,
      endsAt,
      isActive,
      applicableProducts,
      applicableCategories,
      applicableBrands,
      minOrderAmount,
      maxDiscountAmount,
    } = req.body;

    const baseSlug = slugify(name, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.promotion.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const promotion = await prisma.promotion.create({
      data: {
        name,
        slug,
        description,
        type: type || 'FLASH_SALE',
        status: status || 'DRAFT',
        discountType: discountType || 'PERCENTAGE',
        discountValue,
        bannerImageUrl,
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
        isActive: isActive !== undefined ? isActive : true,
        applicableProducts: applicableProducts || [],
        applicableCategories: applicableCategories || [],
        applicableBrands: applicableBrands || [],
        minOrderAmount,
        maxDiscountAmount,
      },
    });

    await auditFromReq(req, 'CREATE', 'Promotion', promotion.id, promotion.name, promotion);

    sendSuccess(res, promotion, 201, { message: 'Promotion created successfully' });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/admin/promotions/:id
promotionsAdminRouter.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      description,
      type,
      status,
      discountType,
      discountValue,
      bannerImageUrl,
      startsAt,
      endsAt,
      isActive,
      applicableProducts,
      applicableCategories,
      applicableBrands,
      minOrderAmount,
      maxDiscountAmount,
    } = req.body;

    const promotion = await prisma.promotion.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        type,
        status,
        discountType,
        discountValue,
        bannerImageUrl,
        ...(startsAt ? { startsAt: new Date(startsAt) } : {}),
        ...(endsAt ? { endsAt: new Date(endsAt) } : {}),
        isActive,
        applicableProducts,
        applicableCategories,
        applicableBrands,
        minOrderAmount,
        maxDiscountAmount,
      },
    });

    await auditFromReq(req, 'UPDATE', 'Promotion', promotion.id, promotion.name, promotion);

    sendSuccess(res, promotion, 200, { message: 'Promotion updated successfully' });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/admin/promotions/:id
promotionsAdminRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.promotion.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Promotion not found' });
      return;
    }

    await prisma.promotion.delete({ where: { id: req.params.id } });
    await auditFromReq(req, 'DELETE', 'Promotion', req.params.id, existing.name);

    sendSuccess(res, { id: req.params.id }, 200, { message: 'Promotion deleted' });
  } catch (err) {
    next(err);
  }
});
