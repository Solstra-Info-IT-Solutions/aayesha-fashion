import Image from "next/image";
import { LinkButton } from "@/components/ui/button";
import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/shared/container";
import { featuredCollections } from "@/data/home";

type CollectionCardProps = {
  collection: (typeof featuredCollections)[number];
  index: number;
};

function CollectionCard({ collection, index }: CollectionCardProps) {
  return (
    <article
      className={`group flex flex-col ${
        index === 1 ? "lg:pt-12 xl:pt-16" : ""
      }`}
    >
      {/* IMAGE */}
      <Link
        href={collection.href}
        aria-label={`Explore ${collection.title}`}
        className="relative block overflow-hidden bg-white/[0.03]"
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={collection.image.src}
            alt={collection.image.alt}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-[1400ms] ease-out group-hover:scale-[1.025]"
          />

          {/* SUBTLE EDITORIAL OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/5 transition-opacity duration-500 group-hover:opacity-70" />

          {/* COLLECTION NUMBER */}
          <div className="absolute right-5 top-5 sm:right-6 sm:top-6">
            <span className="font-display text-lg leading-none text-white/75 sm:text-xl">
              {collection.number}
            </span>
          </div>

          {/* CATEGORY */}
          <div className="absolute left-5 top-5 sm:left-6 sm:top-6">
            <span className="text-[8px] font-semibold uppercase tracking-[0.3em] text-white/75">
              {collection.eyebrow}
            </span>
          </div>
        </div>
      </Link>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col border-b border-white/15 pb-6 pt-6 sm:pt-7">
        <div className="flex items-start justify-between gap-5">
          <div>
            <h3 className="font-display text-[2rem] leading-[0.95] tracking-[-0.03em] text-white sm:text-[2.25rem] lg:text-[2.5rem]">
              {collection.title}
            </h3>

            <p className="mt-4 max-w-[32rem] text-[11px] leading-6 text-white/55 sm:text-xs sm:leading-6">
              {collection.description}
            </p>
          </div>

          <Link
            href={collection.href}
            aria-label={`Explore ${collection.title}`}
            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center border border-white/20 text-white/70 transition-all duration-300 hover:border-[var(--color-rose)] hover:bg-[var(--color-rose)] hover:text-[var(--color-charcoal)]"
          >
            <ArrowUpRight size={17} strokeWidth={1.4} />
          </Link>
        </div>
      </div>

      {/* EDITORIAL LINK */}
      <LinkButton
  href={collection.href}
  variant="darkOutline"
  size="sm"
  icon={
    <ArrowUpRight
      size={14}
      strokeWidth={1.5}
    />
  }
>
  Explore Collections
</LinkButton>
    </article>
  );
}

export function FeaturedCollections() {
  return (
    <section
      id="collections"
      className="relative overflow-hidden bg-[var(--color-charcoal)] text-white"
    >
      {/* Decorative subtle vertical line */}
      <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-white/[0.025] xl:block" />

      <Container className="relative">
        <div className="py-24 sm:py-28 lg:py-32 xl:py-40">
          {/* =============================================
              HEADER
          ============================================== */}

          <header className="border-t border-white/15 pt-5 sm:pt-6">
            {/* TOP LINE */}

            <div className="flex items-start justify-between gap-6">
              <div className="flex items-center gap-4">
                <span className="h-px w-9 bg-[var(--color-rose)]" />

                <p className="text-[8px] font-semibold uppercase tracking-[0.32em] text-white/55 sm:text-[9px]">
                  The House of Aayesha
                </p>
              </div>

              <span className="font-display text-lg leading-none text-white/45 sm:text-xl">
                02
              </span>
            </div>

            {/* MAIN HEADER */}

            <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:items-end">
              {/* TITLE */}

              <div className="lg:col-span-8">
                <h2 className="max-w-4xl font-display text-[3.5rem] leading-[0.86] tracking-[-0.05em] text-white sm:text-7xl md:text-8xl lg:text-[6.5rem] xl:text-[8rem]">
                  Explore the
                  <span className="block italic text-[var(--color-rose-light)]">
                    collections.
                  </span>
                </h2>
              </div>

              {/* DESCRIPTION */}

              <div className="max-w-sm border-l border-white/15 pl-5 lg:col-span-4 lg:justify-self-end lg:pb-3 lg:pl-7">
                <span className="mb-5 block h-px w-10 bg-[var(--color-rose)]" />

                <p className="text-sm leading-7 text-white/60">
                  A considered wardrobe shaped by celebration, heritage and
                  modern femininity.
                </p>
              </div>
            </div>
          </header>

          {/* =============================================
              COLLECTION GRID
          ============================================== */}

          <div className="mt-16 grid gap-14 sm:grid-cols-2 sm:gap-x-7 sm:gap-y-16 lg:mt-24 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-0 xl:gap-x-14">
            {featuredCollections.map((collection, index) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                index={index}
              />
            ))}
          </div>

          {/* =============================================
              BOTTOM CTA
          ============================================== */}

          <div className="mt-20 border-t border-white/15 pt-7 sm:mt-24 lg:mt-28">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-white/35 sm:text-[9px]">
                  Aayesha Fashion
                </p>

                <p className="mt-3 max-w-sm text-sm leading-7 text-white/55">
                  Discover silhouettes created for celebrations, traditions and
                  every beautiful moment in between.
                </p>
              </div>

              <Link
                href="/collections"
                className="group inline-flex w-fit items-center gap-5 border-b border-white/30 pb-3 font-display text-2xl text-white transition-colors duration-300 hover:border-[var(--color-rose)] hover:text-[var(--color-rose-light)] sm:text-3xl"
              >
                View all collections

                <ArrowUpRight
                  size={21}
                  strokeWidth={1.3}
                  className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}