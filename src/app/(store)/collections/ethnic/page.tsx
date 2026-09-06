import { getProducts } from "@/lib/api/products";
import type { ProductSort } from "@/types/product";

import { CollectionPage } from "@/components/collections/collection-page";

type EthnicPageProps = {
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

export default async function EthnicPage({
  searchParams,
}: EthnicPageProps) {
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
    category: "ethnic",
    sort,
  });

  return (
    <CollectionPage
      title="Ethnic"
      eyebrow="The Ethnic Edit"
      description="A refined interpretation of Indian wardrobe classics, balancing familiar craftsmanship and modern ease for pieces that feel rooted, graceful and beautifully wearable."
      category="ethnic"
      products={response.products}
      sort={sort}
      mood="Heritage-inspired. Modern in spirit."
    />
  );
}