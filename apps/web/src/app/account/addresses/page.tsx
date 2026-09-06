'use client';

import React, { useState } from 'react';
import { Plus, CheckCircle2, Trash2, X, Building, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Address {
  id: string;
  name: string;
  type: 'HOME' | 'WORK' | 'OTHER';
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

const INITIAL_ADDRESSES: Address[] = [
  {
    id: 'addr-01',
    name: 'Sophia Vane',
    type: 'HOME',
    street: 'Penthouse 14B, Prestige Kingfisher Towers, Lavelle Road',
    landmark: 'Near UB City',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    phone: '+91 98765 43210',
    isDefault: true,
  },
  {
    id: 'addr-02',
    name: 'Sophia Vane (Studio)',
    type: 'WORK',
    street: 'Floor 9, Concorde Tower, UB City, 1 Vittal Mallya Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    phone: '+91 98765 43210',
    isDefault: false,
  },
];

export default function AccountAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form
  const [fullName, setFullName] = useState('');
  const [addressType, setAddressType] = useState<'HOME' | 'WORK' | 'OTHER'>('HOME');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this address?')) {
      setAddresses(addresses.filter((a) => a.id !== id));
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      name: fullName || 'Sophia Vane',
      type: addressType,
      street,
      city,
      state,
      pincode,
      phone,
      isDefault: addresses.length === 0,
    };
    setAddresses([...addresses, newAddr]);
    setIsAddModalOpen(false);
    setStreet('');
    setCity('');
    setState('');
    setPincode('');
    setPhone('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-obsidian-100">
        <div>
          <span className="text-xs font-semibold tracking-widest text-gold uppercase">Delivery Destinations</span>
          <h1 className="font-serif text-3xl font-medium text-obsidian-950 mt-1">
            Saved Address Book
          </h1>
          <p className="text-sm text-obsidian-500 mt-1">
            Manage your personal residences, executive suites, and secure delivery locations.
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          variant="primary"
          className="text-xs tracking-wider uppercase font-semibold"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Address
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`rounded-2xl border p-6 bg-white relative transition-all ${
              addr.isDefault
                ? 'border-gold/60 shadow-md shadow-gold/5 ring-1 ring-gold/20'
                : 'border-obsidian-100 hover:border-obsidian-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {addr.type === 'HOME' ? (
                  <Home className="w-4 h-4 text-gold" />
                ) : (
                  <Building className="w-4 h-4 text-gold" />
                )}
                <span className="font-serif text-lg font-medium text-obsidian-950">{addr.name}</span>
              </div>

              {addr.isDefault && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-gold/15 text-gold-800 border border-gold/30">
                  <CheckCircle2 className="w-3 h-3" /> Default Residence
                </span>
              )}
            </div>

            <p className="text-sm text-obsidian-700 leading-relaxed mb-3">
              {addr.street}
              {addr.landmark && <span className="block text-xs text-obsidian-500">{addr.landmark}</span>}
              <span className="block font-medium text-obsidian-900 mt-0.5">
                {addr.city}, {addr.state} — {addr.pincode}
              </span>
            </p>

            <p className="text-xs text-obsidian-500 mb-4">Phone: {addr.phone}</p>

            <div className="pt-3 border-t border-obsidian-100 flex items-center justify-between text-xs">
              {!addr.isDefault ? (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="text-gold-700 hover:text-gold font-medium"
                >
                  Set as Default
                </button>
              ) : (
                <span className="text-obsidian-400 font-medium">Primary Shipping Address</span>
              )}

              <button
                onClick={() => handleDelete(addr.id)}
                className="p-1.5 rounded-lg text-obsidian-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete address"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Address Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-obsidian-200">
            <div className="flex items-center justify-between pb-4 border-b border-obsidian-100">
              <h3 className="font-serif text-xl font-medium text-obsidian-950">Add Secure Address</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg hover:bg-obsidian-100 text-obsidian-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-obsidian-700 uppercase tracking-wider mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Recipient Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-obsidian-700 uppercase tracking-wider mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+91..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-obsidian-700 uppercase tracking-wider mb-1">
                  Address Type
                </label>
                <select
                  value={addressType}
                  onChange={(e) => setAddressType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold bg-white"
                >
                  <option value="HOME">Personal Residence</option>
                  <option value="WORK">Executive Office / Studio</option>
                  <option value="OTHER">Other Private Destination</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-obsidian-700 uppercase tracking-wider mb-1">
                  Street Address & Residence
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Flat / Villa / Building, Street"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-3 py-2 border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-obsidian-700 uppercase tracking-wider mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-obsidian-700 uppercase tracking-wider mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-obsidian-700 uppercase tracking-wider mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="560001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3 py-2 border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="text-xs">
                  Save Address
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
