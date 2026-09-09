'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Sparkles, Glasses } from 'lucide-react';
import { FACE_SHAPES } from '@/lib/mockData';

export const FaceShapeGuideTeaser = () => {
  const [selectedShape, setSelectedShape] = useState(FACE_SHAPES[0]);

  return (
    <section className="py-24 bg-gradient-to-b from-white via-cream/30 to-white border-b border-obsidian-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Selector & Information */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.2em] text-gold uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Face Geometry Fitting</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl text-obsidian-900 font-light leading-tight">
                Frames engineered for your exact contours.
              </h2>
              <p className="text-sm text-obsidian-600 leading-relaxed font-light pt-1">
                Every face shape possesses unique architectural harmony. Select your face contour below to discover silhouettes mathematically balanced to elevate your features.
              </p>
            </div>

            {/* Shape Buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              {FACE_SHAPES.map((item) => (
                <button
                  key={item.shape}
                  type="button"
                  onClick={() => setSelectedShape(item)}
                  className={`text-xs px-4 py-2.5 rounded-xl font-semibold tracking-wider uppercase transition-all ${
                    selectedShape.shape === item.shape
                      ? 'bg-obsidian-950 text-white shadow-md scale-105'
                      : 'bg-white border border-obsidian-200 text-obsidian-700 hover:border-gold hover:text-obsidian-950'
                  }`}
                >
                  {item.shape}
                </button>
              ))}
            </div>

            {/* Shape Detail Card */}
            <div className="p-6 rounded-2xl bg-white border border-obsidian-200 shadow-sm space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-xl font-medium text-obsidian-900">
                    The {selectedShape.shape} Face
                  </h4>
                  <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded bg-gold/15 text-gold-800">
                    Optimal Balance
                  </span>
                </div>
                <p className="text-xs text-obsidian-600 mt-1 leading-relaxed">
                  {selectedShape.description}
                </p>
              </div>

              <div className="pt-3 border-t border-obsidian-100">
                <h5 className="text-xs font-semibold text-obsidian-900 mb-2 uppercase tracking-wider">
                  Recommended Silhouettes:
                </h5>
                <div className="flex flex-wrap gap-2">
                  {selectedShape.recommendedFrames.map((frame) => (
                    <span
                      key={frame}
                      className="text-xs px-3 py-1 bg-obsidian-50 border border-obsidian-200 rounded-lg text-obsidian-800 font-medium flex items-center gap-1.5"
                    >
                      <Glasses className="w-3.5 h-3.5 text-gold" />
                      {frame}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-gold/10 border border-gold/20 text-xs text-gold-900 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>
                  <strong>Stylist Tip:</strong> {selectedShape.tips}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={`/shop/eyeglasses?shape=${selectedShape.recommendedFrames[0].toUpperCase()}`}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-obsidian-950 hover:text-gold transition-colors font-sans"
              >
                <span>Shop {selectedShape.shape} Curated Frames</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Face Shape Visual */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden bg-obsidian-950 aspect-square shadow-2xl flex flex-col justify-between p-8 sm:p-12">
              {/* Top Label */}
              <div className="relative z-10">
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold">
                  Face Shape Preview
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-white font-light mt-1">
                  {selectedShape.shape} Face Shape
                </h3>
              </div>

              {/* Centre SVG Face Contour */}
              <div className="flex-1 flex items-center justify-center relative z-10">
                <svg viewBox="0 0 200 240" className="w-48 h-48 sm:w-64 sm:h-64 stroke-gold fill-none transition-all duration-500" strokeWidth="1.5">
                  {selectedShape.shape === 'Oval' && (
                    <>
                      <ellipse cx="100" cy="120" rx="60" ry="85" className="stroke-gold/80" />
                      <ellipse cx="100" cy="100" rx="35" ry="18" className="stroke-gold/40" />
                    </>
                  )}
                  {selectedShape.shape === 'Round' && (
                    <>
                      <circle cx="100" cy="115" r="72" className="stroke-gold/80" />
                      <ellipse cx="100" cy="100" rx="35" ry="18" className="stroke-gold/40" />
                    </>
                  )}
                  {selectedShape.shape === 'Square' && (
                    <>
                      <rect x="30" y="35" width="140" height="170" rx="20" className="stroke-gold/80" />
                      <ellipse cx="100" cy="100" rx="35" ry="18" className="stroke-gold/40" />
                    </>
                  )}
                  {selectedShape.shape === 'Heart' && (
                    <>
                      <path d="M100 210 C30 140, 25 60, 100 40 C175 60, 170 140, 100 210Z" className="stroke-gold/80" />
                      <ellipse cx="100" cy="100" rx="35" ry="18" className="stroke-gold/40" />
                    </>
                  )}
                  {selectedShape.shape === 'Diamond' && (
                    <>
                      <polygon points="100,30 170,120 100,210 30,120" className="stroke-gold/80" />
                      <ellipse cx="100" cy="100" rx="35" ry="18" className="stroke-gold/40" />
                    </>
                  )}
                  {/* Centre guidelines */}
                  <line x1="100" y1="20" x2="100" y2="220" strokeDasharray="3,3" className="stroke-white/10" />
                  <line x1="20" y1="120" x2="180" y2="120" strokeDasharray="3,3" className="stroke-white/10" />
                </svg>
              </div>

              {/* Bottom CTA */}
              <div className="relative z-10">
                <Link
                  href="/try-on"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gold hover:bg-gold-400 text-obsidian-950 text-xs font-semibold uppercase tracking-wider transition-all shadow-gold"
                >
                  <span>Launch Virtual Try-On</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Background decorative contours */}
              <div className="absolute -bottom-10 -right-10 w-96 h-96 opacity-10 pointer-events-none z-0">
                <svg viewBox="0 0 200 200" className="w-full h-full stroke-gold fill-none" strokeWidth="0.75">
                  <ellipse cx="100" cy="100" rx="60" ry="85" />
                  <ellipse cx="100" cy="90" rx="35" ry="18" />
                  <ellipse cx="100" cy="120" rx="20" ry="10" />
                  <line x1="100" y1="20" x2="100" y2="180" strokeDasharray="3,3" />
                  <line x1="30" y1="90" x2="170" y2="90" strokeDasharray="3,3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaceShapeGuideTeaser;
