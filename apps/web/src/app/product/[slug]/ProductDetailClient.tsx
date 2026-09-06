'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Star,
  Camera,
  ShoppingBag,
  Check,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Heart,
  Share2,
  ChevronRight,
  Eye,
  Truck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { ProductItem } from '@/lib/mockData';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductViewer360 } from '@/components/product/ProductViewer360';
import { FrameGeometryGuide } from '@/components/product/FrameGeometryGuide';
import { ProductReviews } from '@/components/product/ProductReviews';
import { ProductCard } from '@/components/product/ProductCard';
import { PrescriptionConfigurator } from '@/components/prescription/PrescriptionConfigurator';
import { VirtualTryOnModal } from '@/components/vto/VirtualTryOnModal';
import { useCartStore } from '@/lib/store/cartStore';

interface ProductDetailClientProps {
  product: ProductItem;
}

export const ProductDetailClient = ({ product }: ProductDetailClientProps) => {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const { addItem, openCart } = useCartStore();

  const activeColor = product.colors[selectedColorIndex] || product.colors[0];
  const discountPercent = Math.round(
    ((product.comparePrice - product.price) / product.comparePrice) * 100,
  );

  const handleDirectAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        basePrice: product.price,
        baseComparePrice: product.comparePrice,
        images: [{ url: activeColor.image, isPrimary: true }],
      } as any,
      {
        id: `${product.id}-var-${selectedColorIndex}`,
        color: activeColor.name,
        colorHex: activeColor.hex,
        size: 'Medium',
        price: product.price,
        images: [{ url: activeColor.image, isPrimary: true }],
      } as any,
      1,
    );

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      openCart();
    }, 600);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      toast.success('Product link copied to clipboard');
    }
  };

  const relatedProducts = MOCK_PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category,
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Breadcrumb ───────────────────────────────────────────────────── */}
      <div className="bg-obsidian-50 border-b border-obsidian-200/80 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-obsidian-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-obsidian-800 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/shop" className="hover:text-obsidian-800 transition-colors">
              Shop
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href={`/shop/${product.category}`}
              className="hover:text-obsidian-800 transition-colors capitalize"
            >
              {product.categoryName}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-obsidian-900 font-medium truncate max-w-xs">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* ─── Top Showcase Section (Gallery + Purchase Panel) ───────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left: Image Gallery (Col 7) */}
          <div className="lg:col-span-7">
            <ProductGallery
              product={product}
              selectedColorIndex={selectedColorIndex}
            />
          </div>

          {/* Right: Technical Purchase Panel (Col 5) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Header & Badges */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-700">
                  {product.categoryName} • {product.frameShape}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="p-2 rounded-full border border-obsidian-200 text-obsidian-600 hover:text-error-500 hover:border-error-200 transition-colors"
                    aria-label="Wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isWishlisted ? 'fill-error-500 text-error-500' : ''
                      }`}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="p-2 rounded-full border border-obsidian-200 text-obsidian-600 hover:text-obsidian-950 transition-colors"
                    aria-label="Share product"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl text-obsidian-950 font-normal">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center text-gold gap-1 text-sm font-semibold">
                  <Star className="w-4 h-4 fill-gold text-gold" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-xs text-obsidian-400">
                  ({product.reviewCount} verified reviews)
                </span>
                <span className="text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                  In Stock & Ready to Mill
                </span>
              </div>
            </div>

            {/* Price Showcase */}
            <div className="p-4 rounded-2xl bg-obsidian-50/80 border border-obsidian-200/80 flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-bold text-obsidian-950">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.comparePrice > product.price && (
                  <span className="text-sm text-obsidian-400 line-through ml-3">
                    ₹{product.comparePrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-gold-800 bg-gold/15 px-3 py-1 rounded-full">
                Save ₹{(product.comparePrice - product.price).toLocaleString('en-IN')} ({discountPercent}%)
              </span>
            </div>

            <p className="text-xs text-obsidian-600 leading-relaxed">
              {product.description}
            </p>

            {/* Color Swatch Picker */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-obsidian-700 block">
                Colorway: <span className="font-normal text-obsidian-900">{activeColor.name}</span>
              </label>
              <div className="flex items-center gap-3">
                {product.colors.map((color, idx) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColorIndex(idx)}
                    className={`group relative p-1 rounded-full border-2 transition-all ${
                      selectedColorIndex === idx
                        ? 'border-obsidian-950 scale-110 shadow-sm'
                        : 'border-obsidian-200 hover:border-obsidian-400'
                    }`}
                  >
                    <span
                      className="block w-6 h-6 rounded-full border border-black/20"
                      style={{ backgroundColor: color.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Dimension Capsule */}
            <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-xl bg-obsidian-50 border border-obsidian-200/70 text-xs">
              <div>
                <span className="text-[10px] uppercase text-obsidian-400 font-bold block">Lens</span>
                <span className="font-serif font-semibold text-obsidian-900">{product.dimensions.lensWidth}mm</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-obsidian-400 font-bold block">Bridge</span>
                <span className="font-serif font-semibold text-obsidian-900">{product.dimensions.bridgeWidth}mm</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-obsidian-400 font-bold block">Temple</span>
                <span className="font-serif font-semibold text-obsidian-900">{product.dimensions.templeLength}mm</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-obsidian-200">
              {/* Select Lenses & Prescription CTA (RECOMMENDED) */}
              <button
                type="button"
                onClick={() => setIsPrescriptionOpen(true)}
                className="w-full py-4 rounded-2xl bg-obsidian-950 hover:bg-obsidian-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all group"
              >
                <Eye className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
                <span>Select Lenses & Enter Prescription</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                {/* Direct Frame Only */}
                <button
                  type="button"
                  onClick={handleDirectAddToCart}
                  disabled={isAdded}
                  className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider border border-obsidian-300 flex items-center justify-center gap-2 transition-all ${
                    isAdded
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'hover:border-obsidian-900 text-obsidian-900 bg-white'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Frame Only (Zero Power)</span>
                    </>
                  )}
                </button>

                {/* Virtual Try-On Trigger */}
                <button
                  type="button"
                  onClick={() => setIsTryOnOpen(true)}
                  className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider border border-gold/60 text-obsidian-900 bg-gold/10 hover:bg-gold/25 flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <Camera className="w-4 h-4 text-gold-700" />
                  <span>Virtual Try-On</span>
                </button>
              </div>
            </div>

            {/* Trust Assurances */}
            <div className="space-y-2.5 pt-4 border-t border-obsidian-100 text-xs text-obsidian-600">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-gold-600 shrink-0" />
                <span>Complimentary Insured Express Delivery across India (2–4 Days)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-gold-600 shrink-0" />
                <span>14-Day Doorstep Exchange Guarantee — 100% Optical Satisfaction</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-gold-600 shrink-0" />
                <span>1-Year Structural Frame & Coating Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Technical Deep-Dive: 360 Turntable & Dimensions ───────────────── */}
      <section className="py-16 bg-obsidian-50/60 border-t border-b border-obsidian-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* 360 Turntable */}
            <ProductViewer360
              productName={product.name}
              baseImage={activeColor.image}
            />

            {/* Dimensions Blueprint */}
            <FrameGeometryGuide
              dimensions={product.dimensions}
              frameShape={product.frameShape}
              recommendedFaceShapes={product.recommendedFaceShapes}
            />
          </div>

          {/* Craft Features Matrix */}
          <div className="bg-white rounded-3xl p-8 border border-obsidian-200/80 space-y-6 shadow-sm">
            <h3 className="font-serif text-2xl font-medium text-obsidian-950">
              Artisanal Craft & Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.features.map((feat, i) => (
                <div key={i} className="p-4 rounded-xl bg-obsidian-50 border border-obsidian-100 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-gold/15 text-gold-700 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold uppercase text-obsidian-900">
                    Feature 0{i + 1}
                  </h4>
                  <p className="text-xs text-obsidian-600">{feat}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Customer Reviews ─────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductReviews product={product} />
        </div>
      </section>

      {/* ─── Related Products Carousel ────────────────────────────────────── */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-obsidian-50 border-t border-obsidian-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
                  Curated Pairings
                </span>
                <h3 className="font-serif text-3xl font-medium text-obsidian-950 mt-1">
                  Complete Your Optical Wardrobe
                </h3>
              </div>
              <Link
                href={`/shop/${product.category}`}
                className="text-xs font-semibold text-obsidian-900 hover:text-gold-700 flex items-center gap-1 uppercase tracking-wider"
              >
                <span>View More in {product.categoryName}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Modals: Prescription Configurator & Try-On ───────────────────── */}
      <PrescriptionConfigurator
        product={product}
        selectedColorIndex={selectedColorIndex}
        isOpen={isPrescriptionOpen}
        onClose={() => setIsPrescriptionOpen(false)}
      />

      <VirtualTryOnModal
        product={product}
        isOpen={isTryOnOpen}
        onClose={() => setIsTryOnOpen(false)}
      />
    </div>
  );
};
