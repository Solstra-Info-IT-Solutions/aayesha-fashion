import type { Metadata } from "next";

import { getProducts } from "@/lib/api/products";
import type { ProductSort } from "@/types/product";

import { ShopHeader } from "@/components/shop/shop-header";
import { ShopFilters } from "@/components/shop/shop-filters";
import { ShopProductGrid } from "@/components/shop/shop-product-grid";

type BestSellersPageProps = {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    availability?: string;
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
  title: "Best Sellers",
  description:
    "Shop Aayesha Fashion's best-selling Indian and contemporary styles, loved for their elegant silhouettes and timeless appeal.",
  alternates: {
    canonical: "/collections/best-sellers",
  },
  openGraph: {
    title: "Best Sellers | Aayesha Fashion",
    description: "Discover the pieces our customers love most.",
    url: "/collections/best-sellers",
    type: "website",
  },
};

export default async function BestSellersPage({
  searchParams,
}: BestSellersPageProps) {
  const params = await searchParams;

  const categoryId = params.category || undefined;

  const sort =
    params.sort &&
    validSorts.includes(params.sort as ProductSort)
      ? (params.sort as ProductSort)
      : "best-selling";

  const minPrice = parseNumber(params.minPrice);
  const maxPrice = parseNumber(params.maxPrice);

  const inStockOnly =
    params.availability === "in-stock"
      ? true
      : undefined;

  const response = await getProducts({
    page: 1,
    limit: 48,

    // Best Sellers collection
    isBestSeller: true,

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
          COLLECTION HEADER
      ===================================================== */}

      <section className="bg-[var(--color-bg)]">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="py-6 sm:py-8 lg:py-10">
            <div className="mb-1 flex items-center gap-3">
              <span className="h-px w-7 bg-[var(--color-accent)]" />

              <span className="eyebrow text-[var(--color-accent)]">
                Aayesha Fashion
              </span>
            </div>

            <h1
              className="
                font-display
                text-[2.5rem]
                font-medium
                leading-[0.95]
                tracking-[-0.04em]
                text-[var(--color-text)]
                sm:text-[3.2rem]
                md:text-[3.7rem]
                lg:text-[4.1rem]
              "
            >
              Best Sellers
            </h1>

            <p
              className="
                mt-2.5
                max-w-xl
                font-body
                text-[12px]
                leading-5
                text-[var(--color-text-secondary)]
                sm:text-[13px]
                sm:leading-6
              "
            >
              Discover the pieces our customers love most,
              selected from the Aayesha Fashion edit.
            </p>
          </div>

          {/* Toolbar */}
          <div className="border-t border-[var(--color-border-light)]">
            <ShopHeader
              products={response.products}
              selectedCategory={categoryId}
              selectedSort={sort}
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <section className="bg-[var(--color-bg)]">
        <div
          className="
            mx-auto
            max-w-[1600px]
            px-4
            py-7
            sm:px-6
            sm:py-9
            lg:px-8
            lg:py-11
          "
        >
          <div
            className="
              grid
              gap-8
              lg:grid-cols-[215px_minmax(0,1fr)]
              xl:grid-cols-[230px_minmax(0,1fr)]
              lg:gap-10
              xl:gap-12
            "
          >
            {/* =================================================
                DESKTOP FILTERS
            ================================================= */}

            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <div className="mb-4">
                  <p className="eyebrow text-[var(--color-text-muted)]">
                    Refine
                  </p>

                  <p className="mt-1 font-display text-lg text-[var(--color-text)]">
                    Your selection
                  </p>
                </div>

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
        </div>
      </section>

      {/* =====================================================
          BRAND FOOTER NOTE
      ===================================================== */}

      <section className="bg-[var(--color-bg-soft)]">
        <div
          className="
            mx-auto
            max-w-[1600px]
            px-4
            py-7
            sm:px-6
            sm:py-8
            lg:px-8
            lg:py-9
          "
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-body text-[8px] font-semibold uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
              The Aayesha edit
            </p>

            <p className="font-display text-base italic text-[var(--color-text-secondary)] sm:text-lg">
              Loved, selected, and worn with confidence.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}