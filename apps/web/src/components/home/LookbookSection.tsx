'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Instagram, ArrowRight } from 'lucide-react';

const LOOKBOOK_ITEMS = [
  {
    image: '/images/hero-banner.jpg',
    title: 'The Sovereign Acetate',
    tag: '#NayanSukhSeen',
    handle: '@sophia_vane',
  },
  {
    image: '/images/category-sunglasses.jpg',
    title: 'Parisian Runway Sun',
    tag: '#NayanSukhSeen',
    handle: '@elena_rossi',
  },
  {
    image: '/images/category-men.jpg',
    title: 'Minimalist Architecture',
    tag: '#NayanSukhSeen',
    handle: '@marcus_k',
  },
  {
    image: '/images/product-craft.jpg',
    title: 'Travertine Master Series',
    tag: '#NayanSukhSeen',
    handle: '@atelier_optic',
  },
];

export const LookbookSection = () => {
  return (
    <section className="py-24 bg-white border-b border-obsidian-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-[0.2em] text-gold uppercase">
              The Living Lookbook
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-obsidian-900 font-normal">
              Seen on Visionaries
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-obsidian-900 hover:text-gold uppercase tracking-wider transition-colors">
            <Instagram className="w-4 h-4 text-gold" />
            <span>Tag @nayansukheyewear on Instagram to be featured</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {LOOKBOOK_ITEMS.map((item, index) => (
            <div
              key={index}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-obsidian-100 shadow-sm"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="absolute inset-x-0 bottom-0 p-4 text-white translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span className="text-[10px] text-gold uppercase font-bold tracking-wider">
                  {item.tag}
                </span>
                <h4 className="font-serif text-sm text-white">{item.title}</h4>
                <p className="text-[11px] text-obsidian-300 font-light">{item.handle}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/lookbook"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-obsidian-900 hover:text-gold transition-colors"
          >
            <span>Explore Editorial Volume IV</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LookbookSection;
