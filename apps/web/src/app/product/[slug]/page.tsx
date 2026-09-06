import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { APP } from '@xyz-eyewear/config';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import { ProductDetailClient } from './ProductDetailClient';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return MOCK_PRODUCTS.map((prod) => ({
    slug: prod.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const matched = MOCK_PRODUCTS.find((p) => p.slug === slug);

  if (!matched) {
    return {
      title: `Product — ${APP.NAME}`,
    };
  }

  return {
    title: `${matched.name} — Handcrafted ${matched.categoryName} | ${APP.NAME}`,
    description: matched.description,
    alternates: {
      canonical: `${APP.URL}/product/${matched.slug}`,
    },
    openGraph: {
      title: `${matched.name} | ${APP.NAME}`,
      description: matched.description,
      images: [{ url: matched.colors[0].image, width: 1200, height: 630 }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const matched = MOCK_PRODUCTS.find((p) => p.slug === slug);

  if (!matched) {
    notFound();
  }

  // Schema.org Product JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: matched.name,
    image: matched.colors.map((c) => c.image),
    description: matched.description,
    sku: matched.id,
    brand: {
      '@type': 'Brand',
      name: APP.NAME,
    },
    offers: {
      '@type': 'Offer',
      price: matched.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: matched.rating,
      reviewCount: matched.reviewCount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={matched} />
    </>
  );
}
