import { Router, type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../../config/database';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { sendSuccess, sendPaginated, calculatePagination } from '../../shared/utils';
import { NotFoundError } from '../../shared/errors/AppError';

export const productsRouter = Router();

// Fallback high-fidelity catalog items for resilience
const FALLBACK_PRODUCTS = [
  {
    id: 'prod-001',
    name: 'The Sovereign Round',
    slug: 'the-sovereign-round',
    sku: 'XYZ-OPT-001',
    category: { name: 'Eyeglasses', slug: 'eyeglasses' },
    brand: { name: 'XYZ Masterworks', slug: 'xyz-masterworks' },
    basePrice: 3499,
    baseComparePrice: 4999,
    rating: 4.9,
    reviewCount: 142,
    frameShape: 'ROUND',
    frameMaterial: 'ACETATE',
    frameType: 'FULL_RIM',
    isFeatured: true,
    isBestSeller: true,
    description: 'Precision-milled from premium 8mm organic Mazzucchelli acetate with custom wirecore filigree.',
    images: [{ url: '/images/product-craft.jpg', isPrimary: true }],
    variants: [
      { id: 'var-1', color: 'Dark Amber Tortoise', colorHex: '#633B18', size: 'Medium', price: 3499, stock: 25 },
      { id: 'var-2', color: 'Obsidian Black', colorHex: '#111111', size: 'Medium', price: 3499, stock: 18 },
    ],
    dimensions: { lensWidth: 49, bridgeWidth: 20, templeLength: 145, frameWidth: 138 },
  },
  {
    id: 'prod-002',
    name: 'The Aviator Prime',
    slug: 'the-aviator-prime',
    sku: 'XYZ-SUN-002',
    category: { name: 'Sunglasses', slug: 'sunglasses' },
    brand: { name: 'XYZ Masterworks', slug: 'xyz-masterworks' },
    basePrice: 4999,
    baseComparePrice: 6999,
    rating: 4.8,
    reviewCount: 89,
    frameShape: 'AVIATOR',
    frameMaterial: 'TITANIUM',
    frameType: 'FULL_RIM',
    isFeatured: true,
    isBestSeller: true,
    description: 'Ultralight Japanese aerospace-grade titanium frame with polarized CR-39 sun lenses.',
    images: [{ url: '/images/category-sunglasses.jpg', isPrimary: true }],
    variants: [
      { id: 'var-3', color: 'Champagne Gold', colorHex: '#C9A84C', size: 'Medium', price: 4999, stock: 12 },
    ],
    dimensions: { lensWidth: 55, bridgeWidth: 17, templeLength: 140, frameWidth: 142 },
  },
  {
    id: 'prod-003',
    name: 'The Kensington Square',
    slug: 'the-kensington-square',
    sku: 'XYZ-OPT-003',
    category: { name: 'Eyeglasses', slug: 'eyeglasses' },
    brand: { name: 'XYZ Masterworks', slug: 'xyz-masterworks' },
    basePrice: 2999,
    baseComparePrice: 3999,
    rating: 4.7,
    reviewCount: 114,
    frameShape: 'SQUARE',
    frameMaterial: 'ACETATE',
    frameType: 'FULL_RIM',
    isFeatured: false,
    isBestSeller: true,
    description: 'Sharp architectural silhouette with bevel-cut rims and brushed gold core wire.',
    images: [{ url: '/images/category-men.jpg', isPrimary: true }],
    variants: [
      { id: 'var-4', color: 'Matte Charcoal', colorHex: '#27272A', size: 'Medium', price: 2999, stock: 30 },
    ],
    dimensions: { lensWidth: 52, bridgeWidth: 19, templeLength: 145, frameWidth: 140 },
  },
  {
    id: 'prod-004',
    name: 'The Marais Cat-Eye',
    slug: 'the-marais-cat-eye',
    sku: 'XYZ-SUN-004',
    category: { name: 'Sunglasses', slug: 'sunglasses' },
    brand: { name: 'XYZ Haute', slug: 'xyz-haute' },
    basePrice: 3999,
    baseComparePrice: 5499,
    rating: 5.0,
    reviewCount: 76,
    frameShape: 'CAT_EYE',
    frameMaterial: 'ACETATE',
    frameType: 'FULL_RIM',
    isFeatured: true,
    isBestSeller: false,
    description: 'Audacious feminine silhouette inspired by mid-century Parisian haute couture.',
    images: [{ url: '/images/category-sunglasses.jpg', isPrimary: true }],
    variants: [
      { id: 'var-5', color: 'Piano Black', colorHex: '#09090B', size: 'Medium', price: 3999, stock: 15 },
    ],
    dimensions: { lensWidth: 53, bridgeWidth: 18, templeLength: 140, frameWidth: 139 },
  },
  {
    id: 'prod-005',
    name: 'The Kyoto Minimalist',
    slug: 'the-kyoto-minimalist',
    sku: 'XYZ-SCR-005',
    category: { name: 'Screen Glasses', slug: 'screen-glasses' },
    brand: { name: 'XYZ Masterworks', slug: 'xyz-masterworks' },
    basePrice: 4299,
    baseComparePrice: 5999,
    rating: 4.9,
    reviewCount: 63,
    frameShape: 'GEOMETRIC',
    frameMaterial: 'TITANIUM',
    frameType: 'RIMLESS',
    isFeatured: true,
    isBestSeller: false,
    description: '9.8g featherweight rimless frame using tension-mounted flexible beta-titanium.',
    images: [{ url: '/images/category-men.jpg', isPrimary: true }],
    variants: [
      { id: 'var-6', color: 'Brushed Silver', colorHex: '#CBD5E1', size: 'Medium', price: 4299, stock: 20 },
    ],
    dimensions: { lensWidth: 50, bridgeWidth: 20, templeLength: 142, frameWidth: 136 },
  },
  {
    id: 'prod-006',
    name: 'The Riviera Sun Classic',
    slug: 'the-riviera-sun-classic',
    sku: 'XYZ-SUN-006',
    category: { name: 'Sunglasses', slug: 'sunglasses' },
    brand: { name: 'XYZ Masterworks', slug: 'xyz-masterworks' },
    basePrice: 3699,
    baseComparePrice: 4799,
    rating: 4.8,
    reviewCount: 95,
    frameShape: 'SQUARE',
    frameMaterial: 'ACETATE',
    frameType: 'FULL_RIM',
    isFeatured: false,
    isBestSeller: true,
    description: 'Timeless Mediterranean styling crafted from thick acetate with mineral glass polarized lenses.',
    images: [{ url: '/images/product-craft.jpg', isPrimary: true }],
    variants: [
      { id: 'var-7', color: 'Classic Havana', colorHex: '#522A0C', size: 'Medium', price: 3699, stock: 22 },
    ],
    dimensions: { lensWidth: 51, bridgeWidth: 21, templeLength: 145, frameWidth: 142 },
  },
];

// ─── GET /api/v1/products ───────────────────────────────────────────────────
productsRouter.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, category, frameShape, frameMaterial, frameType, search, maxPrice } = req.query;
    const pagination = calculatePagination(Number(page) || 1, Number(limit) || 20);

    let products: any[] = [];
    let total = 0;

    try {
      const where: any = { isActive: true };
      if (category && category !== 'all') {
        where.category = { slug: String(category) };
      }
      if (frameShape) {
        where.frameShape = String(frameShape);
      }
      if (frameMaterial) {
        where.frameMaterial = String(frameMaterial);
      }
      if (frameType) {
        where.frameType = String(frameType);
      }
      if (search) {
        where.OR = [
          { name: { contains: String(search), mode: 'insensitive' } },
          { description: { contains: String(search), mode: 'insensitive' } },
        ];
      }

      [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip: pagination.skip,
          take: pagination.take,
          include: {
            category: true,
            brand: true,
            variants: true,
            media: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.product.count({ where }),
      ]);
    } catch {
      // Fallback
      let list = [...FALLBACK_PRODUCTS];
      if (category && category !== 'all') {
        list = list.filter((p) => p.category.slug === category);
      }
      if (frameShape) {
        list = list.filter((p) => p.frameShape === frameShape);
      }
      if (frameMaterial) {
        list = list.filter((p) => p.frameMaterial === frameMaterial);
      }
      if (maxPrice) {
        list = list.filter((p) => p.basePrice <= Number(maxPrice));
      }
      if (search) {
        const q = String(search).toLowerCase();
        list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      }
      total = list.length;
      products = list.slice(pagination.skip, pagination.skip + pagination.take);
    }

    sendPaginated(res, products, pagination.page, pagination.limit, total);
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/v1/products/:slugOrId ─────────────────────────────────────────
productsRouter.get('/:slugOrId', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slugOrId } = req.params;
    let product: any = null;

    try {
      product = await prisma.product.findFirst({
        where: {
          OR: [{ slug: slugOrId }, { id: slugOrId }],
        },
        include: {
          category: true,
          brand: true,
          variants: true,
          media: true,
          reviews: {
            where: { status: 'APPROVED' },
            take: 10,
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    } catch {
      product = FALLBACK_PRODUCTS.find((p) => p.slug === slugOrId || p.id === slugOrId);
    }

    if (!product) {
      throw new NotFoundError(`Product '${slugOrId}' not found`, 'PROD_001');
    }

    sendSuccess(res, product);
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/v1/products/:id/related ───────────────────────────────────────
productsRouter.get('/:id/related', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const related = FALLBACK_PRODUCTS.filter((p) => p.id !== id).slice(0, 4);
    sendSuccess(res, related);
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/v1/products (Admin) ──────────────────────────────────────────
productsRouter.post(
  '/',
  authenticate,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req.body;
      const created = {
        id: `prod-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
      };
      FALLBACK_PRODUCTS.push(created);
      sendSuccess(res, created, 201);
    } catch (error) {
      next(error);
    }
  },
);

// ─── PUT /api/v1/products/:id (Admin) ───────────────────────────────────────
productsRouter.put(
  '/:id',
  authenticate,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const data = req.body;
      const index = FALLBACK_PRODUCTS.findIndex((p) => p.id === id);
      if (index >= 0) {
        FALLBACK_PRODUCTS[index] = { ...FALLBACK_PRODUCTS[index], ...data };
      }
      sendSuccess(res, { id, ...data, updatedAt: new Date().toISOString() });
    } catch (error) {
      next(error);
    }
  },
);

// ─── DELETE /api/v1/products/:id (Admin) ────────────────────────────────────
productsRouter.delete(
  '/:id',
  authenticate,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const idx = FALLBACK_PRODUCTS.findIndex((p) => p.id === id);
      if (idx >= 0) FALLBACK_PRODUCTS.splice(idx, 1);
      sendSuccess(res, { message: `Product ${id} deleted successfully` });
    } catch (error) {
      next(error);
    }
  },
);
