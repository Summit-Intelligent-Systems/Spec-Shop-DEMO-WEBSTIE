'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Warehouse, AlertTriangle, Search, Edit3, RefreshCw } from 'lucide-react';
import { apiGet, apiPatch } from '@/lib/api';
import DataTable, { type Column } from '@/components/admin/DataTable';
import FormField from '@/components/admin/FormField';

interface InventoryItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  reservedQuantity: number;
  lowStockThreshold: number;
  reorderPoint?: number;
  reorderQuantity?: number;
  product: { id: string; name: string; sku: string; basePrice: number };
  variant?: { id: string; sku: string; color?: string; size?: string; stock: number };
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [adjustQty, setAdjustQty] = useState<number>(0);
  const [threshold, setThreshold] = useState<number>(5);
  const [saving, setSaving] = useState(false);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.set('search', search);
      if (lowStockOnly) query.set('lowStock', 'true');

      const res = await apiGet<any>(`/admin/inventory?${query.toString()}`);
      setItems(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoading(false);
    }
  }, [search, lowStockOnly]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const openAdjust = (item: InventoryItem) => {
    setEditingItem(item);
    setAdjustQty(item.quantity);
    setThreshold(item.lowStockThreshold);
  };

  const handleSaveAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setSaving(true);
    try {
      await apiPatch(`/admin/inventory/${editingItem.id}`, {
        quantity: Number(adjustQty),
        lowStockThreshold: Number(threshold),
      });
      setEditingItem(null);
      fetchInventory();
    } catch (err) {
      console.error('Failed to adjust inventory:', err);
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<InventoryItem>[] = [
    {
      header: 'Product & Variant',
      accessor: (item) => (
        <div>
          <span className="font-medium text-white text-sm block">{item.product?.name || 'Item'}</span>
          <div className="flex items-center gap-2 text-xs text-obsidian-400 mt-0.5">
            <span className="font-mono">SKU: {item.variant?.sku || item.product?.sku}</span>
            {item.variant?.color && (
              <span className="px-1.5 py-0.5 rounded bg-obsidian-800 text-obsidian-300">
                {item.variant.color}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'On Hand',
      accessor: (item) => {
        const isLow = item.quantity <= item.lowStockThreshold;
        return (
          <div className="flex items-center gap-2">
            <span
              className={`font-semibold text-sm ${
                isLow ? 'text-amber-400' : 'text-white'
              }`}
            >
              {item.quantity}
            </span>
            {isLow && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                <AlertTriangle className="w-3 h-3" /> Low Stock
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: 'Reserved',
      accessor: (item) => (
        <span className="text-xs text-obsidian-400">{item.reservedQuantity}</span>
      ),
    },
    {
      header: 'Threshold',
      accessor: (item) => (
        <span className="text-xs text-obsidian-400 font-mono">&le; {item.lowStockThreshold}</span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      accessor: (item) => (
        <button
          onClick={() => openAdjust(item)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-800 hover:bg-obsidian-700 text-gold text-xs font-medium border border-obsidian-700 transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" /> Adjust
        </button>
      ),
    },
  ];

  const lowCount = items.filter((i) => i.quantity <= i.lowStockThreshold).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Warehouse className="w-7 h-7 text-gold" />
            Inventory Control
          </h1>
          <p className="text-sm text-obsidian-400 mt-1">
            Monitor warehouse stocks, restock thresholds, and variant reserves.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchInventory}
            className="p-2.5 rounded-xl bg-obsidian-800/80 hover:bg-obsidian-700 text-obsidian-300 border border-obsidian-700 transition-all"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-obsidian-900/60 border border-obsidian-800/80 backdrop-blur-sm">
          <span className="text-xs font-medium text-obsidian-400 uppercase tracking-wider">Total SKUs</span>
          <p className="text-2xl font-bold text-white mt-1">{items.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-obsidian-900/60 border border-obsidian-800/80 backdrop-blur-sm">
          <span className="text-xs font-medium text-obsidian-400 uppercase tracking-wider">Low Stock Warnings</span>
          <p className="text-2xl font-bold text-amber-400 mt-1">{lowCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-obsidian-900/60 border border-obsidian-800/80 backdrop-blur-sm">
          <span className="text-xs font-medium text-obsidian-400 uppercase tracking-wider">Total Stock Count</span>
          <p className="text-2xl font-bold text-gold mt-1">
            {items.reduce((acc, i) => acc + (i.quantity || 0), 0)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-obsidian-400" />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-obsidian-800/60 border border-obsidian-700 text-white text-sm placeholder-obsidian-500 focus:border-gold focus:outline-none"
          />
        </div>
        <label className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-obsidian-800/60 border border-obsidian-700 text-sm text-obsidian-200 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(e) => setLowStockOnly(e.target.checked)}
            className="w-4 h-4 rounded border-obsidian-700 text-amber-500 focus:ring-amber-500 bg-obsidian-900"
          />
          <span>Show Low Stock Only</span>
        </label>
      </div>

      {/* Data Table */}
      <div className="bg-obsidian-900/60 border border-obsidian-800/80 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
        <DataTable
          columns={columns}
          data={items}
          loading={loading}
          emptyTitle="No inventory records"
          emptyDescription="Inventory units are automatically registered with product variants."
          keyField="id"
        />
      </div>

      {/* Adjust Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-sm">
          <div className="bg-obsidian-900 border border-obsidian-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-obsidian-800 pb-4">
              <h2 className="text-lg font-bold text-white">Adjust Stock</h2>
              <button
                onClick={() => setEditingItem(null)}
                className="text-obsidian-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-white">{editingItem.product?.name}</p>
                <p className="text-xs text-obsidian-400 font-mono mt-0.5">
                  SKU: {editingItem.variant?.sku || editingItem.product?.sku}
                </p>
              </div>

              <FormField label="Current On-Hand Quantity" required>
                <input
                  type="number"
                  min="0"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800/80 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none font-semibold text-lg"
                />
              </FormField>

              <FormField label="Low Stock Warning Threshold">
                <input
                  type="number"
                  min="1"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800/80 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
                />
              </FormField>

              <div className="flex justify-end gap-3 pt-4 border-t border-obsidian-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl bg-obsidian-800 text-obsidian-300 hover:text-white text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-gold hover:bg-gold-light text-obsidian-950 text-sm font-medium transition-all shadow-md disabled:opacity-50"
                >
                  {saving ? 'Updating...' : 'Save Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
