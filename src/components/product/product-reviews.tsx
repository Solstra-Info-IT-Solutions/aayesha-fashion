"use client";

import { Star } from "lucide-react";

import type { Product } from "@/types/product";

interface ProductReviewsProps {
  product: Product;
}

export function ProductReviews({
  product,
}: ProductReviewsProps) {
  void product;

  return (
    <div className="border-y border-[var(--color-border)] py-8">
      <div className="flex items-start gap-4">
        <span
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            border
            border-[var(--color-border)]
            bg-[var(--color-bg-soft)]
            text-[var(--color-accent)]
          "
        >
          <Star
            size={15}
            strokeWidth={1.25}
          />
        </span>

        <div>
          <p
            className="
              font-body
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-[var(--color-text)]
            "
          >
            Customer Reviews
          </p>

          <p
            className="
              mt-2
              max-w-lg
              font-body
              text-[11px]
              leading-6
              text-[var(--color-text-muted)]
            "
          >
            Reviews will appear here as
            customers share their experience.
          </p>
        </div>
      </div>
    </div>
  );
}