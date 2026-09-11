import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { APP } from '@nayan-sukh-eyewear/config';
import { CATEGORIES } from '@/lib/mockData';
import { ShopCatalogClient } from '../ShopCatalogClient';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const matched = CATEGORIES.find((c) => c.slug === category);

  if (!matched) {
    return {
      title: `Shop Eyewear — ${APP.NAME}`,
    };
  }

  return {
    title: `${matched.name} Collection — Handcrafted Luxury Eyewear | ${APP.NAME}`,
    description: matched.description,
    alternates: {
      canonical: `${APP.URL}/shop/${matched.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const matched = CATEGORIES.find((c) => c.slug === category);

  if (!matched) {
    notFound();
  }

  return (
    <ShopCatalogClient
      initialCategory={matched.slug}
      categoryTitle={`${matched.name} Collection`}
      categoryDescription={matched.description}
    />
  );
}
