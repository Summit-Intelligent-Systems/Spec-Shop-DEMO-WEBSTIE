'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import { VirtualTryOnModal } from '@/components/vto/VirtualTryOnModal';

function TryOnContent() {
  const searchParams = useSearchParams();
  const productSlug = searchParams.get('product');

  const initialProduct =
    MOCK_PRODUCTS.find((p) => p.slug === productSlug) || MOCK_PRODUCTS[0];

  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div className="min-h-screen bg-obsidian-950 text-white flex flex-col items-center justify-center p-6">
      <VirtualTryOnModal
        product={initialProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          window.location.href = '/shop';
        }}
      />
    </div>
  );
}

export const TryOnStudioClient = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-obsidian-950 text-white flex items-center justify-center">Loading Studio...</div>}>
      <TryOnContent />
    </Suspense>
  );
};
