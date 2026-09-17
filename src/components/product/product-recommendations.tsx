import Link from "next/link";

import type { Product } from "@/types/product";

import { ProductCard } from "@/components/product/product-card";

interface ProductRecommendationsProps {
  product: Product;
  recommendations: Product[];
}

export function ProductRecommendations({
  product,
  recommendations,
}: ProductRecommendationsProps) {
  if (!recommendations.length) {
    return null;
  }

  return (
    <section
      className="
        border-t
        border-[var(--color-border)]
        bg-[var(--color-bg-soft)]
      "
    >
      <div
        className="
          mx-auto
          max-w-[1600px]
          px-4
          py-16
          sm:px-6
          sm:py-20
          lg:px-10
          lg:py-24
          xl:px-12
        "
      >
        {/* =====================================================
            SECTION HEADER
        ===================================================== */}

        <div
          className="
            mb-8
            flex
            items-end
            justify-between
            gap-6
            sm:mb-10
          "
        >
          <div>
            <p
              className="
                eyebrow
                text-[var(--color-accent)]
              "
            >
              Curated for you
            </p>

            <h2
              className="
                mt-2
                font-display
                text-[clamp(2.25rem,4vw,4rem)]
                font-medium
                leading-[0.95]
                tracking-tight
                text-[var(--color-text)]
              "
            >
              You may also like.
            </h2>

            <p
              className="
                mt-3
                max-w-md
                font-body
                text-[11px]
                leading-6
                text-[var(--color-text-muted)]
                sm:text-xs
              "
            >
              Discover pieces selected to complement
              your current choice.
            </p>
          </div>

          <Link
            href={`/shop?category=${encodeURIComponent(
              product.categoryId,
            )}`}
            className="
              link-luxury
              hidden
              shrink-0
              font-body
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-[var(--color-text)]
              sm:inline-flex
            "
          >
            View collection
          </Link>
        </div>

        {/* =====================================================
            PRODUCT GRID
        ===================================================== */}

        <div
          className="
            grid
            grid-cols-2
            gap-x-3
            gap-y-10
            sm:gap-x-5
            sm:gap-y-12
            lg:grid-cols-4
            lg:gap-x-6
            lg:gap-y-14
          "
        >
          {recommendations.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
            />
          ))}
        </div>

        {/* =====================================================
            MOBILE COLLECTION LINK
        ===================================================== */}

        <div
          className="
            mt-10
            flex
            justify-center
            sm:hidden
          "
        >
          <Link
            href={`/shop?category=${encodeURIComponent(
              product.categoryId,
            )}`}
            className="
              link-luxury
              font-body
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-[var(--color-text)]
            "
          >
            View collection
          </Link>
        </div>
      </div>
    </section>
  );
}