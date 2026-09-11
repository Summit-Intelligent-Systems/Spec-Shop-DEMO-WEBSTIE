'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

type RxStatus = 'PENDING' | 'APPROVED' | 'FLAGGED';

interface PrescriptionReview {
  id: string;
  orderNumber: string;
  customer: string;
  date: string;
  lensType: string;
  od: { sphere: string; cylinder: string; axis: string; add?: string };
  os: { sphere: string; cylinder: string; axis: string; add?: string };
  pd: number;
  uploadedBy: string;
  status: RxStatus;
  flagReason?: string;
}

const INITIAL_RX: PrescriptionReview[] = [
  {
    id: 'rx-r01',
    orderNumber: 'NS-88221',
    customer: 'Maya Kapoor',
    date: 'Sept 05, 2026',
    lensType: 'Progressive',
    od: { sphere: '-1.75', cylinder: '-0.50', axis: '170°', add: '+2.00' },
    os: { sphere: '-2.00', cylinder: '-0.75', axis: '175°', add: '+2.00' },
    pd: 61,
    uploadedBy: 'Customer Self-Upload (Photo)',
    status: 'PENDING',
  },
  {
    id: 'rx-r02',
    orderNumber: 'NS-88225',
    customer: 'Vikram Joshi',
    date: 'Sept 06, 2026',
    lensType: 'Progressive',
    od: { sphere: '-3.50', cylinder: '-1.25', axis: '90°', add: '+1.75' },
    os: { sphere: '-3.25', cylinder: '-1.00', axis: '85°', add: '+1.75' },
    pd: 65,
    uploadedBy: 'Customer Self-Upload (Manual Entry)',
    status: 'FLAGGED',
    flagReason: 'Cylinder axis 85° for OS is unusual with this sphere. Please confirm with prescribing doctor.',
  },
  {
    id: 'rx-r03',
    orderNumber: 'NS-88219',
    customer: 'Sophia Vane',
    date: 'Sept 04, 2026',
    lensType: 'Single Vision',
    od: { sphere: '-2.25', cylinder: '-0.50', axis: '180°' },
    os: { sphere: '-2.00', cylinder: '-0.75', axis: '175°' },
    pd: 63,
    uploadedBy: 'Dr. Sarah Chen, OD (Clinic Verified)',
    status: 'APPROVED',
  },
  {
    id: 'rx-r04',
    orderNumber: 'NS-88226',
    customer: 'Nandini Rao',
    date: 'Sept 04, 2026',
    lensType: 'Photochromic SV',
    od: { sphere: '-1.00', cylinder: '0.00', axis: '0°' },
    os: { sphere: '-0.75', cylinder: '-0.25', axis: '180°' },
    pd: 60,
    uploadedBy: 'Optometrist Portal Upload',
    status: 'APPROVED',
  },
];

