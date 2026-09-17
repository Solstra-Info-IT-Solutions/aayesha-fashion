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
        <div className="py-5 sm:py-6 lg:py-8">

          {/* Section Header */}
          <div className="border-t border-[var(--color-border)] pt-3 sm:pt-4">

            <div className="text-center">
              <h2
                className="
                  font-display
                  text-[2.5rem]
                  font-medium
                  leading-[0.95]
                  tracking-[-0.045em]
                  text-[var(--color-charcoal)]
                  sm:text-[3.3rem]
                  md:text-[4rem]
                  lg:text-[4.7rem]
                  xl:text-[5.2rem]
                "
              >
                Best{" "}
                <span className="italic text-[var(--color-rose-dark)]">
                  Sellers.
                </span>
              </h2>

              <p className="mx-auto mt-2 max-w-lg text-[12px] leading-5 text-[var(--color-text-secondary)] sm:mt-3 sm:text-sm sm:leading-6">
                Discover the silhouettes our customers return
                to time and again.
              </p>
            </div>
          </div>

          {/* Product Carousel */}
          {bestSellers.length > 0 ? (
            <div className="mt-6 sm:mt-8 lg:mt-9">
              <ProductCarousel
                products={bestSellers}
                ariaLabel="Best selling products"
              />
            </div>
          ) : (
            <div className="mt-6 border-y border-[var(--color-border)] py-8 text-center sm:py-10">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                Coming soon
              </p>

              <p className="mt-2 font-display text-lg text-[var(--color-charcoal)] sm:text-xl">
                Our most-loved edit is being curated.
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-5 flex justify-center sm:mt-6">
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