import { Router, type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../../../config/database';
import { sendSuccess } from '../../../shared/utils';
import { auditFromReq } from '../audit/audit.service';

export const seoAdminRouter = Router();

const DEFAULT_GLOBAL_SEO = {
  metaTitle: 'XYZ Eyewear | Designer & Prescription Glasses',
  metaDescription: 'Discover our luxury collection of handcrafted eyewear, optical frames, and polarized sunglasses. Free shipping and 30-day trial.',
  ogImage: '/images/hero-banner.jpg',
  twitterHandle: '@xyzeyewear',
  googleSiteVerification: '',
  canonicalDomain: 'https://xyzeyewear.com',
  robotsTxt: 'User-agent: *\nAllow: /',
};

// GET /api/v1/admin/seo - Get global SEO and page SEO list
seoAdminRouter.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [globalSetting, pages] = await Promise.all([
      prisma.cmsGlobal.findUnique({ where: { key: 'global_seo' } }),
      prisma.contentPage.findMany({
        select: { id: true, slug: true, title: true, metaTitle: true, metaDescription: true },
      }),
    ]);

    sendSuccess(res, {
      global: globalSetting?.value || DEFAULT_GLOBAL_SEO,
      pages,
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/admin/seo/global - Update global SEO
seoAdminRouter.put('/global', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;

    const updated = await prisma.cmsGlobal.upsert({
      where: { key: 'global_seo' },
      update: { value: data },
      create: {
        key: 'global_seo',
        value: data,
        label: 'Global SEO Settings',
        group: 'seo',
      },
    });

    await auditFromReq(req, 'UPDATE', 'SEO', updated.id, 'global_seo', data);

    sendSuccess(res, updated.value, 200, { message: 'Global SEO settings updated' });
  } catch (err) {
    next(err);
  }
});
