'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Home,
  Sliders,
  Save,
  CheckCircle2,
  XCircle,
  MoveUp,
  MoveDown,
  RefreshCw,
  Layers,
  ExternalLink,
} from 'lucide-react';
import { apiGet, apiPut, apiPatch } from '@/lib/api';
import FormField from '@/components/admin/FormField';

interface CmsSection {
  id: string;
  type: string;
  name?: string;
  content: any;
  sortOrder: number;
  isActive: boolean;
}

export default function HomepageBuilderPage() {
  const [sections, setSections] = useState<CmsSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<CmsSection | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Editor states
  const [sectionName, setSectionName] = useState('');
  const [sectionContentJson, setSectionContentJson] = useState('');

  const fetchHomepage = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet<any>('/admin/cms/homepage');
      const data = res.data?.sections || res.data?.data?.sections || [];
      setSections(data);
      if (data.length > 0 && !activeSection) {
        selectSection(data[0]);
      }
    } catch (err) {
      console.error('Failed to load homepage sections:', err);
    } finally {
      setLoading(false);
    }
  }, [activeSection]);

  useEffect(() => {
    fetchHomepage();
  }, [fetchHomepage]);

  const selectSection = (section: CmsSection) => {
    setActiveSection(section);
    setSectionName(section.name || section.type);
    setSectionContentJson(JSON.stringify(section.content, null, 2));
    setSaveSuccess(false);
  };

  const handleToggle = async (section: CmsSection, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await apiPatch(`/admin/cms/homepage/sections/${section.id}/toggle`, {});
      setSections((prev) =>
        prev.map((s) => (s.id === section.id ? { ...s, isActive: !s.isActive } : s))
      );
      if (activeSection?.id === section.id) {
        setActiveSection((prev) => (prev ? { ...prev, isActive: !prev.isActive } : null));
      }
    } catch (err) {
      console.error('Failed to toggle section:', err);
    }
  };

  const handleSaveContent = async () => {
    if (!activeSection) return;
    setSaving(true);
    try {
      let parsedContent;
      try {
        parsedContent = JSON.parse(sectionContentJson);
      } catch (e) {
        alert('Invalid JSON formatting in section content.');
        setSaving(false);
        return;
      }

      const res = await apiPut<any>(`/admin/cms/homepage/sections/${activeSection.id}`, {
        name: sectionName,
        content: parsedContent,
      });

      const updated = res.data?.data || res.data;
      setSections((prev) => prev.map((s) => (s.id === activeSection.id ? updated : s)));
      setActiveSection(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save section content:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIdx];
    newSections[targetIdx] = temp;

    const sectionIds = newSections.map((s) => s.id);
    setSections(newSections);

    try {
      await apiPatch('/admin/cms/homepage/sections/reorder', { sectionIds });
    } catch (err) {
      console.error('Failed to persist section reorder:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Home className="w-7 h-7 text-gold" />
            Homepage Visual Builder
          </h1>
          <p className="text-sm text-obsidian-400 mt-1">
            Reorder, customize headlines, banners, and featured showcases with instant storefront sync.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-700 text-obsidian-300 hover:text-white border border-obsidian-700 text-sm font-medium transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            Live Preview
          </a>
          <button
            onClick={fetchHomepage}
            className="p-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-700 text-obsidian-300 border border-obsidian-700 transition-all"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Builder Layout: Left Section List, Right Visual Content Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sections Sidebar */}
        <div className="lg:col-span-4 bg-obsidian-900/60 border border-obsidian-800/80 rounded-2xl p-4 backdrop-blur-sm shadow-xl space-y-3">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-obsidian-800">
            <span className="text-xs font-semibold text-obsidian-400 uppercase tracking-wider">
              Layout Sections ({sections.length})
            </span>
            <span className="text-xs text-obsidian-500">Drag/Reorder</span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {sections.map((section, idx) => {
              const isSelected = activeSection?.id === section.id;
              return (
                <div
                  key={section.id}
                  onClick={() => selectSection(section)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-gold/15 border-gold/30 shadow-sm shadow-gold/10'
                      : 'bg-obsidian-800/50 border-obsidian-700/60 hover:bg-obsidian-800 hover:border-obsidian-600'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-gold text-obsidian-950 font-bold' : 'bg-obsidian-700 text-obsidian-300'
                      }`}
                    >
                      <Layers className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className={`text-sm font-medium truncate ${isSelected ? 'text-gold' : 'text-white'}`}>
                        {section.name || section.type}
                      </p>
                      <span className="text-[11px] text-obsidian-400 uppercase font-mono tracking-wider">
                        {section.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleToggle(section, e)}
                      className={`p-1 rounded transition-colors ${
                        section.isActive ? 'text-emerald-400 hover:text-emerald-300' : 'text-obsidian-500 hover:text-obsidian-400'
                      }`}
                      title={section.isActive ? 'Enabled' : 'Disabled'}
                    >
                      {section.isActive ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReorder(idx, 'up');
                      }}
                      className="p-1 text-obsidian-400 hover:text-white disabled:opacity-20 transition-colors"
                      title="Move Up"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === sections.length - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReorder(idx, 'down');
                      }}
                      className="p-1 text-obsidian-400 hover:text-white disabled:opacity-20 transition-colors"
                      title="Move Down"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section Content Editor */}
        <div className="lg:col-span-8 bg-obsidian-900/60 border border-obsidian-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-xl space-y-6">
          {activeSection ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-obsidian-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-gold" />
                    Configure: {activeSection.name || activeSection.type}
                  </h2>
                  <p className="text-xs text-obsidian-400 mt-0.5">
                    Section Type: <span className="font-mono text-gold/80">{activeSection.type}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {saveSuccess && (
                    <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 animate-in fade-in">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Saved to Database!
                    </span>
                  )}
                  <button
                    onClick={handleSaveContent}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-obsidian-950 font-medium text-sm transition-all shadow-md shadow-gold/20 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Publishing...' : 'Save & Publish'}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <FormField label="Section Label / Title">
                  <input
                    type="text"
                    value={sectionName}
                    onChange={(e) => setSectionName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800/80 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
                  />
                </FormField>

                <FormField
                  label="Section Configuration & Content (JSON)"
                  description="Edit headlines, slides, promotional CTAs, image URLs, and styling options."
                >
                  <textarea
                    rows={16}
                    value={sectionContentJson}
                    onChange={(e) => setSectionContentJson(e.target.value)}
                    className="w-full font-mono text-xs px-4 py-3 rounded-xl bg-obsidian-950 border border-obsidian-700 text-amber-100 focus:border-gold focus:outline-none"
                  />
                </FormField>
              </div>
            </>
          ) : (
            <div className="py-24 text-center">
              <Layers className="w-12 h-12 text-obsidian-600 mx-auto mb-3" />
              <p className="text-obsidian-400 text-sm">Select a section on the left to edit its content.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
