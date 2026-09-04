import Link from "next/link";

import { products } from "@/data/products";
import { ProductCard } from "@/components/product/product-card";

export default function CollectionsPage() {
  const featured = products.filter(
    (product) =>
      product.status === "active" &&
      product.merchandising.isFeatured,
  );

  return (
    <main className="bg-[var(--color-ivory)]">
      <section className="border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            Ayesha Fashion
          </p>

          <h1 className="mt-3 font-[var(--font-cormorant)] text-5xl leading-none sm:text-6xl">
            Collections
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[var(--color-text-secondary)]">
            Explore thoughtfully curated edits designed for
            modern Indian dressing.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            ["Festive", "/shop?category=festive"],
            ["Ethnic", "/shop?category=ethnic"],
            [
              "Contemporary",
              "/shop?category=contemporary",
            ],
            [
              "New Arrivals",
              "/shop?category=new-arrival",
            ],
          ].map(
            ([label, href]) => (
              <Link
                key={label}
                href={href}
                className="group border border-[var(--color-border)] bg-[var(--color-cream)] p-6 transition hover:border-[var(--color-charcoal)]"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                  Explore
                </p>

                <p className="mt-3 font-[var(--font-cormorant)] text-2xl">
                  {label}
                </p>
              </Link>
            ),
          )}
        </div>

        {featured.length > 0 && (
          <div className="mt-16">
            <div className="mb-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                The edit
              </p>

              <h2 className="mt-2 font-[var(--font-cormorant)] text-4xl">
                Featured pieces.
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
              {featured.map(
                (product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ),
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}