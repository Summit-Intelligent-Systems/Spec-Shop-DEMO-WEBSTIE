'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Globe, Save, CheckCircle2, RefreshCw, Search } from 'lucide-react';
import { apiGet, apiPut } from '@/lib/api';
import FormField from '@/components/admin/FormField';

export default function SeoManagerPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // SEO Form fields
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [canonicalDomain, setCanonicalDomain] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');
  const [googleSiteVerification, setGoogleSiteVerification] = useState('');
  const [robotsTxt, setRobotsTxt] = useState('');

  const fetchSeo = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet<any>('/admin/seo');
      const global = res.data?.data?.global || res.data?.global || {};
      setMetaTitle(global.metaTitle || 'XYZ Eyewear | Luxury Japanese Titanium & Optical Mastery');
      setMetaDescription(
        global.metaDescription ||
          'Discover handcrafted luxury eyewear, titanium frames, and precision ophthalmic optics surfaced with zero peripheral distortion.'
      );
      setOgImage(global.ogImage || '/images/hero-banner.jpg');
      setCanonicalDomain(global.canonicalDomain || 'https://xyzeyewear.com');
      setTwitterHandle(global.twitterHandle || '@xyzeyewear');
      setGoogleSiteVerification(global.googleSiteVerification || '');
      setRobotsTxt(global.robotsTxt || 'User-agent: *\nAllow: /\nSitemap: https://xyzeyewear.com/sitemap.xml');
    } catch (err) {
      console.warn('SEO fetch error, using defaults:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeo();
  }, [fetchSeo]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiPut('/admin/seo/global', {
        metaTitle,
        metaDescription,
        ogImage,
        canonicalDomain,
        twitterHandle,
        googleSiteVerification,
        robotsTxt,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save SEO configuration:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Globe className="w-7 h-7 text-gold" />
            SEO & Social Metadata
          </h1>
          <p className="text-sm text-obsidian-400 mt-1">
            Control search engine indexing, social media OpenGraph cards, and Google verification.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Changes Published!
            </span>
          )}
          <button
            type="button"
            onClick={fetchSeo}
            className="p-2.5 rounded-xl bg-obsidian-800/80 hover:bg-obsidian-700 text-obsidian-300 border border-obsidian-700 transition-all"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-obsidian-950 font-medium text-sm transition-all shadow-md shadow-gold/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Publishing...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Google Search Live Preview Card */}
        <div className="bg-obsidian-900/60 border border-obsidian-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-xl space-y-3">
          <span className="text-xs font-semibold text-obsidian-400 uppercase tracking-wider flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-gold" />
            Google Search SERP Preview
          </span>
          <div className="p-4 rounded-xl bg-obsidian-950/80 border border-obsidian-800 max-w-2xl space-y-1">
            <p className="text-xs text-emerald-400 truncate">
              {canonicalDomain || 'https://xyzeyewear.com'} &rsaquo; luxury-eyewear
            </p>
            <h3 className="text-base font-medium text-blue-400 hover:underline cursor-pointer truncate">
              {metaTitle || 'XYZ Eyewear | Luxury Optical Mastery'}
            </h3>
            <p className="text-xs text-obsidian-300 line-clamp-2 leading-relaxed">
              {metaDescription || 'Add your meta description below to see live SERP snippet rendering.'}
            </p>
          </div>
        </div>

        {/* Global Metadata Inputs */}
        <div className="bg-obsidian-900/60 border border-obsidian-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white border-b border-obsidian-800 pb-3">
            Core Metadata
          </h2>

          <FormField
            label="Default Page Title"
            description={`Recommended length: 50-60 chars (Current: ${metaTitle.length})`}
          >
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
            />
          </FormField>

          <FormField
            label="Default Meta Description"
            description={`Recommended length: 150-160 chars (Current: ${metaDescription.length})`}
          >
            <textarea
              rows={3}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Canonical Base Domain">
              <input
                type="url"
                value={canonicalDomain}
                onChange={(e) => setCanonicalDomain(e.target.value)}
                placeholder="https://xyzeyewear.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
              />
            </FormField>

            <FormField label="Social Share Image (OG Image)">
              <input
                type="text"
                value={ogImage}
                onChange={(e) => setOgImage(e.target.value)}
                placeholder="/images/hero-banner.jpg"
                className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Twitter Handle">
              <input
                type="text"
                value={twitterHandle}
                onChange={(e) => setTwitterHandle(e.target.value)}
                placeholder="@xyzeyewear"
                className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
              />
            </FormField>

            <FormField label="Google Site Verification ID">
              <input
                type="text"
                value={googleSiteVerification}
                onChange={(e) => setGoogleSiteVerification(e.target.value)}
                placeholder="google-site-verification=..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
              />
            </FormField>
          </div>

          <FormField label="Robots.txt Rules">
            <textarea
              rows={4}
              value={robotsTxt}
              onChange={(e) => setRobotsTxt(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-700 text-amber-200 font-mono text-xs focus:border-gold focus:outline-none"
            />
          </FormField>
        </div>
      </form>
    </div>
  );
}
