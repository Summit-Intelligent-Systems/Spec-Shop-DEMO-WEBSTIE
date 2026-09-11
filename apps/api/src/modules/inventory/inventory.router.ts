import { Router, type Request, type Response } from 'express';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { sendSuccess } from '../../shared/utils';

export const inventoryRouter = Router();

const INVENTORY_ITEMS = [
  { id: 'inv-1', sku: 'NS-OPT-001', productName: 'The Sovereign Round', color: 'Dark Amber Tortoise', stock: 25, lowStockThreshold: 10, status: 'IN_STOCK' },
  { id: 'inv-2', sku: 'NS-SUN-002', productName: 'The Aviator Prime', color: 'Champagne Gold', stock: 12, lowStockThreshold: 10, status: 'IN_STOCK' },
  { id: 'inv-3', sku: 'NS-OPT-003', productName: 'The Kensington Square', color: 'Matte Charcoal', stock: 6, lowStockThreshold: 10, status: 'LOW_STOCK' },
  { id: 'inv-4', sku: 'NS-SUN-004', productName: 'The Marais Cat-Eye', color: 'Piano Black', stock: 15, lowStockThreshold: 10, status: 'IN_STOCK' },
];

inventoryRouter.get(
  '/',
  authenticate,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  (_req: Request, res: Response): void => {
    sendSuccess(res, INVENTORY_ITEMS);
  },
);

inventoryRouter.patch(
  '/:id/stock',
  authenticate,
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  (req: Request, res: Response): void => {
    const { id } = req.params;
    const { stock } = req.body;
    const item = INVENTORY_ITEMS.find((i) => i.id === id);
    if (item) {
      item.stock = Number(stock);
      item.status = item.stock <= item.lowStockThreshold ? 'LOW_STOCK' : 'IN_STOCK';
    }
    sendSuccess(res, item);
  },
);
