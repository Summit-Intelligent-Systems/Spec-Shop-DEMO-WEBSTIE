import { Router, type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../../config/database';
import { sendSuccess } from '../../shared/utils';
import { NotFoundError } from '../../shared/errors/AppError';

export const brandsRouter = Router();

const FALLBACK_BRANDS = [
  { id: 'brand-1', name: 'XYZ Masterworks', slug: 'xyz-masterworks', description: 'Heritage Japanese titanium & Italian acetate frames' },
  { id: 'brand-2', name: 'XYZ Haute', slug: 'xyz-haute', description: 'Runway avant-garde silhouettes' },
  { id: 'brand-3', name: 'XYZ Clinical', slug: 'xyz-clinical', description: 'Engineered blue-light & ergonomic frames' },
];

brandsRouter.get('/', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let brands: any[] = [];
    try {
      brands = await prisma.brand.findMany({ where: { isActive: true } });
    } catch {
      brands = FALLBACK_BRANDS;
    }
    sendSuccess(res, brands);
  } catch (error) {
    next(error);
  }
});

brandsRouter.get('/:slug', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;
    let brand: any = null;
    try {
      brand = await prisma.brand.findUnique({ where: { slug } });
    } catch {
      brand = FALLBACK_BRANDS.find((b) => b.slug === slug);
    }
    if (!brand) {
      throw new NotFoundError(`Brand '${slug}' not found`, 'BRAND_001');
    }
    sendSuccess(res, brand);
  } catch (error) {
    next(error);
  }
});
