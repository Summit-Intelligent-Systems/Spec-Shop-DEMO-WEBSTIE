import { Router, type Request, type Response } from 'express';
import { optionalAuth } from '../../middleware/auth';
import { sendSuccess } from '../../shared/utils';

export const reviewsRouter = Router();

const REVIEWS_STORE: any[] = [
  {
    id: 'rev-1',
    productId: 'prod-001',
    author: 'Vikramaditya S.',
    rating: 5,
    title: 'The craftsmanship rivals my Japanese Oliver Peoples frames',
    comment: 'The beveling on the acetate and the titanium core wire filigree is stunning.',
    fitAssessment: 'True to Size',
    helpfulCount: 24,
    isVerified: true,
    createdAt: '2026-08-10T12:00:00.000Z',
  },
  {
    id: 'rev-2',
    productId: 'prod-001',
    author: 'Ananya M.',
    rating: 5,
    title: 'Featherweight comfort and flawless design',
    comment: 'I wear these 12+ hours daily in front of monitors. Zero pressure behind the ears.',
    fitAssessment: 'True to Size',
    helpfulCount: 18,
    isVerified: true,
    createdAt: '2026-08-18T15:30:00.000Z',
  },
];

reviewsRouter.get('/product/:productId', (req: Request, res: Response): void => {
  const { productId } = req.params;
  const list = REVIEWS_STORE.filter((r) => r.productId === productId || !productId);
  sendSuccess(res, list);
});

reviewsRouter.post('/', optionalAuth, (req: Request, res: Response): void => {
  const data = req.body;
  const newRev = {
    id: `rev-${Date.now()}`,
    productId: data.productId || 'prod-001',
    author: data.author || req.user?.email || 'Verified Owner',
    rating: Number(data.rating) || 5,
    title: data.title || 'Exceptional Eyewear',
    comment: data.comment || '',
    fitAssessment: data.fitAssessment || 'True to Size',
    helpfulCount: 0,
    isVerified: true,
    createdAt: new Date().toISOString(),
  };

  REVIEWS_STORE.unshift(newRev);
  sendSuccess(res, newRev, 201);
});

reviewsRouter.post('/:id/helpful', (req: Request, res: Response): void => {
  const { id } = req.params;
  const rev = REVIEWS_STORE.find((r) => r.id === id);
  if (rev) rev.helpfulCount += 1;
  sendSuccess(res, rev);
});
