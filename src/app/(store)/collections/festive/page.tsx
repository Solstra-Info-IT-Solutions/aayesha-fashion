import type { Metadata } from "next";

import { getCategoryBySlug } from "@/services/category.service";
import { getProducts } from "@/lib/api/products";

import type { ProductSort } from "@/types/product";

import { CollectionPage } from "@/components/collections/collection-page";

type FestivePageProps = {
  searchParams: Promise<{
    sort?: string;
  }>;
};

const validSorts: ProductSort[] = [
  "relevance",
  "newest",
  "price-low",
  "price-high",
  "rating",
  "best-selling",
  "featured",
];

export const metadata: Metadata = {
  title: "Festive Collection",
  description:
    "Explore elegant festive fashion from Aayesha Fashion, crafted for celebrations, special occasions, and memorable evenings.",
  alternates: {
    canonical: "/collections/festive",
  },
};

export default async function FestivePage({
  searchParams,
}: FestivePageProps) {
  const params = await searchParams;

  const sort =
    params.sort &&
    validSorts.includes(params.sort as ProductSort)
      ? (params.sort as ProductSort)
      : "featured";

  const category = await getCategoryBySlug("festive");

  const response = await getProducts({
    page: 1,
    limit: 48,
    categoryId: category.id,
    sort,
  });

  return (
    <CollectionPage
      title="Festive"
      eyebrow="The Festive Edit"
      description="Occasion dressing with a quieter confidence — luminous colours, graceful silhouettes and considered details designed for celebrations, intimate gatherings and unforgettable evenings."
      categoryId={category.id}
      products={response.products}
      sort={sort}
      mood="For celebrations, ceremonies and everything worth dressing for."
    />
  );
}