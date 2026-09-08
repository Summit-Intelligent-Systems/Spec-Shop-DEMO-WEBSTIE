import { Router, type Request, type Response } from 'express';
import crypto from 'crypto';
import { payment } from '../../infrastructure/payment';
import { env } from '../../config/env';
import { logger } from '../../config/logger';
import { sendSuccess } from '../../shared/utils';
import { optionalAuth } from '../../middleware/auth';

export const paymentsRouter = Router();

/**
 * POST /api/v1/payments/create-order
 * Initiates an order with the active payment driver (Razorpay / Mock)
 */
paymentsRouter.post('/create-order', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      res.status(400).json({
        success: false,
        message: 'Invalid payment amount specified.',
      });
      return;
    }

    // In Razorpay, amount is passed in smallest currency sub-unit (paise)
    // If incoming amount is in Rupees (e.g. 2999), convert to paise (299900).
    const amountInPaise = Math.round(amount * 100);

    const order = await payment.createOrder({
      amount: amountInPaise,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: {
        userId: (req as any).user?.id || 'guest',
        ...(notes || {}),
      },
    });

    const activeKeyId = env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || 'rzp_test_TZfUxWXYyuCC5e';
    sendSuccess(res, {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: activeKeyId,
      driver: env.PAYMENT_DRIVER,
      isMock: (order.gatewayData as any)?.mock === true,
    });
  } catch (error: any) {
    logger.error('Failed to create payment order:', error);
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to initialize payment gateway order.',
    });
  }
});

/**
 * POST /api/v1/payments/verify
 * Verifies the cryptographic payment signature returned by the client modal
 */
paymentsRouter.post('/verify', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { gatewayOrderId, gatewayPaymentId, signature } = req.body;

    if (!gatewayOrderId || !gatewayPaymentId) {
      res.status(400).json({
        success: false,
        message: 'Missing gateway order ID or payment ID.',
      });
      return;
    }

    const isValid = await payment.verifyPayment({
      gatewayOrderId,
      gatewayPaymentId,
      signature: signature || '',
    });

    if (!isValid) {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed. Invalid signature.',
      });
      return;
    }

    sendSuccess(res, {
      verified: true,
      gatewayOrderId,
      gatewayPaymentId,
      message: 'Payment signature verified successfully.',
    });
  } catch (error: any) {
    logger.error('Failed to verify payment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during payment verification.',
    });
  }
});

/**
 * POST /api/v1/payments/webhook
 * Handles async webhook notifications directly from Razorpay
 */
paymentsRouter.post('/webhook', async (req: Request, res: Response): Promise<void> => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const webhookSecret = env.RAZORPAY_WEBHOOK_SECRET;

    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (expectedSignature !== signature) {
        logger.warn('⚠️ Razorpay webhook signature mismatch');
        res.status(400).json({ status: 'invalid_signature' });
        return;
      }
    }

    const event = req.body.event;
    logger.info(`🔔 Received Razorpay webhook event: ${event}`, {
      payload: req.body.payload?.payment?.entity?.id || req.body.payload?.order?.entity?.id,
    });

    // Handle specific Razorpay webhook events
    switch (event) {
      case 'payment.captured':
      case 'order.paid':
        logger.info('Payment confirmed via webhook:', req.body.payload?.payment?.entity?.id);
        break;
      case 'payment.failed':
        logger.warn('Payment failed via webhook:', req.body.payload?.payment?.entity?.id);
        break;
      case 'refund.processed':
        logger.info('Refund processed via webhook:', req.body.payload?.refund?.entity?.id);
        break;
      default:
        break;
    }

    res.status(200).json({ status: 'ok' });
  } catch (error: any) {
    logger.error('Error processing Razorpay webhook:', error);
    res.status(500).json({ status: 'error' });
  }
});
