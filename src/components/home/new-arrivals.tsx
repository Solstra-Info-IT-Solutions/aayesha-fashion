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
        py-[var(--section-lg)]
        lg:py-[var(--section-xl)]
      "
    >
      <Container>
        {/* =====================================================
            SECTION INTRO
        ===================================================== */}

        <div
          className="
            border-t
            border-[var(--color-border)]
            pt-5
            sm:pt-6
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
            "
          >
            {/* Eyebrow */}

            <div className="flex items-center gap-3 sm:gap-4">
              <span
                aria-hidden="true"
                className="
                  h-px
                  w-7
                  bg-[var(--color-accent)]
                  sm:w-9
                "
              />

              <p className="eyebrow">
                The New Edit
              </p>
            </div>

            {/* Product count */}

            <span
              className="
                font-display
                text-lg
                font-medium
                leading-none
                text-[var(--color-text-muted)]
                sm:text-xl
              "
            >
              {String(newArrivals.length).padStart(2, "0")}
            </span>
          </div>

          {/* ===================================================
              EDITORIAL HEADING
          =================================================== */}

          <div className="mt-10 max-w-4xl sm:mt-12 lg:mt-14">
            <h2
              className="
                font-display
                text-[clamp(3.4rem,8vw,7.5rem)]
                font-medium
                leading-[0.82]
                tracking-[-0.055em]
                text-[var(--color-text)]
              "
            >
              New{" "}
              <span
                className="
                  italic
                  text-[var(--color-accent)]
                "
              >
                Arrivals.
              </span>
            </h2>

            <div
              className="
                mt-7
                flex
                flex-col
                gap-5
                sm:mt-8
                lg:flex-row
                lg:items-end
                lg:justify-between
              "
            >
              <p
                className="
                  max-w-md
                  font-body
                  text-[12px]
                  leading-6
                  text-[var(--color-text-secondary)]
                  sm:text-[13px]
                  sm:leading-7
                "
              >
                Discover the latest pieces added to
                the Aayesha wardrobe — designed for
                effortless elegance, meaningful
                occasions and everyday luxury.
              </p>

              <div className="hidden lg:block">
                <p
                  className="
                    font-body
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.22em]
                    text-[var(--color-text-muted)]
                  "
                >
                  New season · 2026
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            PRODUCT CAROUSEL
        ===================================================== */}

        {newArrivals.length > 0 ? (
          <div
            className="
              mt-12
              sm:mt-14
              lg:mt-16
            "
          >
            <ProductCarousel
              products={newArrivals}
              ariaLabel="New arrivals products"
            />
          </div>
        ) : (
          <div
            className="
              mt-12
              border-y
              border-[var(--color-border)]
              py-16
              text-center
              sm:mt-14
              sm:py-20
            "
          >
            <p className="eyebrow">
              The New Edit
            </p>

            <p
              className="
                mt-4
                font-display
                text-[28px]
                leading-none
                text-[var(--color-text)]
                sm:text-[34px]
              "
            >
              New pieces are arriving soon.
            </p>

            <p
              className="
                mx-auto
                mt-4
                max-w-sm
                font-body
                text-[11px]
                leading-5
                text-[var(--color-text-secondary)]
              "
            >
              Keep an eye on this space for the
              latest Aayesha Fashion arrivals.
            </p>
          </div>
        )}

        {/* =====================================================
            BOTTOM CTA
        ===================================================== */}

        <div
          className="
            mt-10
            flex
            items-center
            justify-between
            border-t
            border-[var(--color-border)]
            pt-6
            sm:mt-12
            sm:pt-7
          "
        >
          <p
            className="
              hidden
              font-body
              text-[9px]
              font-medium
              uppercase
              tracking-[0.2em]
              text-[var(--color-text-muted)]
              sm:block
            "
          >
            Discover the latest collection
          </p>

          <div className="sm:ml-auto">
            <LinkButton
              href="/collections/new-arrivals"
              variant="secondary"
              size="md"
              icon={
                <ArrowUpRight
                  size={16}
                  strokeWidth={1.25}
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