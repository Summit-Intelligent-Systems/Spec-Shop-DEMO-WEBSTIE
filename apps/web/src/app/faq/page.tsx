import type { Metadata } from 'next';
import { APP } from '@xyz-eyewear/config';
import Link from 'next/link';
import { ShieldCheck, RotateCcw, Truck, Tag, HelpCircle, Phone, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: `Frequently Asked Questions & Store Policies — ${APP.NAME}`,
  description: 'Learn about our 1-year unconditional warranty, 14-day doorstep return policy, express shipping, and promo codes.',
};

const FAQ_SECTIONS = [
  {
    category: 'Warranty & Guarantees',
    icon: ShieldCheck,
    items: [
      {
        q: 'What does the 1-Year Unconditional Warranty cover?',
        a: 'Every XYZ frame and lens package includes our full 1-year warranty covering manufacturing flaws, structural joint failure, and hinge mechanism issues. If an issue occurs, we repair or replace it free of charge either at any flagship salon or via complimentary doorstep pickup.',
      },
      {
        q: 'What is the Zero-Error Prescription Guarantee?',
        a: 'If your prescription lenses feel uncomfortable or cause eye strain within 30 days of receiving your order, our master optometrists will re-evaluate your prescription and remake your lenses at zero extra cost.',
      },
    ],
  },
  {
    category: 'Returns, Exchanges & Refunds',
    icon: RotateCcw,
    items: [
      {
        q: 'What is your return policy?',
        a: 'We provide a 14-day no-questions-asked doorstep return and exchange policy. If you are not completely satisfied with your frames, simply initiate a return and our courier will collect the package from your address with a 100% refund to your original payment method.',
      },
      {
        q: 'How long does a refund take to process?',
        a: 'Once the frame is inspected at our central lab (typically within 48 hours of pickup), refunds are issued immediately and reflect in your bank account within 3 to 5 business days.',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    icon: Truck,
    items: [
      {
        q: 'What are your delivery timelines and charges?',
        a: 'We offer free express shipping on all orders above ₹999 across India (a flat ₹99 fee applies to orders under ₹999). Delivery takes 2 to 4 business days in metro cities and 3 to 6 business days for other regional hubs.',
      },
      {
        q: 'Can I track my shipment in real time?',
        a: 'Yes. As soon as your glasses leave our optical laboratory, you receive an automated SMS and email containing live tracking details from BlueDart/Delhivery Express.',
      },
    ],
  },
  {
    category: 'Discounts, Promo Codes & Pricing',
    icon: Tag,
    items: [
      {
        q: 'Do you offer any discount coupon codes?',
        a: 'Yes! First-time patrons can enter promo code "LUXE15" at checkout to receive 15% off their first frame order when joining the XYZ Private Salon.',
      },
      {
        q: 'Are your prices inclusive of GST?',
        a: 'Yes, all listed prices on our website include 18% GST. There are no hidden fees or surprise taxes at checkout.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="bg-obsidian-950 text-white min-h-screen pt-24 pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 text-gold text-xs font-semibold uppercase tracking-widest border border-gold/30 mb-4">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Client Concierge & Policies</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-light tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-obsidian-300 font-light">
          Everything you need to know about our handcrafted eyewear, optical guarantees, doorstep returns, and concierge services.
        </p>
      </div>

      {/* FAQ Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {FAQ_SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.category} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <div className="w-8 h-8 rounded-lg bg-gold/15 text-gold flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl text-white font-medium">{section.category}</h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {section.items.map((item) => (
                  <div
                    key={item.q}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/30 transition-colors space-y-2"
                  >
                    <h3 className="text-base text-white font-medium">{item.q}</h3>
                    <p className="text-xs sm:text-sm text-obsidian-300 font-light leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Concierge Contact Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-obsidian-900 to-obsidian-950 border border-gold/20 flex flex-col sm:flex-row items-center justify-between gap-6 mt-12">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs uppercase font-bold tracking-widest text-gold">Still Have Questions?</span>
            <h3 className="font-serif text-2xl text-white font-light">Talk to our Master Opticians</h3>
            <p className="text-xs sm:text-sm text-obsidian-300 font-light">
              Available 7 days a week, 9:00 AM – 9:00 PM IST.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-obsidian-300">
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gold" /> +91 98765 43210</span>
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gold" /> support@xyzeyewear.com</span>
            </div>
          </div>
          <Link
            href="/stores"
            className="px-6 py-3.5 rounded-xl bg-gold hover:bg-gold-400 text-obsidian-950 font-semibold text-xs uppercase tracking-wider transition-colors shrink-0"
          >
            Find Optical Boutique
          </Link>
        </div>
      </div>
    </div>
  );
}
