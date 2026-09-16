import { ArrowUpRight } from "lucide-react";

import { getProducts } from "@/services/product.service";

import { ProductCarousel } from "@/components/product/product-carousel";
import { Container } from "@/components/shared/container";
import { LinkButton } from "@/components/ui/button";

export async function NewArrivals() {
  const response = await getProducts({
    page: 1,
    limit: 8,
    isNew: true,
    status: "active",
    sort: "newest",
  });

  const newArrivals = response.products;

  return (
    <section
      id="new-arrivals"
      className="
        bg-[var(--color-bg-soft)]
        py-14
        sm:py-16
        lg:py-20
      "
    >
      <Container>
        {/* =====================================================
            SECTION HEADER
        ===================================================== */}

        <div
          className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div>
            <p className="eyebrow">
              New Arrivals
            </p>

            <h2
              className="
                mt-3
                font-display
                text-3xl
                leading-tight
                tracking-[-0.025em]
                text-[var(--color-text)]
                sm:text-4xl
                lg:text-[42px]
              "
            >
              Fresh from Aayesha
            </h2>
          </div>

          {/* Desktop CTA */}

          {newArrivals.length > 0 && (
            <div className="hidden sm:block">
              <LinkButton
                href="/collections/new-arrivals"
                variant="secondary"
                size="md"
                icon={
                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.25}
                  />
                }
              >
                View All
              </LinkButton>
            </div>
          )}
        </div>

        {/* =====================================================
            PRODUCTS / COMING SOON
        ===================================================== */}

        {newArrivals.length > 0 ? (
          <>
            <div
              className="
                mt-8
                sm:mt-10
                lg:mt-12
              "
            >
              <ProductCarousel
                products={newArrivals}
                ariaLabel="New arrivals products"
              />
            </div>

            {/* Mobile CTA */}

            <div
              className="
                mt-8
                flex
                justify-center
                sm:hidden
              "
            >
              <LinkButton
                href="/collections/new-arrivals"
                variant="secondary"
                size="md"
                icon={
                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.25}
                  />
                }
              >
                View All New Arrivals
              </LinkButton>
            </div>
          </>
        ) : (
          /* ===================================================
             COMING SOON
          =================================================== */

          <div
            className="
              mt-8
              border-y
              border-[var(--color-border)]
              px-5
              py-16
              text-center
              sm:mt-10
              sm:px-8
              sm:py-20
            "
          >
            <p className="eyebrow">
              New Arrivals
            </p>

            <h3
              className="
                mt-4
                font-display
                text-2xl
                leading-tight
                tracking-[-0.02em]
                text-[var(--color-text)]
                sm:text-3xl
              "
            >
              Coming Soon
            </h3>

            <p
              className="
                mx-auto
                mt-3
                max-w-md
                font-body
                text-xs
                leading-6
                text-[var(--color-text-secondary)]
                sm:text-sm
              "
            >
              Our latest styles are on their way.
              Check back soon for new arrivals from
              Aayesha Fashion.
            </p>

            <div className="mt-7 flex justify-center">
              <LinkButton
                href="/shop"
                variant="secondary"
                size="md"
                icon={
                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.25}
                  />
                }
              >
                Explore Shop
              </LinkButton>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}