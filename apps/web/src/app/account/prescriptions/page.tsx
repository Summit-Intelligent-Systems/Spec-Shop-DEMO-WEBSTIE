'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  CheckCircle2, 
  ShieldCheck, 
  Download, 
  Trash2, 
  X, 
  AlertCircle,
  Eye,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Prescription {
  id: string;
  name: string;
  type: string;
  od: { sphere: string; cylinder: string; axis: string; add?: string };
  os: { sphere: string; cylinder: string; axis: string; add?: string };
  pd: number;
  doctorName: string;
  clinic: string;
  issueDate: string;
  expiryDate: string;
  isVerified: boolean;
}

const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-01',
    name: 'Primary Distance & Astigmatism',
    type: 'Single Vision (Distance)',
    od: { sphere: '-2.25', cylinder: '-0.50', axis: '180°' },
    os: { sphere: '-2.00', cylinder: '-0.75', axis: '175°' },
    pd: 63,
    doctorName: 'Dr. Sarah Chen, OD',
    clinic: 'Nayan Sukh Flagship Optometry Clinic, Bengaluru',
    issueDate: 'Oct 14, 2025',
    expiryDate: 'Oct 14, 2027',
    isVerified: true,
  },
  {
    id: 'rx-02',
    name: 'Executive Progressive & Screen Work',
    type: 'Progressive / Varifocal',
    od: { sphere: '-0.75', cylinder: '0.00', axis: '0°', add: '+1.50' },
    os: { sphere: '-0.75', cylinder: '-0.25', axis: '90°', add: '+1.50' },
    pd: 62,
    doctorName: 'Dr. Rajesh Nair, Senior Optometrist',
    clinic: 'Sabae Optical Consultation Suite, Mumbai',
    issueDate: 'Jan 20, 2026',
    expiryDate: 'Jan 20, 2028',
    isVerified: true,
  },
];

