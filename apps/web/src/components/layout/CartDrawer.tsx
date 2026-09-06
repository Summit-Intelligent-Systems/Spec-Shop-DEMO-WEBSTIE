'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/store/cartStore';
import { backdropVariants, drawerRight } from '@/lib/motion/variants';

const FREE_SHIPPING_THRESHOLD = 1999;

export const CartDrawer = () => {
  const { cart, isOpen, closeCart, updateQuantity, removeItem } = useCartStore();

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const freeShippingLeft = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-obsidian-950/60 backdrop-blur-sm"
          onClick={closeCart}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            variants={drawerRight}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b border-obsidian-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-gold" />
                <h3 className="font-serif text-lg font-medium text-obsidian-900">
                  Shopping Bag ({items.reduce((acc, item) => acc + item.quantity, 0)})
                </h3>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="p-1.5 text-obsidian-400 hover:text-obsidian-900 hover:bg-obsidian-100 rounded-full transition-colors"
                aria-label="Close cart drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="bg-obsidian-50 px-5 py-3 border-b border-obsidian-100">
              <div className="text-xs text-obsidian-700 font-medium">
                {freeShippingLeft > 0 ? (
                  <>
                    Add <span className="text-gold font-bold">₹{freeShippingLeft.toLocaleString('en-IN')}</span> more to qualify for <span className="font-bold">Free Express Delivery</span>
                  </>
                ) : (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                    🎉 You&apos;ve unlocked Free Express Delivery!
                  </span>
                )}
              </div>
              <div className="w-full bg-obsidian-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-gold h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Item List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-obsidian-50 text-obsidian-300 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif text-lg font-medium text-obsidian-900">Your bag is empty</h4>
                    <p className="text-xs text-obsidian-500 max-w-xs mx-auto">
                      Explore our handcrafted collections and discover your signature silhouette.
                    </p>
                  </div>
                  <Link
                    href="/shop/eyeglasses"
                    onClick={closeCart}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-obsidian-900 hover:bg-obsidian-800 px-5 py-2.5 rounded-lg transition-colors shadow-sm"
                  >
                    Browse Frames <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 rounded-xl border border-obsidian-100 bg-white hover:border-obsidian-200 transition-all"
                  >
                    <div className="w-20 h-20 rounded-lg bg-obsidian-50 relative overflow-hidden shrink-0">
                      <Image
                        src={item.variant?.images?.[0]?.url || (item.product as any)?.images?.[0]?.url || '/images/product-craft.jpg'}
                        alt={item.product?.name || 'Frame'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-medium text-obsidian-900 truncate">
                            {item.product?.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-obsidian-400 hover:text-error-600 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-xs text-obsidian-500 mt-0.5">
                          {item.variant?.color} • {item.variant?.size}
                        </div>
                        {item.lensConfig && (
                          <div className="text-[11px] text-gold-700 bg-gold-50/80 border border-gold-200/50 px-2 py-0.5 rounded mt-1 inline-block">
                            {item.lensConfig.lensPackage} • {item.lensConfig.lensType}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-obsidian-200 rounded-md">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-1 hover:bg-obsidian-100 text-obsidian-600 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs px-2 font-medium">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-obsidian-100 text-obsidian-600 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-obsidian-900">
                          ₹{((item.unitPrice || (item as any).price || item.variant?.price || 0) * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {items.length > 0 && (
              <div className="p-5 border-t border-obsidian-100 space-y-3 bg-obsidian-50/50">
                <div className="space-y-1.5 text-xs text-obsidian-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-obsidian-900">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{freeShippingLeft === 0 ? 'FREE' : '₹99'}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-obsidian-950 pt-2 border-t border-obsidian-200">
                    <span>Total Amount</span>
                    <span className="text-gold-700">
                      ₹{(subtotal + (freeShippingLeft === 0 ? 0 : 99)).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="w-full py-3.5 px-6 rounded-xl bg-obsidian-900 hover:bg-obsidian-800 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <span>Proceed to Secure Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-obsidian-700 hover:text-obsidian-950 text-center block transition-colors"
                  >
                    View Bag Details
                  </Link>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-obsidian-500 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Secure Checkout • 14-Day Free Returns</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default CartDrawer;
