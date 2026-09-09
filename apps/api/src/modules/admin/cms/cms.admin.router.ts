import { Router, type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../../../config/database';
import { sendSuccess } from '../../../shared/utils';
import { auditFromReq } from '../audit/audit.service';

export const cmsAdminRouter = Router();

// GET /admin/cms/homepage — Get homepage sections
cmsAdminRouter.get('/homepage', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let page = await prisma.cmsPage.findUnique({
      where: { slug: 'home' },
      include: { sections: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!page) {
      // Create default homepage if not exists
      page = await prisma.cmsPage.create({
        data: {
          slug: 'home', title: 'Homepage', isPublished: true, publishedAt: new Date(),
          sections: {
            create: [
              { type: 'announcement', name: 'Announcement Bar', content: { text: 'Free shipping on orders above ₹1,999', linkText: 'Shop Now', linkUrl: '/shop', isActive: true }, sortOrder: 0, isActive: true },
              { type: 'hero', name: 'Hero Slides', content: { slides: [] }, sortOrder: 1, isActive: true },
              { type: 'featured_categories', name: 'Featured Categories', content: { title: 'Shop by Category', categories: [] }, sortOrder: 2, isActive: true },
              { type: 'featured_products', name: 'Featured Products', content: { title: 'Best Sellers', limit: 8 }, sortOrder: 3, isActive: true },
              { type: 'lookbook', name: 'Lookbook', content: { items: [] }, sortOrder: 4, isActive: true },
              { type: 'testimonials', name: 'Testimonials', content: { title: 'What Our Customers Say', items: [] }, sortOrder: 5, isActive: true },
              { type: 'brands', name: 'Brand Logos', content: { title: 'Our Brands', logos: [] }, sortOrder: 6, isActive: true },
              { type: 'newsletter', name: 'Newsletter', content: { title: 'Stay in the Loop', subtitle: 'Get exclusive offers and style tips.' }, sortOrder: 7, isActive: true },
            ],
          },
        },
        include: { sections: { orderBy: { sortOrder: 'asc' } } },
      });
    }
    sendSuccess(res, page);
  } catch (error) { next(error); }
});

// PUT /admin/cms/sections/:id — Update a section's content
cmsAdminRouter.put('/sections/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { content, name, isActive } = req.body;
    const data: Record<string, unknown> = {};
    if (content !== undefined) data.content = content;
    if (name !== undefined) data.name = name;
    if (isActive !== undefined) data.isActive = isActive;
    const section = await prisma.cmsSection.update({ where: { id: req.params.id }, data: data as any });
    auditFromReq(req, 'UPDATE', 'CmsSection', section.id, section.name || section.type);
    sendSuccess(res, section);
  } catch (error) { next(error); }
});

// POST /admin/cms/sections — Add a new section
cmsAdminRouter.post('/sections', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { pageId, type, name, content, sortOrder } = req.body;
    const section = await prisma.cmsSection.create({ data: { pageId, type, name, content, sortOrder: sortOrder || 0, isActive: true } });
    auditFromReq(req, 'CREATE', 'CmsSection', section.id, name || type);
    sendSuccess(res, section, 201);
  } catch (error) { next(error); }
});

// DELETE /admin/cms/sections/:id
cmsAdminRouter.delete('/sections/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.cmsSection.delete({ where: { id: req.params.id } });
    auditFromReq(req, 'DELETE', 'CmsSection', req.params.id);
    sendSuccess(res, { deleted: true });
  } catch (error) { next(error); }
});

// PATCH /admin/cms/sections/reorder — Reorder sections
cmsAdminRouter.patch('/sections/reorder', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { items } = req.body;
    await prisma.$transaction(
      items.map((item: { id: string; sortOrder: number }) =>
        prisma.cmsSection.update({ where: { id: item.id }, data: { sortOrder: item.sortOrder } })
      )
    );
    auditFromReq(req, 'UPDATE', 'CmsSection', undefined, 'Reorder sections');
    sendSuccess(res, { reordered: true });
  } catch (error) { next(error); }
});

// PATCH /admin/cms/sections/:id/toggle — Enable/disable section
cmsAdminRouter.patch('/sections/:id/toggle', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const section = await prisma.cmsSection.findUnique({ where: { id: req.params.id } });
    if (!section) { res.status(404).json({ success: false, message: 'Section not found' }); return; }
    const updated = await prisma.cmsSection.update({ where: { id: req.params.id }, data: { isActive: !section.isActive } });
    auditFromReq(req, 'UPDATE', 'CmsSection', updated.id, updated.name || updated.type, { isActive: updated.isActive });
    sendSuccess(res, updated);
  } catch (error) { next(error); }
});

// ─── Global CMS Settings (navigation, footer, social) ────────────────────────

// GET /admin/cms/globals — Get all global CMS settings
cmsAdminRouter.get('/globals', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const globals = await prisma.cmsGlobal.findMany({ orderBy: { key: 'asc' } });
    sendSuccess(res, globals);
  } catch (error) { next(error); }
});

// GET /admin/cms/globals/:key
cmsAdminRouter.get('/globals/:key', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const global = await prisma.cmsGlobal.findUnique({ where: { key: req.params.key } });
    if (!global) { res.status(404).json({ success: false, message: 'Setting not found' }); return; }
    sendSuccess(res, global);
  } catch (error) { next(error); }
});

// PUT /admin/cms/globals/:key
cmsAdminRouter.put('/globals/:key', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { value, label, group } = req.body;
    const global = await prisma.cmsGlobal.upsert({
      where: { key: req.params.key },
      update: { value, label, group },
      create: { key: req.params.key, value, label, group },
    });
    auditFromReq(req, 'UPDATE', 'CmsGlobal', global.id, req.params.key);
    sendSuccess(res, global);
  } catch (error) { next(error); }
});
