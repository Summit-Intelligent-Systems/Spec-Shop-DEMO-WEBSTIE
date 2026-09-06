'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ZoomIn, ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { ProductItem } from '@/lib/mockData';

interface ProductGalleryProps {
  product: ProductItem;
  selectedColorIndex: number;
}

export const ProductGallery = ({ product, selectedColorIndex }: ProductGalleryProps) => {
  const activeColor = product.colors[selectedColorIndex] || product.colors[0];

  // Gallery angles combining color image, craft detail, model shot, and hero banner
  const galleryImages = [
    { url: activeColor.image, alt: `${product.name} - Front View` },
    { url: '/images/product-craft.jpg', alt: `${product.name} - Artisan Craft & Hinge Detail` },
    { url: '/images/category-men.jpg', alt: `${product.name} - Editorial Profile View` },
    { url: '/images/hero-banner.jpg', alt: `${product.name} - Luxury Case & Accessories` },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const discountPercent = Math.round(
    ((product.comparePrice - product.price) / product.comparePrice) * 100,
  );

  return (
    <div className="space-y-4">
      {/* Main Image Container */}
      <div className="relative aspect-[4/3] sm:aspect-square bg-obsidian-50 rounded-3xl overflow-hidden border border-obsidian-200/80 group">
        <Image
          src={galleryImages[activeIndex].url}
          alt={galleryImages[activeIndex].alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full bg-obsidian-950 text-white shadow-md">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full bg-gold text-obsidian-950 shadow-md">
              {discountPercent}% Off
            </span>
          )}
        </div>

        {/* Zoom Lightbox Trigger */}
        <button
          type="button"
          onClick={() => setIsZoomOpen(true)}
          className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-obsidian-800 hover:text-obsidian-950 hover:bg-white shadow-md transition-all group-hover:scale-110"
          title="Zoom high-resolution optical details"
          aria-label="Zoom image"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Next/Prev Arrow Navigation */}
        <button
          type="button"
          onClick={() => setActiveIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-obsidian-800 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setActiveIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-obsidian-800 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Next image"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Thumbnails Row */}
      <div className="grid grid-cols-4 gap-3">
        {galleryImages.map((img, idx) => (
          <button
            key={img.url + idx}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className={`relative aspect-square rounded-xl overflow-hidden bg-obsidian-50 border-2 transition-all ${
              activeIndex === idx
                ? 'border-obsidian-950 ring-2 ring-gold/40 shadow-sm'
                : 'border-obsidian-200/80 opacity-70 hover:opacity-100'
            }`}
          >
            <Image
              src={img.url}
              alt={img.alt}
              fill
              sizes="120px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Fullscreen Lightbox Zoom Modal */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
            aria-label="Close fullscreen zoom"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-5xl aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={galleryImages[activeIndex].url}
              alt={galleryImages[activeIndex].alt}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
