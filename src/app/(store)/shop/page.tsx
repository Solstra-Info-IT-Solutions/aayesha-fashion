import type { Metadata } from "next";
import { getProducts } from "@/lib/api/products";

import type { ProductSort } from "@/types/product";

import { ShopHeader } from "@/components/shop/shop-header";
import { ShopFilters } from "@/components/shop/shop-filters";
import { ShopProductGrid } from "@/components/shop/shop-product-grid";

type ShopPageProps = {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    availability?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
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

function parseNumber(value?: string) {
  if (!value) return undefined;

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

export const metadata: Metadata = {
  title: "Shop Women's Fashion",
  description:
    "Explore Aayesha Fashion's curated collection of elegant Indian fashion, contemporary silhouettes, festive wear, and timeless everyday styles.",
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: "Shop Women's Fashion | Aayesha Fashion",
    description:
      "Explore elegant Indian fashion, festive silhouettes, and contemporary styles from Aayesha Fashion.",
    url: "/shop",
    type: "website",
  },
};

export default async function ShopPage({
  searchParams,
}: ShopPageProps) {
  const params = await searchParams;

  const categoryId = params.category || undefined;

  const sort =
    params.sort &&
    validSorts.includes(params.sort as ProductSort)
      ? (params.sort as ProductSort)
      : "relevance";

  const minPrice = parseNumber(params.minPrice);
  const maxPrice = parseNumber(params.maxPrice);

  const inStockOnly =
    params.availability === "in-stock"
      ? true
      : undefined;

  const response = await getProducts({
    page: 1,
    limit: 48,
    categoryId,
    minPrice,
    maxPrice,
    inStockOnly,
    search: params.search,
    sort,
  });

  return (
    <main className="min-h-screen bg-[var(--color-ivory)]">
      <section className="border-b border-[var(--color-border)] bg-[var(--color-ivory)]">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <ShopHeader
            products={response.products}
            selectedCategory={categoryId}
            selectedSort={sort}
          />
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[235px_minmax(0,1fr)] xl:gap-10">
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <ShopFilters
                products={response.products}
                selectedCategory={categoryId}
              />
            </div>
          </aside>

          <div className="min-w-0">
            <ShopProductGrid
              products={response.products}
              category={categoryId}
              sort={sort}
            />
          </div>
        </div>
      </section>
    </main>
  );
}