const statusBadge: Record<RxStatus, { label: string; color: string; icon: React.ElementType }> = {
  PENDING: { label: 'Awaiting Review', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30', icon: Clock },
  APPROVED: { label: 'Clinically Approved', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', icon: CheckCircle2 },
  FLAGGED: { label: 'Flagged for Query', color: 'bg-rose-500/15 text-rose-300 border-rose-500/30', icon: AlertTriangle },
};

export default function AdminPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState(INITIAL_RX);
  const [filterStatus, setFilterStatus] = useState<'ALL' | RxStatus>('ALL');

  const filtered = prescriptions.filter((rx) =>
    filterStatus === 'ALL' ? true : rx.status === filterStatus,
  );

  const handleApprove = (id: string) => {
    setPrescriptions((prev) =>
      prev.map((rx) => (rx.id === id ? { ...rx, status: 'APPROVED' as RxStatus, flagReason: undefined } : rx)),
    );
  };

  const handleFlag = (id: string) => {
    const reason = prompt('Enter clinical concern or query for the customer:');
    if (reason) {
      setPrescriptions((prev) =>
        prev.map((rx) => (rx.id === id ? { ...rx, status: 'FLAGGED' as RxStatus, flagReason: reason } : rx)),
      );
    }
  };

  const pendingCount = prescriptions.filter((rx) => rx.status === 'PENDING').length;
  const flaggedCount = prescriptions.filter((rx) => rx.status === 'FLAGGED').length;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-gold uppercase">Clinical Verification</span>
          <h1 className="font-serif text-3xl font-medium text-white mt-1">
            Optometrist Rx Review Desk
          </h1>
          <p className="text-sm text-obsidian-500 mt-1">
            Verify, approve, or flag prescription uploads before they enter the optical production lab.
          </p>
        </div>

        {/* Summary badges */}
        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              <Clock className="w-3.5 h-3.5" />
              {pendingCount} Pending
            </span>
          )}
          {flaggedCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
              <AlertTriangle className="w-3.5 h-3.5" />
              {flaggedCount} Flagged
            </span>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-obsidian-900/80 border border-obsidian-800/60 rounded-xl p-1 w-fit">
        {(['ALL', 'PENDING', 'FLAGGED', 'APPROVED'] as const).map((key) => (
          <button
            key={key}
            onClick={() => setFilterStatus(key)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === key
                ? 'bg-gold/15 text-gold border border-gold/30'
                : 'text-obsidian-500 hover:text-white border border-transparent'
            }`}
          >
            {key === 'ALL' ? 'All' : key.charAt(0) + key.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Rx Cards */}
      <div className="space-y-5">
        {filtered.map((rx) => {
          const badge = statusBadge[rx.status];
          const BadgeIcon = badge.icon;

          return (
            <div
              key={rx.id}
              className={`bg-obsidian-900/60 border rounded-2xl overflow-hidden transition-all ${
                rx.status === 'FLAGGED'
                  ? 'border-rose-500/40'
                  : rx.status === 'PENDING'
                  ? 'border-amber-500/30'
                  : 'border-obsidian-800/60'
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-5 border-b border-obsidian-800/40">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="font-mono text-xs font-bold text-gold">{rx.orderNumber}</span>
                    <h3 className="text-white font-medium text-base mt-0.5">{rx.customer}</h3>
                    <span className="text-[11px] text-obsidian-600">{rx.date} • Lens: {rx.lensType}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${badge.color}`}>
                    <BadgeIcon className="w-3 h-3" />
                    {badge.label}
                  </span>
                </div>
              </div>

              {/* Rx Matrix */}
              <div className="p-5">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-center border-collapse">
                    <thead>
                      <tr className="text-[10px] uppercase tracking-wider text-obsidian-600">
                        <th className="py-2 px-4 text-left font-semibold">Eye</th>
                        <th className="py-2 px-4 font-semibold">SPH</th>
                        <th className="py-2 px-4 font-semibold">CYL</th>
                        <th className="py-2 px-4 font-semibold">AXIS</th>
                        {rx.od.add && <th className="py-2 px-4 font-semibold">ADD</th>}
                        <th className="py-2 px-4 font-semibold">PD</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-obsidian-800/40 font-mono text-white">
                      <tr>
                        <td className="py-2.5 px-4 text-left font-sans text-obsidian-400">OD (Right)</td>
                        <td className="py-2.5 px-4 font-semibold">{rx.od.sphere}</td>
                        <td className="py-2.5 px-4">{rx.od.cylinder}</td>
                        <td className="py-2.5 px-4">{rx.od.axis}</td>
                        {rx.od.add && <td className="py-2.5 px-4 text-gold">{rx.od.add}</td>}
                        <td rowSpan={2} className="py-2.5 px-4 align-middle font-bold text-gold bg-obsidian-800/20">
                          {rx.pd} mm
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 text-left font-sans text-obsidian-400">OS (Left)</td>
                        <td className="py-2.5 px-4 font-semibold">{rx.os.sphere}</td>
                        <td className="py-2.5 px-4">{rx.os.cylinder}</td>
                        <td className="py-2.5 px-4">{rx.os.axis}</td>
                        {rx.os.add && <td className="py-2.5 px-4 text-gold">{rx.os.add}</td>}
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-[11px] text-obsidian-600 mt-3 flex items-center gap-1.5">
                  <FileText className="w-3 h-3" />
                  Source: {rx.uploadedBy}
                </p>

                {rx.flagReason && (
                  <div className="mt-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                    <span className="font-semibold flex items-center gap-1 mb-0.5">
                      <AlertTriangle className="w-3 h-3" /> Clinical Concern:
                    </span>
                    {rx.flagReason}
                  </div>
                )}
              </div>

              {/* Action Bar */}
              {rx.status !== 'APPROVED' && (
                <div className="px-5 py-4 border-t border-obsidian-800/40 flex items-center justify-end gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFlag(rx.id)}
                    className="text-xs text-rose-400 hover:bg-rose-500/10"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1.5" />
                    Flag & Query
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleApprove(rx.id)}
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                    Approve Rx
                  </Button>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-obsidian-600">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">All prescriptions reviewed. No items in this queue.</p>
          </div>
        )}
      </div>
    </div>
  );
}
