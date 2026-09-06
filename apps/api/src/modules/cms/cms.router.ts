import { Router, type Request, type Response } from 'express';
import { sendSuccess } from '../../shared/utils';

export const cmsRouter = Router();

const CMS_CONTENT = {
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

cmsRouter.get('/announcement', (_req: Request, res: Response): void => {
  sendSuccess(res, CMS_CONTENT.announcement);
});

cmsRouter.get('/hero-slides', (_req: Request, res: Response): void => {
  sendSuccess(res, CMS_CONTENT.heroSlides);
});

cmsRouter.get('/lookbook', (_req: Request, res: Response): void => {
  sendSuccess(res, CMS_CONTENT.lookbook);
});
