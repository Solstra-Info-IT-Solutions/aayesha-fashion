import { ArrowUpRight } from "lucide-react";

import { getProducts } from "@/services/product.service";

import { ProductCarousel } from "@/components/product/product-carousel";
import { Container } from "@/components/shared/container";
import { LinkButton } from "@/components/ui/button";

export async function BestSellers() {
  const response = await getProducts({
    page: 1,
    limit: 8,
    isBestSeller: true,
    status: "active",
    sort: "best-selling",
  });

  const bestSellers = response.products;

  return (
    <section
      id="best-sellers"
      className="bg-[var(--color-cream)]"
    >
      <Container>
        <div className="pt-16 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24">
          {/* =====================================================
              SECTION HEADER
          ===================================================== */}

          <div className="border-t border-[var(--color-border)] pt-5 sm:pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="h-px w-9 bg-[var(--color-rose-dark)]" />

                <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-[var(--color-text-secondary)] sm:text-[9px]">
                  Most Loved
                </p>
              </div>

              <span className="font-display text-lg text-[var(--color-text-muted)] sm:text-xl">
                {String(bestSellers.length).padStart(
                  2,
                  "0",
                )}
              </span>
            </div>

            {/* ===================================================
                TITLE
            =================================================== */}

            <div className="mt-8 flex justify-center text-center sm:mt-10">
              <h2
                className="
                  whitespace-nowrap
                  font-display
                  text-[2.4rem]
                  font-medium
                  leading-none
                  tracking-[-0.045em]
                  text-[var(--color-charcoal)]
                  sm:text-[3.4rem]
                  md:text-[4.4rem]
                  lg:text-[5.2rem]
                  xl:text-[5.8rem]
                "
              >
                Best{" "}
                <span className="italic text-[var(--color-rose-dark)]">
                  Sellers.
                </span>
              </h2>
            </div>

            <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-7 text-[var(--color-text-secondary)] sm:text-[15px] sm:leading-8">
              Discover the silhouettes our customers return
              to time and again.
            </p>
          </div>

          {/* =====================================================
              PRODUCT CAROUSEL
          ===================================================== */}

          {bestSellers.length > 0 ? (
            <div className="mt-12 sm:mt-14 lg:mt-16">
              <ProductCarousel
                products={bestSellers}
                ariaLabel="Best selling products"
              />
            </div>
          ) : (
            <div className="mt-12 border-y border-[var(--color-border)] py-16 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                Coming soon
              </p>

              <p className="mt-3 font-display text-2xl text-[var(--color-charcoal)]">
                Our most-loved edit is being curated.
              </p>
            </div>
          )}

          {/* =====================================================
              CTA
          ===================================================== */}

          <div className="mt-8 flex justify-center border-t border-[var(--color-border)] pt-6 sm:mt-10 sm:pt-7">
            <LinkButton
              href="/collections/best-sellers"
              variant="secondary"
              size="md"
              icon={
                <ArrowUpRight
                  size={16}
                  strokeWidth={1.4}
                />
              }
            >
              View All Best Sellers
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
}