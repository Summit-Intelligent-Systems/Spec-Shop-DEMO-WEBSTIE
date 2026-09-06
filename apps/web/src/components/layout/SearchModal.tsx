'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Glasses, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useUIStore } from '@/lib/store/uiStore';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import { backdropVariants, modalVariants } from '@/lib/motion/variants';

const POPULAR_SEARCHES = [
  'Titanium Aviators',
  'Round Acetate',
  'Blue Light Filter',
  'Polarized Sunglasses',
  'Cat-Eye Frames',
  'Rimless Eyeglasses',
];

export const SearchModal = () => {
  const { isSearchOpen, closeSearch, searchQuery, setSearchQuery } = useUIStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const searchResults = useMemo(() => {
    const q = localQuery.trim().toLowerCase();
    if (!q) return [];
    return MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.frameShape.toLowerCase().includes(q) ||
        p.frameMaterial.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    ).slice(0, 4);
  }, [localQuery]);

  if (!isSearchOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
        {/* Backdrop */}
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-obsidian-950/70 backdrop-blur-md"
          onClick={closeSearch}
        />

        {/* Search Dialog */}
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-obsidian-200"
        >
          {/* Header Input */}
          <div className="flex items-center gap-3 p-4 border-b border-obsidian-100">
            <Search className="w-5 h-5 text-obsidian-400 shrink-0 ml-2" />
            <input
              type="text"
              placeholder="Search frames, shapes, materials, collections..."
              value={localQuery}
              onChange={(e) => {
                setLocalQuery(e.target.value);
                setSearchQuery(e.target.value);
              }}
              autoFocus
              className="w-full text-base bg-transparent border-none outline-none placeholder:text-obsidian-400 text-obsidian-900"
            />
            {localQuery && (
              <button
                type="button"
                onClick={() => {
                  setLocalQuery('');
                  setSearchQuery('');
                }}
                className="p-1 text-obsidian-400 hover:text-obsidian-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={closeSearch}
              className="px-3 py-1.5 text-xs font-medium text-obsidian-500 hover:text-obsidian-900 hover:bg-obsidian-100 rounded-md transition-colors"
            >
              ESC
            </button>
          </div>

          {/* Body */}
          <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
            {/* Quick Suggestions when query is empty */}
            {!localQuery && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-obsidian-400 tracking-wider uppercase mb-3">
                    Popular Searches
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SEARCHES.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => {
                          setLocalQuery(term);
                          setSearchQuery(term);
                        }}
                        className="text-xs px-3.5 py-1.5 rounded-full bg-obsidian-50 hover:bg-gold/15 text-obsidian-700 hover:text-gold-800 border border-obsidian-200 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-obsidian-100">
                  <h4 className="text-xs font-semibold text-obsidian-400 tracking-wider uppercase mb-3">
                    Quick Categories
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/shop/eyeglasses"
                      onClick={closeSearch}
                      className="flex items-center gap-3 p-3 rounded-xl border border-obsidian-100 hover:border-gold/50 hover:bg-obsidian-50 transition-all"
                    >
                      <Glasses className="w-5 h-5 text-gold" />
                      <div>
                        <div className="text-sm font-medium text-obsidian-900">All Eyeglasses</div>
                        <div className="text-xs text-obsidian-500">From ₹2,499</div>
                      </div>
                    </Link>
                    <Link
                      href="/shop/sunglasses"
                      onClick={closeSearch}
                      className="flex items-center gap-3 p-3 rounded-xl border border-obsidian-100 hover:border-gold/50 hover:bg-obsidian-50 transition-all"
                    >
                      <Glasses className="w-5 h-5 text-gold" />
                      <div>
                        <div className="text-sm font-medium text-obsidian-900">Designer Sunglasses</div>
                        <div className="text-xs text-obsidian-500">100% Polarized UV400</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Results when searching */}
            {localQuery && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-obsidian-400 tracking-wider uppercase">
                    Products ({searchResults.length})
                  </h4>
                  {searchResults.length > 0 && (
                    <Link
                      href={`/shop/eyeglasses?search=${encodeURIComponent(localQuery)}`}
                      onClick={closeSearch}
                      className="text-xs font-medium text-gold hover:text-gold-700 inline-flex items-center gap-1"
                    >
                      View All Results <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>

                {searchResults.length === 0 ? (
                  <div className="text-center py-10 space-y-2">
                    <p className="text-sm text-obsidian-600 font-medium">
                      No matching frames found for &ldquo;{localQuery}&rdquo;
                    </p>
                    <p className="text-xs text-obsidian-400">
                      Try searching by shape (Round, Aviator) or material (Acetate, Titanium).
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        onClick={closeSearch}
                        className="flex items-center gap-4 p-3 rounded-xl border border-obsidian-100 hover:border-gold/60 hover:bg-obsidian-50/70 transition-all group"
                      >
                        <div className="w-16 h-16 rounded-lg bg-obsidian-100 relative overflow-hidden shrink-0">
                          <Image
                            src={product.colors[0]?.image || '/images/product-craft.jpg'}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-semibold text-gold-700">
                              {product.categoryName}
                            </span>
                            <span className="text-obsidian-300">•</span>
                            <span className="text-[10px] text-obsidian-500 uppercase">
                              {product.frameShape}
                            </span>
                          </div>
                          <h5 className="text-sm font-medium text-obsidian-900 group-hover:text-gold-700 transition-colors truncate">
                            {product.name}
                          </h5>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-semibold text-obsidian-900">
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[11px] text-obsidian-400 line-through">
                              ₹{product.comparePrice.toLocaleString('en-IN')}
                            </span>
                            <div className="flex items-center text-gold ml-2">
                              <Star className="w-3 h-3 fill-gold text-gold" />
                              <span className="text-[11px] text-obsidian-600 ml-1">
                                {product.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-obsidian-300 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SearchModal;
