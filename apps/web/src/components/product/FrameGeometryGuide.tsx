'use client';

import { Ruler, Sparkles, CheckCircle2, Info } from 'lucide-react';
import type { ProductItem } from '@/lib/mockData';

interface FrameGeometryGuideProps {
  dimensions: ProductItem['dimensions'];
  frameShape: string;
  recommendedFaceShapes: string[];
}

export const FrameGeometryGuide = ({
  dimensions,
  frameShape,
  recommendedFaceShapes,
}: FrameGeometryGuideProps) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-obsidian-200/80 space-y-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-obsidian-100 pb-4">
        <div className="flex items-center gap-2">
          <Ruler className="w-5 h-5 text-gold" />
          <h3 className="font-serif text-xl font-medium text-obsidian-950">
            Technical Optical Blueprint & Fit Guide
          </h3>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          Standard Medium Fit
        </span>
      </div>

      {/* Blueprint Visual Diagram */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-obsidian-50 border border-obsidian-100 text-center space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-obsidian-400">
            Lens Width
          </span>
          <div className="text-2xl font-serif font-semibold text-obsidian-900">
            {dimensions.lensWidth}
            <span className="text-xs text-obsidian-400 font-sans font-normal ml-0.5">mm</span>
          </div>
          <p className="text-[11px] text-obsidian-500">Horizontal diameter of one lens</p>
        </div>

        <div className="p-4 rounded-2xl bg-obsidian-50 border border-obsidian-100 text-center space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-obsidian-400">
            Bridge Width
          </span>
          <div className="text-2xl font-serif font-semibold text-obsidian-900">
            {dimensions.bridgeWidth}
            <span className="text-xs text-obsidian-400 font-sans font-normal ml-0.5">mm</span>
          </div>
          <p className="text-[11px] text-obsidian-500">Distance over nose bridge</p>
        </div>

        <div className="p-4 rounded-2xl bg-obsidian-50 border border-obsidian-100 text-center space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-obsidian-400">
            Temple Arm
          </span>
          <div className="text-2xl font-serif font-semibold text-obsidian-900">
            {dimensions.templeLength}
            <span className="text-xs text-obsidian-400 font-sans font-normal ml-0.5">mm</span>
          </div>
          <p className="text-[11px] text-obsidian-500">Total length of side temple</p>
        </div>

        <div className="p-4 rounded-2xl bg-obsidian-50 border border-obsidian-100 text-center space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-obsidian-400">
            Total Frame
          </span>
          <div className="text-2xl font-serif font-semibold text-obsidian-900">
            {dimensions.frameWidth}
            <span className="text-xs text-obsidian-400 font-sans font-normal ml-0.5">mm</span>
          </div>
          <p className="text-[11px] text-obsidian-500">Hinge-to-hinge front width</p>
        </div>
      </div>

      {/* Face Shape Compatibility */}
      <div className="p-5 rounded-2xl bg-gold/5 border border-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gold-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>Optimal Face Shape Harmony</span>
          </h4>
          <p className="text-xs text-obsidian-700 mt-1">
            The {frameShape.toLowerCase()} silhouette creates exquisite visual balance for:
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {recommendedFaceShapes.map((shape) => (
              <span
                key={shape}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-xs font-semibold text-obsidian-900 shadow-xs border border-gold/30"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{shape} Faces</span>
              </span>
            ))}
          </div>
        </div>

        <div className="sm:text-right shrink-0">
          <span className="text-[11px] font-medium text-obsidian-500 block">Frame Proportions</span>
          <span className="text-sm font-semibold text-obsidian-900">
            {dimensions.lensWidth} • {dimensions.bridgeWidth} • {dimensions.templeLength}
          </span>
        </div>
      </div>

      {/* Credit Card Measurement Tip */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-obsidian-50/80 border border-obsidian-200/60 text-xs text-obsidian-600">
        <Info className="w-4 h-4 text-obsidian-400 shrink-0 mt-0.5" />
        <p>
          <strong>Find your frame size with any standard bank card:</strong> Stand in front of a mirror and place the card edge against the bridge of your nose. If the card extends past the corner of your eye, you have a <em>Small/Narrow</em> face. If it aligns with the outer corner, you are a <em>Medium</em> (matches this frame). If it ends before your eye corner, choose <em>Large/Wide</em>.
        </p>
      </div>
    </div>
  );
};
