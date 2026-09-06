import { Router, type Request, type Response } from 'express';
import { sendSuccess } from '../../shared/utils';

export const couponsRouter = Router();

const COUPONS = [
  { code: 'WELCOME10', type: 'PERCENTAGE', value: 10, minOrderAmount: 0, description: '10% off on your inaugural order' },
  { code: 'GOLD500', type: 'FIXED', value: 500, minOrderAmount: 2999, description: '₹500 off on luxury orders over ₹2,999' },
  { code: 'TITANIUM15', type: 'PERCENTAGE', value: 15, minOrderAmount: 4000, description: '15% off titanium silhouettes' },
];

couponsRouter.get('/', (_req: Request, res: Response): void => {
  sendSuccess(res, COUPONS);
});

couponsRouter.post('/validate', (req: Request, res: Response): void => {
  const { code, cartAmount = 0 } = req.body;
  const found = COUPONS.find((c) => c.code.toUpperCase() === String(code).trim().toUpperCase());

  if (!found) {
    res.status(400).json({ success: false, message: 'Invalid or expired promotion code' });
    return;
  }

  if (cartAmount < found.minOrderAmount) {
    res.status(400).json({
      success: false,
      message: `Minimum bag value of ₹${found.minOrderAmount} required for this voucher`,
    });
    return;
  }

  const discount = found.type === 'PERCENTAGE' ? Math.round((cartAmount * found.value) / 100) : found.value;

  sendSuccess(res, {
    valid: true,
    code: found.code,
    discount,
    description: found.description,
  });
});
