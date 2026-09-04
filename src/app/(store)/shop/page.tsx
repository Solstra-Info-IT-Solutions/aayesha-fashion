import { ShopHeader } from "@/components/shop/shop-header";
import { ShopFilters } from "@/components/shop/shop-filters";
import { ShopProductGrid } from "@/components/shop/shop-product-grid";

type ShopPageProps = {
  searchParams: Promise<{
    category?: string;
    sort?: string;
  }>;
};

export default async function ShopPage({
  searchParams,
}: ShopPageProps) {
  const params = await searchParams;

  return (
    <>
      <ShopHeader />

      <main className="bg-[var(--color-ivory)]">
        <ShopFilters />

        <ShopProductGrid
          category={params.category}
          sort={params.sort}
        />
      </main>
    </>
  );
}