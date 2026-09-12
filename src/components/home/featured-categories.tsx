"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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

    async function load() {
      try {
        const data = await getCategories();

        if (!mounted) return;

        setCategories(
          data
            .filter(
              (item) =>
                item.isActive && item.isFeatured
            )
            .slice(0, 4)
        );
      } catch (error) {
        console.error(error);

        if (mounted) setCategories([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  if (!loading && categories.length === 0) return null;

  return (
    <section className="section-space bg-[var(--color-bg)]">
      <Container>
        {/* Heading */}

        <div className="max-w-3xl">
          <p className="eyebrow">
            Signature Collections
          </p>

          <h2 className="heading-display mt-5">
            Discover our
            <span className="block italic text-[var(--color-accent)]">
              curated edits.
            </span>
          </h2>

          <p className="body-large mt-6 max-w-xl">
            Every collection is crafted around timeless
            silhouettes, elevated fabrics and effortless
            elegance.
          </p>
        </div>

        {/* Grid */}

        <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-7">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <CategorySkeleton key={index} />
              ))
            : categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                />
              ))}
        </div>

        {/* CTA */}

        <div className="mt-16 flex justify-center">
          <LinkButton
            href="/collections"
            variant="secondary"
            size="lg"
            icon={<ArrowUpRight size={16} />}
          >
            Explore All Collections
          </LinkButton>
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
      className="group block"
    >
      <article className="overflow-hidden bg-[var(--color-surface)]">
        {/* Image */}

        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="(max-width:768px) 50vw,25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Overlay */}

          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Text */}

          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <p className="text-[9px] uppercase tracking-[0.35em] text-white/70">
              Collection
            </p>

            <h3 className="mt-2 font-display text-[28px] leading-none tracking-[-0.02em]">
              {category.name}
            </h3>

            <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-white/80 transition-all duration-300 group-hover:text-white">
              Shop Now

              <ArrowUpRight
                size={13}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

/* =========================================================
   SKELETON
========================================================= */

function CategorySkeleton() {
  return (
    <div className="animate-pulse overflow-hidden bg-[var(--color-surface)]">
      <div className="aspect-[3/4] bg-[var(--color-border)]" />

      <div className="space-y-3 p-4">
        <div className="h-3 w-20 bg-[var(--color-border)]" />
        <div className="h-5 w-28 bg-[var(--color-border)]" />
      </div>
    </div>
  );
}