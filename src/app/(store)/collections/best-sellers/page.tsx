import { getProducts } from "@/lib/api/products";

import type {
  ProductCategory,
  ProductSort,
  ProductType,
} from "@/types/product";

import { ShopHeader } from "@/components/shop/shop-header";
import { ShopFilters } from "@/components/shop/shop-filters";
import { ShopProductGrid } from "@/components/shop/shop-product-grid";

type BestSellersPageProps = {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    type?: string;
    collection?: string;
    color?: string;
    size?: string;
    availability?: string;
    badge?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
  }>;
};

const validCategories: ProductCategory[] = [
  "festive",
  "ethnic",
  "contemporary",
  "new-arrival",
];

const validSorts: ProductSort[] = [
  "relevance",
  "newest",
  "price-low",
  "price-high",
  "rating",
  "best-selling",
  "featured",
];

const validProductTypes: ProductType[] = [
  "anarkali",
  "kurta",
  "kurta-set",
  "suit-set",
  "lehenga",
  "saree",
  "dress",
  "top",
  "bottom",
  "co-ord",
  "jacket",
  "dupatta",
  "other",
];

function parseNumber(value?: string) {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

export default async function BestSellersPage({
  searchParams,
}: BestSellersPageProps) {
  const params = await searchParams;

  const category =
    params.category &&
    validCategories.includes(
      params.category as ProductCategory,
    )
      ? (params.category as ProductCategory)
      : undefined;

  const sort =
    params.sort &&
    validSorts.includes(
      params.sort as ProductSort,
    )
      ? (params.sort as ProductSort)
      : "best-selling";

  const productType =
    params.type &&
    validProductTypes.includes(
      params.type as ProductType,
    )
      ? (params.type as ProductType)
      : undefined;

  const minPrice = parseNumber(params.minPrice);
  const maxPrice = parseNumber(params.maxPrice);

  const inStockOnly =
    params.availability === "in-stock"
      ? true
      : undefined;

  const response = await getProducts({
    page: 1,
    limit: 48,

    // Best Sellers collection = products marked as Best Seller
    isBestSeller: true,

    category,
    productType,
    collection: params.collection,
    color: params.color,
    size: params.size,
    badge: params.badge,
    minPrice,
    maxPrice,
    inStockOnly,
    search: params.search,
    sort,
  });

  return (
    <main className="min-h-screen bg-[var(--color-ivory)]">
      {/* =====================================================
          COLLECTION HEADER + TOOLBAR
      ===================================================== */}
      <section className="border-b border-[var(--color-border)] bg-[var(--color-ivory)]">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <ShopHeader
            products={response.products}
            selectedCategory={category}
            selectedSort={sort}
          />
        </div>
      </section>

      {/* =====================================================
          PRODUCTS
      ===================================================== */}
      <section className="mx-auto max-w-[1600px] px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[235px_minmax(0,1fr)] xl:gap-10">
          {/* =================================================
              DESKTOP FILTERS
          ================================================= */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <ShopFilters
                products={response.products}
                selectedCategory={category}
              />
            </div>
          </aside>

          {/* =================================================
              PRODUCT GRID
          ================================================= */}
          <div className="min-w-0">
            <ShopProductGrid
              products={response.products}
              category={category}
              sort={sort}
            />
          </div>
        </div>
      </section>
    </main>
  );
}