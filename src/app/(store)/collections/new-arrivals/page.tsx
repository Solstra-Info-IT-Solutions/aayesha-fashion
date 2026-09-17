import type { Metadata } from "next";

import { getProducts } from "@/lib/api/products";

import type { ProductSort } from "@/types/product";

import { ShopHeader } from "@/components/shop/shop-header";
import { ShopFilters } from "@/components/shop/shop-filters";
import { ShopProductGrid } from "@/components/shop/shop-product-grid";

type NewArrivalsPageProps = {
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
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

export const metadata: Metadata = {
  title: "New Arrivals",
  description:
    "Discover the latest arrivals from Aayesha Fashion — refined Indian silhouettes, contemporary styles, and fresh seasonal edits.",
  alternates: {
    canonical: "/collections/new-arrivals",
  },
  openGraph: {
    title: "New Arrivals | Aayesha Fashion",
    description:
      "Discover the latest fashion arrivals designed for effortless elegance.",
    url: "/collections/new-arrivals",
    type: "website",
  },
};

export default async function NewArrivalsPage({
  searchParams,
}: NewArrivalsPageProps) {
  const params = await searchParams;

  const categoryId = params.category || undefined;

  const sort =
    params.sort &&
    validSorts.includes(params.sort as ProductSort)
      ? (params.sort as ProductSort)
      : "newest";

  const minPrice = parseNumber(params.minPrice);
  const maxPrice = parseNumber(params.maxPrice);

  const inStockOnly =
    params.availability === "in-stock" ? true : undefined;

  const response = await getProducts({
    page: 1,
    limit: 48,

    // New Arrivals collection
    isNew: true,

    categoryId,
    minPrice,
    maxPrice,
    inStockOnly,
    search: params.search,
    sort,
  });

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      {/* =====================================================
          COLLECTION HEADER + TOOLBAR
      ===================================================== */}
      <section className="border-b border-[var(--color-border-light)] bg-[var(--color-bg)]">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <ShopHeader
            products={response.products}
            selectedCategory={categoryId}
            selectedSort={sort}
          />
        </div>
      </section>

      {/* =====================================================
          COLLECTION CONTENT
      ===================================================== */}
      <section className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-[235px_minmax(0,1fr)] xl:gap-12">
          {/* =================================================
              DESKTOP FILTERS
          ================================================= */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <ShopFilters
                products={response.products}
                selectedCategory={categoryId}
              />
            </div>
          </aside>

          {/* =================================================
              PRODUCT GRID
          ================================================= */}
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