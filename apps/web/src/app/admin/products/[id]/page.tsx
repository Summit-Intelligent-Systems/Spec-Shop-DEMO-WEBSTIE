'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';
import { apiGet } from '@/lib/api';

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;
    apiGet(`/admin/products/${productId}`)
      .then((data) => setProduct(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-5xl space-y-6 animate-pulse">
        <div className="h-10 bg-obsidian-800 rounded w-1/3" />
        <div className="h-12 bg-obsidian-800 rounded-xl" />
        <div className="h-96 bg-obsidian-900/60 border border-obsidian-800/60 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl">
      <ProductForm productId={productId} initialData={product} />
    </div>
  );
}
