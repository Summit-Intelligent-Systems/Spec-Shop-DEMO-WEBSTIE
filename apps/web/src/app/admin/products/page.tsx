'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Package,
  MoreVertical,
  Copy,
  Archive,
  Trash2,
  Eye,
  Edit3,
  Check,
  X,
  Filter,
} from 'lucide-react';
import { DataTable, type Column } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { apiPost, apiPatch, apiDelete } from '@/lib/api';
import toast from 'react-hot-toast';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  status: string;
  basePrice: number;
  baseComparePrice?: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  gender: string;
  averageRating: number;
  reviewCount: number;
  viewCount: number;
  purchaseCount: number;
  createdAt: string;
  brand: { id: string; name: string };
  category: { id: string; name: string };
  variants: Array<{ id: string; sku: string; color?: string; stock: number; price: number; isActive: boolean }>;
  media: Array<{ id: string; url: string }>;
  _count: { variants: number; reviews: number };
}

interface PaginatedResponse {
  data: AdminProduct[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

const totalStock = (variants: AdminProduct['variants']) =>
  variants.reduce((sum, v) => sum + v.stock, 0);

// ─── Page Component ───────────────────────────────────────────────────────────

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id?: string; name?: string }>({ open: false });
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const limit = 20;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
      });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/admin/products?${params}`,
        {
          headers: {
            Authorization: `Bearer ${(await import('@/lib/store/authStore')).useAuthStore.getState().accessToken}`,
          },
        },
      );
      const result: PaginatedResponse = await response.json();
      if (result.data) {
        setProducts(result.data);
        setTotalPages(result.pagination.totalPages);
        setTotal(result.pagination.total);
      }
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await apiPatch(`/admin/products/${id}/status`, { status });
      toast.success(`Product ${status === 'ACTIVE' ? 'published' : status.toLowerCase()}`);
      fetchProducts();
    } catch {
      toast.error('Failed to update status');
    }
    setActiveMenu(null);
  };

  const handleDuplicate = async (id: string) => {
    try {
      await apiPost(`/admin/products/${id}/duplicate`);
      toast.success('Product duplicated');
      fetchProducts();
    } catch {
      toast.error('Failed to duplicate');
    }
    setActiveMenu(null);
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    try {
      await apiDelete(`/admin/products/${deleteDialog.id}`);
      toast.success('Product deleted');
      setDeleteDialog({ open: false });
      fetchProducts();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedIds.size === 0) return;
    try {
      await apiPost('/admin/products/bulk', { ids: Array.from(selectedIds), action });
      toast.success(`${selectedIds.size} products ${action}ed`);
      setSelectedIds(new Set());
      fetchProducts();
    } catch {
      toast.error('Bulk action failed');
    }
  };

  const columns: Column<AdminProduct>[] = [
    {
      key: 'name',
      label: 'Product',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-obsidian-800 overflow-hidden flex-shrink-0">
            {row.media?.[0]?.url ? (
              <img src={row.media[0].url} alt={row.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-4 h-4 text-obsidian-600" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <Link href={`/admin/products/${row.id}`} className="text-sm font-medium text-white hover:text-gold transition-colors truncate block">
              {row.name}
            </Link>
            <p className="text-[11px] text-obsidian-500 font-mono">{row.sku}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'basePrice',
      label: 'Price',
      sortable: true,
      headerClassName: 'text-right',
      className: 'text-right',
      render: (row) => (
        <div>
          <span className="text-white font-semibold">{formatCurrency(Number(row.basePrice))}</span>
          {row.baseComparePrice && (
            <span className="text-obsidian-600 line-through ml-1.5 text-xs">
              {formatCurrency(Number(row.baseComparePrice))}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (row) => {
        const stock = totalStock(row.variants);
        return (
          <span className={`text-sm font-mono font-medium ${stock === 0 ? 'text-rose-400' : stock <= 5 ? 'text-amber-400' : 'text-obsidian-300'}`}>
            {stock}
          </span>
        );
      },
    },
    {
      key: 'category',
      label: 'Category',
      className: 'hidden xl:table-cell',
      headerClassName: 'hidden xl:table-cell',
      render: (row) => <span className="text-obsidian-400 text-xs">{row.category?.name}</span>,
    },
    {
      key: 'brand',
      label: 'Brand',
      className: 'hidden lg:table-cell',
      headerClassName: 'hidden lg:table-cell',
      render: (row) => <span className="text-obsidian-400 text-xs">{row.brand?.name}</span>,
    },
    {
      key: 'actions',
      label: '',
      className: 'w-12',
      render: (row) => (
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === row.id ? null : row.id); }}
            className="p-1.5 rounded-lg text-obsidian-500 hover:text-white hover:bg-obsidian-800/60 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {activeMenu === row.id && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />
              <div className="absolute right-0 top-full mt-1 w-44 bg-obsidian-800 border border-obsidian-700/60 rounded-xl shadow-xl z-50 py-1.5 overflow-hidden">
                <Link
                  href={`/admin/products/${row.id}`}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-obsidian-300 hover:text-white hover:bg-obsidian-700/60 transition-colors"
                  onClick={() => setActiveMenu(null)}
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Product
                </Link>
                <Link
                  href={`/product/${row.slug}`}
                  target="_blank"
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-obsidian-300 hover:text-white hover:bg-obsidian-700/60 transition-colors"
                  onClick={() => setActiveMenu(null)}
                >
                  <Eye className="w-3.5 h-3.5" /> View on Store
                </Link>
                <button
                  onClick={() => handleDuplicate(row.id)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-obsidian-300 hover:text-white hover:bg-obsidian-700/60 transition-colors w-full text-left"
                >
                  <Copy className="w-3.5 h-3.5" /> Duplicate
                </button>
                <div className="border-t border-obsidian-700/40 my-1" />
                {row.status !== 'ACTIVE' && (
                  <button
                    onClick={() => handleStatusChange(row.id, 'ACTIVE')}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-emerald-400 hover:bg-emerald-500/10 transition-colors w-full text-left"
                  >
                    <Check className="w-3.5 h-3.5" /> Publish
                  </button>
                )}
                {row.status === 'ACTIVE' && (
                  <button
                    onClick={() => handleStatusChange(row.id, 'DRAFT')}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-amber-400 hover:bg-amber-500/10 transition-colors w-full text-left"
                  >
                    <X className="w-3.5 h-3.5" /> Unpublish
                  </button>
                )}
                <button
                  onClick={() => handleStatusChange(row.id, 'ARCHIVED')}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-obsidian-400 hover:bg-obsidian-700/60 transition-colors w-full text-left"
                >
                  <Archive className="w-3.5 h-3.5" /> Archive
                </button>
                <button
                  onClick={() => { setDeleteDialog({ open: true, id: row.id, name: row.name }); setActiveMenu(null); }}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors w-full text-left"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-gold uppercase">Catalog</span>
          <h1 className="font-serif text-3xl font-medium text-white mt-1">Products</h1>
          <p className="text-sm text-obsidian-500 mt-0.5">{total} products in catalog</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gold to-amber-600 text-obsidian-950 rounded-xl text-sm font-semibold hover:from-amber-500 hover:to-amber-700 transition-all shadow-md shadow-gold/20"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-obsidian-500">
          <Filter className="w-3.5 h-3.5" /> Status:
        </div>
        {['', 'ACTIVE', 'DRAFT', 'ARCHIVED', 'OUT_OF_STOCK'].map((status) => (
          <button
            key={status}
            onClick={() => { setStatusFilter(status); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === status
                ? 'bg-gold/15 text-gold border border-gold/30'
                : 'text-obsidian-500 hover:text-white hover:bg-obsidian-800/60 border border-transparent'
            }`}
          >
            {status || 'All'}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        emptyMessage="No products found. Create your first product to get started."
        emptyIcon={<Package className="w-12 h-12" />}
        page={page}
        totalPages={totalPages}
        total={total}
        limit={limit}
        onPageChange={setPage}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search products by name, SKU..."
        onRowClick={(row) => router.push(`/admin/products/${row.id}`)}
        bulkActions={
          <div className="flex items-center gap-2">
            <button onClick={() => handleBulkAction('publish')} className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 transition-colors">
              Publish
            </button>
            <button onClick={() => handleBulkAction('unpublish')} className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 transition-colors">
              Unpublish
            </button>
            <button onClick={() => handleBulkAction('archive')} className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 transition-colors">
              Archive
            </button>
          </div>
        }
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialog.open}
        title={`Delete "${deleteDialog.name}"?`}
        description="This action cannot be undone. All variants, images, and inventory data for this product will be permanently removed."
        confirmLabel="Delete Product"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false })}
      />
    </div>
  );
}
