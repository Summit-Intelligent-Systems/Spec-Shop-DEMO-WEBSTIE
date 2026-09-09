import type { Metadata } from 'next';
import { APP } from '@xyz-eyewear/config';
import { FaceShapeGuideTeaser } from '@/components/home/FaceShapeGuideTeaser';
import Link from 'next/link';
import { Camera, Sparkles, ArrowRight, Glasses } from 'lucide-react';

export const metadata: Metadata = {
  title: `Face Shape & Geometry Styling Guide — ${APP.NAME}`,
  description: 'Find frames engineered to balance your facial contours. Interactive styling recommendations and virtual 3D camera try-on.',
};

export default function FaceShapeGuidePage() {
  return (
    <div className="bg-cream/20 text-obsidian-900 min-h-screen pt-24 pb-20">
      {/* Intro Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 text-gold-900 text-xs font-semibold uppercase tracking-widest border border-gold/30 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span>Curated Architectural Fit</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-obsidian-950 font-light tracking-tight">
          Face Shape & Silhouette Guide
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-obsidian-600 font-light">
          Discover which frame geometries complement your unique facial architecture. From oval symmetry to sculpted square jaws, explore recommendations engineered to balance your proportions.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/try-on"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-obsidian-950 text-white hover:bg-gold hover:text-obsidian-950 text-xs font-semibold uppercase tracking-wider transition-all shadow-md"
          >
            <Camera className="w-4 h-4" />
            <span>Launch 3D Virtual Try-On</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-obsidian-200 text-obsidian-800 hover:border-gold hover:text-obsidian-950 text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <Glasses className="w-4 h-4 text-gold" />
            <span>Browse All Collections</span>
          </Link>
        </div>
      </div>

      {/* Interactive Face Shape Guide */}
      <div className="mt-8">
        <FaceShapeGuideTeaser />
      </div>
    </div>
  );
}
