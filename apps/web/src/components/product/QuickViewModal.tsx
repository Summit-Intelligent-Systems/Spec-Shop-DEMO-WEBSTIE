'use client';

import { useState, lazy, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Star, Camera, ShoppingBag, Check, ArrowRight } from 'lucide-react';
import type { ProductItem } from '@/lib/mockData';
import { useCartStore } from '@/lib/store/cartStore';

// Lazy-load 3D components
const LazyCanvas = lazy(() => import('@/components/3d/LazyCanvas'));
const QuickView3DScene = lazy(() => import('@/components/3d/QuickView3DScene'));

interface QuickViewModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onLaunchTryOn?: (product: ProductItem) => void;
}

/**
 * Map product frameShape to PlaceholderFrame style prop
 */
const SHAPE_TO_STYLE: Record<string, 'round' | 'aviator' | 'square' | 'cat-eye'> = {
  ROUND: 'round',
  AVIATOR: 'aviator',
  SQUARE: 'square',
  RECTANGLE: 'square',
  CAT_EYE: 'cat-eye',
  GEOMETRIC: 'round',
};

const MATERIAL_TO_TYPE: Record<string, 'acetate' | 'titanium'> = {
  ACETATE: 'acetate',
  TITANIUM: 'titanium',
  METAL: 'titanium',
  TR90: 'acetate',
};

export const QuickViewModal = ({
  product,
  onClose,
  onLaunchTryOn,
}: QuickViewModalProps) => {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [view3D, setView3D] = useState(true); // Default to 3D view
  const { addItem, openCart } = useCartStore();

  if (!product) return null;

  const activeColor = product.colors[selectedColorIndex] || product.colors[0];
  const discountPercent = Math.round(
    ((product.comparePrice - product.price) / product.comparePrice) * 100,
  );

  const frameStyle = SHAPE_TO_STYLE[product.frameShape] || 'round';
  const frameMaterial = MATERIAL_TO_TYPE[product.frameMaterial] || 'acetate';

  const handleAddToCart = () => {
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
      onClose();
      openCart();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Dialog Container */}
      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-obsidian-200/80 overflow-hidden z-10 animate-fade-in">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm text-obsidian-600 hover:text-obsidian-950 hover:bg-obsidian-100 transition-colors z-20"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: 3D Viewer / Image Showcase */}
          <div className="relative aspect-square md:aspect-auto md:h-full bg-obsidian-50 flex items-center justify-center overflow-hidden">
            {view3D ? (
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center text-obsidian-400 text-xs">
                    Loading 3D...
                  </div>
                }
              >
                <div className="w-full h-full min-h-[280px]">
                  <LazyCanvas
                    eager
                    bgColor="#F7F7F7"
                    fov={35}
                    cameraPosition={[0, 0.2, 4]}
                  >
                    <QuickView3DScene
                      frameStyle={frameStyle}
                      frameMaterial={frameMaterial}
                      frameColor={activeColor.hex}
                      productName={product.name}
                      features={product.features}
                    />
                  </LazyCanvas>
                </div>
              </Suspense>
            ) : (
              <div className="relative w-full h-full min-h-[280px]">
                <Image
                  src={activeColor.image}
                  alt={`${product.name} in ${activeColor.name}`}
                  fill
                  className="object-contain p-4"
                />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
              {product.badge && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-obsidian-950 text-white shadow-sm">
                  {product.badge}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-gold text-obsidian-950 shadow-sm">
                  {discountPercent}% Off
                </span>
              )}
            </div>

            {/* 3D / Image toggle */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 z-10">
              <button
                type="button"
                onClick={() => setView3D(true)}
                className={`text-[10px] px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider transition-all ${
                  view3D
                    ? 'bg-obsidian-950 text-white shadow-sm'
                    : 'bg-white/80 backdrop-blur-sm text-obsidian-700 border border-obsidian-200'
                }`}
              >
                3D View
              </button>
              <button
                type="button"
                onClick={() => setView3D(false)}
                className={`text-[10px] px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider transition-all ${
                  !view3D
                    ? 'bg-obsidian-950 text-white shadow-sm'
                    : 'bg-white/80 backdrop-blur-sm text-obsidian-700 border border-obsidian-200'
                }`}
              >
                Photo
              </button>
            </div>
          </div>

          {/* Right: Product Details & Actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
                  {product.categoryName} • {product.frameShape}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-obsidian-950 font-medium mt-1">
                  {product.name}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-gold gap-1 text-xs font-semibold">
                    <Star className="w-4 h-4 fill-gold text-gold" />
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-xs text-obsidian-400">
                    ({product.reviewCount} customer reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-2xl font-bold text-obsidian-950">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.comparePrice > product.price && (
                  <span className="text-sm text-obsidian-400 line-through">
                    ₹{product.comparePrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                  Includes Anti-Glare Lenses
                </span>
              </div>

              <p className="text-xs text-obsidian-600 leading-relaxed line-clamp-3">
                {product.description}
              </p>

              {/* Color Selection */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-obsidian-900 block">
                  Colorway: <span className="text-obsidian-500 font-normal">{activeColor.name}</span>
                </label>
                <div className="flex items-center gap-2">
                  {product.colors.map((color, idx) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColorIndex(idx)}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${
                        selectedColorIndex === idx
                          ? 'border-gold ring-2 ring-gold/40 scale-110'
                          : 'border-obsidian-300 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Dimensions */}
              <div className="flex items-center gap-4 text-[11px] text-obsidian-500 bg-obsidian-50 p-2.5 rounded-xl border border-obsidian-100">
                <span>Lens: <strong>{product.dimensions.lensWidth}mm</strong></span>
                <span>•</span>
                <span>Bridge: <strong>{product.dimensions.bridgeWidth}mm</strong></span>
                <span>•</span>
                <span>Temple: <strong>{product.dimensions.templeLength}mm</strong></span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-4 border-t border-obsidian-100">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-obsidian-950 hover:bg-obsidian-800 text-white'
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
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                {onLaunchTryOn ? (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onLaunchTryOn(product);
                    }}
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider border border-obsidian-300 hover:border-gold hover:bg-gold/10 text-obsidian-900 flex items-center justify-center gap-2 transition-all"
                  >
                    <Camera className="w-4 h-4 text-gold-600" />
                    <span>Virtual Try-On</span>
                  </button>
                ) : (
                  <Link
                    href={`/try-on?product=${product.slug}`}
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider border border-obsidian-300 hover:border-gold hover:bg-gold/10 text-obsidian-900 flex items-center justify-center gap-2 transition-all"
                  >
                    <Camera className="w-4 h-4 text-gold-600" />
                    <span>Virtual Try-On</span>
                  </Link>
                )}
              </div>

              <Link
                href={`/product/${product.slug}`}
                onClick={onClose}
                className="w-full py-2.5 text-center text-xs font-medium text-obsidian-600 hover:text-gold-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Full Optical Specifications & Lens Options</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
