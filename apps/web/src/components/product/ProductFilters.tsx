'use client';

import { useState } from 'react';
import { X, SlidersHorizontal, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

export interface FilterState {
  category: string;
  subCategory: string;
  frameShape: string[];
  frameMaterial: string[];
  frameType: string[];
  minPrice: number;
  maxPrice: number;
  color: string;
}

interface ProductFiltersProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
  totalResults: number;
}

const SHAPES = [
  { id: 'ROUND', label: 'Round' },
  { id: 'SQUARE', label: 'Square' },
  { id: 'AVIATOR', label: 'Aviator' },
  { id: 'CAT_EYE', label: 'Cat-Eye' },
  { id: 'GEOMETRIC', label: 'Geometric' },
  { id: 'RECTANGLE', label: 'Rectangle' },
];

const MATERIALS = [
  { id: 'ACETATE', label: 'Italian Acetate' },
  { id: 'TITANIUM', label: 'Aerospace Titanium' },
  { id: 'METAL', label: 'Surgical Metal' },
  { id: 'TR90', label: 'Ultralight TR90' },
];

const FRAME_TYPES = [
  { id: 'FULL_RIM', label: 'Full Rim' },
  { id: 'SEMI_RIMLESS', label: 'Semi-Rimless' },
  { id: 'RIMLESS', label: 'Rimless' },
];

const COLORS = [
  { name: 'Black', hex: '#09090B' },
  { name: 'Gold', hex: '#C9A84C' },
  { name: 'Tortoise', hex: '#633B18' },
  { name: 'Silver', hex: '#CBD5E1' },
  { name: 'Rose', hex: '#E2A9A9' },
  { name: 'Plum', hex: '#581C87' },
];

