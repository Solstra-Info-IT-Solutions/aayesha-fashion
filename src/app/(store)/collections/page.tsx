import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";

import { products } from "@/data/products";
import { ProductCard } from "@/components/product/product-card";

const collectionLinks = [
  {
    label: "Festive",
    eyebrow: "For celebrations",
    description:
      "Luminous silhouettes and considered details for occasions worth dressing for.",
    href: "/shop?category=festive",
  },
  {
    label: "Ethnic",
    eyebrow: "Rooted in tradition",
    description:
      "Indian wardrobe classics reinterpreted with graceful, modern ease.",
    href: "/shop?category=ethnic",
  },
  {
    label: "Contemporary",
    eyebrow: "Modern essentials",
    description:
      "Clean lines, soft structure and elevated pieces for everyday dressing.",
    href: "/shop?category=contemporary",
  },
  {
    label: "New Arrivals",
    eyebrow: "Just introduced",
    description:
      "The latest Aayesha pieces, selected for the new season.",
    href: "/shop?category=new-arrival",
  },
] as const;

export default function CollectionsPage() {
  const featured = products.filter(
    (product) =>
      product.status === "active" &&
      product.merchandising.isFeatured,
  );

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      {/* =====================================================
          EDITORIAL INTRO
      ===================================================== */}

      <section className="border-b border-[var(--color-border-light)]">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="grid min-h-[52vh] items-end gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_360px] lg:py-24 xl:min-h-[58vh] xl:py-28">
            <div className="max-w-5xl">
              <p className="eyebrow flex items-center gap-3 text-[var(--color-accent)]">
                <span className="h-px w-8 bg-[var(--color-accent)]" />
                Aayesha Fashion
              </p>

              <h1
                className="
                  mt-6
                  max-w-5xl
                  font-display
                  text-[clamp(4rem,10vw,9rem)]
                  font-medium
                  leading-[0.8]
                  tracking-[var(--tracking-tight)]
                  text-[var(--color-text)]
                "
              >
                Collections
              </h1>
            </div>

            <div className="border-t border-[var(--color-border)] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <p className="font-display text-2xl leading-tight text-[var(--color-text)] sm:text-3xl">
                Thoughtfully curated edits for modern Indian dressing.
              </p>

              <p className="mt-5 font-body text-sm leading-7 text-[var(--color-text-secondary)]">
                Discover occasion dressing, everyday essentials and
                contemporary interpretations designed to become part of
                your wardrobe.
              </p>

              <Link
                href="/shop"
                className="
                  link-luxury
                  group
                  mt-7
                  inline-flex
                  items-center
                  gap-2
                  font-body
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[var(--tracking-wider)]
                  text-[var(--color-text)]
                "
              >
                Shop everything

                <ArrowRight
                  size={14}
                  strokeWidth={1.3}
                  className="transition-transform duration-[var(--duration-base)] group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          COLLECTION EDITS
      ===================================================== */}

      <section className="mx-auto max-w-[1600px] px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-24">
        <div className="mb-10 flex items-end justify-between gap-6 sm:mb-12">
          <div>
            <p className="eyebrow text-[var(--color-accent)]">
              Explore the edits
            </p>

            <h2
              className="
                mt-3
                font-display
                text-[var(--text-heading-lg)]
                font-medium
                leading-[0.95]
                tracking-[var(--tracking-tight)]
                text-[var(--color-text)]
              "
            >
              Dress for the moment.
            </h2>
          </div>

          <span className="hidden font-body text-[10px] font-medium uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-muted)] sm:block">
            04 edits
          </span>
        </div>

        <div className="grid gap-px border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4">
          {collectionLinks.map((collection, index) => (
            <Link
              key={collection.label}
              href={collection.href}
              className="
                group
                relative
                flex
                min-h-[310px]
                flex-col
                justify-between
                overflow-hidden
                bg-[var(--color-bg)]
                p-6
                transition-colors
                duration-[var(--duration-base)]
                hover:bg-[var(--color-bg-soft)]
                sm:min-h-[340px]
                sm:p-7
                lg:min-h-[390px]
                lg:p-8
              "
            >
              <div className="flex items-start justify-between">
                <span className="font-body text-[10px] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-muted)]">
                  0{index + 1}
                </span>

                <span
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    border
                    border-[var(--color-border)]
                    text-[var(--color-text-secondary)]
                    transition-all
                    duration-[var(--duration-base)]
                    group-hover:border-[var(--color-accent)]
                    group-hover:text-[var(--color-accent)]
                  "
                >
                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.25}
                    className="transition-transform duration-[var(--duration-base)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </div>

              <div>
                <p className="font-body text-[10px] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-accent)]">
                  {collection.eyebrow}
                </p>

                <h3
                  className="
                    mt-3
                    font-display
                    text-4xl
                    font-medium
                    leading-none
                    tracking-[var(--tracking-tight)]
                    text-[var(--color-text)]
                    sm:text-[2.75rem]
                  "
                >
                  {collection.label}
                </h3>

                <p className="mt-4 max-w-xs font-body text-xs leading-6 text-[var(--color-text-secondary)]">
                  {collection.description}
                </p>

                <span className="mt-6 inline-flex items-center gap-2 font-body text-[10px] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text)]">
                  Explore edit

                  <ArrowRight
                    size={13}
                    strokeWidth={1.3}
                    className="transition-transform duration-[var(--duration-base)] group-hover:translate-x-1"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =====================================================
          FEATURED EDIT
      ===================================================== */}

      {featured.length > 0 && (
        <section className="border-t border-[var(--color-border-light)] bg-[var(--color-bg-soft)]">
          <div className="mx-auto max-w-[1600px] px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-24">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow text-[var(--color-accent)]">
                  The Aayesha edit
                </p>

                <h2
                  className="
                    mt-3
                    font-display
                    text-[var(--text-heading-lg)]
                    font-medium
                    leading-[0.95]
                    tracking-[var(--tracking-tight)]
                    text-[var(--color-text)]
                  "
                >
                  Featured pieces.
                </h2>

                <p className="mt-4 max-w-lg font-body text-sm leading-7 text-[var(--color-text-secondary)]">
                  A considered selection of pieces chosen to define
                  the Aayesha point of view.
                </p>
              </div>

              <Link
                href="/shop"
                className="
                  link-luxury
                  group
                  inline-flex
                  items-center
                  gap-2
                  self-start
                  font-body
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[var(--tracking-wider)]
                  text-[var(--color-text)]
                  sm:self-auto
                "
              >
                View all pieces

                <ArrowUpRight
                  size={14}
                  strokeWidth={1.3}
                  className="transition-transform duration-[var(--duration-base)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 lg:mt-14 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-14">
              {featured.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          CLOSING STATEMENT
      ===================================================== */}

      <section className="border-t border-[var(--color-border-light)] bg-[var(--color-text)]">
        <div className="mx-auto max-w-[1200px] px-4 py-16 text-center sm:px-6 sm:py-20 lg:py-24">
          <p className="font-body text-[10px] font-semibold uppercase tracking-[var(--tracking-luxury)] text-[var(--color-accent-soft)]">
            Aayesha Fashion
          </p>

          <h2
            className="
              mx-auto
              mt-5
              max-w-3xl
              font-display
              text-[clamp(2.75rem,6vw,5.5rem)]
              font-medium
              leading-[0.9]
              tracking-[var(--tracking-tight)]
              text-[var(--color-text-inverse)]
            "
          >
            Style that feels distinctly yours.
          </h2>

          <Link
            href="/shop"
            className="
              mt-8
              inline-flex
              min-h-12
              items-center
              justify-center
              gap-3
              border
              border-[var(--color-text-inverse)]/30
              px-6
              py-3.5
              font-body
              text-[10px]
              font-semibold
              uppercase
              tracking-[var(--tracking-wider)]
              text-[var(--color-text-inverse)]
              transition-all
              duration-[var(--duration-base)]
              hover:border-[var(--color-accent-soft)]
              hover:text-[var(--color-accent-soft)]
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--color-accent-soft)]
              focus:ring-offset-2
              focus:ring-offset-[var(--color-text)]
            "
          >
            Shop the collection

            <ArrowRight
              size={14}
              strokeWidth={1.3}
            />
          </Link>
        </div>
      </section>
    </main>
  );
}