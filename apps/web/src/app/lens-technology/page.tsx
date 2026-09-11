import type { Metadata } from 'next';
import { APP } from '@nayan-sukh-eyewear/config';
import Link from 'next/link';
import { Sparkles, Layers, ShieldCheck, ArrowRight, Gem, Feather } from 'lucide-react';

export const metadata: Metadata = {
  title: `Materials & Master Craftsmanship — ${APP.NAME}`,
  description: 'Explore the engineering behind our Italian Mazzucchelli acetate, Japanese Grade-5 titanium, and 7-layer vacuum nano-coatings.',
};

const CRAFT_PILLARS = [
  {
    title: 'Italian Mazzucchelli Acetate',
    origin: 'Castiglione Olona, Italy',
    icon: Gem,
    desc: 'Produced from renewable organic cotton cellulose. Aged and cured for months before undergoing 48 hours of continuous tumbling in German beechwood barrels and hand-polishing with pumice wax.',
  },
  {
    title: 'Japanese Beta-Titanium',
    origin: 'Sabae, Fukui, Japan',
    icon: Feather,
    desc: 'Forged in the spiritual capital of eyewear metallurgy. Hypoallergenic, flexible memory metal that resists corrosion and perspiration while reducing frame weight to under 10 grams.',
  },
  {
    title: '5-Barrel Precision Hinges',
    origin: 'Surgical Stainless Steel',
    icon: ShieldCheck,
    desc: 'CNC-milled from solid blocks of stainless steel and calibrated with micro-tension Teflon screws. Rigorously tested for over 60,000 open-close cycles without looseness or wobble.',
  },
  {
    title: '7-Layer Nano-Coating Stack',
    origin: 'Vacuum Plasma Deposition',
    icon: Layers,
    desc: 'Each lens is infused in an ultra-clean vacuum chamber: hydrophobic (water repelling), oleophobic (oil/fingerprint resistant), anti-reflective, UV400 shield, and sapphire-hard scratch guard.',
  },
];

export default function LensTechnologyPage() {
  return (
    <div className="bg-obsidian-950 text-white min-h-screen pt-24 pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 text-gold text-xs font-semibold uppercase tracking-widest border border-gold/30 mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Haute Lunetterie Engineering</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-light tracking-tight">
          Materials & Craftsmanship
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-obsidian-300 font-light">
          Where heritage artisanship converges with micro-precision optical engineering. Discover the noble materials that define Nayan Sukh Eyewear.
        </p>
      </div>

      {/* Craft Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CRAFT_PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-gold/40 transition-colors space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold flex items-center justify-center border border-gold/20">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] uppercase font-mono tracking-wider px-3 py-1 rounded-full bg-white/10 text-obsidian-300">
                      {p.origin}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl text-white font-medium">{p.title}</h3>
                  <p className="text-xs sm:text-sm text-obsidian-300 font-light leading-relaxed">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 27-Point Inspection Callout */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-obsidian-900 to-obsidian-950 border border-gold/30 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs uppercase font-bold tracking-widest text-gold">Quality Standards</span>
            <h2 className="font-serif text-2xl sm:text-4xl text-white font-light">
              27-Point Master Optician Inspection
            </h2>
            <p className="text-xs sm:text-sm text-obsidian-300 font-light leading-relaxed">
              Before any frame leaves our workshop, it is hand-checked by a licensed master optician. From bridge balance and temple arm parallelism to optical lens axis verification (tolerance ±0.1mm), we ensure zero defect perfection.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link
              href="/shop"
              className="py-3.5 px-6 rounded-xl bg-gold hover:bg-gold-400 text-obsidian-950 font-semibold text-xs uppercase tracking-wider transition-colors text-center flex items-center justify-center gap-2"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/prescription-guide"
              className="py-3.5 px-6 rounded-xl border border-white/20 hover:bg-white/10 text-white font-medium text-xs uppercase tracking-wider transition-colors text-center"
            >
              Prescription Optics Guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
