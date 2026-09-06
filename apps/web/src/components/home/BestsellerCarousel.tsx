'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import { ProductCard } from '@/components/product/ProductCard';

type CategoryFilter = 'all' | 'eyeglasses' | 'sunglasses' | 'screen-glasses';

export const BestsellerCarousel = () => {
  const [activeTab, setActiveTab] = useState<CategoryFilter>('all');

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    if (activeTab === 'all') return true;
    return product.category === activeTab;
  });

  return (
    <section className="py-24 bg-white border-b border-obsidian-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.2em] text-gold uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Iconic Silhouettes</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-obsidian-900 font-normal">
              Most Coveted Frames
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-obsidian-50 border border-obsidian-200/80 overflow-x-auto max-w-full">
            {[
              { id: 'all', label: 'All Frames' },
              { id: 'eyeglasses', label: 'Eyeglasses' },
              { id: 'sunglasses', label: 'Sunglasses' },
              { id: 'screen-glasses', label: 'Blue Light' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as CategoryFilter)}
                className={`text-xs px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-obsidian-900 text-white shadow-sm'
                    : 'text-obsidian-600 hover:text-obsidian-950 hover:bg-obsidian-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} priority={idx < 3} />
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="mt-14 text-center">
          <Link
            href="/shop/eyeglasses"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-obsidian-900 text-obsidian-900 hover:bg-obsidian-900 hover:text-white text-xs font-semibold uppercase tracking-wider transition-all"
          >
            <span>View Full Optical Catalog ({MOCK_PRODUCTS.length}+ Styles)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestsellerCarousel;
