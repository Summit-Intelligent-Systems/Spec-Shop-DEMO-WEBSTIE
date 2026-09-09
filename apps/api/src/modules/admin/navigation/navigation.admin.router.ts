import { Router, type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../../../config/database';
import { sendSuccess } from '../../../shared/utils';
import { auditFromReq } from '../audit/audit.service';

export const navigationAdminRouter = Router();

// Default navigation state
const DEFAULT_HEADER_NAV = [
  { id: '1', title: 'Eyeglasses', href: '/products?category=eyeglasses', sortOrder: 0 },
  { id: '2', title: 'Sunglasses', href: '/products?category=sunglasses', sortOrder: 1 },
  { id: '3', title: 'Brands', href: '/brands', sortOrder: 2 },
  { id: '4', title: 'Virtual Try-On', href: '/try-on', sortOrder: 3 },
  { id: '5', title: 'Book Eye Test', href: '/appointments', sortOrder: 4 },
];

const DEFAULT_FOOTER_NAV = [
  { group: 'Shop', links: [{ label: 'All Glasses', href: '/products' }, { label: 'New Arrivals', href: '/products?filter=new' }] },
  { group: 'Customer Care', links: [{ label: 'Track Order', href: '/orders' }, { label: 'Contact Us', href: '/contact' }, { label: 'FAQ', href: '/faq' }] },
  { group: 'About', links: [{ label: 'Our Story', href: '/about' }, { label: 'Terms & Conditions', href: '/terms' }, { label: 'Privacy Policy', href: '/privacy' }] },
];

// GET /api/v1/admin/navigation - Get header, footer, and social menus
navigationAdminRouter.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const navItems = await prisma.cmsGlobal.findMany({
      where: {
        key: { in: ['header_navigation', 'footer_navigation', 'social_links'] },
      },
    });

    const header = navItems.find((i) => i.key === 'header_navigation')?.value || DEFAULT_HEADER_NAV;
    const footer = navItems.find((i) => i.key === 'footer_navigation')?.value || DEFAULT_FOOTER_NAV;
    const social = navItems.find((i) => i.key === 'social_links')?.value || [
      { platform: 'instagram', url: 'https://instagram.com' },
      { platform: 'facebook', url: 'https://facebook.com' },
      { platform: 'twitter', url: 'https://twitter.com' },
    ];

    sendSuccess(res, { header, footer, social });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/admin/navigation/:section - Update header, footer, or social links
navigationAdminRouter.put('/:section', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { section } = req.params;
    const { items } = req.body;

    const key = section === 'header' ? 'header_navigation' : section === 'footer' ? 'footer_navigation' : 'social_links';

    const updated = await prisma.cmsGlobal.upsert({
      where: { key },
      update: { value: items },
      create: {
        key,
        value: items,
        label: `${section.charAt(0).toUpperCase() + section.slice(1)} Navigation`,
        group: 'navigation',
      },
    });

    await auditFromReq(req, 'UPDATE', 'Navigation', updated.id, key, { items });

    sendSuccess(res, updated.value, 200, { message: `${section} navigation updated` });
  } catch (err) {
    next(err);
  }
});
