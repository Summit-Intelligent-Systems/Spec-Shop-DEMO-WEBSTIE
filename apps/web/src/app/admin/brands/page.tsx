'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Award, Edit3, Trash2, Globe, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import DataTable, { type Column } from '@/components/admin/DataTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import FormField from '@/components/admin/FormField';

interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  country?: string;
  website?: string;
  isPremium: boolean;
  isActive: boolean;
  sortOrder: number;
  _count?: { products: number };
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [country, setCountry] = useState('');
  const [website, setWebsite] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet<any>('/admin/brands');
      setBrands(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Failed to load brands:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const openCreate = () => {
    setEditingBrand(null);
    setName('');
    setDescription('');
    setLogoUrl('');
    setCountry('');
    setWebsite('');
    setIsPremium(false);
    setIsActive(true);
    setSortOrder(brands.length);
    setModalOpen(true);
  };

  const openEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setName(brand.name);
    setDescription(brand.description || '');
    setLogoUrl(brand.logoUrl || '');
    setCountry(brand.country || '');
    setWebsite(brand.website || '');
    setIsPremium(brand.isPremium);
    setIsActive(brand.isActive);
    setSortOrder(brand.sortOrder || 0);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name,
        description: description || undefined,
        logoUrl: logoUrl || undefined,
        country: country || undefined,
        website: website || undefined,
        isPremium,
        isActive,
        sortOrder: Number(sortOrder) || 0,
      };

      if (editingBrand) {
        await apiPut(`/admin/brands/${editingBrand.id}`, payload);
      } else {
        await apiPost('/admin/brands', payload);
      }
      setModalOpen(false);
      fetchBrands();
    } catch (err) {
      console.error('Error saving brand:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiDelete(`/admin/brands/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchBrands();
    } catch (err) {
      console.error('Error deleting brand:', err);
    }
  };

  const columns: Column<Brand>[] = [
    {
      header: 'Brand',
      accessor: (brand) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-obsidian-800 border border-obsidian-700 flex items-center justify-center overflow-hidden flex-shrink-0">
            {brand.logoUrl ? (
              <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-contain p-1" />
            ) : (
              <Award className="w-5 h-5 text-gold/60" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-white text-sm">{brand.name}</span>
              {brand.isPremium && (
                <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded bg-gold/20 text-gold border border-gold/30">
                  Premium
                </span>
              )}
            </div>
            <span className="text-xs text-obsidian-400 font-mono">/{brand.slug}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Origin',
      accessor: (brand) => (
        <span className="text-xs text-obsidian-300">{brand.country || 'Global'}</span>
      ),
    },
    {
      header: 'Website',
      accessor: (brand) =>
        brand.website ? (
          <a
            href={brand.website}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-xs text-gold/80 hover:text-gold"
          >
            <Globe className="w-3.5 h-3.5" />
            Visit
          </a>
        ) : (
          <span className="text-xs text-obsidian-500">—</span>
        ),
    },
    {
      header: 'Products',
      accessor: (brand) => (
        <span className="px-2.5 py-1 text-xs rounded-full bg-obsidian-800 text-obsidian-200 border border-obsidian-700">
          {brand._count?.products ?? 0} items
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (brand) => (
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
            brand.isActive
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-obsidian-800 text-obsidian-400 border border-obsidian-700'
          }`}
        >
          {brand.isActive ? (
            <>
              <CheckCircle2 className="w-3 h-3" /> Active
            </>
          ) : (
            <>
              <XCircle className="w-3 h-3" /> Inactive
            </>
          )}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      accessor: (brand) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => openEdit(brand)}
            className="p-1.5 rounded-lg text-obsidian-400 hover:text-gold hover:bg-obsidian-800 transition-colors"
            title="Edit"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTarget(brand)}
            className="p-1.5 rounded-lg text-obsidian-400 hover:text-red-400 hover:bg-obsidian-800 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Award className="w-7 h-7 text-gold" />
            Brands
          </h1>
          <p className="text-sm text-obsidian-400 mt-1">
            Manage luxury eyewear makers, logos, tiers, and partner portfolios.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchBrands}
            className="p-2.5 rounded-xl bg-obsidian-800/80 hover:bg-obsidian-700 text-obsidian-300 border border-obsidian-700 transition-all"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-obsidian-950 font-medium text-sm transition-all shadow-md shadow-gold/20"
          >
            <Plus className="w-4 h-4" />
            Add Brand
          </button>
        </div>
      </div>

      <div className="bg-obsidian-900/60 border border-obsidian-800/80 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
        <DataTable
          columns={columns}
          data={brands}
          loading={loading}
          emptyTitle="No brands found"
          emptyDescription="Add designer houses and boutique frame manufacturers."
          keyField="id"
        />
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-sm">
          <div className="bg-obsidian-900 border border-obsidian-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-obsidian-800 pb-4">
              <h2 className="text-lg font-bold text-white">
                {editingBrand ? 'Edit Brand' : 'Create Brand'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-obsidian-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <FormField label="Brand Name" required>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Masunaga, Oliver Peoples, Ray-Ban"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800/80 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Country of Origin">
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. Japan, Italy, Germany"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800/80 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
                  />
                </FormField>
                <FormField label="Website">
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800/80 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
                  />
                </FormField>
              </div>

              <FormField label="Logo URL">
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="/images/brands/logo.png or remote URL"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800/80 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
                />
              </FormField>

              <FormField label="Description">
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Heritage, craftsmanship, and aesthetic hallmarks"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800/80 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
                />
              </FormField>

              <div className="flex items-center gap-6 py-2">
                <label className="flex items-center gap-2.5 text-sm text-obsidian-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPremium}
                    onChange={(e) => setIsPremium(e.target.checked)}
                    className="w-4 h-4 rounded border-obsidian-700 text-gold focus:ring-gold bg-obsidian-800"
                  />
                  <span>Premium / Luxury House</span>
                </label>

                <label className="flex items-center gap-2.5 text-sm text-obsidian-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded border-obsidian-700 text-gold focus:ring-gold bg-obsidian-800"
                  />
                  <span>Active Brand</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-obsidian-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-obsidian-800 text-obsidian-300 hover:text-white text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gold hover:bg-gold-light text-obsidian-950 text-sm font-medium transition-all shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingBrand ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Brand"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        confirmText="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
