import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

import { Container } from "@/components/shared/container";
import { featuredCategories } from "@/data/home";
import { LinkButton } from "@/components/ui/button";

export function FeaturedCategories() {
  const hasCarousel = featuredCategories.length > 4;

  return (
    <section
      id="categories"
      className="bg-[var(--color-ivory)]"
    >
      <Container>
        {/* =====================================================
            SECTION CONTENT
        ===================================================== */}

        <div className="pt-2 pb-16 sm:pt-3 sm:pb-16 lg:pt-8 lg:pb-24">
          {/* ===================================================
              HEADER
          =================================================== */}

          <div className="text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[var(--color-text-secondary)]">
              Shop By Category
            </p>

            <h2 className="mt-4 font-display text-4xl font-medium leading-none tracking-[-0.04em] text-[var(--color-charcoal)] sm:text-5xl lg:text-6xl">
              Featured Categories
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--color-text-secondary)]">
              Explore our signature edits, thoughtfully curated
              for every occasion.
            </p>
          </div>

          {/* ===================================================
              CATEGORY LIST
          =================================================== */}

          {!hasCarousel && (
            <div className="mt-12 grid grid-cols-2 justify-items-center gap-x-6 gap-y-10 sm:mt-14 sm:grid-cols-4 sm:gap-x-8 lg:gap-x-12 xl:gap-x-16">
              {featuredCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                />
              ))}
            </div>
          )}

          {/* ===================================================
              5+ CATEGORIES
              HORIZONTAL SCROLL
          =================================================== */}

          {hasCarousel && (
            <div className="mt-12 sm:mt-14">
              <div
                className="
                  flex
                  gap-7
                  overflow-x-auto
                  pb-4
                  snap-x
                  snap-mandatory
                  [scrollbar-width:none]
                  [&::-webkit-scrollbar]:hidden
                  sm:gap-9
                  lg:gap-10
                "
              >
                {featuredCategories.map(
                  (category) => (
                    <div
                      key={category.id}
                      className="
                        w-[155px]
                        shrink-0
                        snap-start
                        sm:w-[175px]
                        lg:w-[195px]
                      "
                    >
                      <CategoryCard
                        category={category}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* ===================================================
              VIEW ALL
          =================================================== */}

          <div className="mt-10 flex justify-center border-t border-[var(--color-border)] pt-6 sm:mt-5">
            <LinkButton
              href="/collections"
              variant="secondary"
              size="md"
              icon={
                <ArrowUpRight
                  size={16}
                  strokeWidth={1.4}
                />
              }
            >
              View All Collections
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ============================================================
   CATEGORY CARD
============================================================ */

function CategoryCard({
  category,
}: {
  category: (typeof featuredCategories)[number];
}) {
  return (
    <Link
      href={category.href}
      className="group flex w-full flex-col items-center text-center"
    >
      {/* =====================================================
          IMAGE
      ===================================================== */}

      <div className="relative">
        <div
          className="
            relative
            aspect-square
            w-[135px]
            overflow-hidden
            rounded-full
            border
            border-[var(--color-border)]
            bg-[var(--color-warm-gray)]
            transition-all
            duration-500
            group-hover:border-[var(--color-rose)]
            sm:w-[160px]
            lg:w-[185px]
          "
        >
          <Image
            src={category.image.src}
            alt={category.image.alt}
            fill
            sizes="185px"
            className="
              object-cover
              object-center
              transition-transform
              duration-700
              ease-out
              group-hover:scale-[1.05]
            "
          />
        </div>

        {/* SUBTLE OUTER RING */}

        <span
          className="
            pointer-events-none
            absolute
            -inset-1
            rounded-full
            border
            border-transparent
            transition-all
            duration-500
            group-hover:-inset-2
            group-hover:border-[var(--color-rose)]/50
          "
        />
      </div>

      {/* =====================================================
          CATEGORY NAME
      ===================================================== */}

      <h3
        className="
          mt-5
          font-display
          text-[1.45rem]
          font-medium
          leading-none
          tracking-[-0.02em]
          text-[var(--color-charcoal)]
          transition-colors
          duration-300
          group-hover:text-[var(--color-rose-dark)]
          sm:mt-6
          sm:text-[1.65rem]
          lg:text-[1.8rem]
        "
      >
        {category.title}
      </h3>

      {/* =====================================================
          SHOP NOW
      ===================================================== */}

      <span
        className="
          mt-2
          inline-flex
          items-center
          gap-2
          text-[8px]
          font-semibold
          uppercase
          tracking-[0.22em]
          text-[var(--color-text-muted)]
          transition-colors
          duration-300
          group-hover:text-[var(--color-charcoal)]
        "
      >
        Shop Now

        <ArrowRight
          size={13}
          strokeWidth={1.3}
          className="
            transition-transform
            duration-300
            group-hover:translate-x-1
          "
        />
      </span>
    </Link>
  );
}