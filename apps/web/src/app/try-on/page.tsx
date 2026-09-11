import type { Metadata } from 'next';
import { APP } from '@nayan-sukh-eyewear/config';
import { TryOnStudioClient } from './TryOnStudioClient';

export const metadata: Metadata = {
  title: `Virtual 3D Try-On Studio — ${APP.NAME}`,
  description:
    'Experience real-time augmented reality eyewear fitting directly in your browser. Inspect scale, bridge fit, and aesthetic silhouettes across our handcrafted collections.',
  alternates: {
    canonical: `${APP.URL}/try-on`,
  },
};

export default function TryOnPage() {
  return <TryOnStudioClient />;
}
