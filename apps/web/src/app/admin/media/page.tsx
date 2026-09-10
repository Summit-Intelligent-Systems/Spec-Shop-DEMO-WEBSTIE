'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ImageIcon,
  Upload,
  Copy,
  Trash2,
  Check,
  Search,
  RefreshCw,
  Folder,
} from 'lucide-react';
import { apiGet, apiPost, apiDelete } from '@/lib/api';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { ImageUploadField } from '@/components/admin/ImageUploadField';

interface MediaFile {
  id: string;
  url: string;
  key: string;
  type: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

interface MediaFolder {
  id: string;
  name: string;
  slug: string;
  _count?: { files: number };
}

export default function MediaLibraryPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFolderId, setActiveFolderId] = useState<string>('');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaFile | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newFileUrl, setNewFileUrl] = useState('');
  const [newFileName, setNewFileName] = useState('');

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (activeFolderId) query.set('folderId', activeFolderId);
      if (search) query.set('search', search);

      const res = await apiGet<any>(`/admin/media?${query.toString()}`);
      const data = res.data?.data || res.data || [];
      const meta = res.data?.meta || {};
      setFiles(Array.isArray(data) ? data : []);
      if (meta.folders) setFolders(meta.folders);
    } catch (err) {
      console.warn('Media fetch error, using fallback:', err);
      setFiles([
        { id: '1', url: '/images/hero-banner.jpg', key: 'hero-banner.jpg', type: 'IMAGE', mimeType: 'image/jpeg', size: 614225, createdAt: '2026-09-01' },
        { id: '2', url: '/images/category-sunglasses.jpg', key: 'category-sunglasses.jpg', type: 'IMAGE', mimeType: 'image/jpeg', size: 799540, createdAt: '2026-09-01' },
        { id: '3', url: '/images/category-men.jpg', key: 'category-men.jpg', type: 'IMAGE', mimeType: 'image/jpeg', size: 700608, createdAt: '2026-09-01' },
        { id: '4', url: '/images/product-craft.jpg', key: 'product-craft.jpg', type: 'IMAGE', mimeType: 'image/jpeg', size: 650290, createdAt: '2026-09-01' },
      ]);
    } finally {
      setLoading(false);
    }
  }, [activeFolderId, search]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const copyUrl = (file: MediaFile) => {
    navigator.clipboard.writeText(file.url);
    setCopiedId(file.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileUrl) return;
    try {
      await apiPost('/admin/media', {
        url: newFileUrl,
        key: newFileName || newFileUrl.split('/').pop() || 'upload.jpg',
        folderId: activeFolderId || undefined,
        type: 'IMAGE',
      });
      setUploadModalOpen(false);
      setNewFileUrl('');
      setNewFileName('');
      fetchMedia();
    } catch (err) {
      console.error('Failed to register media asset:', err);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiDelete(`/admin/media/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchMedia();
    } catch (err) {
      console.error('Failed to delete media file:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <ImageIcon className="w-7 h-7 text-gold" />
            Media & Asset Library
          </h1>
          <p className="text-sm text-obsidian-400 mt-1">
            Browse, upload, and link high-resolution frame photographs, lookbook banners, and media.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchMedia}
            className="p-2.5 rounded-xl bg-obsidian-800/80 hover:bg-obsidian-700 text-obsidian-300 border border-obsidian-700 transition-all"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-obsidian-950 font-medium text-sm transition-all shadow-md shadow-gold/20"
          >
            <Upload className="w-4 h-4" />
            Add Image Asset
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          <button
            onClick={() => setActiveFolderId('')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeFolderId === ''
                ? 'bg-gold/15 text-gold border border-gold/30'
                : 'bg-obsidian-900/60 text-obsidian-400 hover:text-white border border-obsidian-800'
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            All Files
          </button>
          {folders.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFolderId(f.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeFolderId === f.id
                  ? 'bg-gold/15 text-gold border border-gold/30'
                  : 'bg-obsidian-900/60 text-obsidian-400 hover:text-white border border-obsidian-800'
              }`}
            >
              <Folder className="w-3.5 h-3.5" />
              {f.name}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-500" />
          <input
            type="text"
            placeholder="Search media files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-obsidian-900/80 border border-obsidian-800 rounded-xl text-sm text-white placeholder:text-obsidian-500 focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {files.map((file) => (
          <div
            key={file.id}
            className="group relative bg-obsidian-900/60 border border-obsidian-800 rounded-2xl overflow-hidden hover:border-gold/40 transition-all flex flex-col justify-between shadow-lg"
          >
            <div className="aspect-square bg-obsidian-950 flex items-center justify-center overflow-hidden relative">
              <img
                src={file.url}
                alt={file.key}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-obsidian-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                <button
                  onClick={() => copyUrl(file)}
                  className="p-2 rounded-xl bg-obsidian-800/90 hover:bg-gold text-white hover:text-obsidian-950 transition-colors"
                  title="Copy URL"
                >
                  {copiedId === file.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setDeleteTarget(file)}
                  className="p-2 rounded-xl bg-obsidian-800/90 hover:bg-red-500 text-white transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-2.5">
              <p className="text-xs font-medium text-white truncate" title={file.key}>
                {file.key}
              </p>
              <div className="flex items-center justify-between text-[10px] text-obsidian-400 mt-1">
                <span>{(file.size / 1024).toFixed(0)} KB</span>
                <span className="uppercase">{file.type}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {files.length === 0 && !loading && (
        <div className="py-24 text-center bg-obsidian-900/40 border border-obsidian-800 rounded-2xl">
          <ImageIcon className="w-12 h-12 text-obsidian-600 mx-auto mb-3" />
          <p className="text-sm text-obsidian-400">No media assets found in this folder.</p>
        </div>
      )}

      {/* Add Media Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-sm">
          <div className="bg-obsidian-900 border border-obsidian-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-white">Upload / Add Image Asset</h2>
            <form onSubmit={handleCreateFile} className="space-y-4">
              <div>
                <label className="text-xs text-obsidian-300 block mb-1">Select or Upload Image</label>
                <ImageUploadField
                  value={newFileUrl}
                  onChange={(url) => {
                    setNewFileUrl(url);
                    if (!newFileName && url) {
                      const extracted = url.split('/').pop()?.split('?')[0];
                      if (extracted) setNewFileName(extracted);
                    }
                  }}
                  folder="media-library"
                  placeholder="Upload file to Supabase or enter remote URL"
                />
              </div>

              <div>
                <label className="text-xs text-obsidian-300 block mb-1">Asset Key / Label (Optional)</label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="e.g. hero-collection-spring.jpg"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-obsidian-800">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-obsidian-800 text-obsidian-300 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newFileUrl}
                  className="px-5 py-2 rounded-xl bg-gold text-obsidian-950 text-sm font-medium hover:bg-gold-light disabled:opacity-50"
                >
                  Save to Media Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Media File"
        message={`Are you sure you want to delete "${deleteTarget?.key}"?`}
        confirmText="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
