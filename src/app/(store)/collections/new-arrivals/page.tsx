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
              New Arrivals
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
              Fresh silhouettes, new details, and the latest pieces
              from the Aayesha Fashion edit.
            </p>
          </div>

          {/* Existing toolbar */}
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
          BOTTOM BRAND NOTE
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
              The latest from Aayesha
            </p>

            <p className="font-display text-base italic text-[var(--color-text-secondary)] sm:text-lg">
              Made to feel distinctly yours.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}