/**
 * Payment Gateway Abstraction Layer
 * Supports: Mock | Razorpay | Stripe | PayPal
 * Switch by setting PAYMENT_DRIVER env variable.
 */

import crypto from 'crypto';
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
  // TODO Phase 8: Implement with razorpay npm package
  async createOrder(payload: CreateOrderPayload): Promise<PaymentOrder> {
    logger.warn('Razorpay not configured. Falling back to mock.');
    const mock = new MockPaymentDriver();
    return mock.createOrder(payload);
  }

  async verifyPayment(payload: VerifyPaymentPayload): Promise<boolean> {
    if (!env.RAZORPAY_KEY_SECRET) {
      logger.warn('RAZORPAY_KEY_SECRET not set, using mock verification');
      return true;
    }
    // HMAC-SHA256 signature verification
    const generated = crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
      .update(`${payload.gatewayOrderId}|${payload.gatewayPaymentId}`)
      .digest('hex');
    return generated === payload.signature;
  }

  async refundPayment(
    paymentId: string,
    _amount?: number,
  ): Promise<{ success: boolean; refundId?: string }> {
    logger.warn(`Razorpay refund not fully implemented for: ${paymentId}`);
    return { success: false };
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
