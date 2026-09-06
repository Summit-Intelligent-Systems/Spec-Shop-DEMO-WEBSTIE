'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Sparkles, ChevronRight, X, RotateCcw } from 'lucide-react';
import { MOCK_PRODUCTS, CATEGORIES, type ProductItem } from '@/lib/mockData';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductFilters, type FilterState } from '@/components/product/ProductFilters';
import { ProductSortToolbar, type SortOption } from '@/components/product/ProductSortToolbar';
import { QuickViewModal } from '@/components/product/QuickViewModal';

interface ShopCatalogClientProps {
  initialCategory?: string;
  categoryTitle?: string;
  categoryDescription?: string;
}

const DEFAULT_FILTERS: FilterState = {
  category: 'all',
  subCategory: 'all',
  frameShape: [],
  frameMaterial: [],
  frameType: [],
  minPrice: 2000,
  maxPrice: 10000,
  color: '',
};

export const ShopCatalogClient = ({
  initialCategory = 'all',
  categoryTitle,
  categoryDescription,
}: ShopCatalogClientProps) => {
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    category: initialCategory,
  });

  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(3);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);

  // Filter products
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      // Category filter
      if (filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }
      // Subcategory / gender filter
      if (filters.subCategory !== 'all' && product.subCategory !== filters.subCategory && product.subCategory !== 'unisex') {
        return false;
      }
      // Shape filter
      if (filters.frameShape.length > 0 && !filters.frameShape.includes(product.frameShape)) {
        return false;
      }
      // Material filter
      if (filters.frameMaterial.length > 0 && !filters.frameMaterial.includes(product.frameMaterial)) {
        return false;
      }
      // Frame type filter
      if (filters.frameType.length > 0 && !filters.frameType.includes(product.frameType)) {
        return false;
      }
      // Price filter
      if (product.price > filters.maxPrice) {
        return false;
      }
      // Color tone filter
      if (filters.color) {
        const hasColor = product.colors.some((c) =>
          c.name.toLowerCase().includes(filters.color.toLowerCase()),
        );
        if (!hasColor) return false;
      }
      return true;
    });
  }, [filters]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      case 'featured':
      default:
        return list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }
  }, [filteredProducts, sortBy]);

  const resetFilters = () => {
    setFilters({ ...DEFAULT_FILTERS, category: initialCategory });
  };

  const activeCategoryMeta = CATEGORIES.find((c) => c.slug === filters.category);

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Breadcrumb & Banner ──────────────────────────────────────────── */}
      <div className="bg-obsidian-50 border-b border-obsidian-200/80 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-obsidian-400 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-obsidian-800 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/shop" className="hover:text-obsidian-800 transition-colors">
              Optical Catalog
            </Link>
            {filters.category !== 'all' && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-obsidian-900 font-medium capitalize">
                  {activeCategoryMeta?.name || filters.category}
                </span>
              </>
            )}
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.2em] text-gold uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Optical Vault</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl text-obsidian-950 font-normal tracking-tight">
                {categoryTitle || (activeCategoryMeta ? activeCategoryMeta.name : 'All Optical Frames')}
              </h1>
              <p className="text-sm text-obsidian-600 leading-relaxed">
                {categoryDescription ||
                  (activeCategoryMeta
                    ? activeCategoryMeta.description
                    : 'Discover mastercrafted eyewear silhouettes carved from organic Italian acetate and Japanese aerospace titanium.')}
              </p>
            </div>

            {/* Quick Category Switcher Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <Link
                href="/shop"
                onClick={() => setFilters((f) => ({ ...f, category: 'all' }))}
                className={`text-xs px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all border ${
                  filters.category === 'all'
                    ? 'bg-obsidian-950 text-white border-obsidian-950 shadow-sm'
                    : 'bg-white text-obsidian-600 border-obsidian-200 hover:border-obsidian-400'
                }`}
              >
                All ({MOCK_PRODUCTS.length})
              </Link>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/shop/${cat.slug}`}
                  onClick={() => setFilters((f) => ({ ...f, category: cat.slug }))}
                  className={`text-xs px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all border ${
                    filters.category === cat.slug
                      ? 'bg-obsidian-950 text-white border-obsidian-950 shadow-sm'
                      : 'bg-white text-obsidian-600 border-obsidian-200 hover:border-obsidian-400'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Shop Layout (Sticky Filters + Grid) ──────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row items-start">
          {/* Faceted Filter Sidebar */}
          <ProductFilters
            filters={filters}
            onChange={setFilters}
            onReset={resetFilters}
            totalResults={sortedProducts.length}
          />

          {/* Main Content Area */}
          <main className="flex-1 w-full">
            {/* Toolbar: Sort + Results Count + Grid Toggle */}
            <ProductSortToolbar
              sortBy={sortBy}
              onSortChange={setSortBy}
              gridCols={gridCols}
              onGridColsChange={setGridCols}
              totalResults={sortedProducts.length}
            />

            {/* Active Filters Pill Bar */}
            {(filters.frameShape.length > 0 ||
              filters.frameMaterial.length > 0 ||
              filters.frameType.length > 0 ||
              filters.color ||
              filters.subCategory !== 'all') && (
              <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-obsidian-50/80 rounded-xl border border-obsidian-200/60">
                <span className="text-[11px] font-semibold text-obsidian-500 uppercase tracking-wider">
                  Active Filters:
                </span>

                {filters.subCategory !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setFilters((f) => ({ ...f, subCategory: 'all' }))}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-obsidian-200 text-xs font-medium text-obsidian-800 hover:bg-obsidian-100"
                  >
                    <span>Gender: {filters.subCategory}</span>
                    <X className="w-3 h-3 text-obsidian-400" />
                  </button>
                )}

                {filters.frameShape.map((shape) => (
                  <button
                    key={shape}
                    type="button"
                    onClick={() =>
                      setFilters((f) => ({
                        ...f,
                        frameShape: f.frameShape.filter((s) => s !== shape),
                      }))
                    }
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-obsidian-200 text-xs font-medium text-obsidian-800 hover:bg-obsidian-100"
                  >
                    <span>{shape}</span>
                    <X className="w-3 h-3 text-obsidian-400" />
                  </button>
                ))}

                {filters.frameMaterial.map((mat) => (
                  <button
                    key={mat}
                    type="button"
                    onClick={() =>
                      setFilters((f) => ({
                        ...f,
                        frameMaterial: f.frameMaterial.filter((m) => m !== mat),
                      }))
                    }
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-obsidian-200 text-xs font-medium text-obsidian-800 hover:bg-obsidian-100"
                  >
                    <span>{mat}</span>
                    <X className="w-3 h-3 text-obsidian-400" />
                  </button>
                ))}

                {filters.color && (
                  <button
                    type="button"
                    onClick={() => setFilters((f) => ({ ...f, color: '' }))}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-obsidian-200 text-xs font-medium text-obsidian-800 hover:bg-obsidian-100"
                  >
                    <span>Color: {filters.color}</span>
                    <X className="w-3 h-3 text-obsidian-400" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs text-gold-700 font-semibold hover:underline ml-auto flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear All</span>
                </button>
              </div>
            )}

            {/* Product Grid */}
            {sortedProducts.length === 0 ? (
              <div className="py-20 text-center rounded-3xl border border-dashed border-obsidian-200 bg-obsidian-50/50 p-8 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-obsidian-100 flex items-center justify-center text-obsidian-400">
                  <Sparkles className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-serif text-xl font-medium text-obsidian-900">
                  No matching silhouettes found
                </h3>
                <p className="text-xs text-obsidian-500 max-w-md mx-auto">
                  Try widening your price range or clearing specific geometric shape filters to view our full handcrafted collection.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-obsidian-950 text-white text-xs font-semibold uppercase tracking-wider"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              <div
                className={`grid gap-6 sm:gap-8 ${
                  gridCols === 2
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : gridCols === 3
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                }`}
              >
                {sortedProducts.map((product, idx) => (
                  <div key={product.id} className="relative">
                    <ProductCard product={product} priority={idx < 4} />
                    {/* Quick View Button on Card */}
                    <button
                      type="button"
                      onClick={() => setQuickViewProduct(product)}
                      className="mt-2 w-full py-1.5 rounded-lg border border-obsidian-200 hover:border-obsidian-400 text-[11px] font-semibold text-obsidian-600 hover:text-obsidian-950 transition-colors"
                    >
                      Quick Specifications
                    </button>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
