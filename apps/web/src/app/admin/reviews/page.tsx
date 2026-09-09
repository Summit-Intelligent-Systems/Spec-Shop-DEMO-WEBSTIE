'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Star, CheckCircle2, XCircle, Trash2, RefreshCw } from 'lucide-react';
import { apiGet, apiPatch, apiDelete } from '@/lib/api';
import DataTable, { type Column } from '@/components/admin/DataTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

interface Review {
  id: string;
  rating: number;
  title?: string;
  comment: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  product: { id: string; name: string };
  user: { email: string; profile?: { firstName: string; lastName?: string } };
}

export default function ReviewsModerationPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet<any>('/admin/reviews');
      const data = res.data?.data || res.data || [];
      if (Array.isArray(data) && data.length > 0) {
        setReviews(data);
      } else {
        setReviews([
          {
            id: 'r-1',
            rating: 5,
            title: 'Exquisite frame & flawless optics',
            comment: 'The Japanese titanium build is featherlight. My progressive prescription was surfaced with zero peripheral distortion.',
            status: 'APPROVED',
            createdAt: '2026-09-02T10:00:00Z',
            product: { id: 'p-1', name: 'The Sovereign Round' },
            user: { email: 'sophia@example.com', profile: { firstName: 'Sophia', lastName: 'Vane' } },
          },
          {
            id: 'r-2',
            rating: 4,
            title: 'Great fit, premium feel',
            comment: 'Very solid hinges and classic tortoiseshell acetate.',
            status: 'PENDING',
            createdAt: '2026-09-04T14:30:00Z',
            product: { id: 'p-2', name: 'The Kensington Square' },
            user: { email: 'arjun@example.com', profile: { firstName: 'Arjun', lastName: 'Patel' } },
          },
        ]);
      }
    } catch (err) {
      console.warn('API error, using mock reviews:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const updateReviewStatus = async (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    try {
      await apiPatch(`/admin/reviews/${id}`, { status: newStatus });
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
    } catch (err) {
      console.error('Failed to update review status:', err);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiDelete(`/admin/reviews/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchReviews();
    } catch (err) {
      console.error('Failed to delete review:', err);
    }
  };

  const filtered = reviews.filter((r) =>
    statusFilter === 'ALL' ? true : r.status === statusFilter
  );

  const columns: Column<Review>[] = [
    {
      header: 'Product & Customer',
      accessor: (r) => (
        <div>
          <span className="font-semibold text-white text-sm block">{r.product?.name || 'Product'}</span>
          <span className="text-xs text-obsidian-400">
            By {r.user?.profile?.firstName || r.user?.email || 'Anonymous'}
          </span>
        </div>
      ),
    },
    {
      header: 'Rating & Feedback',
      accessor: (r) => (
        <div className="max-w-md space-y-1">
          <div className="flex items-center gap-1 text-gold">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-gold text-gold' : 'text-obsidian-700'}`}
              />
            ))}
            <span className="text-xs font-mono font-bold ml-1 text-white">{r.rating}/5</span>
          </div>
          {r.title && <p className="text-xs font-semibold text-white">{r.title}</p>}
          <p className="text-xs text-obsidian-300 line-clamp-2">{r.comment}</p>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (r) => (
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${
            r.status === 'APPROVED'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : r.status === 'PENDING'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}
        >
          {r.status}
        </span>
      ),
    },
    {
      header: 'Moderation',
      className: 'text-right',
      accessor: (r) => (
        <div className="flex items-center justify-end gap-1.5">
          {r.status !== 'APPROVED' && (
            <button
              onClick={() => updateReviewStatus(r.id, 'APPROVED')}
              className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors"
              title="Approve Review"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
          {r.status !== 'REJECTED' && (
            <button
              onClick={() => updateReviewStatus(r.id, 'REJECTED')}
              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Reject Review"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setDeleteTarget(r)}
            className="p-1.5 rounded-lg text-obsidian-500 hover:text-red-400 hover:bg-obsidian-800 transition-colors"
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
            <Star className="w-7 h-7 text-gold" />
            Review Moderation
          </h1>
          <p className="text-sm text-obsidian-400 mt-1">
            Approve verified buyer feedback, filter spam, and ensure community standards.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-obsidian-900/80 border border-obsidian-800 rounded-xl p-1">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === st
                    ? 'bg-gold/15 text-gold border border-gold/30'
                    : 'text-obsidian-400 hover:text-white border border-transparent'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
          <button
            onClick={fetchReviews}
            className="p-2.5 rounded-xl bg-obsidian-800/80 hover:bg-obsidian-700 text-obsidian-300 border border-obsidian-700 transition-all"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="bg-obsidian-900/60 border border-obsidian-800/80 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
        <DataTable
          columns={columns}
          data={filtered}
          loading={loading}
          emptyTitle="No reviews found"
          emptyDescription="Customer product ratings will appear here for verification."
          keyField="id"
        />
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Review"
        message="Are you sure you want to permanently delete this customer review?"
        confirmText="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
