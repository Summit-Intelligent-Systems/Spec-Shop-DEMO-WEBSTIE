'use client';

import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Camera, ShieldCheck, Award, Eye } from 'lucide-react';
import { heroHeadline, heroSubheadline, heroCta } from '@/lib/motion/variants';

// Lazy-load the 3D components to avoid loading Three.js on initial bundle
const LazyCanvas = lazy(() => import('@/components/3d/LazyCanvas'));
const HeroScene = lazy(() => import('@/components/3d/HeroScene'));

export const HeroSlider = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [is3DReady, setIs3DReady] = useState(false);

  // Hydrate the 3D canvas after mount
  useEffect(() => {
    setIs3DReady(true);
  }, []);

  // Scroll progress for the hero-to-next-section transition
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      // Progress: 0 when section top is at viewport top, 1 when bottom reaches viewport top
      const progress = Math.max(0, Math.min(1, -rect.top / sectionHeight));
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[85vh] lg:min-h-[92vh] flex items-center bg-obsidian-950 text-white overflow-hidden"
    >
      {/* Background: 3D Canvas on desktop, static image fallback */}
      <div className="absolute inset-0 z-0">
        {/* Static image always rendered as base layer / fallback */}
        <Image
          src="/images/hero-banner.jpg"
          alt="XYZ Eyewear Master Collection"
          fill
          priority
          className="object-cover object-center opacity-60 scale-105"
        />

        {/* 3D Canvas overlay — positioned right side on large screens */}
        {is3DReady && (
          <Suspense fallback={null}>
            <div className="absolute inset-0 hidden lg:block">
              <div className="absolute right-0 top-0 w-[55%] h-full">
                <LazyCanvas
                  eager
                  bgColor="transparent"
                  fov={40}
                  cameraPosition={[0, 0.3, 4.5]}
                  fallbackSrc="/images/hero-banner.jpg"
                  fallbackAlt="XYZ Eyewear 3D Product View"
                >
                  <HeroScene scrollProgress={scrollProgress} />
                </LazyCanvas>
              </div>
            </div>
          </Suspense>
        )}

        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950 via-obsidian-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-transparent to-obsidian-950/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 w-full">
        <div className="max-w-2xl space-y-8">

          {/* Eyebrow badge */}
          <motion.div
            variants={heroSubheadline}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-widest"
          >
            <span>Autumn / Winter 2026 Collection</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={heroHeadline}
            initial="hidden"
            animate="visible"
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white leading-[1.08]"
          >
            Sculpted for those who{' '}
            <span className="italic font-normal text-gold-300">
              see beyond.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={heroSubheadline}
            initial="hidden"
            animate="visible"
            className="text-base sm:text-lg text-obsidian-300 leading-relaxed font-light max-w-xl"
          >
            Architectural eyewear handcrafted from 8mm organic Italian Mazzucchelli acetate and aerospace-grade Japanese titanium. Experience uncompromised optical clarity.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            variants={heroCta}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <Link
              href="/shop/eyeglasses"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gold hover:bg-gold-400 text-obsidian-950 font-semibold text-sm tracking-wider uppercase transition-all shadow-gold hover:shadow-gold-lg active:scale-95"
            >
              <span>Explore Eyeglasses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/try-on"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm tracking-wider uppercase backdrop-blur-md border border-white/20 transition-all active:scale-95"
            >
              <Camera className="w-4 h-4 text-gold" />
              <span>3D Virtual Try-On</span>
            </Link>
          </motion.div>

          {/* Key Value Micro-Bar */}
          <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-6 text-xs text-obsidian-400">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-gold shrink-0" />
              <span>Aerospace Titanium</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
              <span>1-Year Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-gold shrink-0" />
              <span>Free 20-Step Eye Test</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
