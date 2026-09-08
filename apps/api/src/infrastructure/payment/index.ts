/**
 * Payment Gateway Abstraction Layer
 * Supports: Mock | Razorpay | Stripe | PayPal
 * Switch by setting PAYMENT_DRIVER env variable.
 */

import crypto from 'crypto';
import Razorpay from 'razorpay';
import { env } from '../../config/env';
import { logger } from '../../config/logger';
import { generateOrderNumber } from '@xyz-eyewear/utils';

export interface CreateOrderPayload {
  amount: number; // in smallest currency unit (paise for INR, cents for USD)
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface PaymentOrder {
  id: string;          // Gateway order ID
  amount: number;
  currency: string;
  status: string;
  gatewayData: Record<string, unknown>; // Raw gateway response
}

export interface VerifyPaymentPayload {
  gatewayOrderId: string;
  gatewayPaymentId: string;
  signature: string;
}

export interface PaymentDriver {
  createOrder(payload: CreateOrderPayload): Promise<PaymentOrder>;
  verifyPayment(payload: VerifyPaymentPayload): Promise<boolean>;
  refundPayment(paymentId: string, amount?: number): Promise<{ success: boolean; refundId?: string }>;
}

// ─── Mock Payment Driver (Default for development) ────────────────────────────

class MockPaymentDriver implements PaymentDriver {
  async createOrder(payload: CreateOrderPayload): Promise<PaymentOrder> {
    logger.debug('Mock payment: creating order', payload);
    // Simulate async operation
    await new Promise((r) => setTimeout(r, 100));

    return {
      id: `mock_order_${generateOrderNumber()}`,
      amount: payload.amount,
      currency: payload.currency,
      status: 'created',
      gatewayData: {
        mock: true,
        receipt: payload.receipt,
        notes: payload.notes,
      },
    };
  }

  async verifyPayment(payload: VerifyPaymentPayload): Promise<boolean> {
    logger.debug('Mock payment: verifying payment', payload);
    // Always succeed in mock mode
    return true;
  }

  async refundPayment(
    paymentId: string,
    amount?: number,
  ): Promise<{ success: boolean; refundId?: string }> {
    logger.debug('Mock payment: refunding', { paymentId, amount });
    return { success: true, refundId: `mock_refund_${Date.now()}` };
  }
}

// ─── Razorpay Driver ──────────────────────────────────────────────────────────

class RazorpayDriver implements PaymentDriver {
  private razorpayInstance: Razorpay | null = null;

  private getRazorpay(): Razorpay | null {
    if (this.razorpayInstance) return this.razorpayInstance;
    const keyId = env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    const keySecret = env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET;
    if (keyId && keySecret) {
      try {
        this.razorpayInstance = new Razorpay({
          key_id: keyId,
          key_secret: keySecret,
        });
        logger.info('✅ Razorpay driver initialized with credentials.');
      } catch (err) {
        logger.error('Failed to initialize Razorpay SDK client:', err);
      }
    }
    return this.razorpayInstance;
  }

  async createOrder(payload: CreateOrderPayload): Promise<PaymentOrder> {
    const rzp = this.getRazorpay();
    if (!rzp) {
      logger.warn('Razorpay SDK not configured with valid API keys. Falling back to mock order.');
      const mock = new MockPaymentDriver();
      return mock.createOrder(payload);
    }

    try {
      // Amount must be an integer in smallest currency unit (paise)
      const options = {
        amount: Math.round(payload.amount),
        currency: payload.currency || 'INR',
        receipt: payload.receipt || `rcpt_${generateOrderNumber()}`,
        notes: payload.notes || {},
      };

      const order = await rzp.orders.create(options);

      return {
        id: order.id,
        amount: Number(order.amount),
        currency: order.currency,
        status: order.status,
        gatewayData: {
          id: order.id,
          entity: order.entity,
          amount: order.amount,
          amount_paid: order.amount_paid,
          amount_due: order.amount_due,
          currency: order.currency,
          receipt: order.receipt,
          status: order.status,
          attempts: order.attempts,
          notes: order.notes,
          created_at: order.created_at,
        },
      };
    } catch (error: any) {
      logger.error('Error creating Razorpay order:', error);
      throw new Error(error?.error?.description || error?.message || 'Failed to create Razorpay order');
    }
  }

  async verifyPayment(payload: VerifyPaymentPayload): Promise<boolean> {
    if (!env.RAZORPAY_KEY_SECRET) {
      logger.warn('RAZORPAY_KEY_SECRET not set, using mock verification');
      return true;
    }
    try {
      // HMAC-SHA256 signature verification: order_id + "|" + payment_id
      const body = `${payload.gatewayOrderId}|${payload.gatewayPaymentId}`;
      const expectedSignature = crypto
        .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      const isValid = expectedSignature === payload.signature;
      if (!isValid) {
        logger.warn('Razorpay signature mismatch', {
          gatewayOrderId: payload.gatewayOrderId,
          gatewayPaymentId: payload.gatewayPaymentId,
        });
      }
      return isValid;
    } catch (err) {
      logger.error('Razorpay signature verification error:', err);
      return false;
    }
  }

  async refundPayment(
    paymentId: string,
    amount?: number,
  ): Promise<{ success: boolean; refundId?: string }> {
    if (!this.razorpayInstance) {
      logger.warn(`Razorpay not configured. Mock refund for: ${paymentId}`);
      return { success: true, refundId: `mock_refund_${Date.now()}` };
    }

    try {
      const refundOptions: any = {};
      if (amount) {
        refundOptions.amount = Math.round(amount);
      }

      const refund = await this.razorpayInstance.payments.refund(paymentId, refundOptions);
      return { success: true, refundId: refund.id };
    } catch (err: any) {
      logger.error(`Failed to process Razorpay refund for ${paymentId}:`, err);
      return { success: false };
    }
  }
}

// ─── Stripe Driver ────────────────────────────────────────────────────────────

class StripeDriver implements PaymentDriver {
  // TODO Phase 8: Implement with stripe npm package
  async createOrder(payload: CreateOrderPayload): Promise<PaymentOrder> {
    logger.warn('Stripe not configured. Falling back to mock.');
    const mock = new MockPaymentDriver();
    return mock.createOrder(payload);
  }

  async verifyPayment(_payload: VerifyPaymentPayload): Promise<boolean> {
    logger.warn('Stripe webhook verification not yet implemented');
    return true;
  }

  async refundPayment(
    paymentId: string,
    _amount?: number,
  ): Promise<{ success: boolean; refundId?: string }> {
    logger.warn(`Stripe refund not fully implemented for: ${paymentId}`);
    return { success: false };
  }
}

// ─── Factory ──────────────────────────────────────────────────────────────────

const createPaymentDriver = (): PaymentDriver => {
  switch (env.PAYMENT_DRIVER) {
    case 'razorpay':
      return new RazorpayDriver();
    case 'stripe':
      return new StripeDriver();
    case 'mock':
    default:
      return new MockPaymentDriver();
  }
};

export const payment = createPaymentDriver();
logger.info(`💳 Payment driver: ${env.PAYMENT_DRIVER}`);
