"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Container } from "@/components/shared/container";
import { LinkButton } from "@/components/ui/button";
import { getCategories } from "@/services/category.service";
import type { Category } from "@/types/category";

export function FeaturedCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      try {
        const data = await getCategories();

        if (mounted) {
          setCategories(
            data.filter(
              (category) =>
                category.isActive &&
                category.isFeatured
            )
          );
        }
      } catch (error) {
        console.error(
          "Failed to load homepage categories:",
          error
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

    loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  if (!loading && categories.length === 0) {
    return null;
  }

  const hasCarousel = categories.length > 4;

  return (
    <section
      id="categories"
      className="bg-[var(--color-ivory)]"
    >
      <Container>
        <div className="pt-2 pb-16 sm:pt-3 sm:pb-16 lg:pt-8 lg:pb-24">
          {/* Header */}
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
              Shop By Category
            </p>

            <h2 className="mt-3 font-serif text-3xl tracking-wide text-[var(--color-foreground)] sm:text-4xl">
              Featured Categories
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--color-muted)] sm:text-base">
              Explore our signature edits, thoughtfully
              curated for every occasion.
            </p>
          </div>

          {/* Categories */}
          {loading ? (
            <div className="mt-12 flex justify-center gap-7 overflow-hidden">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="w-[155px] shrink-0 animate-pulse"
                >
                  <div className="aspect-square w-[135px] rounded-full bg-black/5 mx-auto" />

                  <div className="mx-auto mt-5 h-4 w-20 rounded bg-black/5" />

                  <div className="mx-auto mt-3 h-3 w-16 rounded bg-black/5" />
                </div>
              ))}
            </div>
          ) : !hasCarousel ? (
            <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-4 sm:gap-7">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                />
              ))}
            </div>
          ) : (
            <div className="mt-12">
              <div className="flex gap-7 overflow-x-auto pb-4 scrollbar-hide">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="w-[155px] shrink-0"
                  >
                    <CategoryCard category={category} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* View All */}
          <div className="mt-12 flex justify-center">
            <LinkButton
              href="/collections"
              variant="secondary"
            >
              View All Collections
            </LinkButton>
          </div>
        </div>
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
      href={`/collections/${category.slug}`}
      className="group block text-center"
    >
      <div className="relative">
        <div className="relative mx-auto aspect-square w-[135px] overflow-hidden rounded-full">
          <Image
            src={category.image}
            alt={
              category.name ||
              "Ayesha Fashion category"
            }
            fill
            sizes="135px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mx-auto aspect-square w-[135px] rounded-full border border-black/10 transition-all duration-500 group-hover:scale-105 group-hover:border-black/20"
        />
      </div>

      <h3 className="mt-5 font-serif text-base tracking-wide text-[var(--color-foreground)]">
        {category.name}
      </h3>

      <span className="mt-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-foreground)]">
        Shop Now
        <ArrowRight
          className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}