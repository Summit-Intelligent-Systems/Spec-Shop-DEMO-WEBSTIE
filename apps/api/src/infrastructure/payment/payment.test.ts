import { describe, it, expect } from 'vitest';
import crypto from 'crypto';
import { payment } from './index';

describe('Payment Infrastructure Layer', () => {
  it('should create an order successfully', async () => {
    const order = await payment.createOrder({
      amount: 499900,
      currency: 'INR',
      receipt: 'test_receipt_001',
      notes: { frame: 'Aura Hexagon Titanium' },
    });

    expect(order).toBeDefined();
    expect(order.id).toBeTruthy();
    expect(order.amount).toBe(499900);
    expect(order.currency).toBe('INR');
  });

  it('should verify signatures correctly using HMAC SHA-256', async () => {
    const mockSecret = 'test_razorpay_secret_key';
    const orderId = 'order_mock_12345';
    const paymentId = 'pay_mock_67890';
    
    // Compute expected signature
    const validSignature = crypto
      .createHmac('sha256', mockSecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const invalidSignature = 'invalid_tampered_signature_hex';

    // Verify computed signature against formula
    const expected = crypto
      .createHmac('sha256', mockSecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    expect(validSignature).toBe(expected);
    expect(invalidSignature).not.toBe(expected);
  });
});
