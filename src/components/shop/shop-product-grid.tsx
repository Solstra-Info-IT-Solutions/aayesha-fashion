import { ProductCard } from "@/components/product/product-card";
import { Container } from "@/components/shared/container";
import { products } from "@/data/products";

type ShopProductGridProps = {
  category?: string;
  sort?: string;
};

function getFilteredProducts(
  category?: string,
  sort?: string
) {
  let result = [...products];

  /* =========================================================
     CATEGORY
  ========================================================= */

  if (category) {
    if (category === "new-arrivals") {
      result = result.filter(
        (product) => product.isNew
      );
    } else {
      result = result.filter(
        (product) =>
          product.category === category
      );
    }
  }

  /* =========================================================
     SORT
  ========================================================= */

  switch (sort) {
    case "price-low":
      result.sort(
        (a, b) => a.price - b.price
      );
      break;

    case "price-high":
      result.sort(
        (a, b) => b.price - a.price
      );
      break;

    case "name":
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      break;

    case "newest":
    default:
      result.sort((a, b) => {
        if (a.isNew && !b.isNew) {
          return -1;
        }

        if (!a.isNew && b.isNew) {
          return 1;
        }

        return 0;
      });
      break;
  }

  return result;
}

export function ShopProductGrid({
  category,
  sort = "newest",
}: ShopProductGridProps) {
  const filteredProducts =
    getFilteredProducts(
      category,
      sort
    );

  return (
    <section className="bg-[var(--color-ivory)]">
      <Container>
        <div className="pt-10 pb-16 sm:pt-12 sm:pb-20 lg:pt-14 lg:pb-24">
          {/* =====================================================
              PRODUCT COUNT
          ===================================================== */}

          <div className="mb-7 flex items-center justify-between border-b border-[var(--color-border)] pb-4 sm:mb-8">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-secondary)] sm:text-[10px]">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "Piece"
                : "Pieces"}
            </p>

            {category && (
              <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
                {formatCategory(category)}
              </p>
            )}
          </div>

          {/* =====================================================
              PRODUCT GRID
          ===================================================== */}

          {filteredProducts.length > 0 ? (
            <div
              className="
                grid
                grid-cols-2
                gap-x-4
                gap-y-12
                sm:gap-x-6
                sm:gap-y-14
                lg:grid-cols-3
                lg:gap-x-8
                lg:gap-y-16
                xl:gap-x-10
              "
            >
              {filteredProducts.map(
                (product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    priority={index < 4}
                  />
                )
              )}
            </div>
          ) : (
            <EmptyShopState
              category={category}
            />
          )}

          {/* =====================================================
              LOAD MORE FOUNDATION
          ===================================================== */}

          {filteredProducts.length > 0 && (
            <div className="mt-14 border-t border-[var(--color-border)] pt-8 sm:mt-16">
              <p className="text-center text-[9px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                End of collection
              </p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyShopState({
  category,
}: {
  category?: string;
}) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center border-y border-[var(--color-border)] px-6 text-center">
      <p className="font-display text-[2.2rem] font-medium tracking-[-0.025em] text-[var(--color-charcoal)] sm:text-[2.8rem]">
        No pieces found.
      </p>

      <p className="mt-4 max-w-md text-sm leading-7 text-[var(--color-text-secondary)]">
        {category
          ? `We couldn't find any pieces in the ${formatCategory(
              category
            )} collection.`
          : "There are no products available in this collection yet."}
      </p>
    </div>
  );
}

/* ============================================================
   CATEGORY FORMATTER
============================================================ */

function formatCategory(
  category: string
) {
  return category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}