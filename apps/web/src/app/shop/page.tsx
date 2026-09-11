import type { Metadata } from 'next';
import { APP } from '@nayan-sukh-eyewear/config';
import { ShopCatalogClient } from './ShopCatalogClient';

export const metadata: Metadata = {
  title: `Optical Catalog & Luxury Frames — ${APP.NAME}`,
  description:
    'Explore the complete collection of handcrafted eyeglasses, sunglasses, and screen glasses. Precision German optical lenses with Japanese titanium & organic Italian acetate frames.',
  alternates: {
    canonical: `${APP.URL}/shop`,
  },
};

export default function ShopPage() {
  return <ShopCatalogClient initialCategory="all" />;
}
