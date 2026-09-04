import { ArrowUpRight } from "lucide-react";

import { ProductCarousel } from "@/components/product/product-carousel";
import { Container } from "@/components/shared/container";
import { LinkButton } from "@/components/ui/button";
import { newArrivals } from "@/data/products";

export function NewArrivals() {
  return (
    <section
      id="new-arrivals"
      className="bg-[var(--color-porcelain)]"
    >
      <Container>
        <div className="pt-2 pb-16 sm:pt-3 sm:pb-16 lg:pt-1 lg:pb-24">
          {/* =====================================================
              SECTION HEADER
          ===================================================== */}

          <div className="border-t border-[var(--color-border)] pt-5 sm:pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="h-px w-9 bg-[var(--color-rose-dark)]" />

                <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-[var(--color-text-secondary)] sm:text-[9px]">
                  The New Edit
                </p>
              </div>

              <span className="font-display text-lg text-[var(--color-text-muted)] sm:text-xl">
                03
              </span>
            </div>

            {/* ===================================================
                TITLE + DESCRIPTION
            =================================================== */}

            <div className="mt-8 flex justify-center text-center sm:mt-10">
              {/* TITLE */}

              <div>
                <h2 className="
                  whitespace-nowrap
                  font-display 
                  text-[2.4rem] 
                  font-medium 
                  leading-none 
                  tracking-[-0.045em] 
                  text-[var(--color-charcoal)] 
                  sm:text-[3.3rem] 
                  md:text-[4.3rem] 
                  lg:text-[5.2rem] 
                  xl:text-[5.8rem]">
                  New {" "}
                  <span className="italic text-[var(--color-rose-dark)]">
                    Arrivals.
                  </span>
                </h2>
              </div>

              {/* DESCRIPTION */}

          
            </div>
          </div>

          {/* =====================================================
              PRODUCT CAROUSEL
          ===================================================== */}

          <div className="mt-12 sm:mt-14 lg:mt-16">
            <ProductCarousel
              products={newArrivals}
              ariaLabel="New arrivals products"
            />
          </div>

          {/* =====================================================
              BOTTOM CTA
          ===================================================== */}

          <div className="mt-8 flex justify-center border-t border-[var(--color-border)] pt-6 sm:mt-10 sm:pt-7">
            <LinkButton
              href="/collections/new-arrivals"
              variant="secondary"
              size="md"
              icon={
                <ArrowUpRight
                  size={16}
                  strokeWidth={1.4}
                />
              }
            >
              View All New Arrivals
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
}