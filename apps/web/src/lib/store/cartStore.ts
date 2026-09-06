import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Cart, CartItem, Product, ProductVariant } from '@xyz-eyewear/types';

interface CartStore {
  // State
  cart: Cart | null;
  isOpen: boolean;
  isLoading: boolean;

  // Actions
  setCart: (cart: Cart) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Item management (optimistic UI — synced with API in Phase 8)
  addItem: (
    product: Product,
    variant: ProductVariant,
    quantity?: number,
    lensConfig?: CartItem['lensConfig'],
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;

  // Coupon
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;

  // Computed
  getItemCount: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    immer((set, get) => ({
      cart: null,
      isOpen: false,
      isLoading: false,

      setCart: (cart) => set({ cart }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product, variant, quantity = 1, lensConfig) => {
        set((state) => {
          if (!state.cart) {
            // Initialize guest cart
            state.cart = {
              id: `local_${Date.now()}`,
              items: [],
              subtotal: 0,
              discount: 0,
              shippingCharge: 0,
              tax: 0,
              total: 0,
              itemCount: 0,
            };
          }

          const unitPrice = Number(variant.price) + (lensConfig?.price ?? 0);
          const existingIndex = state.cart.items.findIndex(
            (item: CartItem) =>
              item.variantId === variant.id &&
              JSON.stringify(item.lensConfig) === JSON.stringify(lensConfig),
          );

          if (existingIndex >= 0) {
            state.cart.items[existingIndex].quantity += quantity;
            state.cart.items[existingIndex].totalPrice =
              state.cart.items[existingIndex].unitPrice * state.cart.items[existingIndex].quantity;
          } else {
            state.cart.items.push({
              id: `local_item_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
              cartId: state.cart.id,
              productId: product.id,
              product,
              variantId: variant.id,
              variant,
              quantity,
              unitPrice,
              totalPrice: unitPrice * quantity,
              lensConfig,
            });
          }

          // Recalculate totals
          const subtotal = state.cart.items.reduce(
            (sum: number, item: CartItem) => sum + item.unitPrice * item.quantity,
            0,
          );
          state.cart.subtotal = subtotal;
          state.cart.itemCount = state.cart.items.reduce(
            (sum: number, item: CartItem) => sum + item.quantity,
            0,
          );
          state.cart.total = Math.max(0, subtotal - (state.cart.discount || 0));
        });
        get().openCart();
      },

      removeItem: (itemId) => {
        set((state) => {
          if (!state.cart) return;
          state.cart.items = state.cart.items.filter((item: CartItem) => item.id !== itemId);
          state.cart.itemCount = state.cart.items.reduce(
            (sum: number, item: CartItem) => sum + item.quantity,
            0,
          );
          state.cart.subtotal = state.cart.items.reduce(
            (sum: number, item: CartItem) => sum + Number(item.variant.price) * item.quantity,
            0,
          );
          state.cart.total = state.cart.subtotal;
        });
      },

      updateQuantity: (itemId, quantity) => {
        set((state) => {
          if (!state.cart) return;
          const item = state.cart.items.find((i: CartItem) => i.id === itemId);
          if (item) {
            if (quantity <= 0) {
              state.cart.items = state.cart.items.filter((i: CartItem) => i.id !== itemId);
            } else {
              item.quantity = quantity;
              item.totalPrice = Number(item.unitPrice) * quantity;
            }
            state.cart.itemCount = state.cart.items.reduce(
              (sum: number, i: CartItem) => sum + i.quantity,
              0,
            );
            state.cart.subtotal = state.cart.items.reduce(
              (sum: number, i: CartItem) => sum + Number(i.unitPrice) * i.quantity,
              0,
            );
            state.cart.total = state.cart.subtotal;
          }
        });
      },

      clearCart: () => set({ cart: null }),

      applyCoupon: (_code) => {
        // Phase 8: Connect to coupon validation API
        set((state) => {
          if (state.cart) state.cart.couponCode = _code;
        });
      },

      removeCoupon: () => {
        set((state) => {
          if (state.cart) {
            state.cart.couponCode = undefined;
            state.cart.appliedCoupon = undefined;
            state.cart.discount = 0;
          }
        });
      },

      getItemCount: () => get().cart?.itemCount ?? 0,
      getSubtotal: () => get().cart?.subtotal ?? 0,
    })),
    {
      name: 'xyz-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cart: state.cart }),
    },
  ),
);
