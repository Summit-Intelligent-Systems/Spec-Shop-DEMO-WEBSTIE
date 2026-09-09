import { Router, type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../../../config/database';
import { sendSuccess, sendPaginated, calculatePagination } from '../../../shared/utils';
import { auditFromReq } from '../audit/audit.service';

export const inventoryAdminRouter = Router();

// GET /api/v1/admin/inventory - List inventory with low stock filters
inventoryAdminRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { skip, take, page, limit } = calculatePagination(
      Number(req.query.page) || 1,
      Number(req.query.limit) || 20
    );

    const lowStockOnly = req.query.lowStock === 'true';
    const search = req.query.search as string;

    const where: any = {};
    if (search) {
      where.product = {
        name: { contains: search, mode: 'insensitive' },
      };
    }

    const [items, total] = await Promise.all([
      prisma.inventory.findMany({
        where,
        skip,
        take,
        include: {
          product: { select: { id: true, name: true, sku: true, basePrice: true } },
          variant: { select: { id: true, sku: true, color: true, size: true, stock: true } },
        },
        orderBy: { quantity: 'asc' },
      }),
      prisma.inventory.count({ where }),
    ]);

    // If low stock filter requested
    const filtered = lowStockOnly
      ? items.filter((item) => item.quantity <= item.lowStockThreshold)
      : items;

    sendPaginated(res, filtered, page, limit, total);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/admin/inventory/:id - Adjust stock
inventoryAdminRouter.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quantity, lowStockThreshold, reorderPoint, reorderQuantity } = req.body;

    const existing = await prisma.inventory.findUnique({
      where: { id: req.params.id },
      include: { variant: true, product: true },
    });

    if (!existing) {
      res.status(404).json({ success: false, message: 'Inventory record not found' });
      return;
    }

    const updated = await prisma.inventory.update({
      where: { id: req.params.id },
      data: {
        ...(quantity !== undefined ? { quantity, lastRestockedAt: new Date() } : {}),
        ...(lowStockThreshold !== undefined ? { lowStockThreshold } : {}),
        ...(reorderPoint !== undefined ? { reorderPoint } : {}),
        ...(reorderQuantity !== undefined ? { reorderQuantity } : {}),
      },
      include: { product: true, variant: true },
    });

    // Also sync variant stock if variantId is present
    if (existing.variantId && quantity !== undefined) {
      await prisma.productVariant.update({
        where: { id: existing.variantId },
        data: { stock: quantity },
      });
    }

    await auditFromReq(req, 'UPDATE', 'Inventory', existing.id, existing.product.name, {
      previousQuantity: existing.quantity,
      newQuantity: quantity,
    });

    sendSuccess(res, updated, 200, { message: 'Inventory updated successfully' });
  } catch (err) {
    next(err);
  }
});
