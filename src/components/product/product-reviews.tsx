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

  const breakdown = [
    {
      star: 5,
      count: reviews.breakdown?.[5] ?? 0,
    },
    {
      star: 4,
      count: reviews.breakdown?.[4] ?? 0,
    },
    {
      star: 3,
      count: reviews.breakdown?.[3] ?? 0,
    },
    {
      star: 2,
      count: reviews.breakdown?.[2] ?? 0,
    },
    {
      star: 1,
      count: reviews.breakdown?.[1] ?? 0,
    },
  ];

  const total = breakdown.reduce(
    (sum, item) => sum + item.count,
    0,
  );

  return (
    <div className="space-y-8">
      {/* =====================================================
          REVIEW SUMMARY
      ===================================================== */}

      <div
        className="
          grid
          gap-8
          sm:grid-cols-[180px_1fr]
        "
      >
        {/* Rating */}
        <div
          className="
            border-r
            border-[var(--color-border)]
            pr-6
            sm:min-h-[150px]
          "
        >
          <p
            className="
              font-body
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-[var(--color-accent)]
            "
          >
            Customer rating
          </p>

          <div
            className="
              mt-3
              font-display
              text-[4rem]
              font-medium
              leading-none
              tracking-tight
              text-[var(--color-text)]
            "
          >
            {reviews.averageRating.toFixed(1)}
          </div>

          <div
            className="
              mt-4
              flex
              items-center
              gap-1
            "
            aria-label={`${reviews.averageRating.toFixed(
              1,
            )} out of 5 stars`}
          >
            {Array.from({ length: 5 }).map(
              (_, index) => {
                const filled =
                  index <
                  Math.round(
                    reviews.averageRating,
                  );

                return (
                  <Star
                    key={index}
                    size={13}
                    strokeWidth={1.25}
                    fill={
                      filled
                        ? "currentColor"
                        : "none"
                    }
                    className={
                      filled
                        ? "text-[var(--color-accent)]"
                        : "text-[var(--color-border-dark)]"
                    }
                    aria-hidden="true"
                  />
                );
              },
            )}
          </div>

          <p
            className="
              mt-2
              font-body
              text-[10px]
              text-[var(--color-text-muted)]
            "
          >
            Based on {reviews.reviewCount}{" "}
            {reviews.reviewCount === 1
              ? "review"
              : "reviews"}
          </p>
        </div>

        {/* Breakdown */}
        <div
          className="
            flex
            flex-col
            justify-center
            space-y-2.5
          "
        >
          <div className="mb-1">
            <p
              className="
                font-body
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-[var(--color-text-muted)]
              "
            >
              Rating breakdown
            </p>
          </div>

          {breakdown.map((item) => {
            const percentage =
              total > 0
                ? (item.count / total) * 100
                : 0;

            return (
              <div
                key={item.star}
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <span
                  className="
                    flex
                    w-7
                    shrink-0
                    items-center
                    gap-1
                    font-body
                    text-[10px]
                    text-[var(--color-text-secondary)]
                  "
                >
                  {item.star}
                  <Star
                    size={9}
                    strokeWidth={1.25}
                    fill="currentColor"
                    className="text-[var(--color-text-muted)]"
                    aria-hidden="true"
                  />
                </span>

                <div
                  className="
                    h-[3px]
                    flex-1
                    overflow-hidden
                    bg-[var(--color-border-light)]
                  "
                  aria-hidden="true"
                >
                  <div
                    className="
                      h-full
                      bg-[var(--color-accent)]
                      transition-[width]
                      duration-[var(--duration-luxury)]
                    "
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

                <span
                  className="
                    w-7
                    shrink-0
                    text-right
                    font-body
                    text-[9px]
                    text-[var(--color-text-muted)]
                  "
                >
                  {item.count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* =====================================================
          REVIEW NOTE
      ===================================================== */}

      <div
        className="
          border-t
          border-[var(--color-border)]
          pt-6
        "
      >
        <div
          className="
            flex
            items-start
            gap-3
          "
        >
          <span
            className="
              mt-0.5
              h-1.5
              w-1.5
              shrink-0
              bg-[var(--color-accent)]
            "
            aria-hidden="true"
          />

          <p
            className="
              max-w-2xl
              font-body
              text-[10px]
              leading-6
              text-[var(--color-text-muted)]
            "
          >
            Detailed customer reviews can be
            connected to the reviews API/admin
            system later without changing the
            overall PDP structure.
          </p>
        </div>
      </div>
    </div>
  );
}