import type { Metadata } from "next";

import { getCategoryBySlug } from "@/services/category.service";
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

export const metadata: Metadata = {
  title: "Ethnic Collection",
  description:
    "Discover refined ethnic wear by Aayesha Fashion, blending Indian craftsmanship, graceful silhouettes, and modern styling.",
  alternates: {
    canonical: "/collections/ethnic",
  },
};

export default async function EthnicPage({
  searchParams,
}: EthnicPageProps) {
  const params = await searchParams;

  const sort =
    params.sort &&
    validSorts.includes(params.sort as ProductSort)
      ? (params.sort as ProductSort)
      : "featured";

  const category = await getCategoryBySlug("ethnic");

  const response = await getProducts({
    page: 1,
    limit: 48,
    categoryId: category.id,
    sort,
  });

  return (
    <CollectionPage
      title="Ethnic"
      eyebrow="The Ethnic Edit"
      description="A refined interpretation of Indian wardrobe classics, balancing familiar craftsmanship and modern ease for pieces that feel rooted, graceful and beautifully wearable."
      categoryId={category.id}
      products={response.products}
      sort={sort}
      mood="Heritage-inspired. Modern in spirit."
    />
  );
}