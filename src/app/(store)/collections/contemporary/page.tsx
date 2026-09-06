import { getProducts } from "@/lib/api/products";
import type { ProductSort } from "@/types/product";

import { CollectionPage } from "@/components/collections/collection-page";

type ContemporaryPageProps = {
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

export default async function ContemporaryPage({
  searchParams,
}: ContemporaryPageProps) {
  const params = await searchParams;

  const sort =
    params.sort &&
    validSorts.includes(
      params.sort as ProductSort,
    )
      ? (params.sort as ProductSort)
      : "newest";

  const response = await getProducts({
    page: 1,
    limit: 48,
    category: "contemporary",
    sort,
  });

  return (
    <CollectionPage
      title="Contemporary"
      eyebrow="The Contemporary Edit"
      description="Modern Indian dressing distilled into clean silhouettes, easy layers and elevated essentials designed to move naturally through everyday life."
      category="contemporary"
      products={response.products}
      sort={sort}
      mood="Clean lines. Soft structure. Everyday sophistication."
    />
  );
}