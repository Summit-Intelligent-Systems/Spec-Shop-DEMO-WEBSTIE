import { Router, type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../../../config/database';
import { sendSuccess } from '../../../shared/utils';
import { auditFromReq } from '../audit/audit.service';
import slugify from 'slugify';

export const pagesAdminRouter = Router();

// GET /admin/pages — List all content pages
pagesAdminRouter.get('/', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pages = await prisma.contentPage.findMany({
      orderBy: { sortOrder: 'asc' },
      select: { id: true, slug: true, title: true, isPublished: true, publishedAt: true, sortOrder: true, createdAt: true, updatedAt: true },
    });
    sendSuccess(res, pages);
  } catch (error) { next(error); }
});

// GET /admin/pages/:id
pagesAdminRouter.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = await prisma.contentPage.findUnique({ where: { id: req.params.id } });
    if (!page) { res.status(404).json({ success: false, message: 'Page not found' }); return; }
    sendSuccess(res, page);
  } catch (error) { next(error); }
});

// POST /admin/pages
pagesAdminRouter.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, content, excerpt, metaTitle, metaDescription, ogImage, isPublished, sortOrder } = req.body;
    const slug = slugify(title, { lower: true, strict: true });
    const page = await prisma.contentPage.create({
      data: { slug, title, content: content || '', excerpt, metaTitle, metaDescription, ogImage, isPublished: isPublished ?? false, publishedAt: isPublished ? new Date() : null, sortOrder: sortOrder || 0 },
    });
    auditFromReq(req, 'CREATE', 'ContentPage', page.id, page.title);
    sendSuccess(res, page, 201);
  } catch (error) { next(error); }
});

// PUT /admin/pages/:id
pagesAdminRouter.put('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = { ...req.body };
    if (data.title) data.slug = slugify(data.title, { lower: true, strict: true });
    if (data.isPublished && !data.publishedAt) data.publishedAt = new Date();
    const page = await prisma.contentPage.update({ where: { id: req.params.id }, data });
    auditFromReq(req, 'UPDATE', 'ContentPage', page.id, page.title);
    sendSuccess(res, page);
  } catch (error) { next(error); }
});

// DELETE /admin/pages/:id
pagesAdminRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = await prisma.contentPage.delete({ where: { id: req.params.id } });
    auditFromReq(req, 'DELETE', 'ContentPage', req.params.id, page.title);
    sendSuccess(res, { deleted: true });
  } catch (error) { next(error); }
});
