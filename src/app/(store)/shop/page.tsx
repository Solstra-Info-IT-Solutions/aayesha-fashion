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
    : undefined;

  return (
    <main className="bg-[var(--color-ivory)]">
      <ShopHeader />

      <section className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
          <aside>
            <ShopFilters />
          </aside>

          <div>
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