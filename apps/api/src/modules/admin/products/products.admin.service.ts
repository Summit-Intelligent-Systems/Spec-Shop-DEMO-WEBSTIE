import { prisma } from '../../../config/database';
import { calculatePagination } from '../../../shared/utils';
import { NotFoundError, ConflictError } from '../../../shared/errors/AppError';
import slugify from 'slugify';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductFilters {
  search?: string;
  status?: string;
  categoryId?: string;
  brandId?: string;
  gender?: string;
  isFeatured?: string;
  isNewArrival?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

interface CreateProductInput {
  name: string;
  sku: string;
  shortDescription?: string;
  description?: string;
  brandId: string;
  categoryId: string;
  gender?: string;
  shape?: string;
  frameType?: string;
  frameWidth?: number;
  weight?: number;
  lensWidth?: number;
  bridgeWidth?: number;
  templeLength?: number;
  lensHeight?: number;
  prescriptionCompatible?: boolean;
  recommendedFaceShapes?: string[];
  basePrice: number;
  baseComparePrice?: number;
  status?: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  tags?: string[];
  metaTitle?: string;
  metaDesc?: string;
  warrantyInfo?: string;
  careInstructions?: string;
  variants?: CreateVariantInput[];
}

interface CreateVariantInput {
  sku: string;
  color?: string;
  colorHex?: string;
  size?: string;
  frameWidth?: number;
  frameMaterial?: string;
  lensType?: string;
  price: number;
  comparePrice?: number;
  stock?: number;
  isDefault?: boolean;
  isActive?: boolean;
}

// ─── Service Functions ────────────────────────────────────────────────────────

/**
 * Get paginated list of products with filters.
 */
export const getAdminProducts = async (filters: ProductFilters) => {
  const { skip, take, page, limit } = calculatePagination(filters.page, filters.limit);

  const where: Record<string, unknown> = {};

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { sku: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }
  if (filters.status) where.status = filters.status;
  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.brandId) where.brandId = filters.brandId;
  if (filters.gender) where.gender = filters.gender;
  if (filters.isFeatured === 'true') where.isFeatured = true;
  if (filters.isNewArrival === 'true') where.isNewArrival = true;

  // Sort
  const orderBy: Record<string, string> = {};
  const sortBy = filters.sortBy || 'createdAt';
  const sortOrder = filters.sortOrder || 'desc';
  orderBy[sortBy] = sortOrder;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: where as any,
      skip,
      take,
      orderBy: orderBy as any,
      select: {
        id: true,
        name: true,
        slug: true,
        sku: true,
        status: true,
        basePrice: true,
        baseComparePrice: true,
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: true,
        averageRating: true,
        reviewCount: true,
        viewCount: true,
        purchaseCount: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
        brand: { select: { id: true, name: true, slug: true } },
        category: { select: { id: true, name: true, slug: true } },
        variants: {
          select: {
            id: true,
            sku: true,
            color: true,
            colorHex: true,
            price: true,
            stock: true,
            isDefault: true,
            isActive: true,
          },
          orderBy: { sortOrder: 'asc' },
        },
        media: {
          take: 1,
          orderBy: { sortOrder: 'asc' },
          select: { id: true, url: true, altText: true },
        },
        _count: { select: { variants: true, reviews: true } },
      },
    }),
    prisma.product.count({ where: where as any }),
  ]);

  return { products, page, limit, total };
};

/**
 * Get a single product with full details.
 */
export const getAdminProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      brand: true,
      category: true,
      variants: {
        orderBy: { sortOrder: 'asc' },
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          inventories: true,
        },
      },
      media: { orderBy: { sortOrder: 'asc' } },
      reviews: {
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { email: true, profile: { select: { firstName: true, lastName: true } } } } },
      },
      _count: { select: { variants: true, reviews: true, orderItems: true, wishlistItems: true } },
    },
  });

  if (!product) throw new NotFoundError('Product');
  return product;
};

/**
 * Create a new product.
 */
