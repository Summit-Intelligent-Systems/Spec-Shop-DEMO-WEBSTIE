'use client';

import { LayoutGrid, Grid2X2, Grid3X3 } from 'lucide-react';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

interface ProductSortToolbarProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  gridCols: 2 | 3 | 4;
  onGridColsChange: (cols: 2 | 3 | 4) => void;
  totalResults: number;
}

export const ProductSortToolbar = ({
  sortBy,
  onSortChange,
  gridCols,
  onGridColsChange,
  totalResults,
}: ProductSortToolbarProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 px-2 mb-6 border-b border-obsidian-200/80">
      <div className="flex items-center gap-3">
        <span className="text-sm font-serif text-obsidian-900 font-medium">
          Showing <strong className="font-semibold text-obsidian-950">{totalResults}</strong> handcrafted styles
        </span>
      </div>

      <div className="flex items-center gap-4 self-end sm:self-auto">
        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-xs font-semibold text-obsidian-500 uppercase tracking-wider">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="text-xs font-medium text-obsidian-900 bg-obsidian-50 border border-obsidian-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-gold focus:outline-none cursor-pointer"
          >
            <option value="featured">Featured Curations</option>
            <option value="newest">New Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {/* Column Switches for Desktop */}
        <div className="hidden md:flex items-center gap-1 bg-obsidian-100 p-1 rounded-lg border border-obsidian-200/60">
          <button
            type="button"
            onClick={() => onGridColsChange(2)}
            className={`p-1.5 rounded transition-all ${
              gridCols === 2 ? 'bg-white shadow-xs text-obsidian-950' : 'text-obsidian-400 hover:text-obsidian-700'
            }`}
            title="2 Columns"
            aria-label="2 Columns layout"
          >
            <Grid2X2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onGridColsChange(3)}
            className={`p-1.5 rounded transition-all ${
              gridCols === 3 ? 'bg-white shadow-xs text-obsidian-950' : 'text-obsidian-400 hover:text-obsidian-700'
            }`}
            title="3 Columns"
            aria-label="3 Columns layout"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onGridColsChange(4)}
            className={`p-1.5 rounded transition-all ${
              gridCols === 4 ? 'bg-white shadow-xs text-obsidian-950' : 'text-obsidian-400 hover:text-obsidian-700'
            }`}
            title="4 Columns"
            aria-label="4 Columns layout"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
