import type { Metadata } from 'next';
import { APP, SEO_DEFAULTS } from '@nayan-sukh-eyewear/config';
import { HeroSlider } from '@/components/home/HeroSlider';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { BestsellerCarousel } from '@/components/home/BestsellerCarousel';
import { FaceShapeGuideTeaser } from '@/components/home/FaceShapeGuideTeaser';
import { EyeCareBanner } from '@/components/home/EyeCareBanner';
import { LookbookSection } from '@/components/home/LookbookSection';

export const metadata: Metadata = {
  title: `${APP.NAME} — Luxury Eyewear & Clinical Precision`,
  description: SEO_DEFAULTS.DEFAULT_DESCRIPTION,
  alternates: {
    canonical: APP.URL,
  },
};

export default function HomePage() {
  return (
    <main className="w-full">
      {/* Editorial Hero Slider */}
      <HeroSlider />

      {/* Curated Categories */}
      <CategoryGrid />

      {/* Bestselling Silhouettes Carousel */}
      <BestsellerCarousel />

      {/* Face Shape Geometry Guide */}
      <FaceShapeGuideTeaser />

      {/* Clinical Eye-Care & Free Test Banner */}
      <EyeCareBanner />

      {/* Living Lookbook & UGC Showcase */}
      <LookbookSection />
    </main>
  );
}