export const createAdminProduct = async (input: CreateProductInput) => {
  const slug = slugify(input.name, { lower: true, strict: true });

  // Check for duplicate slug
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) throw new ConflictError('A product with this name already exists');

  // Check for duplicate SKU
  const existingSku = await prisma.product.findUnique({ where: { sku: input.sku } });
  if (existingSku) throw new ConflictError('A product with this SKU already exists');

  const product = await prisma.product.create({
    data: {
      name: input.name,
      slug,
      sku: input.sku,
      shortDescription: input.shortDescription,
      description: input.description,
      brandId: input.brandId,
      categoryId: input.categoryId,
      gender: (input.gender as any) || 'UNISEX',
      shape: input.shape as any,
      frameType: input.frameType as any,
      frameWidth: input.frameWidth,
      weight: input.weight,
      lensWidth: input.lensWidth,
      bridgeWidth: input.bridgeWidth,
      templeLength: input.templeLength,
      lensHeight: input.lensHeight,
      prescriptionCompatible: input.prescriptionCompatible ?? true,
      recommendedFaceShapes: (input.recommendedFaceShapes as any) || [],
      basePrice: input.basePrice,
      baseComparePrice: input.baseComparePrice,
      status: (input.status as any) || 'DRAFT',
      isFeatured: input.isFeatured ?? false,
      isNewArrival: input.isNewArrival ?? false,
      isBestSeller: input.isBestSeller ?? false,
      tags: input.tags || [],
      metaTitle: input.metaTitle,
      metaDesc: input.metaDesc,
      warrantyInfo: input.warrantyInfo,
      careInstructions: input.careInstructions,
      publishedAt: input.status === 'ACTIVE' ? new Date() : null,
      variants: input.variants?.length ? {
        create: input.variants.map((v, i) => ({
          sku: v.sku,
          color: v.color,
          colorHex: v.colorHex,
          size: v.size,
          frameWidth: v.frameWidth,
          frameMaterial: v.frameMaterial as any,
          lensType: v.lensType as any,
          price: v.price,
          comparePrice: v.comparePrice,
          stock: v.stock ?? 0,
          isDefault: v.isDefault ?? i === 0,
          isActive: v.isActive ?? true,
          sortOrder: i,
        })),
      } : undefined,
    },
    include: {
      brand: true,
      category: true,
      variants: true,
      media: true,
    },
  });

  return product;
};

/**
 * Update an existing product.
 */
export const updateAdminProduct = async (id: string, input: Partial<CreateProductInput>) => {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Product');

  const updateData: Record<string, unknown> = {};

  if (input.name !== undefined) {
    updateData.name = input.name;
    updateData.slug = slugify(input.name, { lower: true, strict: true });
  }
  if (input.sku !== undefined) updateData.sku = input.sku;
  if (input.shortDescription !== undefined) updateData.shortDescription = input.shortDescription;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.brandId !== undefined) updateData.brandId = input.brandId;
  if (input.categoryId !== undefined) updateData.categoryId = input.categoryId;
  if (input.gender !== undefined) updateData.gender = input.gender;
  if (input.shape !== undefined) updateData.shape = input.shape;
  if (input.frameType !== undefined) updateData.frameType = input.frameType;
  if (input.basePrice !== undefined) updateData.basePrice = input.basePrice;
  if (input.baseComparePrice !== undefined) updateData.baseComparePrice = input.baseComparePrice;
  if (input.isFeatured !== undefined) updateData.isFeatured = input.isFeatured;
  if (input.isNewArrival !== undefined) updateData.isNewArrival = input.isNewArrival;
  if (input.isBestSeller !== undefined) updateData.isBestSeller = input.isBestSeller;
  if (input.tags !== undefined) updateData.tags = input.tags;
  if (input.metaTitle !== undefined) updateData.metaTitle = input.metaTitle;
  if (input.metaDesc !== undefined) updateData.metaDesc = input.metaDesc;
  if (input.warrantyInfo !== undefined) updateData.warrantyInfo = input.warrantyInfo;
  if (input.careInstructions !== undefined) updateData.careInstructions = input.careInstructions;
  if (input.frameWidth !== undefined) updateData.frameWidth = input.frameWidth;
  if (input.weight !== undefined) updateData.weight = input.weight;
  if (input.prescriptionCompatible !== undefined) updateData.prescriptionCompatible = input.prescriptionCompatible;

  if (input.status !== undefined) {
    updateData.status = input.status;
    if (input.status === 'ACTIVE' && !existing.publishedAt) {
      updateData.publishedAt = new Date();
    }
  }

  return prisma.product.update({
    where: { id },
    data: updateData as any,
    include: { brand: true, category: true, variants: true, media: true },
  });
};

