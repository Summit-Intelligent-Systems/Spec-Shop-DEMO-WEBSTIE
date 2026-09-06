'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Glasses, Camera, CalendarCheck, MapPin, User, Phone, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useUIStore } from '@/lib/store/uiStore';
import { backdropVariants, drawerLeft } from '@/lib/motion/variants';

export const MobileNav = () => {
  const { isMobileNavOpen, closeMobileNav, openAuthModal } = useUIStore();
  const [expandedSection, setExpandedSection] = useState<string | null>('eyeglasses');

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  if (!isMobileNavOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
        {/* Backdrop */}
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-obsidian-950/60 backdrop-blur-sm"
          onClick={closeMobileNav}
        />

        <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
          <motion.div
            variants={drawerLeft}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-screen max-w-xs bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b border-obsidian-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold tracking-widest text-obsidian-900">
                  XYZ
                </span>
                <span className="text-[10px] uppercase font-semibold text-gold tracking-widest">
                  Eyewear
                </span>
              </div>
              <button
                type="button"
                onClick={closeMobileNav}
                className="p-1.5 text-obsidian-400 hover:text-obsidian-900 rounded-full"
                aria-label="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Category 1: Eyeglasses */}
              <div className="border-b border-obsidian-100 pb-3">
                <button
                  type="button"
                  onClick={() => toggleSection('eyeglasses')}
                  className="w-full flex items-center justify-between py-2 text-sm font-semibold text-obsidian-900 uppercase tracking-wider"
                >
                  <span>Eyeglasses</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${expandedSection === 'eyeglasses' ? 'rotate-180 text-gold' : 'text-obsidian-400'}`}
                  />
                </button>
                {expandedSection === 'eyeglasses' && (
                  <div className="pl-3 py-2 space-y-2 text-sm">
                    <Link
                      href="/shop/eyeglasses?gender=MEN"
                      onClick={closeMobileNav}
                      className="block text-obsidian-600 hover:text-gold"
                    >
                      Men&apos;s Eyeglasses
                    </Link>
                    <Link
                      href="/shop/eyeglasses?gender=WOMEN"
                      onClick={closeMobileNav}
                      className="block text-obsidian-600 hover:text-gold"
                    >
                      Women&apos;s Eyeglasses
                    </Link>
                    <Link
                      href="/shop/eyeglasses?gender=UNISEX"
                      onClick={closeMobileNav}
                      className="block text-obsidian-600 hover:text-gold"
                    >
                      Unisex Eyeglasses
                    </Link>
                    <Link
                      href="/shop/eyeglasses?shape=ROUND"
                      onClick={closeMobileNav}
                      className="block text-obsidian-600 hover:text-gold"
                    >
                      Round Acetate Frames
                    </Link>
                    <Link
                      href="/shop/eyeglasses?material=TITANIUM"
                      onClick={closeMobileNav}
                      className="block text-gold-700 font-medium"
                    >
                      Pure Titanium Series ✨
                    </Link>
                  </div>
                )}
              </div>

              {/* Category 2: Sunglasses */}
              <div className="border-b border-obsidian-100 pb-3">
                <button
                  type="button"
                  onClick={() => toggleSection('sunglasses')}
                  className="w-full flex items-center justify-between py-2 text-sm font-semibold text-obsidian-900 uppercase tracking-wider"
                >
                  <span>Sunglasses</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${expandedSection === 'sunglasses' ? 'rotate-180 text-gold' : 'text-obsidian-400'}`}
                  />
                </button>
                {expandedSection === 'sunglasses' && (
                  <div className="pl-3 py-2 space-y-2 text-sm">
                    <Link
                      href="/shop/sunglasses?type=polarized"
                      onClick={closeMobileNav}
                      className="block text-obsidian-600 hover:text-gold font-medium"
                    >
                      Polarized UV400 Sun
                    </Link>
                    <Link
                      href="/shop/sunglasses?gender=MEN"
                      onClick={closeMobileNav}
                      className="block text-obsidian-600 hover:text-gold"
                    >
                      Men&apos;s Sunglasses
                    </Link>
                    <Link
                      href="/shop/sunglasses?gender=WOMEN"
                      onClick={closeMobileNav}
                      className="block text-obsidian-600 hover:text-gold"
                    >
                      Women&apos;s Sunglasses
                    </Link>
                    <Link
                      href="/shop/sunglasses?shape=AVIATOR"
                      onClick={closeMobileNav}
                      className="block text-obsidian-600 hover:text-gold"
                    >
                      Aviator Classics
                    </Link>
                  </div>
                )}
              </div>

              {/* Quick Links */}
              <div className="space-y-3 pt-2">
                <Link
                  href="/try-on"
                  onClick={closeMobileNav}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gold/10 text-gold-800 font-medium text-sm"
                >
                  <Camera className="w-4 h-4 text-gold" />
                  <span>3D Virtual Try-On</span>
                </Link>

                <Link
                  href="/book-eye-test"
                  onClick={closeMobileNav}
                  className="flex items-center gap-3 p-3 rounded-xl bg-obsidian-50 text-obsidian-800 font-medium text-sm hover:bg-obsidian-100"
                >
                  <CalendarCheck className="w-4 h-4 text-gold" />
                  <span>Book Free Eye Test</span>
                </Link>

                <Link
                  href="/stores"
                  onClick={closeMobileNav}
                  className="flex items-center gap-3 p-3 rounded-xl bg-obsidian-50 text-obsidian-800 font-medium text-sm hover:bg-obsidian-100"
                >
                  <MapPin className="w-4 h-4 text-gold" />
                  <span>Find Flagship Stores</span>
                </Link>

                <Link
                  href="/face-shape-guide"
                  onClick={closeMobileNav}
                  className="flex items-center gap-3 p-3 rounded-xl bg-obsidian-50 text-obsidian-800 font-medium text-sm hover:bg-obsidian-100"
                >
                  <Glasses className="w-4 h-4 text-gold" />
                  <span>Face Shape Guide</span>
                </Link>
              </div>
            </div>

            {/* Footer Account & Support */}
            <div className="p-5 border-t border-obsidian-100 bg-obsidian-50/70 space-y-3">
              <button
                type="button"
                onClick={() => {
                  closeMobileNav();
                  openAuthModal('login');
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-obsidian-900 text-white rounded-lg text-xs font-semibold uppercase tracking-wider"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
              </button>

              <div className="flex items-center justify-between text-[11px] text-obsidian-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-gold" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>100% Certified</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default MobileNav;
