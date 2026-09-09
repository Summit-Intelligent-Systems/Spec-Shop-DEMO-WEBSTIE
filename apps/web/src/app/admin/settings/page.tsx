'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Settings, Save, CheckCircle2, Store, Truck, Phone, RefreshCw } from 'lucide-react';
import { apiGet, apiPut } from '@/lib/api';
import FormField from '@/components/admin/FormField';

export default function SettingsAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Settings states
  const [storeName, setStoreName] = useState('XYZ Eyewear');
  const [storeEmail, setStoreEmail] = useState('concierge@xyzeyewear.com');
  const [storePhone, setStorePhone] = useState('+91 1800-890-5000');
  const [currency, setCurrency] = useState('INR');
  const [taxRate, setTaxRate] = useState<number>(18);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(1999);
  const [flatShippingFee, setFlatShippingFee] = useState<number>(149);
  const [activeTab, setActiveTab] = useState<'general' | 'shipping' | 'contact'>('general');

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet<any>('/admin/settings');
      const data = res.data?.data || res.data || {};
      if (data.store_name) setStoreName(data.store_name);
      if (data.store_email) setStoreEmail(data.store_email);
      if (data.store_phone) setStorePhone(data.store_phone);
      if (data.currency) setCurrency(data.currency);
      if (data.tax_rate) setTaxRate(Number(data.tax_rate));
      if (data.free_shipping_threshold) setFreeShippingThreshold(Number(data.free_shipping_threshold));
      if (data.flat_shipping_fee) setFlatShippingFee(Number(data.flat_shipping_fee));
    } catch (err) {
      console.warn('Settings fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiPut('/admin/settings', {
        settings: [
          { key: 'store_name', value: storeName, group: 'general' },
          { key: 'store_email', value: storeEmail, group: 'contact' },
          { key: 'store_phone', value: storePhone, group: 'contact' },
          { key: 'currency', value: currency, group: 'general' },
          { key: 'tax_rate', value: taxRate, group: 'general' },
          { key: 'free_shipping_threshold', value: freeShippingThreshold, group: 'shipping' },
          { key: 'flat_shipping_fee', value: flatShippingFee, group: 'shipping' },
        ],
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Settings className="w-7 h-7 text-gold" />
            Global Store Settings
          </h1>
          <p className="text-sm text-obsidian-400 mt-1">
            Configure boutique brand attributes, shipping rules, tax rates, and customer support.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Settings Saved!
            </span>
          )}
          <button
            type="button"
            onClick={fetchSettings}
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
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-obsidian-800 pb-2">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'general'
              ? 'bg-gold/15 text-gold border border-gold/30'
              : 'text-obsidian-400 hover:text-white'
          }`}
        >
          <Store className="w-4 h-4" /> General & Tax
        </button>
        <button
          onClick={() => setActiveTab('shipping')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'shipping'
              ? 'bg-gold/15 text-gold border border-gold/30'
              : 'text-obsidian-400 hover:text-white'
          }`}
        >
          <Truck className="w-4 h-4" /> Shipping & Delivery
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'contact'
              ? 'bg-gold/15 text-gold border border-gold/30'
              : 'text-obsidian-400 hover:text-white'
          }`}
        >
          <Phone className="w-4 h-4" /> Concierge & Contact
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {activeTab === 'general' && (
          <div className="bg-obsidian-900/60 border border-obsidian-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white border-b border-obsidian-800 pb-3">
              Storefront Identity & Currency
            </h2>

            <FormField label="Store Name">
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Store Currency">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
                >
                  <option value="INR">INR (₹) - Indian Rupee</option>
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                </select>
              </FormField>

              <FormField label="Applicable GST / VAT Rate (%)">
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
                />
              </FormField>
            </div>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="bg-obsidian-900/60 border border-obsidian-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white border-b border-obsidian-800 pb-3">
              Shipping & Fulfillment Policies
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Free Delivery Minimum Threshold (₹)"
                description="Orders exceeding this subtotal receive complimentary express shipping."
              >
                <input
                  type="number"
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
                />
              </FormField>

              <FormField
                label="Standard Flat Delivery Fee (₹)"
                description="Applied when order is below threshold."
              >
                <input
                  type="number"
                  value={flatShippingFee}
                  onChange={(e) => setFlatShippingFee(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
                />
              </FormField>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="bg-obsidian-900/60 border border-obsidian-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white border-b border-obsidian-800 pb-3">
              Customer Concierge & Optical Care
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Support Email">
                <input
                  type="email"
                  value={storeEmail}
                  onChange={(e) => setStoreEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
                />
              </FormField>

              <FormField label="Toll-Free Phone Number">
                <input
                  type="text"
                  value={storePhone}
                  onChange={(e) => setStorePhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-800 border border-obsidian-700 text-white text-sm focus:border-gold focus:outline-none"
                />
              </FormField>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
