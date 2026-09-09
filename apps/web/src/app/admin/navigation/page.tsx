'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navigation, Plus, Trash2, Save, MoveUp, MoveDown, CheckCircle2, RefreshCw, Layers } from 'lucide-react';
import { apiGet, apiPut } from '@/lib/api';

interface NavItem {
  id: string;
  title: string;
  href: string;
  sortOrder?: number;
}

export default function NavigationEditorPage() {
  const [headerLinks, setHeaderLinks] = useState<NavItem[]>([]);
  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New Link input
  const [newTitle, setNewTitle] = useState('');
  const [newHref, setNewHref] = useState('');

  const fetchNav = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet<any>('/admin/navigation');
      const data = res.data?.data || res.data || {};
      setHeaderLinks(data.header || [
        { id: '1', title: 'Eyeglasses', href: '/products?category=eyeglasses' },
        { id: '2', title: 'Sunglasses', href: '/products?category=sunglasses' },
        { id: '3', title: 'Brands', href: '/brands' },
        { id: '4', title: 'Virtual Try-On', href: '/try-on' },
        { id: '5', title: 'Book Eye Test', href: '/appointments' },
      ]);
      setSocialLinks(data.social || [
        { platform: 'Instagram', url: 'https://instagram.com' },
        { platform: 'Facebook', url: 'https://facebook.com' },
        { platform: 'Twitter', url: 'https://twitter.com' },
      ]);
    } catch (err) {
      console.warn('Nav fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNav();
  }, [fetchNav]);

  const addHeaderLink = () => {
    if (!newTitle || !newHref) return;
    const item: NavItem = {
      id: `nav-${Date.now()}`,
      title: newTitle,
      href: newHref,
      sortOrder: headerLinks.length,
    };
    setHeaderLinks([...headerLinks, item]);
    setNewTitle('');
    setNewHref('');
  };

  const removeHeaderLink = (id: string) => {
    setHeaderLinks(headerLinks.filter((l) => l.id !== id));
  };

  const moveLink = (index: number, dir: 'up' | 'down') => {
    const targetIdx = dir === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= headerLinks.length) return;
    const copy = [...headerLinks];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    setHeaderLinks(copy);
  };

  const saveNavigation = async () => {
    setSaving(true);
    try {
      await apiPut('/admin/navigation/header', { items: headerLinks });
      await apiPut('/admin/navigation/social', { items: socialLinks });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save navigation:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Navigation className="w-7 h-7 text-gold" />
            Navigation & Menus
          </h1>
          <p className="text-sm text-obsidian-400 mt-1">
            Customize header navigation links, order, and storefront menus without modifying code.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Published!
            </span>
          )}
          <button
            type="button"
            onClick={fetchNav}
            className="p-2.5 rounded-xl bg-obsidian-800/80 hover:bg-obsidian-700 text-obsidian-300 border border-obsidian-700 transition-all"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={saveNavigation}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-obsidian-950 font-medium text-sm transition-all shadow-md shadow-gold/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Navigation'}
          </button>
        </div>
      </div>

      {/* Main Header Menu Builder */}
      <div className="bg-obsidian-900/60 border border-obsidian-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-xl space-y-5">
        <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-obsidian-800 pb-3">
          <Layers className="w-4 h-4 text-gold" />
          Primary Header Navigation ({headerLinks.length})
        </h2>

        {/* List of current links */}
        <div className="space-y-2.5">
          {headerLinks.map((link, idx) => (
            <div
              key={link.id}
              className="flex items-center justify-between gap-3 p-3.5 bg-obsidian-800/60 border border-obsidian-700/60 rounded-xl"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-xs font-mono text-obsidian-500 w-5">{idx + 1}.</span>
                <input
                  type="text"
                  value={link.title}
                  onChange={(e) => {
                    const updated = [...headerLinks];
                    updated[idx].title = e.target.value;
                    setHeaderLinks(updated);
                  }}
                  className="bg-obsidian-900 border border-obsidian-700 rounded-lg px-3 py-1.5 text-white text-sm focus:border-gold focus:outline-none w-44"
                />
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => {
                    const updated = [...headerLinks];
                    updated[idx].href = e.target.value;
                    setHeaderLinks(updated);
                  }}
                  className="bg-obsidian-900 border border-obsidian-700 rounded-lg px-3 py-1.5 text-obsidian-300 font-mono text-xs focus:border-gold focus:outline-none flex-1"
                />
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveLink(idx, 'up')}
                  className="p-1.5 text-obsidian-400 hover:text-white disabled:opacity-20 transition-colors"
                  title="Move Up"
                >
                  <MoveUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={idx === headerLinks.length - 1}
                  onClick={() => moveLink(idx, 'down')}
                  className="p-1.5 text-obsidian-400 hover:text-white disabled:opacity-20 transition-colors"
                  title="Move Down"
                >
                  <MoveDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeHeaderLink(link.id)}
                  className="p-1.5 text-obsidian-400 hover:text-red-400 transition-colors"
                  title="Remove Link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add new link form */}
        <div className="p-4 rounded-xl bg-obsidian-950/60 border border-dashed border-obsidian-700/80 flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="Link Label (e.g. Lookbook)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full sm:w-44 px-3.5 py-2 rounded-xl bg-obsidian-900 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
          />
          <input
            type="text"
            placeholder="Target URL / Route (e.g. /lookbook)"
            value={newHref}
            onChange={(e) => setNewHref(e.target.value)}
            className="w-full sm:flex-1 px-3.5 py-2 rounded-xl bg-obsidian-900 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
          />
          <button
            type="button"
            onClick={addHeaderLink}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-obsidian-800 hover:bg-gold hover:text-obsidian-950 text-white text-sm font-medium border border-obsidian-700 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Menu Item
          </button>
        </div>
      </div>
    </div>
  );
}
