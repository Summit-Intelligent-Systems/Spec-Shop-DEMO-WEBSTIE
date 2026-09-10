'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
} from 'lucide-react';
import { FormField, AdminInput, AdminSelect, AdminTextarea } from '@/components/admin/FormField';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { apiGet, apiPost, apiPut } from '@/lib/api';
import toast from 'react-hot-toast';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductFormData {
  name: string;
  sku: string;
  shortDescription: string;
  description: string;
  brandId: string;
  categoryId: string;
  gender: string;
  shape: string;
  frameType: string;
  frameWidth: string;
  weight: string;
  lensWidth: string;
  bridgeWidth: string;
  templeLength: string;
  basePrice: string;
  baseComparePrice: string;
  status: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  tags: string;
  metaTitle: string;
  metaDesc: string;
  warrantyInfo: string;
  careInstructions: string;
  prescriptionCompatible: boolean;
  primaryImage: string;
  images: string[];
}

interface VariantFormData {
  id?: string;
  sku: string;
  color: string;
  colorHex: string;
  size: string;
  frameMaterial: string;
  price: string;
  comparePrice: string;
  stock: string;
  isDefault: boolean;
  isActive: boolean;
  imageUrl?: string;
}

interface SelectOption { id: string; name: string; slug?: string }

