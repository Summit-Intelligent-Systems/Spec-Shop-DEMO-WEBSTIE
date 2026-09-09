import { Router, type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../../../config/database';
import { sendSuccess } from '../../../shared/utils';
import { auditFromReq } from '../audit/audit.service';
import slugify from 'slugify';

export const categoriesAdminRouter = Router();

// GET /admin/categories — List all (tree-structured)
categoriesAdminRouter.get('/', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { products: true, children: true } },
        children: {
          orderBy: { sortOrder: 'asc' },
          include: { _count: { select: { products: true, children: true } } },
        },
      },
    });
    sendSuccess(res, categories);
  } catch (error) { next(error); }
});

// POST /admin/categories
categoriesAdminRouter.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, imageUrl, parentId, sortOrder, isActive, metaTitle, metaDesc } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    const category = await prisma.category.create({
      data: { name, slug, description, imageUrl, parentId, sortOrder: sortOrder || 0, isActive: isActive ?? true, metaTitle, metaDesc },
    });
    auditFromReq(req, 'CREATE', 'Category', category.id, category.name);
    sendSuccess(res, category, 201);
  } catch (error) { next(error); }
});

// PUT /admin/categories/:id
categoriesAdminRouter.put('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, imageUrl, parentId, sortOrder, isActive, metaTitle, metaDesc } = req.body;
    const data: Record<string, unknown> = {};
    if (name !== undefined) { data.name = name; data.slug = slugify(name, { lower: true, strict: true }); }
    if (description !== undefined) data.description = description;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (parentId !== undefined) data.parentId = parentId;
    if (sortOrder !== undefined) data.sortOrder = sortOrder;
    if (isActive !== undefined) data.isActive = isActive;
    if (metaTitle !== undefined) data.metaTitle = metaTitle;
    if (metaDesc !== undefined) data.metaDesc = metaDesc;

    const category = await prisma.category.update({ where: { id: req.params.id }, data: data as any });
    auditFromReq(req, 'UPDATE', 'Category', category.id, category.name);
    sendSuccess(res, category);
  } catch (error) { next(error); }
});

// DELETE /admin/categories/:id
categoriesAdminRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await prisma.category.delete({ where: { id: req.params.id } });
    auditFromReq(req, 'DELETE', 'Category', req.params.id, category.name);
    sendSuccess(res, { deleted: true });
  } catch (error) { next(error); }
});

// PATCH /admin/categories/reorder — Bulk update sort orders
categoriesAdminRouter.patch('/reorder', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { items } = req.body; // [{ id, sortOrder }]
    await prisma.$transaction(
      items.map((item: { id: string; sortOrder: number }) =>
        prisma.category.update({ where: { id: item.id }, data: { sortOrder: item.sortOrder } })
      )
    );
    auditFromReq(req, 'UPDATE', 'Category', undefined, 'Reorder categories');
    sendSuccess(res, { reordered: true });
  } catch (error) { next(error); }
});