export default function AccountPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(INITIAL_PRESCRIPTIONS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [rxName, setRxName] = useState('');
  const [rxType, setRxType] = useState('Single Vision');
  const [odSphere, setOdSphere] = useState('-1.50');
  const [odCyl, setOdCyl] = useState('-0.25');
  const [odAxis, setOdAxis] = useState('180');
  const [osSphere, setOsSphere] = useState('-1.50');
  const [osCyl, setOsCyl] = useState('-0.25');
  const [osAxis, setOsAxis] = useState('180');
  const [pdValue, setPdValue] = useState('63');
  const [doctorName, setDoctorName] = useState('');

  const handleAddPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    const newRx: Prescription = {
      id: `rx-${Date.now()}`,
      name: rxName || 'Newly Added Prescription',
      type: rxType,
      od: { sphere: odSphere, cylinder: odCyl, axis: `${odAxis}°` },
      os: { sphere: osSphere, cylinder: osCyl, axis: `${osAxis}°` },
      pd: Number(pdValue) || 63,
      doctorName: doctorName || 'Attending Optometrist',
      clinic: 'External Optical Clinic (Pending Verification)',
      issueDate: 'Sept 2026',
      expiryDate: 'Sept 2028',
      isVerified: false,
    };

    setPrescriptions([newRx, ...prescriptions]);
    setIsAddModalOpen(false);
    setRxName('');
    setDoctorName('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you wish to delete this prescription from your vault?')) {
      setPrescriptions(prescriptions.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-obsidian-100">
        <div>
          <span className="text-xs font-semibold tracking-widest text-gold uppercase">Clinical Optical Records</span>
          <h1 className="font-serif text-3xl font-medium text-obsidian-950 mt-1">
            Prescriptions Vault
          </h1>
          <p className="text-sm text-obsidian-500 mt-1">
            Securely stored optical measurements verified by certified optometrists.
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          variant="primary"
          className="text-xs tracking-wider uppercase font-semibold"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Prescription
        </Button>
      </div>

      {/* Prescriptions List */}
      <div className="grid grid-cols-1 gap-6">
        {prescriptions.map((rx) => (
          <div
            key={rx.id}
            className="border border-obsidian-100 rounded-2xl p-6 bg-white hover:border-gold/40 transition-all shadow-sm relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-obsidian-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-xl font-medium text-obsidian-950">{rx.name}</h3>
                  {rx.isVerified ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Doctor Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-50 text-amber-700 border border-amber-200">
                      <AlertCircle className="w-3 h-3" /> Pending Lab Review
                    </span>
                  )}
                </div>
                <p className="text-xs text-obsidian-500 mt-0.5">Type: {rx.type}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert(`Downloading Optical Rx Certificate for ${rx.name}...`)}
                  className="text-xs"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Rx Certificate
                </Button>
                <button
                  onClick={() => handleDelete(rx.id)}
                  className="p-2 rounded-lg text-obsidian-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Remove from vault"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="bg-obsidian-50 text-obsidian-600 uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-4 text-left font-semibold">Eye</th>
                    <th className="py-2.5 px-4 font-semibold">Sphere (SPH)</th>
                    <th className="py-2.5 px-4 font-semibold">Cylinder (CYL)</th>
                    <th className="py-2.5 px-4 font-semibold">Axis</th>
                    {rx.od.add && <th className="py-2.5 px-4 font-semibold">Addition (ADD)</th>}
                    <th className="py-2.5 px-4 font-semibold">Pupillary Distance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-obsidian-100 font-mono">
                  <tr>
                    <td className="py-3 px-4 text-left font-sans font-medium text-obsidian-900">Right (OD)</td>
                    <td className="py-3 px-4 font-semibold text-obsidian-950">{rx.od.sphere}</td>
                    <td className="py-3 px-4 text-obsidian-800">{rx.od.cylinder}</td>
                    <td className="py-3 px-4 text-obsidian-800">{rx.od.axis}</td>
                    {rx.od.add && <td className="py-3 px-4 text-gold-700 font-semibold">{rx.od.add}</td>}
                    <td rowSpan={2} className="py-3 px-4 align-middle bg-obsidian-50/40 font-semibold text-obsidian-950">
                      {rx.pd} mm
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-left font-sans font-medium text-obsidian-900">Left (OS)</td>
                    <td className="py-3 px-4 font-semibold text-obsidian-950">{rx.os.sphere}</td>
                    <td className="py-3 px-4 text-obsidian-800">{rx.os.cylinder}</td>
                    <td className="py-3 px-4 text-obsidian-800">{rx.os.axis}</td>
                    {rx.os.add && <td className="py-3 px-4 text-gold-700 font-semibold">{rx.os.add}</td>}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Clinic & Expiry Details */}
            <div className="mt-4 pt-3 border-t border-obsidian-100 flex flex-wrap items-center justify-between text-xs text-obsidian-500 gap-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                <span>Prescribed by <strong>{rx.doctorName}</strong> ({rx.clinic})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-obsidian-400" />
                <span>Valid: {rx.issueDate} – {rx.expiryDate}</span>
              </div>
            </div>

            {/* Order Lenses Action */}
            <div className="mt-4 pt-3 border-t border-obsidian-100 flex justify-end">
              <Link href="/shop">
                <Button variant="outline" size="sm" className="border-gold text-gold-700 hover:bg-gold/10 text-xs">
                  <Eye className="w-3.5 h-3.5 mr-1.5" />
                  Order Frames with this Rx
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Add Prescription Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-obsidian-200">
            <div className="flex items-center justify-between pb-4 border-b border-obsidian-100">
              <h3 className="font-serif text-xl font-medium text-obsidian-950">Add Prescription to Vault</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg hover:bg-obsidian-100 text-obsidian-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPrescription} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-obsidian-700 uppercase tracking-wider mb-1">
                  Prescription Label
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Computer & Reading Glasses"
                  value={rxName}
                  onChange={(e) => setRxName(e.target.value)}
                  className="w-full px-3 py-2 border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-obsidian-700 uppercase tracking-wider mb-1">
                    Rx Type
                  </label>
                  <select
                    value={rxType}
                    onChange={(e) => setRxType(e.target.value)}
                    className="w-full px-3 py-2 border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold bg-white"
                  >
                    <option value="Single Vision">Single Vision</option>
                    <option value="Progressive">Progressive</option>
                    <option value="Reading Only">Reading Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-obsidian-700 uppercase tracking-wider mb-1">
                    Pupillary Distance (mm)
                  </label>
                  <input
                    type="number"
                    value={pdValue}
                    onChange={(e) => setPdValue(e.target.value)}
                    className="w-full px-3 py-2 border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Right Eye (OD) */}
              <div className="p-3 bg-obsidian-50 rounded-xl space-y-2">
                <span className="text-xs font-semibold text-obsidian-900 block">Right Eye (OD)</span>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="SPH (-2.00)"
                    value={odSphere}
                    onChange={(e) => setOdSphere(e.target.value)}
                    className="px-2 py-1.5 border border-obsidian-200 rounded text-xs text-center"
                  />
                  <input
                    type="text"
                    placeholder="CYL (-0.50)"
                    value={odCyl}
                    onChange={(e) => setOdCyl(e.target.value)}
                    className="px-2 py-1.5 border border-obsidian-200 rounded text-xs text-center"
                  />
                  <input
                    type="text"
                    placeholder="AXIS (180)"
                    value={odAxis}
                    onChange={(e) => setOdAxis(e.target.value)}
                    className="px-2 py-1.5 border border-obsidian-200 rounded text-xs text-center"
                  />
                </div>
              </div>

              {/* Left Eye (OS) */}
              <div className="p-3 bg-obsidian-50 rounded-xl space-y-2">
                <span className="text-xs font-semibold text-obsidian-900 block">Left Eye (OS)</span>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="SPH (-2.00)"
                    value={osSphere}
                    onChange={(e) => setOsSphere(e.target.value)}
                    className="px-2 py-1.5 border border-obsidian-200 rounded text-xs text-center"
                  />
                  <input
                    type="text"
                    placeholder="CYL (-0.50)"
                    value={osCyl}
                    onChange={(e) => setOsCyl(e.target.value)}
                    className="px-2 py-1.5 border border-obsidian-200 rounded text-xs text-center"
                  />
                  <input
                    type="text"
                    placeholder="AXIS (180)"
                    value={osAxis}
                    onChange={(e) => setOsAxis(e.target.value)}
                    className="px-2 py-1.5 border border-obsidian-200 rounded text-xs text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-obsidian-700 uppercase tracking-wider mb-1">
                  Prescribing Doctor / Clinic
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Rajesh Nair, Bengaluru"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full px-3 py-2 border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold"
                />
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
                  Save to Vault
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
