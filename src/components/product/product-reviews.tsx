"use client";

import { Star } from "lucide-react";

import type { Product } from "@/types/product";

interface ProductReviewsProps {
  product: Product;
}

export function ProductReviews({
  product,
}: ProductReviewsProps) {
  const reviews = product.reviews;

  if (!reviews) {
    return (
      <div className="py-6">
        <p className="text-sm text-[var(--color-text-muted)]">
          Reviews will appear here as customers share their
          experience.
        </p>
      </div>
    );
  }

  const breakdown = [
    { star: 5, count: reviews.breakdown?.[5] ?? 0 },
    { star: 4, count: reviews.breakdown?.[4] ?? 0 },
    { star: 3, count: reviews.breakdown?.[3] ?? 0 },
    { star: 2, count: reviews.breakdown?.[2] ?? 0 },
    { star: 1, count: reviews.breakdown?.[1] ?? 0 },
  ];

  const total = breakdown.reduce(
    (sum, item) => sum + item.count,
    0,
  );

  return (
    <div className="space-y-7">
      <div className="grid gap-6 sm:grid-cols-[150px_1fr]">
        <div>
          <div className="font-[var(--font-cormorant)] text-5xl leading-none">
            {reviews.averageRating.toFixed(1)}
          </div>

          <div className="mt-3 flex gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                size={14}
                fill={
                  index < Math.round(reviews.averageRating)
                    ? "currentColor"
                    : "none"
                }
                className="text-[var(--color-charcoal)]"
              />
            ))}
          </div>

          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            {reviews.reviewCount} reviews
          </p>
        </div>

        <div className="space-y-2">
          {breakdown.map((item) => {
            const percentage =
              total > 0 ? (item.count / total) * 100 : 0;

            return (
              <div
                key={item.star}
                className="flex items-center gap-3"
              >
                <span className="w-7 text-xs">
                  {item.star}
                </span>

                <div className="h-1.5 flex-1 bg-[var(--color-warm-gray)]">
                  <div
                    className="h-full bg-[var(--color-charcoal)]"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

                <span className="w-7 text-right text-[10px] text-[var(--color-text-muted)]">
                  {item.count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-[var(--color-border)] pt-5">
        <p className="text-xs leading-6 text-[var(--color-text-muted)]">
          Detailed customer reviews can be connected to the
          reviews API/admin system later without changing the
          overall PDP structure.
        </p>
      </div>
    </div>
  );
}