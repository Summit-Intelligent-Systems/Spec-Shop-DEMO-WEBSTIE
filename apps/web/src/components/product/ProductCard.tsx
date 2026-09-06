'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, Camera, ShoppingBag, Check } from 'lucide-react';
import type { ProductItem } from '@/lib/mockData';
import { useCartStore } from '@/lib/store/cartStore';

interface ProductCardProps {
  product: ProductItem;
  priority?: boolean;
}

export const ProductCard = ({ product, priority = false }: ProductCardProps) => {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const { addItem, openCart } = useCartStore();

  const activeColor = product.colors[selectedColorIndex] || product.colors[0];
  const discountPercent = Math.round(
    ((product.comparePrice - product.price) / product.comparePrice) * 100,
  );

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Map to Cart product/variant types
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

  return (
    <div className="group relative bg-white rounded-2xl border border-obsidian-200/70 hover:border-gold/60 transition-all duration-300 hover:shadow-xl flex flex-col overflow-hidden">
      {/* ─── Image Container ────────────────────────────────────────────── */}
      <div className="relative aspect-[4/3] bg-obsidian-50 overflow-hidden">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={activeColor.image}
            alt={`${product.name} in ${activeColor.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
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

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm text-obsidian-700 hover:text-error-500 hover:bg-white transition-colors shadow-sm z-10"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-error-500 text-error-500' : ''
            }`}
          />
        </button>

        {/* Try-On floating chip */}
        {product.isTryOnAvailable && (
          <Link
            href={`/try-on?product=${product.slug}`}
            className="absolute bottom-3 left-3 text-[11px] font-semibold text-obsidian-900 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-obsidian-200/80 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1.5 hover:bg-gold hover:text-obsidian-950"
          >
            <Camera className="w-3 h-3 text-gold-600" />
            <span>Virtual Try-On</span>
          </Link>
        )}
      </div>

      {/* ─── Details ────────────────────────────────────────────────────── */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Shape */}
          <div className="flex items-center justify-between text-[11px] text-obsidian-400 uppercase tracking-wider font-semibold mb-1">
            <span>{product.categoryName}</span>
            <span>{product.frameShape}</span>
          </div>

          {/* Title */}
          <Link href={`/product/${product.slug}`} className="block group-hover:text-gold-700 transition-colors">
            <h3 className="font-serif text-base font-medium text-obsidian-900 truncate">
              {product.name}
            </h3>
          </Link>

          {/* Price & Rating */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-obsidian-950">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.comparePrice > product.price && (
                <span className="text-xs text-obsidian-400 line-through">
                  ₹{product.comparePrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <div className="flex items-center text-gold gap-1 text-xs font-semibold">
              <Star className="w-3.5 h-3.5 fill-gold text-gold" />
              <span>{product.rating}</span>
              <span className="text-[11px] text-obsidian-400 font-normal">
                ({product.reviewCount})
              </span>
            </div>
          </div>
        </div>

        {/* Color Swatches & Quick Add */}
        <div className="pt-2 border-t border-obsidian-100 flex items-center justify-between gap-2">
          {/* Swatches */}
          <div className="flex items-center gap-1.5">
            {product.colors.map((color, idx) => (
              <button
                key={color.name}
                type="button"
                onClick={() => setSelectedColorIndex(idx)}
                className={`w-4 h-4 rounded-full border transition-all ${
                  selectedColorIndex === idx
                    ? 'ring-2 ring-gold ring-offset-1 scale-110'
                    : 'border-obsidian-300 opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
                aria-label={`Select color ${color.name}`}
              />
            ))}
          </div>

          {/* Quick Add Button */}
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isAdded}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-obsidian-900 hover:bg-obsidian-800 text-white shadow-sm'
            }`}
            aria-label="Quick add to bag"
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
