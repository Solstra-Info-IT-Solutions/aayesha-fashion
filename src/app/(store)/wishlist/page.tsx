import type { Product } from "@/types/product";
import { getProducts } from "@/lib/api/products";
import { WishlistGrid } from "@/components/product/wishlist-grid";

export default async function WishlistPage() {
  let products: Product[] = [];

  try {
    const response = await getProducts({
      page: 1,
      limit: 100,
      status: "active",
      sort: "featured",
    });

    products = response.products;
  } catch {
    products = [];
  }

  return (
    <main className="min-h-screen bg-[var(--color-ivory)]">
      <section className="border-b border-[var(--color-border)]">
        <div className="container-premium py-14 text-center sm:py-16 lg:py-20">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
            Saved Pieces
          </p>

          <h1 className="font-display text-[3rem] font-bold leading-none tracking-[-0.03em] text-[var(--color-charcoal)] sm:text-[3.5rem] lg:text-[4rem]">
            Your Wishlist.
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
            Keep the pieces you love close and come back to them whenever
            you're ready.
          </p>
        </div>
      </section>

      <section className="container-premium py-12 sm:py-14 lg:py-16">
        <WishlistGrid products={products} />
      </section>
    </main>
  );
}