interface ProductFormProps {
  productId?: string;
  initialData?: any;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const defaultProduct: ProductFormData = {
  name: '', sku: '', shortDescription: '', description: '',
  brandId: '', categoryId: '', gender: 'UNISEX', shape: '', frameType: '',
  frameWidth: '', weight: '', lensWidth: '', bridgeWidth: '', templeLength: '',
  basePrice: '', baseComparePrice: '', status: 'DRAFT',
  isFeatured: false, isNewArrival: false, isBestSeller: false,
  tags: '', metaTitle: '', metaDesc: '', warrantyInfo: '', careInstructions: '',
  prescriptionCompatible: true,
  primaryImage: '',
  images: [],
};

const defaultVariant: VariantFormData = {
  sku: '', color: '', colorHex: '#000000', size: '',
  frameMaterial: '', price: '', comparePrice: '', stock: '0',
  isDefault: false, isActive: true,
  imageUrl: '',
};

const genderOptions = ['UNISEX', 'MEN', 'WOMEN', 'KIDS'];
const shapeOptions = ['ROUND', 'SQUARE', 'RECTANGLE', 'OVAL', 'CAT_EYE', 'AVIATOR', 'WAYFARER', 'GEOMETRIC', 'CLUBMASTER', 'SPORT'];
const frameTypeOptions = ['FULL_RIM', 'HALF_RIM', 'RIMLESS'];
const materialOptions = ['METAL', 'ACETATE', 'TITANIUM', 'TR90', 'WOOD', 'CARBON_FIBER', 'MIXED'];
const statusOptions = ['DRAFT', 'ACTIVE', 'ARCHIVED'];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductForm({ productId, initialData }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!productId;

  const [form, setForm] = useState<ProductFormData>(defaultProduct);
  const [variants, setVariants] = useState<VariantFormData[]>([{ ...defaultVariant, isDefault: true }]);
  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [brands, setBrands] = useState<SelectOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'variants' | 'images' | 'details' | 'seo'>('basic');

  // Fetch categories and brands
  useEffect(() => {
    Promise.allSettled([
      apiGet<SelectOption[]>('/categories'),
      apiGet<SelectOption[]>('/brands'),
    ]).then(([cats, brands]) => {
      if (cats.status === 'fulfilled') setCategories(Array.isArray(cats.value) ? cats.value : []);
      if (brands.status === 'fulfilled') setBrands(Array.isArray(brands.value) ? brands.value : []);
    });
  }, []);

  // Load existing product data
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        sku: initialData.sku || '',
        shortDescription: initialData.shortDescription || '',
        description: initialData.description || '',
        brandId: initialData.brandId || '',
        categoryId: initialData.categoryId || '',
        gender: initialData.gender || 'UNISEX',
        shape: initialData.shape || '',
        frameType: initialData.frameType || '',
        frameWidth: initialData.frameWidth?.toString() || '',
        weight: initialData.weight?.toString() || '',
        lensWidth: initialData.lensWidth?.toString() || '',
        bridgeWidth: initialData.bridgeWidth?.toString() || '',
        templeLength: initialData.templeLength?.toString() || '',
        basePrice: initialData.basePrice?.toString() || '',
        baseComparePrice: initialData.baseComparePrice?.toString() || '',
        status: initialData.status || 'DRAFT',
        isFeatured: initialData.isFeatured || false,
        isNewArrival: initialData.isNewArrival || false,
        isBestSeller: initialData.isBestSeller || false,
        tags: initialData.tags?.join(', ') || '',
        metaTitle: initialData.metaTitle || '',
        metaDesc: initialData.metaDesc || '',
        warrantyInfo: initialData.warrantyInfo || '',
        careInstructions: initialData.careInstructions || '',
        prescriptionCompatible: initialData.prescriptionCompatible ?? true,
        primaryImage: initialData.primaryImage || initialData.images?.[0]?.url || initialData.images?.[0] || '',
        images: Array.isArray(initialData.images)
          ? initialData.images.map((img: any) => typeof img === 'string' ? img : img.url).filter(Boolean)
          : [],
      });

      if (initialData.variants?.length) {
        setVariants(initialData.variants.map((v: any) => ({
          id: v.id,
          sku: v.sku || '',
          color: v.color || '',
          colorHex: v.colorHex || '#000000',
          size: v.size || '',
          frameMaterial: v.frameMaterial || '',
          price: v.price?.toString() || '',
          comparePrice: v.comparePrice?.toString() || '',
          stock: v.stock?.toString() || '0',
          isDefault: v.isDefault || false,
          isActive: v.isActive !== false,
          imageUrl: v.imageUrl || v.images?.[0]?.url || '',
        })));
      }
    }
  }, [initialData]);

  const updateForm = (key: keyof ProductFormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateVariant = (index: number, key: keyof VariantFormData, value: string | boolean) => {
    setVariants((prev) => prev.map((v, i) => i === index ? { ...v, [key]: value } : v));
  };

  const addVariant = () => {
    setVariants((prev) => [...prev, { ...defaultVariant, sku: `${form.sku}-V${prev.length + 1}` }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length <= 1) return;
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const setDefaultVariant = (index: number) => {
    setVariants((prev) => prev.map((v, i) => ({ ...v, isDefault: i === index })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...form,
        basePrice: parseFloat(form.basePrice),
        baseComparePrice: form.baseComparePrice ? parseFloat(form.baseComparePrice) : undefined,
        frameWidth: form.frameWidth ? parseInt(form.frameWidth) : undefined,
        weight: form.weight ? parseInt(form.weight) : undefined,
        lensWidth: form.lensWidth ? parseInt(form.lensWidth) : undefined,
        bridgeWidth: form.bridgeWidth ? parseInt(form.bridgeWidth) : undefined,
        templeLength: form.templeLength ? parseInt(form.templeLength) : undefined,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        primaryImage: form.primaryImage || form.images[0] || undefined,
        images: form.images,
        variants: variants.map((v) => ({
          ...v,
          price: parseFloat(v.price) || 0,
          comparePrice: v.comparePrice ? parseFloat(v.comparePrice) : undefined,
          stock: parseInt(v.stock) || 0,
          imageUrl: v.imageUrl || undefined,
        })),
      };

      if (isEdit) {
        await apiPut(`/admin/products/${productId}`, payload);
        toast.success('Product updated');
      } else {
        await apiPost('/admin/products', payload);
        toast.success('Product created');
      }

      router.push('/admin/products');
    } catch {
      toast.error(isEdit ? 'Failed to update product' : 'Failed to create product');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { key: 'basic' as const, label: 'Basic Info' },
    { key: 'variants' as const, label: `Variants (${variants.length})` },
    { key: 'images' as const, label: `Images (${(form.primaryImage ? 1 : 0) + form.images.length})` },
    { key: 'details' as const, label: 'Details & Specs' },
    { key: 'seo' as const, label: 'SEO' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.back()} className="p-2 rounded-xl text-obsidian-500 hover:text-white hover:bg-obsidian-800/60 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-gold uppercase">Catalog</span>
            <h1 className="font-serif text-2xl font-medium text-white mt-0.5">
              {isEdit ? 'Edit Product' : 'New Product'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <AdminSelect
            value={form.status}
            onChange={(e) => updateForm('status', e.target.value)}
            className="w-32 !py-2 text-xs"
          >
            {statusOptions.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </AdminSelect>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gold to-amber-600 text-obsidian-950 rounded-xl text-sm font-semibold hover:from-amber-500 hover:to-amber-700 transition-all shadow-md shadow-gold/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-obsidian-900/40 border border-obsidian-800/40 rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-obsidian-800 text-white shadow-sm'
                : 'text-obsidian-500 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-obsidian-900/60 border border-obsidian-800/60 rounded-2xl p-6">
        {/* Basic Info */}
        {activeTab === 'basic' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField label="Product Name" required>
                <AdminInput value={form.name} onChange={(e) => updateForm('name', e.target.value)} placeholder="e.g. The Sovereign Round" required />
              </FormField>
              <FormField label="SKU" required>
                <AdminInput value={form.sku} onChange={(e) => updateForm('sku', e.target.value)} placeholder="e.g. XYZ-SOV-RND-001" required />
              </FormField>
            </div>

            <FormField label="Short Description">
              <AdminInput value={form.shortDescription} onChange={(e) => updateForm('shortDescription', e.target.value)} placeholder="Brief product tagline..." />
            </FormField>

            <FormField label="Description">
              <AdminTextarea value={form.description} onChange={(e) => updateForm('description', e.target.value)} rows={4} placeholder="Full product description..." />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              <FormField label="Category" required>
                <AdminSelect value={form.categoryId} onChange={(e) => updateForm('categoryId', e.target.value)} required>
                  <option value="">Select category...</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </AdminSelect>
              </FormField>
              <FormField label="Brand" required>
                <AdminSelect value={form.brandId} onChange={(e) => updateForm('brandId', e.target.value)} required>
                  <option value="">Select brand...</option>
                  {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </AdminSelect>
              </FormField>
              <FormField label="Gender">
                <AdminSelect value={form.gender} onChange={(e) => updateForm('gender', e.target.value)}>
                  {genderOptions.map((g) => <option key={g} value={g}>{g}</option>)}
                </AdminSelect>
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              <FormField label="Base Price (₹)" required>
                <AdminInput type="number" step="0.01" value={form.basePrice} onChange={(e) => updateForm('basePrice', e.target.value)} placeholder="0.00" required />
              </FormField>
              <FormField label="Compare Price (₹)" description="Original price before discount">
                <AdminInput type="number" step="0.01" value={form.baseComparePrice} onChange={(e) => updateForm('baseComparePrice', e.target.value)} placeholder="0.00" />
              </FormField>
              <FormField label="Tags" description="Comma-separated">
                <AdminInput value={form.tags} onChange={(e) => updateForm('tags', e.target.value)} placeholder="premium, titanium, round" />
              </FormField>
            </div>

            <div className="flex flex-wrap gap-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => updateForm('isFeatured', e.target.checked)} className="w-4 h-4 rounded border-obsidian-600 bg-obsidian-800 text-gold accent-amber-500" />
                <span className="text-xs text-obsidian-400">Featured Product</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isNewArrival} onChange={(e) => updateForm('isNewArrival', e.target.checked)} className="w-4 h-4 rounded border-obsidian-600 bg-obsidian-800 text-gold accent-amber-500" />
                <span className="text-xs text-obsidian-400">New Arrival</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isBestSeller} onChange={(e) => updateForm('isBestSeller', e.target.checked)} className="w-4 h-4 rounded border-obsidian-600 bg-obsidian-800 text-gold accent-amber-500" />
                <span className="text-xs text-obsidian-400">Best Seller</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.prescriptionCompatible} onChange={(e) => updateForm('prescriptionCompatible', e.target.checked)} className="w-4 h-4 rounded border-obsidian-600 bg-obsidian-800 text-gold accent-amber-500" />
                <span className="text-xs text-obsidian-400">Prescription Compatible</span>
              </label>
            </div>
          </div>
        )}

        {/* Variants */}
        {activeTab === 'variants' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-obsidian-400">
                Manage color, size, material, and pricing variants.
              </p>
              <button type="button" onClick={addVariant} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gold hover:bg-gold/10 rounded-lg border border-gold/30 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add Variant
              </button>
            </div>

            {variants.map((variant, index) => (
              <div
                key={index}
                className={`border rounded-xl p-4 space-y-4 ${variant.isDefault ? 'border-gold/30 bg-gold/5' : 'border-obsidian-800/60'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-obsidian-600 cursor-grab" />
                    <span className="text-xs font-semibold text-obsidian-400">Variant {index + 1}</span>
                    {variant.isDefault && (
                      <span className="text-[9px] px-1.5 py-0.5 bg-gold/20 text-gold rounded-full font-bold uppercase tracking-wider">Default</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!variant.isDefault && (
                      <button type="button" onClick={() => setDefaultVariant(index)} className="text-[11px] text-obsidian-500 hover:text-gold transition-colors">
                        Set Default
                      </button>
                    )}
                    {variants.length > 1 && (
                      <button type="button" onClick={() => removeVariant(index)} className="p-1 text-obsidian-600 hover:text-rose-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  <FormField label="Variant SKU">
                    <AdminInput value={variant.sku} onChange={(e) => updateVariant(index, 'sku', e.target.value)} placeholder="SKU" className="!py-2 text-xs" />
                  </FormField>
                  <FormField label="Color">
                    <div className="flex gap-2">
                      <AdminInput value={variant.color} onChange={(e) => updateVariant(index, 'color', e.target.value)} placeholder="Black" className="!py-2 text-xs flex-1" />
                      <input type="color" value={variant.colorHex} onChange={(e) => updateVariant(index, 'colorHex', e.target.value)} className="w-10 h-10 rounded-lg border border-obsidian-700 cursor-pointer bg-transparent" />
                    </div>
                  </FormField>
                  <FormField label="Material">
                    <AdminSelect value={variant.frameMaterial} onChange={(e) => updateVariant(index, 'frameMaterial', e.target.value)} className="!py-2 text-xs">
                      <option value="">Select...</option>
                      {materialOptions.map((m) => <option key={m} value={m}>{m.replace('_', ' ')}</option>)}
                    </AdminSelect>
                  </FormField>
                  <FormField label="Size">
                    <AdminInput value={variant.size} onChange={(e) => updateVariant(index, 'size', e.target.value)} placeholder="Medium" className="!py-2 text-xs" />
                  </FormField>
                  <FormField label="Price (₹)">
                    <AdminInput type="number" step="0.01" value={variant.price} onChange={(e) => updateVariant(index, 'price', e.target.value)} placeholder="0" className="!py-2 text-xs" />
                  </FormField>
                  <FormField label="Compare Price">
                    <AdminInput type="number" step="0.01" value={variant.comparePrice} onChange={(e) => updateVariant(index, 'comparePrice', e.target.value)} placeholder="0" className="!py-2 text-xs" />
                  </FormField>
                  <FormField label="Stock">
                    <AdminInput type="number" value={variant.stock} onChange={(e) => updateVariant(index, 'stock', e.target.value)} placeholder="0" className="!py-2 text-xs" />
                  </FormField>
                  <div className="flex items-end pb-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={variant.isActive} onChange={(e) => updateVariant(index, 'isActive', e.target.checked)} className="w-3.5 h-3.5 rounded border-obsidian-600 bg-obsidian-800 text-gold accent-amber-500" />
                      <span className="text-[11px] text-obsidian-400">Active</span>
                    </label>
                  </div>
                </div>

                <div className="pt-2 border-t border-obsidian-800/40">
                  <ImageUploadField
                    label="Variant Photo (Optional)"
                    value={variant.imageUrl || ''}
                    onChange={(url) => updateVariant(index, 'imageUrl', url)}
                    folder="variants"
                    placeholder="Upload specific color photo or paste URL"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Images & Media */}
        {activeTab === 'images' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-white">Primary Product Image</h3>
              <p className="text-xs text-obsidian-400 mt-0.5 mb-3">
                Featured as the main thumbnail in catalog grids, product cards, and search results.
              </p>
              <ImageUploadField
                value={form.primaryImage}
                onChange={(url) => updateForm('primaryImage', url)}
                folder="products"
                placeholder="Upload primary photo from device or enter image URL"
              />
            </div>

            <div className="pt-5 border-t border-obsidian-800/60">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-white">Additional Gallery Images</h3>
                  <p className="text-xs text-obsidian-400 mt-0.5">
                    Extra high-resolution angles, lifestyle shots, and macro details shown on the product page.
                  </p>
                </div>
              </div>

              {/* Gallery Grid */}
              {form.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                  {form.images.map((imgUrl, imgIndex) => (
                    <div
                      key={imgIndex}
                      className="relative group rounded-xl overflow-hidden border border-obsidian-700 bg-obsidian-900 aspect-square"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgUrl}
                        alt={`Gallery ${imgIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-obsidian-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                        <button
                          type="button"
                          onClick={() => {
                            const currentPrimary = form.primaryImage;
                            updateForm('primaryImage', imgUrl);
                            updateForm(
                              'images',
                              form.images
                                .filter((_, i) => i !== imgIndex)
                                .concat(currentPrimary ? [currentPrimary] : []),
                            );
                          }}
                          className="px-2.5 py-1 bg-gold text-obsidian-950 text-[10px] font-bold rounded-lg hover:bg-gold-light transition-colors"
                        >
                          Set as Primary
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            updateForm(
                              'images',
                              form.images.filter((_, i) => i !== imgIndex),
                            );
                          }}
                          className="p-1.5 text-rose-400 hover:text-white hover:bg-rose-500/20 rounded-lg transition-colors"
                          title="Delete image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Gallery Image Upload Field */}
              <div className="bg-obsidian-900/40 border border-obsidian-800 rounded-xl p-4">
                <p className="text-xs font-medium text-obsidian-300 mb-2">Upload Gallery Image</p>
                <ImageUploadField
                  value=""
                  onChange={(newUrl) => {
                    if (newUrl) {
                      updateForm('images', [...form.images, newUrl]);
                    }
                  }}
                  folder="products/gallery"
                  placeholder="Upload gallery image or paste remote URL"
                />
              </div>
            </div>
          </div>
        )}

        {/* Details & Specifications */}
        {activeTab === 'details' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              <FormField label="Frame Shape">
                <AdminSelect value={form.shape} onChange={(e) => updateForm('shape', e.target.value)}>
                  <option value="">Select...</option>
                  {shapeOptions.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </AdminSelect>
              </FormField>
              <FormField label="Frame Type">
                <AdminSelect value={form.frameType} onChange={(e) => updateForm('frameType', e.target.value)}>
                  <option value="">Select...</option>
                  {frameTypeOptions.map((f) => <option key={f} value={f}>{f.replace('_', ' ')}</option>)}
                </AdminSelect>
              </FormField>
              <FormField label="Frame Width (mm)">
                <AdminInput type="number" value={form.frameWidth} onChange={(e) => updateForm('frameWidth', e.target.value)} placeholder="138" />
              </FormField>
              <FormField label="Weight (grams)">
                <AdminInput type="number" value={form.weight} onChange={(e) => updateForm('weight', e.target.value)} placeholder="28" />
              </FormField>
              <FormField label="Lens Width (mm)">
                <AdminInput type="number" value={form.lensWidth} onChange={(e) => updateForm('lensWidth', e.target.value)} placeholder="52" />
              </FormField>
              <FormField label="Bridge Width (mm)">
                <AdminInput type="number" value={form.bridgeWidth} onChange={(e) => updateForm('bridgeWidth', e.target.value)} placeholder="20" />
              </FormField>
              <FormField label="Temple Length (mm)">
                <AdminInput type="number" value={form.templeLength} onChange={(e) => updateForm('templeLength', e.target.value)} placeholder="145" />
              </FormField>
            </div>

            <FormField label="Warranty Information">
              <AdminTextarea value={form.warrantyInfo} onChange={(e) => updateForm('warrantyInfo', e.target.value)} rows={3} placeholder="1-year manufacturer warranty covering..." />
            </FormField>

            <FormField label="Care Instructions">
              <AdminTextarea value={form.careInstructions} onChange={(e) => updateForm('careInstructions', e.target.value)} rows={3} placeholder="Clean with microfiber cloth. Store in provided case..." />
            </FormField>
          </div>
        )}

        {/* SEO */}
        {activeTab === 'seo' && (
          <div className="space-y-5">
            <FormField label="Meta Title" description="Max 60 characters. Defaults to product name if empty.">
              <AdminInput value={form.metaTitle} onChange={(e) => updateForm('metaTitle', e.target.value)} placeholder="Product Name | XYZ Eyewear" maxLength={60} />
              <div className="text-right mt-1">
                <span className={`text-[10px] ${(form.metaTitle?.length || 0) > 50 ? 'text-amber-400' : 'text-obsidian-600'}`}>
                  {form.metaTitle?.length || 0}/60
                </span>
              </div>
            </FormField>

            <FormField label="Meta Description" description="Max 160 characters. Used for search engine results.">
              <AdminTextarea value={form.metaDesc} onChange={(e) => updateForm('metaDesc', e.target.value)} rows={3} placeholder="A compelling description for search engines..." maxLength={160} />
              <div className="text-right mt-1">
                <span className={`text-[10px] ${(form.metaDesc?.length || 0) > 140 ? 'text-amber-400' : 'text-obsidian-600'}`}>
                  {form.metaDesc?.length || 0}/160
                </span>
              </div>
            </FormField>

            {/* SEO Preview */}
            <div className="border border-obsidian-800/60 rounded-xl p-4">
              <p className="text-[10px] font-bold tracking-wider text-obsidian-600 uppercase mb-3">Search Preview</p>
              <div className="space-y-1">
                <p className="text-blue-400 text-sm font-medium truncate">
                  {form.metaTitle || form.name || 'Product Title'} | XYZ Eyewear
                </p>
                <p className="text-emerald-600 text-xs truncate">
                  xyzeyewear.com/product/{form.name ? form.name.toLowerCase().replace(/\s+/g, '-') : 'slug'}
                </p>
                <p className="text-obsidian-400 text-xs leading-relaxed line-clamp-2">
                  {form.metaDesc || form.shortDescription || 'Add a meta description to improve your search engine results...'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
