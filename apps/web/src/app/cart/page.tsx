'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  Check,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore } from '@/lib/store/cartStore';

export default function CartPage() {
  const { cart, removeItem, updateQuantity, clearCart } = useCartStore();
  const [couponInput, setCouponInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponCode, setCouponCode] = useState<string>('');

  const items = cart?.items || [];
  const subtotal = items.reduce(
    (sum, item) => sum + (item.unitPrice || item.variant?.price || 0) * item.quantity,
    0,
  );

  const shippingCharge = subtotal >= 1999 || subtotal === 0 ? 0 : 199;
  const grandTotal = Math.max(0, subtotal - appliedDiscount + shippingCharge);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'WELCOME10') {
      const discount = Math.round(subtotal * 0.1);
      setAppliedDiscount(discount);
      setCouponCode(code);
      toast.success('Coupon WELCOME10 applied: 10% Off!');
    } else if (code === 'GOLD500') {
      const discount = 500;
      setAppliedDiscount(discount);
      setCouponCode(code);
      toast.success('Coupon GOLD500 applied: ₹500 Off!');
    } else {
      toast.error('Invalid coupon code. Try WELCOME10 or GOLD500');
    }
  };

  const removeCoupon = () => {
    setAppliedDiscount(0);
    setCouponCode('');
    setCouponInput('');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-obsidian-50 border border-obsidian-200 flex items-center justify-center text-obsidian-400 mb-6">
          <ShoppingBag className="w-8 h-8 text-gold" />
        </div>
        <h1 className="font-serif text-3xl font-medium text-obsidian-950 mb-2">
          Your Optical Bag is Empty
        </h1>
        <p className="text-xs text-obsidian-500 max-w-md mb-8">
          Explore our handcrafted collections of eyeglasses, titanium frames, and polarized sunglasses.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-obsidian-950 hover:bg-obsidian-800 text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all"
        >
          <span>Explore Optical Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian-50/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-obsidian-400 mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-obsidian-800">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-obsidian-900 font-medium">Shopping Bag ({items.length} items)</span>
        </nav>

        <h1 className="font-serif text-3xl sm:text-4xl text-obsidian-950 font-normal mb-8">
          Your Shopping Bag
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Itemized List (Col 8) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Shipping Progress Indicator */}
            <div className="p-4 bg-white rounded-2xl border border-obsidian-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-obsidian-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                  <span>
                    {subtotal >= 1999
                      ? 'Congratulations! You unlocked Free Insured Express Delivery'
                      : `Add ₹${(1999 - subtotal).toLocaleString('en-IN')} more to unlock Free Insured Shipping`}
                  </span>
                </span>
                <span className="font-bold text-gold-700">
                  {Math.min(100, Math.round((subtotal / 1999) * 100))}%
                </span>
              </div>
              <div className="h-1.5 bg-obsidian-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (subtotal / 1999) * 100)}%` }}
                />
              </div>
            </div>

            {/* Cart Items */}
            <div className="bg-white rounded-3xl border border-obsidian-200 divide-y divide-obsidian-100 overflow-hidden shadow-sm">
              {items.map((item) => (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  {/* Thumbnail */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-obsidian-50 border border-obsidian-100 relative shrink-0 overflow-hidden">
                    <Image
                      src={
                        item.variant?.images?.[0]?.url ||
                        (item.product as any)?.images?.[0]?.url ||
                        '/images/product-craft.jpg'
                      }
                      alt={item.product?.name || 'Frame'}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-serif text-lg font-medium text-obsidian-950">
                          {item.product?.name}
                        </h3>
                        <div className="text-xs text-obsidian-500 mt-0.5">
                          Colorway: <strong>{item.variant?.color}</strong> • Size: <strong>{item.variant?.size}</strong>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-obsidian-400 hover:text-error-600 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Lens Config Tag */}
                    {item.lensConfig && (
                      <div className="p-2.5 rounded-xl bg-gold/5 border border-gold/20 text-xs text-obsidian-700 space-y-1">
                        <div className="flex items-center justify-between font-semibold text-obsidian-950">
                          <span className="flex items-center gap-1.5 text-gold-800">
                            <Eye className="w-3.5 h-3.5 text-gold-600" />
                            <span>{item.lensConfig.lensType}</span>
                          </span>
                          <span>+₹{item.lensConfig.price.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="text-[11px] text-obsidian-500">
                          {item.lensConfig.lensPackage}
                        </div>
                        {item.lensConfig.prescriptionData && (
                          <div className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded inline-block">
                            Method: {item.lensConfig.prescriptionData.type === 'later' ? 'Submit Post-Order via WhatsApp' : item.lensConfig.prescriptionData.type}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Quantity & Item Subtotal */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-obsidian-200 rounded-xl bg-obsidian-50">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-2 hover:bg-obsidian-100 text-obsidian-600 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs px-3 font-semibold text-obsidian-950">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-obsidian-100 text-obsidian-600 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-serif text-lg font-bold text-obsidian-950">
                        ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link
                href="/shop"
                className="text-xs font-semibold text-obsidian-600 hover:text-obsidian-950 flex items-center gap-1.5"
              >
                <span>Continue Shopping</span>
              </Link>
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-obsidian-400 hover:text-error-600 transition-colors"
              >
                Clear Bag
              </button>
            </div>
          </div>

          {/* Order Summary & Checkout (Col 4) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Promo Code Card */}
            <div className="bg-white rounded-3xl p-6 border border-obsidian-200 shadow-sm space-y-4">
              <h3 className="font-serif text-base font-medium text-obsidian-950 flex items-center gap-2">
                <Tag className="w-4 h-4 text-gold" />
                <span>Promotion & Gift Cards</span>
              </h3>

              {couponCode ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{couponCode} (-₹{appliedDiscount.toLocaleString('en-IN')})</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-emerald-700 hover:text-emerald-950 text-xs underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter WELCOME10"
                    className="flex-1 text-xs p-3 rounded-xl border border-obsidian-200 uppercase tracking-wider font-mono focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                  <button
                    type="submit"
                    className="px-4 py-3 rounded-xl bg-obsidian-950 hover:bg-obsidian-800 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Price Summary Breakdown */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-obsidian-200 shadow-sm space-y-6">
              <h3 className="font-serif text-xl font-medium text-obsidian-950 border-b border-obsidian-100 pb-4">
                Order Summary
              </h3>

              <div className="space-y-3 text-xs text-obsidian-600">
                <div className="flex justify-between">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-medium text-obsidian-950">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Promotional Discount</span>
                    <span className="font-medium">-₹{appliedDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Insured Express Shipping</span>
                  <span className="font-medium text-obsidian-950">
                    {shippingCharge === 0 ? (
                      <strong className="text-emerald-700 uppercase tracking-wider text-[11px]">
                        Complimentary
                      </strong>
                    ) : (
                      `₹${shippingCharge}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Applicable GST & Optical Taxes</span>
                  <span className="font-medium text-obsidian-950">Included</span>
                </div>

                <div className="pt-4 border-t border-obsidian-100 flex justify-between items-baseline text-sm">
                  <span className="font-serif text-lg font-medium text-obsidian-950">
                    Total
                  </span>
                  <span className="font-serif text-2xl font-bold text-obsidian-950">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="w-full py-4 rounded-2xl bg-obsidian-950 hover:bg-obsidian-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4 text-gold" />
              </Link>

              {/* Trust Pillars */}
              <div className="space-y-2 pt-2 text-[11px] text-obsidian-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                  <span>256-Bit Bank Grade SSL Encrypted Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                  <span>14-Day Free Doorstep Return & Lens Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
