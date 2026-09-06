'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Package, 
  FileText, 
  Calendar, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { useUIStore } from '@/lib/store/uiStore';
import { Button } from '@/components/ui/Button';

export default function AccountOverviewPage() {
  const { user } = useAuthStore();
  const { openEyeExamModal } = useUIStore();

  const firstName = user?.profile?.firstName || 'Sophia';

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-obsidian-100">
        <div>
          <span className="text-xs font-semibold tracking-widest text-gold uppercase">Private Client Dashboard</span>
          <h1 className="font-serif text-3xl font-medium text-obsidian-950 mt-1">
            Welcome, {firstName}
          </h1>
          <p className="text-sm text-obsidian-500 mt-1">
            Manage your bespoke eyewear collection, optical prescriptions, and appointments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => openEyeExamModal()}
            variant="outline"
            className="border-gold/50 text-gold-700 hover:bg-gold/10 text-xs tracking-wider uppercase font-semibold"
          >
            <Calendar className="w-3.5 h-3.5 mr-2" />
            Book Eye Exam
          </Button>
          <Link href="/shop">
            <Button variant="primary" className="text-xs tracking-wider uppercase font-semibold">
              Explore Atelier
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-obsidian-50 border border-obsidian-100/80">
          <div className="flex items-center justify-between text-obsidian-500 mb-2">
            <span className="text-xs font-medium">Active Order</span>
            <Package className="w-4 h-4 text-gold" />
          </div>
          <div className="text-2xl font-serif font-semibold text-obsidian-950">1</div>
          <span className="text-[11px] text-amber-600 font-medium flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3" /> In Optical Lab
          </span>
        </div>

        <div className="p-4 rounded-xl bg-obsidian-50 border border-obsidian-100/80">
          <div className="flex items-center justify-between text-obsidian-500 mb-2">
            <span className="text-xs font-medium">Prescriptions</span>
            <FileText className="w-4 h-4 text-gold" />
          </div>
          <div className="text-2xl font-serif font-semibold text-obsidian-950">2</div>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3 h-3" /> Doctor Verified
          </span>
        </div>

        <div className="p-4 rounded-xl bg-obsidian-50 border border-obsidian-100/80">
          <div className="flex items-center justify-between text-obsidian-500 mb-2">
            <span className="text-xs font-medium">Salon Credits</span>
            <Sparkles className="w-4 h-4 text-gold" />
          </div>
          <div className="text-2xl font-serif font-semibold text-obsidian-950">₹4,500</div>
          <span className="text-[11px] text-obsidian-500 mt-1 block">Tier III Privé Benefit</span>
        </div>

        <div className="p-4 rounded-xl bg-obsidian-50 border border-obsidian-100/80">
          <div className="flex items-center justify-between text-obsidian-500 mb-2">
            <span className="text-xs font-medium">Next Fitting</span>
            <Calendar className="w-4 h-4 text-gold" />
          </div>
          <div className="text-base font-serif font-semibold text-obsidian-950 mt-1">Sept 12</div>
          <span className="text-[11px] text-obsidian-500 block">Indiranagar Boutique</span>
        </div>
      </div>

      {/* In-Production Highlight */}
      <div className="rounded-2xl border border-gold/40 bg-gradient-to-br from-gold/5 via-transparent to-transparent p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-gold-700 text-xs font-semibold tracking-wider uppercase mb-2 border border-gold/30">
              <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
              Live Optical Production Status
            </div>
            <h3 className="font-serif text-xl font-medium text-obsidian-950">
              Order #XYZ-88219 — The Sovereign Round
            </h3>
            <p className="text-xs text-obsidian-500 mt-0.5">
              Single Vision 1.74 High Index • Zeiss DuraVision BlueProtect • Prescription Verified
            </p>
          </div>

          <Link href="/account/orders">
            <Button variant="outline" className="border-obsidian-300 text-xs font-medium">
              <span>View Full Lab Tracker</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>

        {/* Timeline Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-gold font-semibold">Stage 3 of 5: Lens Precision Surfacing</span>
            <span className="text-obsidian-500">Estimated Dispatch: Sept 10, 2026</span>
          </div>
          <div className="h-2 w-full bg-obsidian-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-gold via-amber-500 to-gold rounded-full w-[65%]" />
          </div>
          <div className="grid grid-cols-5 text-[11px] text-obsidian-500 pt-1">
            <span className="text-emerald-700 font-medium">✓ Frame Sourced</span>
            <span className="text-emerald-700 font-medium">✓ Rx Verified</span>
            <span className="text-gold-700 font-bold">● Surfacing</span>
            <span className="text-obsidian-400">Coating</span>
            <span className="text-obsidian-400 text-right">Dispatch</span>
          </div>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prescription Vault Quick Card */}
        <div className="border border-obsidian-100 rounded-xl p-5 hover:border-gold/50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold" />
              <h4 className="font-serif text-lg font-medium text-obsidian-950">Primary Prescription</h4>
            </div>
            <Link href="/account/prescriptions" className="text-xs font-semibold text-gold hover:underline">
              View All Vault
            </Link>
          </div>

          <div className="bg-obsidian-50/80 rounded-lg p-3 text-xs space-y-2">
            <div className="flex justify-between font-mono">
              <span className="text-obsidian-500">Right Eye (OD):</span>
              <span className="font-semibold text-obsidian-900">SPH -2.25 | CYL -0.50 | AXIS 180°</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-obsidian-500">Left Eye (OS):</span>
              <span className="font-semibold text-obsidian-900">SPH -2.00 | CYL -0.75 | AXIS 175°</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-obsidian-200/60 font-mono">
              <span className="text-obsidian-500">Pupillary Distance (PD):</span>
              <span className="font-semibold text-obsidian-900">63 mm</span>
            </div>
          </div>
          <p className="text-[11px] text-obsidian-400 mt-2">
            Certified by Dr. Sarah Chen, OD • Valid until October 2027
          </p>
        </div>

        {/* Upcoming Eye Exam Card */}
        <div className="border border-obsidian-100 rounded-xl p-5 hover:border-gold/50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold" />
              <h4 className="font-serif text-lg font-medium text-obsidian-950">Optometry Appointment</h4>
            </div>
            <Link href="/account/appointments" className="text-xs font-semibold text-gold hover:underline">
              Manage
            </Link>
          </div>

          <div className="bg-obsidian-50/80 rounded-lg p-3 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-obsidian-500">Consultation:</span>
              <span className="font-semibold text-obsidian-900">Comprehensive Refraction & Styling</span>
            </div>
            <div className="flex justify-between">
              <span className="text-obsidian-500">Date & Slot:</span>
              <span className="font-semibold text-obsidian-900">Saturday, Sept 12 at 11:30 AM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-obsidian-500">Doctor:</span>
              <span className="font-semibold text-obsidian-900">Dr. Rajesh Nair, Senior Optometrist</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-obsidian-200/60">
              <span className="text-obsidian-500">Location:</span>
              <span className="font-semibold text-obsidian-900">Indiranagar 100ft Rd Flagship</span>
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Confirmed with VIP Suite reserved
          </p>
        </div>
      </div>
    </div>
  );
}
