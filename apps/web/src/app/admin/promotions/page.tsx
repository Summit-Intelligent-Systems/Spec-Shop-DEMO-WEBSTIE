'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Megaphone, Plus, Trash2, Edit3, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import DataTable, { type Column } from '@/components/admin/DataTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import FormField from '@/components/admin/FormField';

interface Promotion {
  id: string;
  name: string;
  slug: string;
  description?: string;
  type: string;
  status: string;
  discountType: string;
  discountValue: number;
  bannerImageUrl?: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Promotion | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('FLASH_SALE');
  const [discountType, setDiscountType] = useState('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState<number>(20);
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [isActive, setIsActive] = useState(true);

  const fetchPromotions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet<any>('/admin/promotions');
      const data = res.data?.data || res.data || [];
      if (Array.isArray(data) && data.length > 0) {
        setPromotions(data);
      } else {
        setPromotions([
          {
            id: 'promo-1',
            name: 'Autumn Equinox Flash Sale',
            slug: 'autumn-equinox-flash-sale',
            description: '20% off all handcrafted Japanese Titanium frames for 72 hours',
            type: 'FLASH_SALE',
            status: 'ACTIVE',
            discountType: 'PERCENTAGE',
            discountValue: 20,
            bannerImageUrl: '/images/hero-banner.jpg',
            startsAt: '2026-09-08T00:00:00Z',
            endsAt: '2026-09-12T23:59:59Z',
            isActive: true,
          },
        ]);
      }
    } catch (err) {
      console.warn('API error, using mock promotions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const openCreate = () => {
    setEditingPromo(null);
    setName('');
    setDescription('');
    setType('FLASH_SALE');
    setDiscountType('PERCENTAGE');
    setDiscountValue(20);
    setBannerImageUrl('/images/hero-banner.jpg');
    setStartsAt(new Date().toISOString().slice(0, 10));
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setEndsAt(nextWeek.toISOString().slice(0, 10));
    setIsActive(true);
    setModalOpen(true);
  };

  const openEdit = (p: Promotion) => {
    setEditingPromo(p);
    setName(p.name);
    setDescription(p.description || '');
    setType(p.type);
    setDiscountType(p.discountType);
    setDiscountValue(Number(p.discountValue));
    setBannerImageUrl(p.bannerImageUrl || '');
    setStartsAt(p.startsAt ? p.startsAt.slice(0, 10) : '');
    setEndsAt(p.endsAt ? p.endsAt.slice(0, 10) : '');
    setIsActive(p.isActive);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name,
        description: description || undefined,
        type,
        discountType,
        discountValue: Number(discountValue),
        bannerImageUrl: bannerImageUrl || undefined,
        startsAt: new Date(startsAt).toISOString(),
        endsAt: new Date(endsAt).toISOString(),
        isActive,
      };

      if (editingPromo) {
        await apiPut(`/admin/promotions/${editingPromo.id}`, payload);
      } else {
        await apiPost('/admin/promotions', payload);
      }
      setModalOpen(false);
      fetchPromotions();
    } catch (err) {
      console.error('Failed to save promotion:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiDelete(`/admin/promotions/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchPromotions();
    } catch (err) {
      console.error('Failed to delete promotion:', err);
    }
  };

  const columns: Column<Promotion>[] = [
    {
      header: 'Campaign Name',
      accessor: (p) => (
        <div>
          <span className="font-semibold text-white text-sm block">{p.name}</span>
          <span className="text-xs text-obsidian-400 font-mono">/{p.slug}</span>
        </div>
      ),
    },
    {
      header: 'Type',
      accessor: (p) => (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase bg-gold/15 text-gold border border-gold/30">
          {p.type.replace('_', ' ')}
        </span>
      ),
    },
    {
      header: 'Discount',
      accessor: (p) => (
        <span className="text-sm font-semibold text-white font-mono">
          {p.discountType === 'PERCENTAGE' ? `${p.discountValue}% Off` : `₹${p.discountValue} Off`}
        </span>
      ),
    },
    {
      header: 'Duration',
      accessor: (p) => (
        <div className="text-xs text-obsidian-300">
          <span>{new Date(p.startsAt).toLocaleDateString()}</span>
          <span className="text-obsidian-500 mx-1">&rarr;</span>
          <span>{new Date(p.endsAt).toLocaleDateString()}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (p) => (
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
            p.isActive
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-obsidian-800 text-obsidian-400 border border-obsidian-700'
          }`}
        >
          {p.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
          {p.isActive ? 'Active' : 'Draft'}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      accessor: (p) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => openEdit(p)}
            className="p-1.5 rounded-lg text-obsidian-400 hover:text-gold hover:bg-obsidian-800 transition-colors"
            title="Edit"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTarget(p)}
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
            <Megaphone className="w-7 h-7 text-gold" />
            Promotions & Flash Sales
          </h1>
          <p className="text-sm text-obsidian-400 mt-1">
            Run scheduled promotional campaigns, seasonal sales banners, and limited-time frame discounts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchPromotions}
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
            Create Campaign
          </button>
        </div>
      </div>

      <div className="bg-obsidian-900/60 border border-obsidian-800/80 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
        <DataTable
          columns={columns}
          data={promotions}
          loading={loading}
          emptyTitle="No campaigns active"
          emptyDescription="Launch flash sales or seasonal offers to engage customers."
          keyField="id"
        />
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-sm">
          <div className="bg-obsidian-900 border border-obsidian-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-obsidian-800 pb-4">
              <h2 className="text-lg font-bold text-white">
                {editingPromo ? 'Edit Promotion' : 'New Promotional Campaign'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-obsidian-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <FormField label="Campaign Title" required>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Summer Optical Showcase"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800/80 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Campaign Type">
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800/80 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
                  >
                    <option value="FLASH_SALE">Flash Sale</option>
                    <option value="SEASONAL">Seasonal Event</option>
                    <option value="CLEARANCE">Clearance</option>
                    <option value="BUNDLE">Bundle Offer</option>
                  </select>
                </FormField>

                <FormField label="Discount Value (%)">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800/80 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Start Date" required>
                  <input
                    type="date"
                    required
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800/80 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
                  />
                </FormField>
                <FormField label="End Date" required>
                  <input
                    type="date"
                    required
                    value={endsAt}
                    onChange={(e) => setEndsAt(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800/80 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
                  />
                </FormField>
              </div>

              <FormField label="Banner Image URL">
                <input
                  type="text"
                  value={bannerImageUrl}
                  onChange={(e) => setBannerImageUrl(e.target.value)}
                  placeholder="/images/hero-banner.jpg"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800/80 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
                />
              </FormField>

              <FormField label="Description">
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short subheadline for banner banner display"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800/80 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
                />
              </FormField>

              <label className="flex items-center gap-2.5 text-sm text-obsidian-200 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-obsidian-700 text-gold focus:ring-gold bg-obsidian-800"
                />
                <span>Active Immediately</span>
              </label>

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
                  {submitting ? 'Saving...' : editingPromo ? 'Save Changes' : 'Launch Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Promotion"
        message={`Are you sure you want to delete campaign "${deleteTarget?.name}"?`}
        confirmText="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
