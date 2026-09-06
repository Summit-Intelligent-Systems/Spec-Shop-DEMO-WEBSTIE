'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const CATEGORY_CARDS = [
  {
    title: 'Optical Eyeglasses',
    subtitle: 'Mazzucchelli Italian Acetate & Prescription Optics',
    link: '/shop/eyeglasses',
    image: '/images/hero-banner.jpg',
    colSpan: 'md:col-span-8',
    count: '64 Styles',
  },
  {
    title: 'Designer Sunglasses',
    subtitle: '100% UV400 Polarized Runway Silhouettes',
    link: '/shop/sunglasses',
    image: '/images/category-sunglasses.jpg',
    colSpan: 'md:col-span-4',
    count: '42 Styles',
  },
  {
    title: 'Screen & Digital Glasses',
    subtitle: 'Zero Power Blue-Light Cutoff for Computer Fatigue',
    link: '/shop/screen-glasses',
    image: '/images/category-men.jpg',
    colSpan: 'md:col-span-4',
    count: '28 Styles',
  },
  {
    title: 'Pure Japanese Titanium',
    subtitle: 'Ultralight Grade-5 Titanium Under 12 Grams',
    link: '/shop/eyeglasses?material=TITANIUM',
    image: '/images/product-craft.jpg',
    colSpan: 'md:col-span-8',
    count: '36 Styles',
  },
];

export const CategoryGrid = () => {
  return (
    <section className="py-20 bg-cream/40 border-b border-obsidian-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-[0.2em] text-gold uppercase">
              Curated Universes
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-obsidian-900 font-normal">
              Explore by Collection
            </h2>
          </div>
          <Link
            href="/shop/eyeglasses"
            className="text-xs font-semibold uppercase tracking-wider text-obsidian-900 hover:text-gold transition-colors inline-flex items-center gap-1.5 mt-4 md:mt-0"
          >
            <span>View All Universes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {CATEGORY_CARDS.map((cat) => (
            <Link
              key={cat.title}
              href={cat.link}
              className={`group relative rounded-2xl overflow-hidden aspect-[4/3] md:aspect-auto md:h-96 ${cat.colSpan} shadow-md`}
            >
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/90 via-obsidian-950/40 to-transparent group-hover:via-obsidian-950/50 transition-colors" />

              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between text-white">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
                    {cat.count}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-2xl sm:text-3xl text-white font-light group-hover:text-gold-200 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-obsidian-300 font-light max-w-md">
                    {cat.subtitle}
                  </p>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold pt-2 group-hover:translate-x-1 transition-transform">
                    <span>Shop Collection</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
