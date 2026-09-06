import { Router, type Request, type Response } from 'express';
import { optionalAuth } from '../../middleware/auth';
import { sendSuccess } from '../../shared/utils';

export const cartRouter = Router();

// In-memory session cart store
const SESSION_CARTS: Record<string, any> = {};

const getOrCreateCart = (sessionId: string, userId?: string) => {
  const key = userId || sessionId || 'guest_cart';
  if (!SESSION_CARTS[key]) {
    SESSION_CARTS[key] = {
      id: `cart_${Date.now()}`,
      items: [],
      subtotal: 0,
      discount: 0,
      shippingCharge: 0,
      total: 0,
      itemCount: 0,
    };
  }
  return SESSION_CARTS[key];
};

const recalculateCart = (cart: any) => {
  const subtotal = cart.items.reduce(
    (sum: number, item: any) => sum + item.unitPrice * item.quantity,
    0,
  );
  cart.subtotal = subtotal;
  cart.itemCount = cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
  cart.shippingCharge = subtotal >= 1999 || subtotal === 0 ? 0 : 199;
  cart.total = Math.max(0, subtotal - cart.discount + cart.shippingCharge);
};

cartRouter.get('/', optionalAuth, (req: Request, res: Response): void => {
  const sessionId = (req.headers['x-session-id'] as string) || 'guest_session';
  const cart = getOrCreateCart(sessionId, req.user?.id);
  sendSuccess(res, cart);
});

cartRouter.post('/items', optionalAuth, (req: Request, res: Response): void => {
  const sessionId = (req.headers['x-session-id'] as string) || 'guest_session';
  const cart = getOrCreateCart(sessionId, req.user?.id);
  const { productId, product, variantId, variant, quantity = 1, lensConfig } = req.body;

  const unitPrice = Number(variant?.price || product?.price || 3499) + (lensConfig?.price || 0);

  const existingIndex = cart.items.findIndex(
    (i: any) =>
      i.variantId === variantId &&
      JSON.stringify(i.lensConfig) === JSON.stringify(lensConfig),
  );

  if (existingIndex >= 0) {
    cart.items[existingIndex].quantity += quantity;
    cart.items[existingIndex].totalPrice = cart.items[existingIndex].unitPrice * cart.items[existingIndex].quantity;
  } else {
    cart.items.push({
      id: `item_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      productId,
      product: product || { name: 'Optical Frame', price: unitPrice },
      variantId,
      variant: variant || { color: 'Standard', price: unitPrice },
      quantity,
      unitPrice,
      totalPrice: unitPrice * quantity,
      lensConfig,
    });
  }

  recalculateCart(cart);
  sendSuccess(res, cart, 201);
});

cartRouter.patch('/items/:id', optionalAuth, (req: Request, res: Response): void => {
  const sessionId = (req.headers['x-session-id'] as string) || 'guest_session';
  const cart = getOrCreateCart(sessionId, req.user?.id);
  const { id } = req.params;
  const { quantity } = req.body;

  const item = cart.items.find((i: any) => i.id === id);
  if (item) {
    if (quantity <= 0) {
      cart.items = cart.items.filter((i: any) => i.id !== id);
    } else {
      item.quantity = quantity;
      item.totalPrice = item.unitPrice * quantity;
    }
    recalculateCart(cart);
  }

  sendSuccess(res, cart);
});

cartRouter.delete('/items/:id', optionalAuth, (req: Request, res: Response): void => {
  const sessionId = (req.headers['x-session-id'] as string) || 'guest_session';
  const cart = getOrCreateCart(sessionId, req.user?.id);
  const { id } = req.params;

  cart.items = cart.items.filter((i: any) => i.id !== id);
  recalculateCart(cart);
  sendSuccess(res, cart);
});

cartRouter.post('/coupon', optionalAuth, (req: Request, res: Response): void => {
  const sessionId = (req.headers['x-session-id'] as string) || 'guest_session';
  const cart = getOrCreateCart(sessionId, req.user?.id);
  const { code } = req.body;

  if (code === 'WELCOME10') {
    cart.couponCode = code;
    cart.discount = Math.round(cart.subtotal * 0.1);
  } else if (code === 'GOLD500') {
    cart.couponCode = code;
    cart.discount = 500;
  } else {
    cart.couponCode = undefined;
    cart.discount = 0;
  }

  recalculateCart(cart);
  sendSuccess(res, cart);
});

cartRouter.delete('/', optionalAuth, (req: Request, res: Response): void => {
  const sessionId = (req.headers['x-session-id'] as string) || 'guest_session';
  const key = req.user?.id || sessionId || 'guest_cart';
  delete SESSION_CARTS[key];
  sendSuccess(res, { message: 'Cart cleared' });
});
