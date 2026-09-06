'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Camera, Glasses } from 'lucide-react';
import { megaMenuVariant } from '@/lib/motion/variants';

interface MegaMenuProps {
  activeMenu: string;
  onClose: () => void;
}

export const MegaMenu = ({ activeMenu, onClose }: MegaMenuProps) => {
  return (
    <motion.div
      variants={megaMenuVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-obsidian-200/80 shadow-2xl z-50 overflow-hidden"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeMenu === 'eyeglasses' && (
          <div className="grid grid-cols-12 gap-8">
            {/* Column 1: Gender */}
            <div className="col-span-3 space-y-4 border-r border-obsidian-100 pr-6">
              <h3 className="text-xs font-semibold tracking-wider text-gold-700 uppercase">
                Shop by Gender
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/shop/eyeglasses?gender=MEN"
                    onClick={onClose}
                    className="text-obsidian-800 hover:text-gold-600 transition-colors block font-medium"
                  >
                    Men&apos;s Eyeglasses
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop/eyeglasses?gender=WOMEN"
                    onClick={onClose}
                    className="text-obsidian-800 hover:text-gold-600 transition-colors block font-medium"
                  >
                    Women&apos;s Eyeglasses
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop/eyeglasses?gender=UNISEX"
                    onClick={onClose}
                    className="text-obsidian-800 hover:text-gold-600 transition-colors block font-medium"
                  >
                    Unisex Eyeglasses
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop/eyeglasses?collection=titanium"
                    onClick={onClose}
                    className="text-obsidian-800 hover:text-gold-600 transition-colors block font-medium flex items-center gap-1.5"
                  >
                    Pure Titanium Series
                    <span className="text-[10px] bg-gold/15 text-gold-700 px-1.5 py-0.5 rounded font-bold">New</span>
                  </Link>
                </li>
              </ul>

              <div className="pt-3 border-t border-obsidian-100">
                <Link
                  href="/try-on"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-obsidian-900 hover:text-gold transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-gold" />
                  <span>Try Frames with 3D Camera</span>
                </Link>
              </div>
            </div>

            {/* Column 2: Shapes */}
            <div className="col-span-3 space-y-4 border-r border-obsidian-100 pr-6">
              <h3 className="text-xs font-semibold tracking-wider text-gold-700 uppercase">
                Shop by Frame Shape
              </h3>
              <ul className="space-y-2.5 text-sm">
                {['Round', 'Square', 'Aviator', 'Cat-Eye', 'Geometric', 'Rimless'].map((shape) => (
                  <li key={shape}>
                    <Link
                      href={`/shop/eyeglasses?shape=${shape.toUpperCase()}`}
                      onClick={onClose}
                      className="text-obsidian-700 hover:text-obsidian-950 transition-colors block"
                    >
                      {shape} Frames
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Materials & Lenses */}
            <div className="col-span-3 space-y-4 border-r border-obsidian-100 pr-6">
              <h3 className="text-xs font-semibold tracking-wider text-gold-700 uppercase">
                Materials & Lenses
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/shop/eyeglasses?material=ACETATE"
                    onClick={onClose}
                    className="text-obsidian-700 hover:text-obsidian-950 transition-colors block"
                  >
                    Italian Mazzucchelli Acetate
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop/eyeglasses?material=TITANIUM"
                    onClick={onClose}
                    className="text-obsidian-700 hover:text-obsidian-950 transition-colors block"
                  >
                    Japanese Aerospace Titanium
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop/screen-glasses"
                    onClick={onClose}
                    className="text-obsidian-700 hover:text-obsidian-950 transition-colors block"
                  >
                    Blue Light Blocking (Zero Power)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/prescription-guide"
                    onClick={onClose}
                    className="text-obsidian-700 hover:text-obsidian-950 transition-colors block"
                  >
                    Progressive & Bifocal Guide
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Visual Card */}
            <div className="col-span-3">
              <div className="group relative rounded-xl overflow-hidden bg-obsidian-900 aspect-[4/3] flex flex-col justify-end p-5 text-white shadow-md">
                <Image
                  src="/images/product-craft.jpg"
                  alt="Crafted Eyewear"
                  fill
                  className="object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/90 via-obsidian-950/40 to-transparent" />
                <div className="relative z-10 space-y-1">
                  <span className="text-[10px] tracking-widest uppercase font-semibold text-gold">Master Collection</span>
                  <h4 className="font-serif text-lg text-white">The Sovereign Round</h4>
                  <Link
                    href="/product/the-sovereign-round"
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 text-xs text-white/90 group-hover:text-gold pt-2 font-medium"
                  >
                    Explore Frame <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'sunglasses' && (
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-3 space-y-4 border-r border-obsidian-100 pr-6">
              <h3 className="text-xs font-semibold tracking-wider text-gold-700 uppercase">
                Sunglasses Categories
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/shop/sunglasses?type=polarized" onClick={onClose} className="text-obsidian-800 hover:text-gold block font-medium">
                    Polarized Sun Collection
                  </Link>
                </li>
                <li>
                  <Link href="/shop/sunglasses?gender=MEN" onClick={onClose} className="text-obsidian-700 hover:text-obsidian-950 block">
                    Men&apos;s Sunglasses
                  </Link>
                </li>
                <li>
                  <Link href="/shop/sunglasses?gender=WOMEN" onClick={onClose} className="text-obsidian-700 hover:text-obsidian-950 block">
                    Women&apos;s Sunglasses
                  </Link>
                </li>
                <li>
                  <Link href="/shop/sunglasses?category=aviator" onClick={onClose} className="text-obsidian-700 hover:text-obsidian-950 block">
                    Classic Titanium Aviators
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-4 space-y-4 border-r border-obsidian-100 pr-6">
              <h3 className="text-xs font-semibold tracking-wider text-gold-700 uppercase">
                Sun Lens Technology
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-obsidian-50 rounded-lg">
                  <h5 className="text-xs font-bold text-obsidian-900">UV400 Polarized Mineral Glass</h5>
                  <p className="text-xs text-obsidian-600 mt-0.5">Eliminates 99.9% of blinding road & water glare with zero color distortion.</p>
                </div>
                <div className="p-3 bg-obsidian-50 rounded-lg">
                  <h5 className="text-xs font-bold text-obsidian-900">Gradient Runway Tints</h5>
                  <p className="text-xs text-obsidian-600 mt-0.5">Custom dipped tints offering seamless transition from dark sky to readable dashboard.</p>
                </div>
              </div>
            </div>

            <div className="col-span-5">
              <div className="group relative rounded-xl overflow-hidden bg-obsidian-900 aspect-[16/9] flex flex-col justify-end p-6 text-white shadow-md">
                <Image
                  src="/images/category-sunglasses.jpg"
                  alt="Designer Sunglasses"
                  fill
                  className="object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/90 via-obsidian-950/40 to-transparent" />
                <div className="relative z-10 space-y-1.5">
                  <span className="text-[10px] tracking-widest uppercase font-semibold text-gold">Summer 2026 Collection</span>
                  <h4 className="font-serif text-xl text-white">Parisian High Glamour</h4>
                  <Link
                    href="/shop/sunglasses"
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 text-xs text-gold hover:text-gold-300 font-medium"
                  >
                    View All Sunglasses <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'services' && (
          <div className="grid grid-cols-3 gap-6">
            <Link
              href="/book-eye-test"
              onClick={onClose}
              className="p-5 border border-obsidian-200 rounded-xl hover:border-gold hover:shadow-lg transition-all group bg-gradient-to-br from-white to-obsidian-50/50"
            >
              <div className="w-10 h-10 rounded-lg bg-gold/10 text-gold flex items-center justify-center mb-3 group-hover:bg-gold group-hover:text-obsidian-950 transition-colors">
                <Glasses className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-base font-medium text-obsidian-900 group-hover:text-gold-700 transition-colors">
                Book In-Store Eye Test
              </h4>
              <p className="text-xs text-obsidian-500 mt-1">
                20-step computerized comprehensive eye exam conducted by certified senior optometrists. 100% complimentary.
              </p>
            </Link>

            <Link
              href="/face-shape-guide"
              onClick={onClose}
              className="p-5 border border-obsidian-200 rounded-xl hover:border-gold hover:shadow-lg transition-all group bg-gradient-to-br from-white to-obsidian-50/50"
            >
              <div className="w-10 h-10 rounded-lg bg-gold/10 text-gold flex items-center justify-center mb-3 group-hover:bg-gold group-hover:text-obsidian-950 transition-colors">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-base font-medium text-obsidian-900 group-hover:text-gold-700 transition-colors">
                Face Shape Frame Advisor
              </h4>
              <p className="text-xs text-obsidian-500 mt-1">
                Identify your face contours (Round, Oval, Square, Heart) and discover silhouettes tailor-made for your features.
              </p>
            </Link>

            <Link
              href="/try-on"
              onClick={onClose}
              className="p-5 border border-obsidian-200 rounded-xl hover:border-gold hover:shadow-lg transition-all group bg-gradient-to-br from-white to-obsidian-50/50"
            >
              <div className="w-10 h-10 rounded-lg bg-gold/10 text-gold flex items-center justify-center mb-3 group-hover:bg-gold group-hover:text-obsidian-950 transition-colors">
                <Camera className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-base font-medium text-obsidian-900 group-hover:text-gold-700 transition-colors">
                3D Virtual Fitting Room
              </h4>
              <p className="text-xs text-obsidian-500 mt-1">
                Real-time camera try-on. See frames rotate in 3D scale on your face before you buy.
              </p>
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MegaMenu;
