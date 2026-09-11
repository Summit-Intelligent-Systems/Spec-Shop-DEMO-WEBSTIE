import type { Metadata } from 'next';
import { APP } from '@nayan-sukh-eyewear/config';
import Link from 'next/link';
import { Sparkles, CheckCircle2, Glasses, ArrowRight, Eye, Sun, Monitor, CreditCard } from 'lucide-react';

export const metadata: Metadata = {
  title: `Optical Blueprint & Prescription Lens Guide — ${APP.NAME}`,
  description: 'Understand prescription options, high-index lens packages (1.50 to 1.74 Featherweight), protective nano-coatings, and frame sizing.',
};

const VISION_TYPES = [
  {
    title: 'Zero Power / Digital Blue Light',
    price: '₹0 (Included)',
    icon: Monitor,
    desc: 'Engineered for computer, tablet, and smartphone users. Blocks 420nm harmful blue rays with zero power distortion.',
  },
  {
    title: 'Single Vision Correction',
    price: '+₹999',
    icon: Eye,
    desc: 'Precision single focal power for distance (myopia), near reading (hyperopia), or astigmatic correction.',
  },
  {
    title: 'Progressive / Multifocal',
    price: '+₹2,499',
    icon: Glasses,
    desc: 'Seamless line-free optical corridors transitioning naturally between reading, computer, and driving distances.',
  },
  {
    title: 'Polarized Sun Prescription',
    price: '+₹1,999',
    icon: Sun,
    desc: 'Prescription sun lenses combining 100% UV400 defense and polarized glare filtration for outdoor elegance.',
  },
];

const LENS_INDICES = [
  {
    index: '1.50 Standard Clarity',
    powerRange: 'Up to ±2.00 SPH',
    price: 'Included (₹0)',
    benefit: 'Impact-resistant CR-39 monomer with UV400 protection and scratch-resistant hard coat.',
  },
  {
    index: '1.60 High-Index Thin',
    powerRange: 'Up to ±4.00 SPH',
    price: '₹999',
    benefit: '25% thinner and significantly lighter than standard lenses. High tensile strength for rimless and semi-rimless frames.',
  },
  {
    index: '1.67 Ultra-Thin Aspheric',
    powerRange: 'Up to ±7.00 SPH',
    price: '₹1,999',
    benefit: '40% thinner profile with flat aspheric geometry. Eliminates eye magnification and peripheral fishbowl distortion.',
  },
  {
    index: '1.74 Featherweight High Index',
    powerRange: '±7.00 SPH & Above',
    price: '₹3,499',
    benefit: 'The thinnest, flattest organic optical lens in modern optometry. 55% thinner than standard lenses with razor-thin edge bevels.',
  },
];

const COATINGS = [
  { name: 'Sapphire Anti-Glare AR', price: 'Free', desc: 'Eliminates 99.8% of light reflection and halo glare.' },
  { name: 'Blue Defense 420nm Shield', price: '₹799', desc: 'Selective blue-violet ray absorption for intensive screen users.' },
  { name: 'Photochromic Transitions Gen-8', price: '₹1,999', desc: 'Rapid indoor clear to outdoor dark sunglass adaptation.' },
  { name: 'DriveSafe Night Contrast', price: '₹1,299', desc: 'Filters oncoming LED high-beam glare for nighttime motoring.' },
];

export default function PrescriptionGuidePage() {
  return (
    <div className="bg-obsidian-950 text-white min-h-screen pt-24 pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 text-gold text-xs font-semibold uppercase tracking-widest border border-gold/30 mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Precision German Optics</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-light tracking-tight">
          Prescription Optics & Lens Guide
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-obsidian-300 font-light">
          Engineered with sub-micron surfacing tolerances and vacuum-deposited nanocoatings to deliver edge-to-edge optical clarity tailored to your prescription.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* 1. Vision Types */}
        <div>
          <div className="mb-8">
            <span className="text-xs uppercase font-bold tracking-widest text-gold block">Section 01</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-light mt-1">Select Your Vision Correction</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VISION_TYPES.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/40 transition-colors flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-4 border border-gold/20">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-lg text-white font-medium">{v.title}</h3>
                    <p className="text-xs text-obsidian-400 mt-2 leading-relaxed font-light">{v.desc}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/10 text-xs font-semibold text-gold">
                    {v.price}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Lens Indices */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-obsidian-900 to-obsidian-950 border border-white/10">
          <div className="mb-8">
            <span className="text-xs uppercase font-bold tracking-widest text-gold block">Section 02</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-light mt-1">High-Index Lens Profiles & Thickness</h2>
            <p className="text-xs sm:text-sm text-obsidian-300 font-light mt-2">
              Higher index materials bend light more efficiently, yielding thinner, lighter lenses even with strong corrective powers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {LENS_INDICES.map((idx) => (
              <div key={idx.index} className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">{idx.index}</span>
                  <span className="text-xs text-gold font-mono">{idx.price}</span>
                </div>
                <div className="text-[11px] uppercase tracking-wider text-obsidian-400">
                  Ideal for: <strong className="text-obsidian-200">{idx.powerRange}</strong>
                </div>
                <p className="text-xs text-obsidian-400 font-light leading-relaxed">{idx.benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Advanced Protective Coatings */}
        <div>
          <div className="mb-8">
            <span className="text-xs uppercase font-bold tracking-widest text-gold block">Section 03</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-light mt-1">Vacuum-Deposited Nano-Coatings</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COATINGS.map((c) => (
              <div key={c.name} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm text-white">{c.name}</h4>
                  <span className="text-xs text-gold font-medium">{c.price}</span>
                </div>
                <p className="text-xs text-obsidian-400 font-light">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Frame Sizing & Bank Card Method */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white/5 border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold">
              <CreditCard className="w-4 h-4" />
              <span>Easy At-Home Sizing Method</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-light">
              The Standard Bank Card Frame Sizing Test
            </h3>
            <p className="text-xs sm:text-sm text-obsidian-300 font-light leading-relaxed">
              Every standard credit or debit card is precisely 85.6mm long. Stand in front of a mirror, align one vertical edge along the center bridge of your nose, and observe where the outer edge falls relative to the outer corner of your eye:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-obsidian-300 font-light pt-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span><strong>Card extends past eye corner:</strong> Small / Narrow Fit (Lens width ~49–51mm).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span><strong>Card aligns directly with eye corner:</strong> Medium / Standard Fit (Lens width ~51–53mm).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span><strong>Card ends before eye corner:</strong> Large / Wide Fit (Lens width ~53–56mm).</span>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-3">
            <Link
              href="/shop/eyeglasses"
              className="py-4 px-6 rounded-xl bg-gold hover:bg-gold-400 text-obsidian-950 font-semibold text-xs uppercase tracking-wider text-center transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <span>Explore Eyeglasses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/book-eye-test"
              className="py-3 px-6 rounded-xl border border-white/20 hover:bg-white/10 text-white font-medium text-xs uppercase tracking-wider text-center transition-colors"
            >
              Book Complimentary Eye Exam
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
