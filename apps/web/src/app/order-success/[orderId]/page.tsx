import Link from 'next/link';
import {
  CheckCircle2,
  Sparkles,
  MessageCircle,
} from 'lucide-react';

interface OrderSuccessPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { orderId } = await params;

  return (
    <div className="min-h-screen bg-obsidian-50/50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-obsidian-200/80 shadow-xl text-center space-y-8">
          {/* Animated Success Badge */}
          <div className="w-20 h-20 rounded-full bg-gold/15 text-gold-700 mx-auto flex items-center justify-center ring-8 ring-gold/10">
            <CheckCircle2 className="w-10 h-10 text-gold-700" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold-700">
              Order Confirmed & Allocated
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-obsidian-950 font-normal">
              Thank You for Your Order
            </h1>
            <p className="text-xs sm:text-sm text-obsidian-600 max-w-md mx-auto">
              Your bespoke eyewear has entered our certified optical laboratory. Order reference:
            </p>
            <div className="inline-block font-mono text-sm font-bold text-obsidian-950 bg-obsidian-100 px-4 py-1.5 rounded-full border border-obsidian-200 mt-2">
              #{orderId}
            </div>
          </div>

          {/* Optical Production Journey Timeline */}
          <div className="p-6 rounded-2xl bg-obsidian-50 border border-obsidian-200 text-left space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-obsidian-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              <span>Optical Craft & Fulfillment Journey</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 text-[10px] font-bold">
                  ✓
                </div>
                <div>
                  <div className="font-semibold text-obsidian-950">1. Order Authenticated & Verified</div>
                  <div className="text-obsidian-500 text-[11px]">Frame silhouette allocated from climate-controlled vault.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-gold text-obsidian-950 flex items-center justify-center shrink-0 text-[10px] font-bold animate-pulse">
                  2
                </div>
                <div>
                  <div className="font-semibold text-obsidian-950">2. Prescription Verification & Lens Surfacing</div>
                  <div className="text-obsidian-500 text-[11px]">Our optometrists review optical parameters and calibrate high-index lens curvature.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-obsidian-200 text-obsidian-600 flex items-center justify-center shrink-0 text-[10px] font-bold">
                  3
                </div>
                <div>
                  <div className="font-semibold text-obsidian-900">3. Sapphire AR Coating & Bevel Edge Milling</div>
                  <div className="text-obsidian-500 text-[11px]">Anti-reflective treatments applied in class-100 cleanroom.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-obsidian-200 text-obsidian-600 flex items-center justify-center shrink-0 text-[10px] font-bold">
                  4
                </div>
                <div>
                  <div className="font-semibold text-obsidian-900">4. 20-Point Optical Quality Inspection & Dispatch</div>
                  <div className="text-obsidian-500 text-[11px]">Packaged in luxury leather case with certificate of authenticity.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Concierge Support Box */}
          <div className="p-5 rounded-2xl bg-gold/5 border border-gold/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-left">
            <div className="space-y-1">
              <h4 className="font-semibold text-obsidian-950 flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-gold-700" />
                <span>Need to update or send your prescription?</span>
              </h4>
              <p className="text-obsidian-600">
                You can reply directly to your confirmation SMS or WhatsApp our optical concierge team.
              </p>
            </div>
            <a
              href="https://wa.me/?text=Hello%20XYZ%20Eyewear,%20I%20would%20like%20to%20submit%20my%20prescription%20for%20order%20"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold whitespace-nowrap hover:bg-emerald-700 transition-colors shrink-0"
            >
              WhatsApp Concierge
            </a>
          </div>

          {/* Navigation CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-obsidian-950 hover:bg-obsidian-800 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all"
            >
              Return to Homepage
            </Link>
            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-obsidian-300 hover:border-obsidian-900 text-obsidian-900 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Browse More Styles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
