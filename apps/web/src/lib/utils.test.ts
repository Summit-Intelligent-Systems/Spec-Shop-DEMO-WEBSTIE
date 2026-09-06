import { describe, it, expect } from 'vitest';
import { cn } from './utils';
import { useCartStore } from './store/cartStore';
import { useUIStore } from './store/uiStore';

describe('Web Utils - cn() helper', () => {
  it('should merge classes correctly', () => {
    const result = cn('bg-red-500', 'text-white');
    expect(result).toBe('bg-red-500 text-white');
  });

  it('should resolve conflicting Tailwind classes favoring the latter', () => {
    const result = cn('p-4', 'p-8');
    expect(result).toBe('p-8');
  });

  it('should handle conditionals and falsy values', () => {
    const isActive = false;
    const isPrimary = true;
    const result = cn(
      'base-class',
      isActive && 'active-class',
      isPrimary && 'primary-class',
      null,
      undefined,
    );
    expect(result).toBe('base-class primary-class');
  });
});

describe('Web Store - UI Store', () => {
  it('should toggle and set filter drawer state', () => {
    const store = useUIStore.getState();
    expect(store.isFilterDrawerOpen).toBe(false);

    store.openFilterDrawer();
    expect(useUIStore.getState().isFilterDrawerOpen).toBe(true);

    store.closeFilterDrawer();
    expect(useUIStore.getState().isFilterDrawerOpen).toBe(false);
  });
});

describe('Web Store - Cart Store', () => {
  it('should start with an empty cart and open/close functionality', () => {
    const cart = useCartStore.getState();
    expect(cart.cart).toBeNull();
    expect(cart.getItemCount()).toBe(0);
    expect(cart.getSubtotal()).toBe(0);
    expect(cart.isOpen).toBe(false);

    cart.openCart();
    expect(useCartStore.getState().isOpen).toBe(true);

    cart.closeCart();
    expect(useCartStore.getState().isOpen).toBe(false);
  });
});
