'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Heart, User, Menu, Camera, ChevronDown } from 'lucide-react';
import { useUIStore } from '@/lib/store/uiStore';
import { useCartStore } from '@/lib/store/cartStore';
import { MegaMenu } from './MegaMenu';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const { openMobileNav, openSearch, openAuthModal } = useUIStore();
  const { openCart, getItemCount } = useCartStore();

  const cartCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-obsidian-100 py-3.5'
          : 'bg-white/90 backdrop-blur-sm border-b border-obsidian-100/60 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Mobile hamburger & desktop main nav */}
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={openMobileNav}
              className="p-2 -ml-2 text-obsidian-800 hover:text-gold lg:hidden transition-colors"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-obsidian-800">
              <div
                className="relative py-2"
                onMouseEnter={() => setActiveMenu('eyeglasses')}
              >
                <Link
                  href="/shop/eyeglasses"
                  className="flex items-center gap-1 hover:text-gold transition-colors"
                >
                  <span>Eyeglasses</span>
                  <ChevronDown className="w-3.5 h-3.5 text-obsidian-400 group-hover:text-gold" />
                </Link>
              </div>

              <div
                className="relative py-2"
                onMouseEnter={() => setActiveMenu('sunglasses')}
              >
                <Link
                  href="/shop/sunglasses"
                  className="flex items-center gap-1 hover:text-gold transition-colors"
                >
                  <span>Sunglasses</span>
                  <ChevronDown className="w-3.5 h-3.5 text-obsidian-400" />
                </Link>
              </div>

              <Link
                href="/shop/screen-glasses"
                onMouseEnter={() => setActiveMenu(null)}
                className="hover:text-gold transition-colors py-2 flex items-center gap-1.5"
              >
                <span>Screen & Gaming</span>
                <span className="text-[9px] bg-gold/15 text-gold-800 px-1.5 py-0.5 rounded font-bold">
                  Blue Filter
                </span>
              </Link>

              <div
                className="relative py-2"
                onMouseEnter={() => setActiveMenu('services')}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 hover:text-gold transition-colors"
                >
                  <span>Eye Care & Try-On</span>
                  <ChevronDown className="w-3.5 h-3.5 text-obsidian-400" />
                </button>
              </div>
            </nav>
          </div>

          {/* Center: Brand Identity */}
          <div className="flex-1 lg:flex-initial text-center lg:text-left">
            <Link href="/" className="inline-block group">
              <div className="flex flex-col items-center">
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.25em] text-obsidian-950 group-hover:text-gold transition-colors">
                  XYZ
                </span>
                <span className="text-[8px] sm:text-[9px] font-sans uppercase tracking-[0.4em] text-gold-700 font-medium -mt-1">
                  E Y E W E A R
                </span>
              </div>
            </Link>
          </div>

          {/* Right: Quick Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Try-On Button */}
            <Link
              href="/try-on"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-obsidian-900 bg-obsidian-50 hover:bg-gold/15 hover:text-gold-900 px-3.5 py-2 rounded-full border border-obsidian-200 transition-all"
            >
              <Camera className="w-3.5 h-3.5 text-gold" />
              <span>Virtual Try-On</span>
            </Link>

            {/* Search Trigger */}
            <button
              type="button"
              onClick={openSearch}
              className="p-2 text-obsidian-700 hover:text-gold hover:bg-obsidian-50 rounded-full transition-colors"
              aria-label="Search catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              className="p-2 text-obsidian-700 hover:text-gold hover:bg-obsidian-50 rounded-full transition-colors hidden sm:inline-flex relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* User Account */}
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="p-2 text-obsidian-700 hover:text-gold hover:bg-obsidian-50 rounded-full transition-colors"
              aria-label="Account sign in"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Shopping Bag / Cart */}
            <button
              type="button"
              onClick={openCart}
              className="p-2 text-obsidian-900 hover:text-gold hover:bg-obsidian-50 rounded-full transition-colors relative"
              aria-label={`Cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold text-obsidian-950 font-bold text-[10px] flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Render Active MegaMenu */}
      {activeMenu && (
        <MegaMenu
          activeMenu={activeMenu}
          onClose={() => setActiveMenu(null)}
        />
      )}
    </header>
  );
};

export default Header;