/**
 * Update product status.
 */
export const updateProductStatus = async (id: string, status: string) => {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Product');

  return prisma.product.update({
    where: { id },
    data: {
      status: status as any,
      publishedAt: status === 'ACTIVE' && !existing.publishedAt ? new Date() : existing.publishedAt,
    },
  });
};

/**
 * Duplicate a product.
 */
export const duplicateProduct = async (id: string) => {
  const source = await prisma.product.findUnique({
    where: { id },
    include: { variants: true, media: true },
  });
  if (!source) throw new NotFoundError('Product');

  const baseName = `${source.name} (Copy)`;
  let slug = slugify(baseName, { lower: true, strict: true });
  let sku = `${source.sku}-COPY`;

  // Ensure unique slug
  let counter = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = slugify(`${baseName} ${counter}`, { lower: true, strict: true });
    sku = `${source.sku}-COPY-${counter}`;
    counter++;
  }

  const duplicate = await prisma.product.create({
    data: {
      name: baseName,
      slug,
      sku,
      shortDescription: source.shortDescription,
      description: source.description,
      brandId: source.brandId,
      categoryId: source.categoryId,
      gender: source.gender,
      shape: source.shape,
      frameType: source.frameType,
      frameWidth: source.frameWidth,
      weight: source.weight,
      lensWidth: source.lensWidth,
      bridgeWidth: source.bridgeWidth,
      templeLength: source.templeLength,
      lensHeight: source.lensHeight,
      prescriptionCompatible: source.prescriptionCompatible,
      recommendedFaceShapes: source.recommendedFaceShapes,
      basePrice: source.basePrice,
      baseComparePrice: source.baseComparePrice,
      status: 'DRAFT',
      isFeatured: false,
      isNewArrival: false,
      isBestSeller: false,
      tags: source.tags,
      metaTitle: source.metaTitle,
      metaDesc: source.metaDesc,
      warrantyInfo: source.warrantyInfo,
      careInstructions: source.careInstructions,
      variants: {
        create: source.variants.map((v, i) => ({
          sku: `${v.sku}-COPY${counter > 1 ? `-${counter - 1}` : ''}`,
          color: v.color,
          colorHex: v.colorHex,
          size: v.size,
          frameWidth: v.frameWidth,
          frameMaterial: v.frameMaterial,
          lensType: v.lensType,
          price: v.price,
          comparePrice: v.comparePrice,
          stock: 0,
          isDefault: v.isDefault,
          isActive: v.isActive,
          sortOrder: i,
        })),
      },
    },
    include: { brand: true, category: true, variants: true },
  });

  return duplicate;
};

/**
 * Bulk update product status.
 */
export const bulkUpdateProducts = async (ids: string[], action: string) => {
  switch (action) {
    case 'publish':
      return prisma.product.updateMany({
        where: { id: { in: ids } },
        data: { status: 'ACTIVE', publishedAt: new Date() },
      });
    case 'unpublish':
      return prisma.product.updateMany({
        where: { id: { in: ids } },
        data: { status: 'DRAFT' },
      });
    case 'archive':
      return prisma.product.updateMany({
        where: { id: { in: ids } },
        data: { status: 'ARCHIVED' },
      });
    case 'delete':
      return prisma.product.deleteMany({
        where: { id: { in: ids } },
      });
    default:
      throw new Error(`Unknown bulk action: ${action}`);
  }
};

/**
 * Delete a product.
 */
export const deleteAdminProduct = async (id: string) => {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Product');
  return prisma.product.delete({ where: { id } });
};
