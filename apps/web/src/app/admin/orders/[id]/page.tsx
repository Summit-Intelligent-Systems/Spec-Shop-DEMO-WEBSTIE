'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  User,
  MapPin,
  CreditCard,
  Save,
} from 'lucide-react';
import { apiGet, apiPatch } from '@/lib/api';

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('PROCESSING');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('DHL Express');
  const [updating, setUpdating] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      setLoading(true);
      try {
        const res = await apiGet<any>(`/admin/orders/${orderId}`);
        const data = res.data?.data || res.data;
        if (data) {
          setOrder(data);
          setStatus(data.status || 'PROCESSING');
          setTrackingNumber(data.trackingNumber || '');
          setCarrier(data.carrier || 'BlueDart Express');
        } else {
          // Fallback mock
          setOrder({
            id: orderId,
            orderNumber: `XYZ-${orderId}`,
            status: 'PROCESSING',
            total: 7998,
            subtotal: 7998,
            tax: 0,
            shippingFee: 0,
            paymentStatus: 'SUCCESS',
            paymentMethod: 'RAZORPAY',
            createdAt: new Date().toISOString(),
            user: {
              email: 'customer@xyzeyewear.com',
              profile: { firstName: 'Sophia', lastName: 'Vane', phone: '+91 98765 43210' },
            },
            shippingAddress: {
              addressLine1: '42 Marine Drive, Apt 11B',
              city: 'Mumbai',
              state: 'Maharashtra',
              postalCode: '400020',
              country: 'India',
            },
            items: [
              {
                id: 'item-1',
                product: { name: 'The Sovereign Round', sku: 'XYZ-SOV-GLD' },
                price: 7998,
                quantity: 1,
              },
            ],
          });
        }
      } catch (err) {
        console.warn('API error, using mock order:', err);
        setOrder({
          id: orderId,
          orderNumber: `XYZ-${orderId}`,
          status: 'PROCESSING',
          total: 7998,
          subtotal: 7998,
          tax: 0,
          shippingFee: 0,
          paymentStatus: 'SUCCESS',
          paymentMethod: 'RAZORPAY',
          createdAt: new Date().toISOString(),
          user: {
            email: 'customer@xyzeyewear.com',
            profile: { firstName: 'Sophia', lastName: 'Vane', phone: '+91 98765 43210' },
          },
          shippingAddress: {
            addressLine1: '42 Marine Drive, Apt 11B',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400020',
            country: 'India',
          },
          items: [
            {
              id: 'item-1',
              product: { name: 'The Sovereign Round', sku: 'XYZ-SOV-GLD' },
              price: 7998,
              quantity: 1,
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    }

    if (orderId) loadOrder();
  }, [orderId]);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await apiPatch(`/admin/orders/${orderId}/status`, {
        status,
        trackingNumber: trackingNumber || undefined,
        carrier: carrier || undefined,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update order:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-obsidian-400">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full mx-auto mb-3" />
        Loading order details...
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="p-2.5 rounded-xl bg-obsidian-800 text-obsidian-400 hover:text-white border border-obsidian-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight font-mono">
                {order.orderNumber || `XYZ-${order.id}`}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase bg-gold/20 text-gold border border-gold/30">
                {status}
              </span>
            </div>
            <p className="text-xs text-obsidian-400 mt-1">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Updated!
            </span>
          )}
          <button
            onClick={handleUpdate}
            disabled={updating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-obsidian-950 font-medium text-sm transition-all shadow-md shadow-gold/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {updating ? 'Saving...' : 'Save Order Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Items & Totals */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-obsidian-900/60 border border-obsidian-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-obsidian-800 pb-3">
              <Package className="w-4 h-4 text-gold" />
              Order Items ({order.items?.length || 0})
            </h2>

            <div className="divide-y divide-obsidian-800/60">
              {order.items?.map((item: any) => (
                <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-white">{item.product?.name || 'Eyewear Frame'}</h3>
                    <p className="text-xs text-obsidian-400 font-mono mt-0.5">
                      SKU: {item.product?.sku || 'XYZ-ITEM'} &bull; Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-white font-mono">
                    ₹{(Number(item.price) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-obsidian-800 space-y-2 text-sm">
              <div className="flex justify-between text-obsidian-400">
                <span>Subtotal</span>
                <span>₹{Number(order.subtotal || order.total).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-obsidian-400">
                <span>Shipping</span>
                <span>{order.shippingFee ? `₹${order.shippingFee}` : 'Free Delivery'}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-obsidian-800">
                <span>Total</span>
                <span className="text-gold font-mono">₹{Number(order.total).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Fulfillment Status Management */}
          <div className="bg-obsidian-900/60 border border-obsidian-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-obsidian-800 pb-3">
              <Truck className="w-4 h-4 text-gold" />
              Fulfillment & Dispatch
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-obsidian-300 block mb-1.5 font-medium">Order Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing / Optical Lab</option>
                  <option value="SHIPPED">Shipped (In Transit)</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-obsidian-300 block mb-1.5 font-medium">Logistics Carrier</label>
                <input
                  type="text"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  placeholder="e.g. BlueDart, Delhivery, DHL"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs text-obsidian-300 block mb-1.5 font-medium">AWB / Tracking Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. BD789401201"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800 border border-obsidian-700 text-white text-sm font-mono focus:border-gold focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Delivery Info */}
        <div className="space-y-6">
          <div className="bg-obsidian-900/60 border border-obsidian-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-obsidian-800 pb-3">
              <User className="w-4 h-4 text-gold" />
              Customer
            </h2>

            <div>
              <p className="font-semibold text-white">
                {order.user?.profile?.firstName
                  ? `${order.user.profile.firstName} ${order.user.profile.lastName || ''}`
                  : 'Customer'}
              </p>
              <p className="text-xs text-obsidian-400 mt-0.5">{order.user?.email}</p>
              {order.user?.profile?.phone && (
                <p className="text-xs text-obsidian-400 mt-0.5">{order.user.profile.phone}</p>
              )}
            </div>
          </div>

          <div className="bg-obsidian-900/60 border border-obsidian-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-obsidian-800 pb-3">
              <MapPin className="w-4 h-4 text-gold" />
              Shipping Address
            </h2>

            {order.shippingAddress ? (
              <div className="text-sm text-obsidian-300 space-y-1">
                <p>{order.shippingAddress.addressLine1}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </p>
                <p className="text-xs text-obsidian-500 uppercase">{order.shippingAddress.country}</p>
              </div>
            ) : (
              <p className="text-xs text-obsidian-500">Standard Express Delivery</p>
            )}
          </div>

          <div className="bg-obsidian-900/60 border border-obsidian-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-obsidian-800 pb-3">
              <CreditCard className="w-4 h-4 text-gold" />
              Payment
            </h2>

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-obsidian-400">Method</span>
                <span className="text-white font-medium">{order.paymentMethod || 'Razorpay / UPI'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-obsidian-400">Status</span>
                <span className="text-emerald-400 font-medium">{order.paymentStatus || 'SUCCESS'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
