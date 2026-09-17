"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import { Container } from "@/components/shared/container";
import { LinkButton } from "@/components/ui/button";

import { getCategories } from "@/services/category.service";
import type { Category } from "@/types/category";

/* =========================================================
   COMPONENT
========================================================= */

export function FeaturedCategories() {
  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(true);

  /* =======================================================
     LOAD FEATURED CATEGORIES
  ======================================================= */

  useEffect(() => {
    console.log("🔥 FeaturedCategories mounted");
    
    let mounted = true;

    async function load() {
      try {

        console.log("🔥 Calling getCategories...");

        const data =
          await getCategories();

        if (!mounted) return;

        setCategories(
          data
            .filter(
              (item) =>
                item.isActive &&
                item.isFeatured,
            )
            .slice(0, 4),
        );
      } catch (error) {
        console.error(
          "Failed to load featured categories:",
          error,
        );

        if (mounted) {
          setCategories([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      className="
        bg-[var(--color-bg)]
        py-14
        sm:py-16
        md:py-20
        lg:py-24
      "
    >
      <Container>
        {/* =================================================
            SECTION HEADER
        ================================================= */}

        <div
          className="
            max-w-2xl
            px-0
          "
        >
          <p className="eyebrow">
            Featured Categories
          </p>

          <h2
            className="
              mt-3
              font-display
              text-[30px]
              leading-[1.05]
              tracking-[-0.025em]
              text-[var(--color-text)]
              sm:text-[36px]
              md:text-[42px]
            "
          >
            Explore our
            <span
              className="
                ml-1.5
                italic
                text-[var(--color-accent)]
              "
            >
              collections.
            </span>
          </h2>
        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div
            className="
              mt-8
              grid
              grid-cols-2
              gap-2.5
              sm:mt-10
              sm:gap-4
              lg:grid-cols-4
              lg:gap-6
            "
          >
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <CategorySkeleton
                key={index}
              />
            ))}
          </div>
        )}

        {/* =================================================
            FEATURED CATEGORIES
        ================================================= */}

        {!loading &&
          categories.length > 0 && (
            <>
              <div
                className="
                  mt-8
                  grid
                  grid-cols-2
                  gap-2.5
                  sm:mt-10
                  sm:gap-4
                  lg:grid-cols-4
                  lg:gap-6
                "
              >
                {categories.map(
                  (category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                    />
                  ),
                )}
              </div>

              {/* CTA */}

              <div
                className="
                  mt-9
                  flex
                  justify-center
                  sm:mt-12
                "
              >
                <LinkButton
                  href="/categories"
                  variant="secondary"
                  size="lg"
                  icon={
                    <ArrowUpRight
                      size={15}
                    />
                  }
                >
                  Explore All Categories
                </LinkButton>
              </div>
            </>
          )}

        {/* =================================================
            EMPTY / COMING SOON
        ================================================= */}

        {!loading &&
          categories.length === 0 && (
            <ComingSoon />
          )}
      </Container>
    </section>
  );
}

/* =========================================================
   CATEGORY CARD
========================================================= */

function CategoryCard({
  category,
}: {
  category: Category;
}) {
  return (
    <Link
      href={`/${category.slug}`}
      className="
        group
        block
        min-w-0
      "
    >
      <article
        className="
          overflow-hidden
          bg-[var(--color-surface)]
        "
      >
        {/* =================================================
            IMAGE
        ================================================= */}

        <div
          className="
            relative
            aspect-[3/4]
            overflow-hidden
            bg-[var(--color-bg-soft)]
          "
        >
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="
                (max-width: 639px) 50vw,
                (max-width: 1023px) 25vw,
                25vw
              "
              className="
                object-cover
                transition-transform
                duration-700
                ease-out
                group-hover:scale-105
              "
            />
          ) : (
            <div
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
                bg-[var(--color-bg-soft)]
              "
            >
              <Sparkles
                size={20}
                strokeWidth={1.1}
                className="
                  text-[var(--color-text-muted)]
                "
              />
            </div>
          )}

          {/* =================================================
              OVERLAY
          ================================================= */}

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-black/70
              via-black/10
              to-transparent
              opacity-80
              transition-opacity
              duration-500
              group-hover:opacity-100
            "
          />

          {/* =================================================
              CONTENT
          ================================================= */}

          <div
            className="
              absolute
              inset-x-0
              bottom-0
              p-3
              text-white
              sm:p-4
              md:p-5
            "
          >
            <p
              className="
                text-[7px]
                uppercase
                tracking-[0.25em]
                text-white/70
                sm:text-[8px]
                sm:tracking-[0.3em]
              "
            >
              Collection
            </p>

            <h3
              className="
                mt-1.5
                font-display
                text-[19px]
                leading-none
                tracking-[-0.02em]
                sm:mt-2
                sm:text-[24px]
                md:text-[26px]
              "
            >
              {category.name}
            </h3>

            <div
              className="
                mt-2.5
                flex
                items-center
                gap-1.5
                text-[7px]
                font-medium
                uppercase
                tracking-[0.18em]
                text-white/80
                transition-colors
                duration-300
                group-hover:text-white
                sm:mt-3
                sm:gap-2
                sm:text-[9px]
                sm:tracking-[0.2em]
              "
            >
              Shop Now

              <ArrowUpRight
                size={11}
                strokeWidth={1.3}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                  group-hover:-translate-y-1
                  sm:h-3
                  sm:w-3
                "
              />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

/* =========================================================
   COMING SOON
========================================================= */

function ComingSoon() {
  return (
    <div
      className="
        mt-8
        flex
        min-h-[280px]
        items-center
        justify-center
        border
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        px-5
        py-10
        text-center
        sm:mt-10
        sm:min-h-[300px]
        sm:px-8
        sm:py-12
      "
    >
      <div
        className="
          w-full
          max-w-sm
        "
      >
        {/* ICON */}

        <div
          className="
            mx-auto
            flex
            h-10
            w-10
            items-center
            justify-center
            border
            border-[var(--color-accent-soft)]
            bg-[var(--color-bg)]
            text-[var(--color-accent)]
            sm:h-11
            sm:w-11
          "
        >
          <Sparkles
            size={17}
            strokeWidth={1.1}
          />
        </div>

        {/* LABEL */}

        <p
          className="
            mt-5
            font-body
            text-[8px]
            font-medium
            uppercase
            tracking-[0.26em]
            text-[var(--color-accent)]
            sm:mt-6
            sm:text-[9px]
            sm:tracking-[0.28em]
          "
        >
          Coming Soon
        </p>

        {/* TITLE */}

        <h3
          className="
            mt-2.5
            font-display
            text-[25px]
            leading-[1.08]
            tracking-[-0.025em]
            text-[var(--color-text)]
            sm:mt-3
            sm:text-[32px]
          "
        >
          Something special
          <span className="block italic">
            is being curated.
          </span>
        </h3>

        {/* DESCRIPTION */}

        <p
          className="
            mx-auto
            mt-3
            max-w-[300px]
            font-body
            text-[10px]
            leading-5
            text-[var(--color-text-secondary)]
            sm:mt-4
            sm:text-[11px]
          "
        >
          Our featured collections are
          currently being prepared. Check
          back soon for the latest from
          Aayesha Fashion.
        </p>

        {/* CTA */}

        <div
          className="
            mt-6
            flex
            justify-center
            sm:mt-7
          "
        >
          <LinkButton
            href="/categories"
            variant="secondary"
            size="md"
            icon={
              <ArrowUpRight
                size={14}
              />
            }
          >
            View All Categories
          </LinkButton>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SKELETON
========================================================= */

function CategorySkeleton() {
  return (
    <div
      className="
        animate-pulse
        overflow-hidden
        bg-[var(--color-surface)]
      "
    >
      <div
        className="
          aspect-[3/4]
          bg-[var(--color-border)]
        "
      />
    </div>
  );
}