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
        <div className="py-8 sm:py-10 lg:py-12">

          {/* Section Header */}
          <div className="border-t border-[var(--color-border)] pt-4 sm:pt-5">

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="h-px w-7 bg-[var(--color-rose-dark)]" />

                <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[var(--color-text-secondary)] sm:text-[9px]">
                  Most Loved
                </p>
              </div>

              <span className="font-display text-base text-[var(--color-text-muted)] sm:text-lg">
                {String(bestSellers.length).padStart(2, "0")}
              </span>
            </div>

            {/* Title */}
            <div className="mt-6 text-center sm:mt-7">
              <h2
                className="
                  font-display
                  text-[2.7rem]
                  font-medium
                  leading-[0.95]
                  tracking-[-0.045em]
                  text-[var(--color-charcoal)]
                  sm:text-[3.5rem]
                  md:text-[4.3rem]
                  lg:text-[5rem]
                  xl:text-[5.5rem]
                "
              >
                Best{" "}
                <span className="italic text-[var(--color-rose-dark)]">
                  Sellers.
                </span>
              </h2>
            </div>

            <p className="mx-auto mt-3 max-w-lg text-center text-[13px] leading-6 text-[var(--color-text-secondary)] sm:mt-4 sm:text-sm sm:leading-7">
              Discover the silhouettes our customers return
              to time and again.
            </p>
          </div>

          {/* Product Carousel */}
          {bestSellers.length > 0 ? (
            <div className="mt-8 sm:mt-10 lg:mt-12">
              <ProductCarousel
                products={bestSellers}
                ariaLabel="Best selling products"
              />
            </div>
          ) : (
            <div className="mt-8 border-y border-[var(--color-border)] py-10 text-center sm:py-12">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                Coming soon
              </p>

              <p className="mt-2 font-display text-xl text-[var(--color-charcoal)] sm:text-2xl">
                Our most-loved edit is being curated.
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-7 flex justify-center border-t border-[var(--color-border)] pt-5 sm:mt-8 sm:pt-6">
            <LinkButton
              href="/collections/best-sellers"
              variant="secondary"
              size="md"
              icon={
                <ArrowUpRight
                  size={15}
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