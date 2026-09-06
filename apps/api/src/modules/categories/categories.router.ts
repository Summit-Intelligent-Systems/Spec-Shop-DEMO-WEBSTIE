import { Router, type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../../config/database';
import { sendSuccess } from '../../shared/utils';
import { NotFoundError } from '../../shared/errors/AppError';

export const categoriesRouter = Router();

const FALLBACK_CATEGORIES = [
  { id: 'cat-1', name: 'Eyeglasses', slug: 'eyeglasses', description: 'Handcrafted optical frames with clinical lenses', imageUrl: '/images/hero-banner.jpg', productCount: 4 },
  { id: 'cat-2', name: 'Sunglasses', slug: 'sunglasses', description: '100% UV400 polarized luxury sun silhouettes', imageUrl: '/images/category-sunglasses.jpg', productCount: 3 },
  { id: 'cat-3', name: 'Screen Glasses', slug: 'screen-glasses', description: 'Blue light protection for digital screens', imageUrl: '/images/category-men.jpg', productCount: 1 },
  { id: 'cat-4', name: 'Reading Glasses', slug: 'reading-glasses', description: 'Precision near-vision reading optics', imageUrl: '/images/product-craft.jpg', productCount: 1 },
];

categoriesRouter.get('/', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let categories: any[] = [];
    try {
      categories = await prisma.category.findMany({
        where: { isActive: true },
        include: { _count: { select: { products: true } } },
      });
    } catch {
      categories = FALLBACK_CATEGORIES;
    }
    sendSuccess(res, categories);
  } catch (error) {
    next(error);
  }
});

categoriesRouter.get('/:slug', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;
    let category: any = null;
    try {
      category = await prisma.category.findUnique({
        where: { slug },
        include: { products: { take: 10 } },
      });
    } catch {
      category = FALLBACK_CATEGORIES.find((c) => c.slug === slug);
    }

    if (!category) {
      throw new NotFoundError(`Category '${slug}' not found`, 'CAT_001');
    }
    sendSuccess(res, category);
  } catch (error) {
    next(error);
  }
});
