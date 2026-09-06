'use client';

import { useState } from 'react';
import { CalendarCheck, ShieldCheck, MapPin, Award, ArrowRight } from 'lucide-react';
import { EyeTestBookingModal } from './EyeTestBookingModal';

export const EyeCareBanner = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <section className="py-20 bg-obsidian-900 text-white relative overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-r from-obsidian-950 to-obsidian-900 border border-white/10 rounded-3xl p-8 sm:p-14 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Text & Value Props */}
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-semibold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" />
                <span>Clinical Eye Care Excellence</span>
              </div>

              <div className="space-y-3">
                <h2 className="font-serif text-3xl sm:text-5xl text-white font-light leading-tight">
                  Precision 20-Step Eye Examination.{' '}
                  <span className="italic text-gold">100% Complimentary.</span>
                </h2>
                <p className="text-sm text-obsidian-300 font-light max-w-2xl leading-relaxed">
                  Clear vision is the foundation of elegance. Experience world-class eye testing using automated corneal topography, digital refraction, and retina wellness screenings performed by certified optometrists.
                </p>
              </div>

              {/* 3 Value Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                  <div className="text-gold font-serif text-xl">20 Steps</div>
                  <div className="text-xs text-white font-medium">Certified Protocol</div>
                  <p className="text-[11px] text-obsidian-400">Zero error prescription accuracy guarantee.</p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                  <div className="text-gold font-serif text-xl">In-Store</div>
                  <div className="text-xs text-white font-medium">Flagship Salons</div>
                  <p className="text-[11px] text-obsidian-400">Complimentary beverage & styling consultation.</p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                  <div className="text-gold font-serif text-xl">At Home</div>
                  <div className="text-xs text-white font-medium">Doorstep Testing</div>
                  <p className="text-[11px] text-obsidian-400">Optometrist visits with 100+ trial frames.</p>
                </div>
              </div>
            </div>

            {/* Right Action Callout */}
            <div className="lg:col-span-4 flex flex-col justify-center space-y-4 lg:border-l lg:border-white/10 lg:pl-10">
              <div className="space-y-1">
                <div className="text-xs uppercase font-bold text-gold tracking-widest">
                  Reserve Your Slot
                </div>
                <div className="text-lg font-serif text-white">
                  Available 7 Days a Week
                </div>
                <p className="text-xs text-obsidian-400">
                  Select your nearest flagship optical salon or schedule a home visit.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsBookingOpen(true)}
                className="w-full py-4 px-6 rounded-xl bg-gold hover:bg-gold-400 text-obsidian-950 font-semibold text-xs uppercase tracking-wider transition-all shadow-gold flex items-center justify-center gap-2"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Book Free Eye Exam</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsBookingOpen(true)}
                className="w-full py-3 px-4 rounded-xl border border-white/20 hover:bg-white/10 text-white font-medium text-xs uppercase tracking-wider text-center block transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 inline mr-1 text-gold" />
                <span>Locate Flagship Salons</span>
              </button>

              <div className="flex items-center justify-center gap-1 text-[11px] text-obsidian-400 pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Over 120,000+ Verified Prescriptions Delivered</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EyeTestBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </section>
  );
};

export default EyeCareBanner;
