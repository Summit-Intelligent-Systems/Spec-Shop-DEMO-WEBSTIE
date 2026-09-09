'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, Plus, Edit3, Trash2, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import DataTable, { type Column } from '@/components/admin/DataTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import FormField from '@/components/admin/FormField';

interface ContentPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished: boolean;
  publishedAt?: string;
  updatedAt: string;
}

export default function ContentPagesManager() {
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<ContentPage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContentPage | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const fetchPages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet<any>('/admin/pages');
      setPages(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Failed to load content pages:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const openCreate = () => {
    setEditingPage(null);
    setTitle('');
    setSlug('');
    setContent('<h2>Page Heading</h2><p>Write your detailed page content here...</p>');
    setExcerpt('');
    setMetaTitle('');
    setMetaDescription('');
    setIsPublished(true);
    setModalOpen(true);
  };

  const openEdit = (pg: ContentPage) => {
    setEditingPage(pg);
    setTitle(pg.title);
    setSlug(pg.slug);
    setContent(pg.content || '');
    setExcerpt(pg.excerpt || '');
    setMetaTitle(pg.metaTitle || '');
    setMetaDescription(pg.metaDescription || '');
    setIsPublished(pg.isPublished);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        content,
        excerpt: excerpt || undefined,
        metaTitle: metaTitle || undefined,
        metaDescription: metaDescription || undefined,
        isPublished,
      };

      if (editingPage) {
        await apiPut(`/admin/pages/${editingPage.id}`, payload);
      } else {
        await apiPost('/admin/pages', payload);
      }
      setModalOpen(false);
      fetchPages();
    } catch (err) {
      console.error('Error saving content page:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiDelete(`/admin/pages/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchPages();
    } catch (err) {
      console.error('Error deleting page:', err);
    }
  };

  const columns: Column<ContentPage>[] = [
    {
      header: 'Page Title',
      accessor: (pg) => (
        <div>
          <span className="font-medium text-white text-sm block">{pg.title}</span>
          <span className="text-xs text-obsidian-400 font-mono">/{pg.slug}</span>
        </div>
      ),
    },
    {
      header: 'Excerpt',
      accessor: (pg) => (
        <span className="text-xs text-obsidian-300 max-w-xs truncate block">
          {pg.excerpt || '—'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (pg) => (
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
            pg.isPublished
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-obsidian-800 text-obsidian-400 border border-obsidian-700'
          }`}
        >
          {pg.isPublished ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
          {pg.isPublished ? 'Published' : 'Draft'}
        </span>
      ),
    },
    {
      header: 'Last Updated',
      accessor: (pg) => (
        <span className="text-xs text-obsidian-400">
          {new Date(pg.updatedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      accessor: (pg) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => openEdit(pg)}
            className="p-1.5 rounded-lg text-obsidian-400 hover:text-gold hover:bg-obsidian-800 transition-colors"
            title="Edit"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTarget(pg)}
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
            <BookOpen className="w-7 h-7 text-gold" />
            Content Pages
          </h1>
          <p className="text-sm text-obsidian-400 mt-1">
            Create rich-text articles, About Us story, Terms & Conditions, and FAQ pages.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchPages}
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
            Add Page
          </button>
        </div>
      </div>

      <div className="bg-obsidian-900/60 border border-obsidian-800/80 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
        <DataTable
          columns={columns}
          data={pages}
          loading={loading}
          emptyTitle="No content pages found"
          emptyDescription="Publish your brand story, policy documents, and customer guides."
          keyField="id"
        />
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-obsidian-900 border border-obsidian-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-obsidian-800 pb-4">
              <h2 className="text-lg font-bold text-white">
                {editingPage ? 'Edit Content Page' : 'New Content Page'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-obsidian-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Page Title" required>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Artisanal Heritage & Craft"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800/80 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
                  />
                </FormField>
                <FormField label="URL Slug" required>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. our-craft"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800/80 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none font-mono text-xs"
                  />
                </FormField>
              </div>

              <FormField label="Excerpt / Summary">
                <input
                  type="text"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Short introductory summary for search results and previews"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800/80 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
                />
              </FormField>

              <FormField label="Page Content (HTML / Rich Text)" required>
                <textarea
                  rows={10}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none font-mono"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="SEO Meta Title">
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="XYZ Eyewear — Page Title"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800/80 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
                  />
                </FormField>
                <FormField label="SEO Meta Description">
                  <input
                    type="text"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Description for search engines"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800/80 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
                  />
                </FormField>
              </div>

              <label className="flex items-center gap-2.5 text-sm text-obsidian-200 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 rounded border-obsidian-700 text-gold focus:ring-gold bg-obsidian-800"
                />
                <span>Publish Immediately</span>
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
                  {submitting ? 'Saving...' : editingPage ? 'Save Changes' : 'Create Page'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Content Page"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This page will no longer be accessible on the website.`}
        confirmText="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