export const ProductFilters = ({
  filters,
  onChange,
  onReset,
  totalResults,
}: ProductFiltersProps) => {
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    shape: true,
    material: true,
    price: true,
    type: true,
    color: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCheckboxToggle = (
    key: 'frameShape' | 'frameMaterial' | 'frameType',
    value: string,
  ) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    onChange({ ...filters, [key]: updated });
  };

  const activeFilterCount =
    (filters.category !== 'all' ? 1 : 0) +
    (filters.subCategory !== 'all' ? 1 : 0) +
    filters.frameShape.length +
    filters.frameMaterial.length +
    filters.frameType.length +
    (filters.color ? 1 : 0) +
    (filters.minPrice > 0 || filters.maxPrice < 10000 ? 1 : 0);

  const FilterContent = (
    <div className="space-y-6">
      {/* Active Filter Header */}
      <div className="flex items-center justify-between pb-4 border-b border-obsidian-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gold" />
          <h3 className="font-serif text-lg font-medium text-obsidian-900">Refine Silhouette</h3>
          {activeFilterCount > 0 && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gold/20 text-gold-800">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-obsidian-500 hover:text-obsidian-900 flex items-center gap-1 font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Gender / Collection */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-obsidian-500">
          Collection
        </label>
        <div className="grid grid-cols-4 gap-1 p-1 bg-obsidian-100/80 rounded-xl">
          {[
            { id: 'all', label: 'All' },
            { id: 'men', label: 'Men' },
            { id: 'women', label: 'Women' },
            { id: 'unisex', label: 'Unisex' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange({ ...filters, subCategory: item.id })}
              className={`text-xs py-1.5 rounded-lg font-medium transition-all ${
                filters.subCategory === item.id
                  ? 'bg-obsidian-900 text-white shadow-sm'
                  : 'text-obsidian-600 hover:text-obsidian-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Frame Shape */}
      <div className="border-b border-obsidian-100 pb-5">
        <button
          type="button"
          onClick={() => toggleSection('shape')}
          className="w-full flex items-center justify-between py-1 text-sm font-semibold text-obsidian-900"
        >
          <span>Frame Geometry</span>
          {expandedSections.shape ? (
            <ChevronUp className="w-4 h-4 text-obsidian-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-obsidian-400" />
          )}
        </button>
        {expandedSections.shape && (
          <div className="mt-3 space-y-2">
            {SHAPES.map((shape) => {
              const isChecked = filters.frameShape.includes(shape.id);
              return (
                <label
                  key={shape.id}
                  className="flex items-center justify-between text-xs text-obsidian-700 hover:text-obsidian-950 cursor-pointer py-1"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCheckboxToggle('frameShape', shape.id)}
                      className="w-4 h-4 rounded border-obsidian-300 text-obsidian-900 focus:ring-gold"
                    />
                    <span className={isChecked ? 'font-semibold text-obsidian-950' : ''}>
                      {shape.label}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Material */}
      <div className="border-b border-obsidian-100 pb-5">
        <button
          type="button"
          onClick={() => toggleSection('material')}
          className="w-full flex items-center justify-between py-1 text-sm font-semibold text-obsidian-900"
        >
          <span>Craft Material</span>
          {expandedSections.material ? (
            <ChevronUp className="w-4 h-4 text-obsidian-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-obsidian-400" />
          )}
        </button>
        {expandedSections.material && (
          <div className="mt-3 space-y-2">
            {MATERIALS.map((mat) => {
              const isChecked = filters.frameMaterial.includes(mat.id);
              return (
                <label
                  key={mat.id}
                  className="flex items-center justify-between text-xs text-obsidian-700 hover:text-obsidian-950 cursor-pointer py-1"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCheckboxToggle('frameMaterial', mat.id)}
                      className="w-4 h-4 rounded border-obsidian-300 text-obsidian-900 focus:ring-gold"
                    />
                    <span className={isChecked ? 'font-semibold text-obsidian-950' : ''}>
                      {mat.label}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Frame Rim Construction */}
      <div className="border-b border-obsidian-100 pb-5">
        <button
          type="button"
          onClick={() => toggleSection('type')}
          className="w-full flex items-center justify-between py-1 text-sm font-semibold text-obsidian-900"
        >
          <span>Rim Construction</span>
          {expandedSections.type ? (
            <ChevronUp className="w-4 h-4 text-obsidian-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-obsidian-400" />
          )}
        </button>
        {expandedSections.type && (
          <div className="mt-3 space-y-2">
            {FRAME_TYPES.map((type) => {
              const isChecked = filters.frameType.includes(type.id);
              return (
                <label
                  key={type.id}
                  className="flex items-center justify-between text-xs text-obsidian-700 hover:text-obsidian-950 cursor-pointer py-1"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCheckboxToggle('frameType', type.id)}
                      className="w-4 h-4 rounded border-obsidian-300 text-obsidian-900 focus:ring-gold"
                    />
                    <span className={isChecked ? 'font-semibold text-obsidian-950' : ''}>
                      {type.label}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Color Swatch Picker */}
      <div className="border-b border-obsidian-100 pb-5">
        <button
          type="button"
          onClick={() => toggleSection('color')}
          className="w-full flex items-center justify-between py-1 text-sm font-semibold text-obsidian-900"
        >
          <span>Color Tones</span>
          {expandedSections.color ? (
            <ChevronUp className="w-4 h-4 text-obsidian-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-obsidian-400" />
          )}
        </button>
        {expandedSections.color && (
          <div className="mt-3 flex flex-wrap gap-2.5">
            {COLORS.map((c) => {
              const isSelected = filters.color === c.name.toLowerCase();
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...filters,
                      color: isSelected ? '' : c.name.toLowerCase(),
                    })
                  }
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                    isSelected
                      ? 'border-obsidian-900 bg-obsidian-900 text-white shadow-sm'
                      : 'border-obsidian-200 hover:border-obsidian-400 text-obsidian-700'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-black/20"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm font-semibold text-obsidian-900">
          <span>Max Price</span>
          <span className="text-xs font-bold text-gold-700">
            ₹{filters.maxPrice.toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min={2000}
          max={10000}
          step={500}
          value={filters.maxPrice}
          onChange={(e) =>
            onChange({
              ...filters,
              maxPrice: Number(e.target.value),
            })
          }
          className="w-full h-1.5 bg-obsidian-200 rounded-lg appearance-none cursor-pointer accent-obsidian-950"
        />
        <div className="flex justify-between text-[11px] text-obsidian-400">
          <span>₹2,000</span>
          <span>₹10,000+</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Filter Column */}
      <aside className="hidden lg:block w-72 shrink-0 pr-6">
        <div className="sticky top-28 bg-white rounded-2xl border border-obsidian-200/80 p-6 shadow-sm">
          {FilterContent}
        </div>
      </aside>

      {/* Mobile Drawer Trigger Button */}
      <div className="lg:hidden w-full mb-4">
        <button
          type="button"
          onClick={() => setIsOpenMobile(true)}
          className="w-full py-3 px-4 rounded-xl border border-obsidian-300 bg-white flex items-center justify-between text-xs font-semibold text-obsidian-900 shadow-sm active:bg-obsidian-50"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gold" />
            <span>Filter & Refine</span>
            {activeFilterCount > 0 && (
              <span className="bg-obsidian-900 text-white text-[10px] px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </span>
          <span className="text-obsidian-500 font-normal">({totalResults} styles)</span>
        </button>
      </div>

      {/* Mobile Slide-Over Sheet */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpenMobile(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-white shadow-2xl z-50 flex flex-col">
            <div className="p-4 border-b border-obsidian-100 flex items-center justify-between">
              <h3 className="font-serif text-lg font-medium text-obsidian-900">Filters</h3>
              <button
                type="button"
                onClick={() => setIsOpenMobile(false)}
                className="p-2 text-obsidian-500 hover:text-obsidian-900 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">{FilterContent}</div>
            <div className="p-4 border-t border-obsidian-100 bg-obsidian-50">
              <button
                type="button"
                onClick={() => setIsOpenMobile(false)}
                className="w-full py-3 rounded-xl bg-obsidian-900 text-white text-xs font-bold uppercase tracking-wider shadow-md"
              >
                Show {totalResults} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
