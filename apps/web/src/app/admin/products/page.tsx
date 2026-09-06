'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

type ProductStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';

interface AdminProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  basePrice: number;
  stock: number;
  status: ProductStatus;
  image: string;
  rating: number;
  sales: number;
}

const PRODUCTS: AdminProduct[] = [
  { id: 'p1', name: 'The Sovereign Round', sku: 'XYZ-OPT-001', category: 'Eyeglasses', brand: 'XYZ Masterworks', basePrice: 3499, stock: 42, status: 'PUBLISHED', image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=200&auto=format&fit=crop&q=60', rating: 4.9, sales: 156 },
  { id: 'p2', name: 'The Aurelius Aviator', sku: 'XYZ-SUN-004', category: 'Sunglasses', brand: 'XYZ Masterworks', basePrice: 4999, stock: 28, status: 'PUBLISHED', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&auto=format&fit=crop&q=60', rating: 4.8, sales: 213 },
  { id: 'p3', name: 'The Athena Cat-Eye', sku: 'XYZ-OPT-005', category: 'Eyeglasses', brand: 'XYZ Maison', basePrice: 2999, stock: 55, status: 'PUBLISHED', image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=200&auto=format&fit=crop&q=60', rating: 4.7, sales: 98 },
  { id: 'p4', name: 'The Scholar Rectangle', sku: 'XYZ-OPT-003', category: 'Eyeglasses', brand: 'XYZ Essentials', basePrice: 1999, stock: 120, status: 'PUBLISHED', image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=200&auto=format&fit=crop&q=60', rating: 4.6, sales: 310 },
  { id: 'p5', name: 'The Monarch Browline', sku: 'XYZ-OPT-006', category: 'Eyeglasses', brand: 'XYZ Masterworks', basePrice: 3999, stock: 18, status: 'PUBLISHED', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&auto=format&fit=crop&q=60', rating: 4.8, sales: 74 },
  { id: 'p6', name: 'The Prism Sport Wrap', sku: 'XYZ-SPT-002', category: 'Sports', brand: 'XYZ Active', basePrice: 2499, stock: 65, status: 'PUBLISHED', image: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=200&auto=format&fit=crop&q=60', rating: 4.5, sales: 44 },
  { id: 'p7', name: 'The Lumina Round (Ti)', sku: 'XYZ-OPT-007', category: 'Eyeglasses', brand: 'XYZ Masterworks', basePrice: 5499, stock: 8, status: 'DRAFT', image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=200&auto=format&fit=crop&q=60', rating: 0, sales: 0 },
  { id: 'p8', name: 'The Heritage Clip-On', sku: 'XYZ-ACC-001', category: 'Accessories', brand: 'XYZ Essentials', basePrice: 999, stock: 0, status: 'ARCHIVED', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&auto=format&fit=crop&q=60', rating: 4.2, sales: 220 },
];

const statusStyle: Record<ProductStatus, string> = {
  PUBLISHED: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  DRAFT: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  ARCHIVED: 'bg-obsidian-500/15 text-obsidian-400 border-obsidian-600/30',
};

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState(PRODUCTS);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const next: ProductStatus =
          p.status === 'PUBLISHED' ? 'DRAFT' : p.status === 'DRAFT' ? 'ARCHIVED' : 'PUBLISHED';
        return { ...p, status: next };
      }),
    );
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-gold uppercase">Catalog Management</span>
          <h1 className="font-serif text-3xl font-medium text-white mt-1">
            Product Catalog
          </h1>
          <p className="text-sm text-obsidian-500 mt-1">
            {products.length} SKUs in catalog • {products.filter((p) => p.status === 'PUBLISHED').length} published
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => alert('Product creation form — coming in Phase 10 CMS.')}
          className="text-xs tracking-wider uppercase font-semibold"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-600" />
        <input
          type="text"
          placeholder="Search by name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 bg-obsidian-900/80 border border-obsidian-800/60 rounded-xl text-sm text-white placeholder:text-obsidian-600 focus:outline-none focus:border-gold/50"
        />
      </div>

      {/* Products Table */}
      <div className="bg-obsidian-900/60 border border-obsidian-800/60 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-obsidian-600 border-b border-obsidian-800/50">
                <th className="text-left px-5 py-3 font-semibold">Product</th>
                <th className="text-left px-5 py-3 font-semibold hidden md:table-cell">Category</th>
                <th className="text-right px-5 py-3 font-semibold">Price</th>
                <th className="text-center px-5 py-3 font-semibold hidden lg:table-cell">Stock</th>
                <th className="text-center px-5 py-3 font-semibold hidden lg:table-cell">Sales</th>
                <th className="text-center px-5 py-3 font-semibold">Status</th>
                <th className="text-center px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800/40">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-obsidian-800/20 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-obsidian-800 border border-obsidian-700 flex-shrink-0">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                      <div>
                        <span className="text-white font-medium block text-sm">{product.name}</span>
                        <span className="text-[11px] text-obsidian-600 font-mono">{product.sku}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-obsidian-400 text-xs hidden md:table-cell">
                    {product.category}
                    <span className="block text-obsidian-600">{product.brand}</span>
                  </td>
                  <td className="px-5 py-4 text-right text-white font-semibold">
                    ₹{product.basePrice.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-center hidden lg:table-cell">
                    <span className={`font-mono font-bold ${product.stock <= 10 ? 'text-rose-400' : product.stock <= 25 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center text-obsidian-400 hidden lg:table-cell font-mono">
                    {product.sales}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => toggleStatus(product.id)}
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border cursor-pointer hover:opacity-80 transition-opacity ${statusStyle[product.status]}`}
                    >
                      {product.status}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => alert(`Editing ${product.name}...`)}
                        className="p-1.5 rounded-lg text-obsidian-500 hover:text-gold hover:bg-gold/10 transition-colors"
                        title="Edit product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete ${product.name}?`)) {
                            setProducts((prev) => prev.filter((p) => p.id !== product.id));
                          }
                        }}
                        className="p-1.5 rounded-lg text-obsidian-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-obsidian-600">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No products match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
