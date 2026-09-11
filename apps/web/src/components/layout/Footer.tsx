'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles, RefreshCw, Eye, Check } from 'lucide-react';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-obsidian-950 text-white border-t border-white/10">
      {/* ─── Trust Pillars Bar ────────────────────────────────────────────── */}
      <div className="border-b border-white/10 py-10 bg-obsidian-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif text-base font-medium text-white">1-Year Warranty</h4>
                <p className="text-xs text-obsidian-400 mt-1">
                  Full coverage on Italian acetate and Japanese titanium frames.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif text-base font-medium text-white">14-Day Free Returns</h4>
                <p className="text-xs text-obsidian-400 mt-1">
                  Hassle-free doorstep exchanges with 100% money back guarantee.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif text-base font-medium text-white">Complimentary Eye Test</h4>
                <p className="text-xs text-obsidian-400 mt-1">
                  Certified 20-step computerized exam at all flagship stores.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif text-base font-medium text-white">Precision Optics</h4>
                <p className="text-xs text-obsidian-400 mt-1">
                  Anti-reflective, hydrophobic, anti-scratch coatings included.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Footer Columns ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-serif text-3xl font-bold tracking-[0.2em] text-white">
                  Nayan Sukh
                </span>
                <span className="text-[10px] uppercase font-semibold text-gold tracking-widest">
                  E Y E W E A R
                </span>
              </div>
              <p className="text-xs text-obsidian-400 leading-relaxed max-w-sm">
                Architectural eyewear combining precision Japanese metallurgy and Italian Mazzucchelli acetate. Crafted for those who see the world in bold definition.
              </p>
            </div>

            {/* Newsletter */}
            <div className="space-y-3 pt-2">
              <h5 className="text-xs font-semibold uppercase tracking-widest text-gold">
                Join the Private Salon
              </h5>
              <p className="text-xs text-obsidian-400">
                Receive private previews of limited edition drops and 15% off your first frame.
              </p>

              {isSubscribed ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 p-3 rounded-lg">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Thank you for joining. Your 15% code is: <strong>LUXE15</strong></span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder:text-obsidian-500 focus:outline-none focus:border-gold transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-gold hover:bg-gold-400 text-obsidian-950 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Links Column 1: Collections */}
          <div className="lg:col-span-2 space-y-4">
            <h5 className="text-xs font-semibold uppercase tracking-widest text-white">
              Collections
            </h5>
            <ul className="space-y-2.5 text-xs text-obsidian-400">
              <li><Link href="/shop/eyeglasses" className="hover:text-white transition-colors">Optical Frames</Link></li>
              <li><Link href="/shop/sunglasses" className="hover:text-white transition-colors">Polarized Sun</Link></li>
              <li><Link href="/shop/screen-glasses" className="hover:text-white transition-colors">Computer Blue Filter</Link></li>
              <li><Link href="/shop/eyeglasses?material=TITANIUM" className="hover:text-white transition-colors">Pure Titanium</Link></li>
              <li><Link href="/shop/eyeglasses?gender=MEN" className="hover:text-white transition-colors">Men&apos;s Collection</Link></li>
              <li><Link href="/shop/eyeglasses?gender=WOMEN" className="hover:text-white transition-colors">Women&apos;s Collection</Link></li>
            </ul>
          </div>

          {/* Links Column 2: Eye Care & Services */}
          <div className="lg:col-span-3 space-y-4">
            <h5 className="text-xs font-semibold uppercase tracking-widest text-white">
              Eye Care & Innovation
            </h5>
            <ul className="space-y-2.5 text-xs text-obsidian-400">
              <li><Link href="/book-eye-test" className="hover:text-white transition-colors text-gold">Book Free Clinic Eye Test</Link></li>
              <li><Link href="/try-on" className="hover:text-white transition-colors">3D Camera Try-On</Link></li>
              <li><Link href="/face-shape-guide" className="hover:text-white transition-colors">Face Shape Frame Finder</Link></li>
              <li><Link href="/prescription-guide" className="hover:text-white transition-colors">How to Read Your Prescription</Link></li>
              <li><Link href="/stores" className="hover:text-white transition-colors">Find a Flagship Optical Store</Link></li>
              <li><Link href="/lens-technology" className="hover:text-white transition-colors">High-Index Lenses & Coatings</Link></li>
            </ul>
          </div>

          {/* Links Column 3: Support */}
          <div className="lg:col-span-2 space-y-4">
            <h5 className="text-xs font-semibold uppercase tracking-widest text-white">
              Assistance
            </h5>
            <ul className="space-y-2.5 text-xs text-obsidian-400">
              <li><Link href="/track-order" className="hover:text-white transition-colors">Track Your Order</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/warranty" className="hover:text-white transition-colors">Warranty Registration</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Concierge</Link></li>
              <li><span className="text-white block font-medium pt-2">+91 98765 43210</span></li>
              <li><span className="text-obsidian-400 block text-[11px]">support@nayansukheyewear.com</span></li>
            </ul>
          </div>
        </div>

        {/* ─── Bottom Sub-footer ───────────────────────────────────────────── */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-obsidian-500">
          <p>© {new Date().getFullYear()} Nayan Sukh Eyewear Ltd. All Rights Reserved. Crafted with Japanese Titanium & Mazzucchelli Acetate.</p>
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-gold hover:text-gold-400 font-medium transition-colors">Admin Portal / CMS</Link>
            <Link href="/privacy-policy" className="hover:text-obsidian-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-obsidian-300 transition-colors">Terms of Service</Link>
            <Link href="/sitemap" className="hover:text-obsidian-300 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
