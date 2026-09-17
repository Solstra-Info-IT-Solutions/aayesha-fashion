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
    params.availability === "in-stock"
      ? true
      : undefined;

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
          HEADER + TOOLBAR
      ===================================================== */}

      <section className="bg-[var(--color-bg)]">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">

          {/* Compact Page Heading */}
          <div className="py-5 sm:py-6 lg:py-7">
            <div className="flex items-center gap-2.5">
              <span className="h-px w-5 bg-[var(--color-accent)]" />

              <span className="eyebrow text-[var(--color-accent)]">
                Collection
              </span>
            </div>

            <h1
              className="
                mt-2
                font-display
                text-[1.8rem]
                font-medium
                leading-none
                tracking-[-0.025em]
                text-[var(--color-text)]
                sm:text-[2rem]
                lg:text-[2.2rem]
              "
            >
              New Arrivals
            </h1>
          </div>
        </div>
      </section>

      {/* =====================================================
          PRODUCT CONTENT
      ===================================================== */}

      <section className="bg-[var(--color-bg)]">
        <div
          className="
            mx-auto
            max-w-[1600px]
            px-4
            py-6
            sm:px-6
            sm:py-7
            lg:px-8
            lg:py-8
          "
        >
          <div
            className="
              grid
              gap-7
              lg:grid-cols-[200px_minmax(0,1fr)]
              xl:grid-cols-[215px_minmax(0,1fr)]
              lg:gap-9
              xl:gap-11
            "
          >
            {/* =================================================
                FILTERS
            ================================================= */}

            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <div
                  className="
                    border
                    border-[var(--color-border-light)]
                    bg-[var(--color-bg-soft)]
                  "
                >
                  <div className="flex items-center justify-between px-4 py-3">
                    <span
                      className="
                        font-body
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        text-[var(--color-text)]
                      "
                    >
                      Filters
                    </span>

                    <span
                      className="
                        font-body
                        text-[8px]
                        uppercase
                        tracking-[0.15em]
                        text-[var(--color-text-muted)]
                      "
                    >
                      Refine
                    </span>
                  </div>

                  <div className="border-t border-[var(--color-border-light)] px-4 py-1">
                    <ShopFilters
                      products={response.products}
                      selectedCategory={categoryId}
                    />
                  </div>
                </div>
              </div>
            </aside>

            {/* =================================================
                PRODUCTS
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
    </main>
  );
}