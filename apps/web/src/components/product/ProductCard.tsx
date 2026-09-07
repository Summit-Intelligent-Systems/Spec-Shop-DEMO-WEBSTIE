'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, Camera, ShoppingBag, Check } from 'lucide-react';
import type { ProductItem } from '@/lib/mockData';
import { useCartStore } from '@/lib/store/cartStore';

interface ProductCardProps {
  product: ProductItem;
  priority?: boolean;
}

/**
 * Product Card with CSS 3D tilt effect.
 *
 * Scene 2 — No WebGL. Pure CSS 3D transforms on mousemove:
 * - perspective(800px) rotateX() rotateY() capped at ±6°
 * - Dynamic box-shadow shifts opposite to tilt direction
 * - Product image parallax offset (4-6px) opposite to card tilt
 * - mouseleave transitions back to neutral with ease-out 400ms
 * - Mobile: no tilt (touch tilt feels janky)
 * - Respects prefers-reduced-motion
 */
export const ProductCard = ({ product, priority = false }: ProductCardProps) => {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // 3D tilt state
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, shadowX: 0, shadowY: 0 });
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useRef(false);
  const isMobile = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    isMobile.current =
      window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window;
  }, []);

  const { addItem, openCart } = useCartStore();

  const activeColor = product.colors[selectedColorIndex] || product.colors[0];
  const discountPercent = Math.round(
    ((product.comparePrice - product.price) / product.comparePrice) * 100,
  );

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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

  /** Calculate 3D tilt from mouse position relative to card center */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion.current || isMobile.current || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalize to [-1, 1]
    const normalX = (e.clientX - centerX) / (rect.width / 2);
    const normalY = (e.clientY - centerY) / (rect.height / 2);

    // Clamp rotation to ±6 degrees
    const maxAngle = 6;
    const rotateY = normalX * maxAngle;
    const rotateX = -normalY * maxAngle; // Invert Y for natural tilt

    // Shadow shifts opposite to tilt
    const shadowX = -normalX * 12;
    const shadowY = -normalY * 8;

    // Image parallax — opposite to tilt, 4-6px
    const parallaxX = -normalX * 5;
    const parallaxY = -normalY * 4;

    setTilt({ rotateX, rotateY, shadowX, shadowY });
    setImageOffset({ x: parallaxX, y: parallaxY });
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (reducedMotion.current || isMobile.current) return;
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setTilt({ rotateX: 0, rotateY: 0, shadowX: 0, shadowY: 0 });
    setImageOffset({ x: 0, y: 0 });
  }, []);

  const cardStyle: React.CSSProperties = isHovering
    ? {
        transform: `perspective(800px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        boxShadow: `${tilt.shadowX}px ${tilt.shadowY + 16}px 40px -12px rgba(10, 10, 10, 0.18)`,
        transition: 'transform 0.08s ease-out, box-shadow 0.08s ease-out',
      }
    : {
        transform: 'perspective(800px) rotateX(0deg) rotateY(0deg)',
        boxShadow: '',
        transition: 'transform 0.4s ease-out, box-shadow 0.4s ease-out',
      };

  const imageStyle: React.CSSProperties = isHovering
    ? {
        transform: `translate(${imageOffset.x}px, ${imageOffset.y}px) scale(1.05)`,
        transition: 'transform 0.08s ease-out',
      }
    : {
        transform: 'translate(0px, 0px) scale(1)',
        transition: 'transform 0.5s ease-out',
      };

  return (
    <div
      ref={cardRef}
      className="group relative bg-white rounded-2xl border border-obsidian-200/70 hover:border-gold/60 transition-colors duration-300 flex flex-col overflow-hidden will-change-transform"
      style={cardStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ─── Image Container ────────────────────────────────────────────── */}
      <div className="relative aspect-[4/3] bg-obsidian-50 overflow-hidden">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={activeColor.image}
            alt={`${product.name} in ${activeColor.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            className="object-cover object-center"
            style={imageStyle}
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
