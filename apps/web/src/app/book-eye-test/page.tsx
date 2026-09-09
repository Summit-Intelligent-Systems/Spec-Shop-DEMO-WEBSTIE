import type { Metadata } from 'next';
import { APP } from '@xyz-eyewear/config';
import { EyeCareBanner } from '@/components/home/EyeCareBanner';
import Link from 'next/link';
import { ShieldCheck, MapPin, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: `Clinical 20-Step Eye Examination (100% Complimentary) — ${APP.NAME}`,
  description: 'Book your complimentary 20-step digital eye exam at our flagship optical salons or schedule a doorstep visit.',
};

const PROTOCOL_STEPS = [
  { step: '01', title: 'Case History & Visual Needs', desc: 'Screen time habits, occupational demands, and family ocular history.' },
  { step: '02', title: 'Automated Corneal Topography', desc: 'Digital surface mapping measuring curvature and astigmatism.' },
  { step: '03', title: 'Computerized Auto-Refraction', desc: 'Infrared objective analysis calculating exact base focal power.' },
  { step: '04', title: 'Subjective Refraction & Phoropter', desc: 'Fine-tuned cylinder and axis calibration for pin-sharp focus.' },
  { step: '05', title: 'Binocular Balance Verification', desc: 'Synchronized visual balance between both eyes for fatigue-free viewing.' },
  { step: '06', title: 'Non-Contact Tonometry (IOP)', desc: 'Gentle air-puff intraocular pressure screening for glaucoma risk.' },
  { step: '07', title: 'Pupillometry & Exact PD Measure', desc: 'Sub-millimeter optical center alignment matching frame geometry.' },
  { step: '08', title: 'High-Res Digital Retinal Scan', desc: 'Macular health and retinal vessel wellness assessment.' },
];

export default function BookEyeTestPage() {
  return (
    <div className="bg-obsidian-950 text-white min-h-screen pt-24 pb-20">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 text-gold text-xs font-semibold uppercase tracking-widest border border-gold/30">
            <Award className="w-3.5 h-3.5" />
            <span>Zero-Error Precision Guarantee</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-light tracking-tight">
            Clinical 20-Step Eye Exam.{' '}
            <span className="italic text-gold block sm:inline">100% Complimentary.</span>
          </h1>
          <p className="text-obsidian-300 text-sm sm:text-base font-light leading-relaxed">
            World-class diagnostic optometry engineered to uncover micro-variations in your visual acuity. Conducted by certified optometrists at our flagship optical salons or directly at your doorstep.
          </p>
        </div>
      </div>

      {/* Embedded Booking Banner & Trigger */}
      <EyeCareBanner />

      {/* 20-Step Protocol Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-gold">The Science of Sight</span>
          <h2 className="font-serif text-2xl sm:text-4xl text-white font-light">Certified Diagnostic Protocol</h2>
          <p className="text-xs sm:text-sm text-obsidian-400 font-light">
            Every consultation adheres to rigorous European and Japanese clinical standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PROTOCOL_STEPS.map((item) => (
            <div key={item.step} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/40 transition-colors">
              <span className="font-serif text-2xl text-gold font-light block mb-2">{item.step}</span>
              <h3 className="font-serif text-base text-white font-medium mb-1">{item.title}</h3>
              <p className="text-xs text-obsidian-400 font-light leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-gold/10 border border-gold/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-gold shrink-0" />
            <div className="text-xs sm:text-sm text-obsidian-200">
              <strong className="text-white font-medium">Zero-Error Guarantee:</strong> If your prescription feels uncomfortable within 30 days, we perform a complimentary re-test and replace your lenses at zero charge.
            </div>
          </div>
          <Link
            href="/stores"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-400 text-obsidian-950 font-semibold text-xs uppercase tracking-wider transition-colors shrink-0"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Find Nearby Salon</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
