import type {
  ProductCategory,
  ProductSort,
} from "@/types/product";

import { products } from "@/data/products";
import { ShopHeader } from "@/components/shop/shop-header";
import { ShopFilters } from "@/components/shop/shop-filters";
import { ShopProductGrid } from "@/components/shop/shop-product-grid";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    type?: string;
    color?: string;
    size?: string;
    availability?: string;
  }>;
}

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

export default async function ShopPage({
  searchParams,
}: ShopPageProps) {
  const params = await searchParams;

  const category = validCategories.includes(
    params.category as ProductCategory,
  )
    ? (params.category as ProductCategory)
    : undefined;

  const sort = validSorts.includes(
    params.sort as ProductSort,
  )
    ? (params.sort as ProductSort)
    : "relevance";

  return (
    <main className="min-h-screen bg-[var(--color-ivory)]">
      {/* =====================================================
          SHOP HEADER
      ===================================================== */}
      <ShopHeader
        products={products}
        selectedCategory={category}
        selectedSort={sort}
      />

      {/* =====================================================
          COLLECTION CONTENT
      ===================================================== */}
      <section className="mx-auto w-full max-w-[1600px] px-4 pb-16 pt-7 sm:px-6 sm:pb-20 sm:pt-8 lg:px-10 lg:pt-10 xl:px-16">
        <div className="grid items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[260px_minmax(0,1fr)] xl:gap-12">
          {/* =================================================
              DESKTOP FILTER SIDEBAR
          ================================================= */}
          <aside className="hidden lg:block">
            <ShopFilters
              products={products}
              selectedCategory={category}
            />
          </aside>

          {/* =================================================
              PRODUCT GRID
          ================================================= */}
          <div className="min-w-0">
            <ShopProductGrid
              products={products}
              category={category}
              sort={sort}
            />
          </div>
        </div>
      </section>
    </main>
  );
}