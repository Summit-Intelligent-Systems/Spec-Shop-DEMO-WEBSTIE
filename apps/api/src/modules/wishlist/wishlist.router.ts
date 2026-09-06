import { Router, type Request, type Response } from 'express';
import { optionalAuth } from '../../middleware/auth';
import { sendSuccess } from '../../shared/utils';

export const wishlistRouter = Router();

const WISHLIST_STORE: Record<string, string[]> = {};

wishlistRouter.get('/', optionalAuth, (req: Request, res: Response): void => {
  const key = req.user?.id || (req.headers['x-session-id'] as string) || 'guest';
  const itemIds = WISHLIST_STORE[key] || [];
  sendSuccess(res, { itemIds });
});

wishlistRouter.post('/toggle', optionalAuth, (req: Request, res: Response): void => {
  const key = req.user?.id || (req.headers['x-session-id'] as string) || 'guest';
  const { productId } = req.body;
  if (!WISHLIST_STORE[key]) WISHLIST_STORE[key] = [];

  const index = WISHLIST_STORE[key].indexOf(productId);
  let isWishlisted = false;
  if (index >= 0) {
    WISHLIST_STORE[key].splice(index, 1);
  } else {
    WISHLIST_STORE[key].push(productId);
    isWishlisted = true;
  }
  sendSuccess(res, { productId, isWishlisted, itemIds: WISHLIST_STORE[key] });
});
