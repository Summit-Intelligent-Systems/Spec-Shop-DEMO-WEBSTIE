'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface LookbookItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  productSlug?: string;
  season: string;
  category: string;
}

const LOOKBOOK_ITEMS: LookbookItem[] = [
  {
    id: 'lb-1',
    title: 'Obsidian Minimalism',
    subtitle: 'The Sovereign Round in Pure Titanium',
    description: 'A meditation on weight and absence. Japanese-milled titanium at 12 grams—so light it defies gravity. The definitive intellectual frame for the digital polymath.',
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1200&auto=format&fit=crop&q=80',
    productSlug: 'the-sovereign-round',
    season: 'Autumn 2026',
    category: 'Eyeglasses',
  },
  {
    id: 'lb-2',
    title: 'Golden Hour Protocol',
    subtitle: 'The Aurelius Aviator with Gradient Flash',
    description: 'Polarized amber gradient lenses meet hand-polished 18K champagne gold bridge. Engineered for the drive from Bengaluru to Goa at magic hour.',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1200&auto=format&fit=crop&q=80',
    productSlug: 'the-aurelius-aviator',
    season: 'Autumn 2026',
    category: 'Sunglasses',
  },
  {
    id: 'lb-3',
    title: 'Studio Geometry',
    subtitle: 'The Athena Cat-Eye in Acetate Noir',
    description: 'Hand-cut Mazzucchelli acetate, polished for 72 hours. Architectural proportions inspired by the temples of Hampi—bold yet balanced, ancient yet now.',
    image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=1200&auto=format&fit=crop&q=80',
    productSlug: 'the-athena-cat-eye',
    season: 'Autumn 2026',
    category: 'Eyeglasses',
  },
  {
    id: 'lb-4',
    title: 'Library Light',
    subtitle: 'The Scholar Rectangle in Brushed Silver',
    description: 'Precision-bent beta titanium temples calibrate to your unique head geometry. The frame that Harvard professors and Mumbai editors quietly covet.',
    image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=1200&auto=format&fit=crop&q=80',
    productSlug: 'the-scholar-rectangle',
    season: 'Autumn 2026',
    category: 'Eyeglasses',
  },
  {
    id: 'lb-5',
    title: 'Monsoon Shield',
    subtitle: 'The Prism Sport Wrap in Tactical Matte',
    description: 'Hydrophobic nano-coating sheds every raindrop. Impact-rated polycarbonate survives a motorcycle crash. Born for the Ladakh passes and Bombay downpours.',
    image: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=1200&auto=format&fit=crop&q=80',
    productSlug: 'the-prism-sport-wrap',
    season: 'Autumn 2026',
    category: 'Sports',
  },
  {
    id: 'lb-6',
    title: 'Executive Brow',
    subtitle: 'The Monarch Browline in Havana Tortoise',
    description: 'A nod to mid-century power lunches. Acetate brow-bar layered over titanium lower rim—weight distributed so perfectly it disappears in conversation.',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1200&auto=format&fit=crop&q=80',
    productSlug: 'the-monarch-browline',
    season: 'Autumn 2026',
    category: 'Eyeglasses',
  },
];

const categories = ['All', 'Eyeglasses', 'Sunglasses', 'Sports'];

export default function LookbookPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? LOOKBOOK_ITEMS
    : LOOKBOOK_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-obsidian-950 text-white">
      {/* Hero */}
      <div className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950 via-obsidian-900/80 to-obsidian-950" />
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[800px] h-[400px] bg-gold/5 rounded-full blur-[100px]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <span className="text-[10px] font-bold tracking-[0.35em] text-gold uppercase">
            Autumn / Winter 2026
          </span>
          <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-medium mt-4 leading-[1.1]">
            The Lookbook
          </h1>
          <p className="text-base text-obsidian-500 mt-5 max-w-xl mx-auto leading-relaxed">
            Six frames. Six philosophies. Each piece engineered at the intersection of optical precision, material science, and the Indian aesthetic consciousness.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${
                activeCategory === cat
                  ? 'bg-gold/15 text-gold border-gold/40'
                  : 'text-obsidian-500 border-obsidian-800 hover:text-white hover:border-obsidian-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Lookbook Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="space-y-20">
          {filtered.map((item, index) => {
            const isReversed = index % 2 !== 0;

            return (
              <div
                key={item.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                  isReversed ? 'lg:direction-rtl' : ''
                }`}
              >
                {/* Image */}
                <div className={`relative aspect-[4/5] lg:aspect-[3/4] rounded-2xl overflow-hidden group ${isReversed ? 'lg:order-2' : ''}`}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Season Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.15em] uppercase bg-obsidian-950/70 text-gold border border-gold/30 backdrop-blur-sm">
                      <Sparkles className="w-3 h-3" />
                      {item.season}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className={`space-y-5 ${isReversed ? 'lg:order-1 lg:text-right' : ''}`}>
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.3em] text-gold/70 uppercase">
                      {item.category}
                    </span>
                    <h2 className="font-serif text-3xl lg:text-4xl font-medium text-white mt-2 leading-tight">
                      {item.title}
                    </h2>
                    <p className="text-sm text-gold/80 font-medium mt-1">{item.subtitle}</p>
                  </div>

                  <p className="text-base text-obsidian-400 leading-relaxed max-w-md">
                    {item.description}
                  </p>

                  {item.productSlug && (
                    <div className={`flex ${isReversed ? 'lg:justify-end' : ''}`}>
                      <Link href={`/product/${item.productSlug}`}>
                        <Button
                          variant="outline"
                          className="border-obsidian-700 text-white hover:border-gold hover:text-gold text-xs tracking-wider uppercase font-semibold"
                        >
                          Explore This Frame
                          <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
