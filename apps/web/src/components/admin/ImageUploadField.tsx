'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, X, Loader2, Sparkles, ExternalLink } from 'lucide-react';
import { uploadToSupabaseStorage } from '@/lib/storage';

interface ImageUploadFieldProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  placeholder?: string;
  helperText?: string;
}

const SAMPLE_PRESETS = [
  {
    name: 'Aviator Gold',
    url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Hexagon Black',
    url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Tortoise Classic',
    url: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80',
  },
];

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  folder = 'products',
  placeholder = 'Upload from computer or paste image URL',
  helperText,
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, WebP, SVG, AVIF).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit.');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const result = await uploadToSupabaseStorage(file, folder);
      onChange(result.url);
    } catch (err) {
      console.error('Image upload failed:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-medium text-obsidian-300">
          {label}
        </label>
      )}

      {/* Preview if image is present */}
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-obsidian-700 bg-obsidian-900/60 p-2 flex items-center gap-3">
          <div className="w-16 h-16 rounded-lg bg-obsidian-800 flex-shrink-0 overflow-hidden border border-obsidian-700 flex items-center justify-center">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/product-craft.jpg';
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs text-white font-mono truncate">{value}</p>
            <div className="flex items-center gap-3 mt-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] text-gold hover:text-gold-300 font-medium transition-colors"
              >
                Replace Image
              </button>
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-obsidian-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                View Full <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1.5 text-obsidian-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Upload Area */
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-4 transition-all text-center cursor-pointer ${
            dragActive
              ? 'border-gold bg-gold/5'
              : 'border-obsidian-700 hover:border-obsidian-600 bg-obsidian-900/40 hover:bg-obsidian-900/60'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? (
            <div className="py-4 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 text-gold animate-spin" />
              <p className="text-xs text-gold">Uploading to Supabase Storage...</p>
            </div>
          ) : (
            <div className="py-2 flex flex-col items-center justify-center gap-1.5">
              <div className="w-9 h-9 rounded-xl bg-obsidian-800 flex items-center justify-center text-obsidian-400 group-hover:text-gold transition-colors">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-white">
                  Click to upload or drag & drop
                </p>
                <p className="text-[11px] text-obsidian-500 mt-0.5">
                  PNG, JPG, WebP, or SVG (Up to 10MB)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {/* Direct URL input fallback */}
      <div className="flex gap-2 items-center pt-1">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-1.5 bg-obsidian-800/80 border border-obsidian-700/60 rounded-lg text-xs text-white placeholder-obsidian-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all font-mono"
        />
      </div>

      {/* Quick Presets */}
      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
        <span className="text-[10px] text-obsidian-500 flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 text-gold-400" /> Presets:
        </span>
        {SAMPLE_PRESETS.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => onChange(preset.url)}
            className="text-[10px] px-2 py-0.5 rounded-full bg-obsidian-800 hover:bg-gold/10 hover:text-gold text-obsidian-400 border border-obsidian-700/60 transition-colors"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-[11px] text-rose-400 mt-1">{error}</p>
      )}

      {helperText && !error && (
        <p className="text-[11px] text-obsidian-500">{helperText}</p>
      )}
    </div>
  );
};
