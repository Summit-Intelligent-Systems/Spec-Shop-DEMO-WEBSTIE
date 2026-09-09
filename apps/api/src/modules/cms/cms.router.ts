import { Router, type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../../config/database';
import { sendSuccess } from '../../shared/utils';

export const cmsRouter = Router();

const DEFAULT_CMS = {
  announcement: {
    text: 'Complimentary Pan-India Express Delivery & Home Optical Styling on all orders above ₹1,999',
    linkText: 'Explore Lookbook',
    linkUrl: '/lookbook',
    isActive: true,
  },
  heroSlides: [
    {
      id: 'slide-1',
      eyebrow: 'Artisanal Japanese Craft',
      title: 'Titanium & Organic Acetate',
      subtitle: 'Sculpted for those who perceive the world with uncompromising precision.',
      image: '/images/hero-banner.jpg',
      ctaPrimary: { text: 'Explore New Silhouettes', url: '/shop' },
      ctaSecondary: { text: 'Virtual Try-On', url: '/try-on' },
    },
    {
      id: 'slide-2',
      eyebrow: 'Precision Vision Care',
      title: 'German Optical Mastery',
      subtitle: 'Sapphire anti-reflective coating engineered with zero edge distortion.',
      image: '/images/category-sunglasses.jpg',
      ctaPrimary: { text: 'Select Lenses', url: '/shop/eyeglasses' },
      ctaSecondary: { text: 'Book Eye Test', url: '/#eye-care' },
    },
  ],
  lookbook: [
    {
      id: 'look-1',
      title: 'Architectural Obsidian',
      description: 'Hand-polished black acetate paired with brushed gold core filigree.',
      image: '/images/category-men.jpg',
      featuredProductSlug: 'the-kensington-square',
    },
    {
      id: 'look-2',
      title: 'Riviera Mediterranean Gold',
      description: 'Aerospace-grade titanium frame with polarized CR-39 sun lenses.',
      image: '/images/category-sunglasses.jpg',
      featuredProductSlug: 'the-aviator-prime',
    },
    {
      id: 'look-3',
      title: 'The Modern Scholar',
      description: 'Iconic round silhouette with custom 5-barrel German hinges.',
      image: '/images/product-craft.jpg',
      featuredProductSlug: 'the-sovereign-round',
    },
  ],
};

cmsRouter.get('/announcement', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const record = await prisma.cmsGlobal.findUnique({ where: { key: 'announcement' } });
    if (record && record.value) {
      sendSuccess(res, record.value);
      return;
    }
    sendSuccess(res, DEFAULT_CMS.announcement);
  } catch (err) {
    next(err);
  }
});

cmsRouter.get('/hero-slides', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const heroSection = await prisma.cmsSection.findFirst({
      where: { type: 'hero', isActive: true },
    });
    if (heroSection && heroSection.content) {
      const slides = (heroSection.content as any).slides || heroSection.content;
      sendSuccess(res, slides);
      return;
    }
    sendSuccess(res, DEFAULT_CMS.heroSlides);
  } catch (err) {
    next(err);
  }
});

cmsRouter.get('/lookbook', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const lookbookSection = await prisma.cmsSection.findFirst({
      where: { type: 'lookbook', isActive: true },
    });
    if (lookbookSection && lookbookSection.content) {
      const items = (lookbookSection.content as any).items || lookbookSection.content;
      sendSuccess(res, items);
      return;
    }
    sendSuccess(res, DEFAULT_CMS.lookbook);
  } catch (err) {
    next(err);
  }
});

