import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/shared/container";
import { ProductCard } from "@/components/product/product-card";
import { signatureProducts } from "@/data/products";

export function SignatureEdit() {
  return (
    <section className="bg-[var(--color-ivory)]">
      <Container>
        <div className="py-24 sm:py-28 lg:py-32 xl:py-36">
          {/* TOP LINE */}
          <div className="border-t border-[var(--color-border)] pt-5 sm:pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-[var(--color-rose-dark)]" />

                <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[var(--color-text-muted)]">
                  The Signature Edit
                </p>
              </div>

              <span className="text-[9px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                03 Pieces
              </span>
            </div>
          </div>

          {/* SECTION HEADER */}
          <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-[1fr_320px] lg:items-end lg:gap-16">
            <div>
              <h2 className="font-display text-[3.8rem] leading-[0.9] tracking-[-0.045em] text-[var(--color-charcoal)] sm:text-7xl lg:text-[5.5rem] xl:text-[6.5rem]">
                The pieces
                <span className="block italic text-[var(--color-rose-dark)]">
                  we love now.
                </span>
              </h2>
            </div>

            <div className="border-l border-[var(--color-border)] pl-5 pb-1 sm:pl-6">
              <p className="text-sm leading-7 text-[var(--color-text-secondary)]">
                A refined selection of our most considered silhouettes,
                designed to make every occasion feel unforgettable.
              </p>
            </div>
          </div>

          {/* PRODUCTS */}
          <div className="mt-14 grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-x-7 sm:gap-y-14 lg:mt-20 lg:grid-cols-3 lg:gap-8 xl:gap-10">
            {signatureProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={index === 0}
              />
            ))}
          </div>

          {/* BOTTOM CTA */}
          <div className="mt-16 flex justify-center border-t border-[var(--color-border)] pt-8 sm:mt-20">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-charcoal)] transition-colors duration-300 hover:text-[var(--color-rose-dark)]"
            >
              Explore the complete collection

              <span className="flex h-10 w-10 items-center justify-center border border-[var(--color-charcoal)] transition-all duration-300 group-hover:border-[var(--color-rose-dark)] group-hover:bg-[var(--color-rose-dark)] group-hover:text-white">
                <ArrowUpRight
                  size={16}
                  strokeWidth={1.3}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}