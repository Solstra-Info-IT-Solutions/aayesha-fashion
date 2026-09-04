"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";

const categories = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Festive",
    value: "festive",
  },
  {
    label: "Ethnic",
    value: "ethnic",
  },
  {
    label: "Contemporary",
    value: "contemporary",
  },
  {
    label: "New Arrivals",
    value: "new-arrivals",
  },
] as const;

const sortOptions = [
  {
    label: "Newest",
    value: "newest",
  },
  {
    label: "Price: Low to High",
    value: "price-low",
  },
  {
    label: "Price: High to Low",
    value: "price-high",
  },
  {
    label: "Name",
    value: "name",
  },
] as const;

export function ShopFilters() {
  const searchParams = useSearchParams();

  const activeCategory =
    searchParams.get("category") ?? "";

  const activeSort =
    searchParams.get("sort") ?? "newest";

  const [sortOpen, setSortOpen] = useState(false);

  function buildCategoryUrl(category: string) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    const query = params.toString();

    return query ? `/shop?${query}` : "/shop";
  }

  function buildSortUrl(sort: string) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("sort", sort);

    return `/shop?${params.toString()}`;
  }

  const selectedSort =
    sortOptions.find(
      (option) => option.value === activeSort
    )?.label ?? "Newest";

  return (
    <section className="border-y border-[var(--color-border)] bg-[var(--color-ivory)]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-6 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        {/* =====================================================
            CATEGORY NAVIGATION
        ===================================================== */}

        <div className="flex items-center gap-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-7">
          <SlidersHorizontal
            size={18}
            strokeWidth={1.3}
            className="shrink-0 text-[var(--color-charcoal)]"
            aria-hidden="true"
          />

          {categories.map((category) => {
            const active =
              activeCategory === category.value;

            return (
              <Link
                key={category.value || "all"}
                href={buildCategoryUrl(
                  category.value
                )}
                aria-current={
                  active ? "page" : undefined
                }
                className="
                  relative
                  shrink-0
                  py-2
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  transition-colors
                  duration-300
                "
              >
                <span
                  className={
                    active
                      ? "text-[var(--color-charcoal)]"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-charcoal)]"
                  }
                >
                  {category.label}
                </span>

                {active && (
                  <span
                    aria-hidden="true"
                    className="
                      absolute
                      bottom-0
                      left-0
                      h-px
                      w-full
                      bg-[var(--color-rose-dark)]
                    "
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* =====================================================
            SORT
        ===================================================== */}

        <div className="relative flex shrink-0 items-center gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
            Sort By
          </span>

          <button
            type="button"
            onClick={() =>
              setSortOpen((value) => !value)
            }
            aria-expanded={sortOpen}
            aria-haspopup="menu"
            className="
              inline-flex
              items-center
              gap-2
              border-b
              border-[var(--color-border-dark)]
              pb-1
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-[var(--color-charcoal)]
              transition-colors
              duration-300
              hover:border-[var(--color-charcoal)]
            "
          >
            <span>{selectedSort}</span>

            <ChevronDown
              size={14}
              strokeWidth={1.3}
              className={`transition-transform duration-300 ${
                sortOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* ===================================================
              SORT MENU
          =================================================== */}

          {sortOpen && (
            <div
              role="menu"
              className="
                absolute
                right-0
                top-full
                z-40
                mt-3
                min-w-[210px]
                overflow-hidden
                border
                border-[var(--color-border)]
                bg-[var(--color-ivory)]
                py-1
                shadow-[0_16px_50px_rgba(27,29,29,0.10)]
              "
            >
              {sortOptions.map((option) => {
                const active =
                  option.value === activeSort;

                return (
                  <Link
                    key={option.value}
                    href={buildSortUrl(
                      option.value
                    )}
                    role="menuitem"
                    onClick={() =>
                      setSortOpen(false)
                    }
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                      px-4
                      py-3
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.12em]
                      transition-colors
                      duration-200
                      hover:bg-[var(--color-cream)]
                    "
                  >
                    <span
                      className={
                        active
                          ? "text-[var(--color-charcoal)]"
                          : "text-[var(--color-text-secondary)]"
                      }
                    >
                      {option.label}
                    </span>

                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-rose-dark)]" />
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}