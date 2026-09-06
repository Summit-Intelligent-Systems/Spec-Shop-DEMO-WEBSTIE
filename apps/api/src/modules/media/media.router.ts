import { Router, type Request, type Response } from 'express';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { sendSuccess } from '../../shared/utils';

export const mediaRouter = Router();

const MEDIA_LIBRARY = [
  { id: 'med-1', name: 'hero-banner.jpg', url: '/images/hero-banner.jpg', type: 'IMAGE', size: 614225, createdAt: '2026-09-01' },
  { id: 'med-2', name: 'category-sunglasses.jpg', url: '/images/category-sunglasses.jpg', type: 'IMAGE', size: 799540, createdAt: '2026-09-01' },
  { id: 'med-3', name: 'category-men.jpg', url: '/images/category-men.jpg', type: 'IMAGE', size: 700608, createdAt: '2026-09-01' },
  { id: 'med-4', name: 'product-craft.jpg', url: '/images/product-craft.jpg', type: 'IMAGE', size: 650290, createdAt: '2026-09-01' },
];

mediaRouter.get('/', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), (_req: Request, res: Response): void => {
  sendSuccess(res, MEDIA_LIBRARY);
});

mediaRouter.post('/upload', authenticate, (req: Request, res: Response): void => {
  const fileName = req.body.fileName || `upload_${Date.now()}.jpg`;
  const newMedia = {
    id: `med-${Date.now()}`,
    name: fileName,
    url: req.body.url || '/images/product-craft.jpg',
    type: 'IMAGE',
    size: 512000,
    createdAt: new Date().toISOString(),
  };
  MEDIA_LIBRARY.unshift(newMedia);
  sendSuccess(res, newMedia, 201);
});
