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

export default async function FestivePage({
  searchParams,
}: FestivePageProps) {
  const params = await searchParams;

  const sort =
    params.sort &&
    validSorts.includes(
      params.sort as ProductSort,
    )
      ? (params.sort as ProductSort)
      : "featured";

  const response = await getProducts({
    page: 1,
    limit: 48,
    category: "festive",
    sort,
  });

  return (
    <CollectionPage
      title="Festive"
      eyebrow="The Festive Edit"
      description="Occasion dressing with a quieter confidence — luminous colours, graceful silhouettes and considered details designed for celebrations, intimate gatherings and unforgettable evenings."
      category="festive"
      products={response.products}
      sort={sort}
      mood="For celebrations, ceremonies and everything worth dressing for."
    />
  );
}