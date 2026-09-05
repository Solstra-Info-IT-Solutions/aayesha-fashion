"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ChevronDown,
  SlidersHorizontal,
  X,
} from "lucide-react";

import type {
  Product,
  ProductCategory,
  ProductSort,
} from "@/types/product";

import { ShopFilters } from "@/components/shop/shop-filters";

interface ShopHeaderProps {
  products?: Product[];
  selectedCategory?: ProductCategory;
  selectedSort?: ProductSort;
}

const sortOptions: {
  value: ProductSort;
  label: string;
}[] = [
  {
    value: "relevance",
    label: "Relevance",
  },
  {
    value: "newest",
    label: "Newest",
  },
  {
    value: "featured",
    label: "Featured",
  },
  {
    value: "best-selling",
    label: "Best Selling",
  },
  {
    value: "price-low",
    label: "Price: Low to High",
  },
  {
    value: "price-high",
    label: "Price: High to Low",
  },
  {
    value: "rating",
    label: "Top Rated",
  },
];

export function ShopHeader({
  products = [],
  selectedCategory,
  selectedSort = "relevance",
}: ShopHeaderProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false);

  const [sortOpen, setSortOpen] = useState(false);

  const sortRef = useRef<HTMLDivElement>(null);

  const activeSort =
    sortOptions.find(
      (item) => item.value === selectedSort,
    ) ?? sortOptions[0];

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        sortRef.current &&
        !sortRef.current.contains(
          event.target as Node,
        )
      ) {
        setSortOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSortOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );

      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, []);

  function handleSortChange(value: ProductSort) {
    const params = new URLSearchParams(
      window.location.search,
    );

    if (value === "relevance") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    setSortOpen(false);

    const query = params.toString();

    window.location.href = query
      ? `/shop?${query}`
      : "/shop";
  }

  return (
    <>
      {/* =====================================================
          COLLECTION INTRO
      ===================================================== */}

      <section className="border-b border-[var(--color-border)] bg-[var(--color-ivory)]">
        <div
          className="
            mx-auto
            max-w-[1600px]
            px-5
            pb-10
            pt-11

            sm:px-8
            sm:pb-12
            sm:pt-14

            lg:px-14
            lg:pb-14
            lg:pt-16

            xl:px-20
          "
        >
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            {/* -------------------------------------------------
                TITLE
            ------------------------------------------------- */}

            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-7 bg-[var(--color-rose-dark)]" />

                <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[var(--color-text-secondary)]">
                  Aayesha Fashion
                </span>
              </div>

              <h1
                className="
                  font-serif
                  text-[2.8rem]
                  leading-[0.94]
                  tracking-[-0.035em]
                  text-[var(--color-charcoal)]

                  sm:text-[3.6rem]

                  lg:text-[4.4rem]
                "
              >
                The Collection
              </h1>

              <p
                className="
                  mt-5
                  max-w-[600px]
                  text-[13px]
                  leading-6
                  text-[var(--color-text-secondary)]

                  sm:text-[14px]
                  sm:leading-7
                "
              >
                A considered edit of refined Indian
                silhouettes, contemporary essentials and
                occasion dressing designed with a timeless
                point of view.
              </p>
            </div>

            {/* -------------------------------------------------
                EDITORIAL NOTE
            ------------------------------------------------- */}

            <div className="hidden max-w-[230px] pb-1 md:block">
              <p className="text-right text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Curated
              </p>

              <p className="mt-2 text-right text-xs leading-5 text-[var(--color-text-secondary)]">
                Designed for modern Indian wardrobes,
                from everyday elegance to celebrations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          COLLECTION TOOLBAR
      ===================================================== */}

      <div
        className="
          sticky
          top-[74px]
          z-30
          border-b
          border-[var(--color-border)]
          bg-[var(--color-ivory)]

          sm:top-[78px]

          md:top-[82px]
        "
      >
        <div
          className="
            mx-auto
            flex
            min-h-[62px]
            max-w-[1600px]
            items-center
            justify-between
            px-5

            sm:px-8

            lg:px-14

            xl:px-20
          "
        >
          {/* -------------------------------------------------
              LEFT SIDE
          ------------------------------------------------- */}

          <div className="flex items-center gap-5">
            {/* MOBILE FILTER */}
            <button
              type="button"
              onClick={() =>
                setMobileFiltersOpen(true)
              }
              className="
                group
                inline-flex
                items-center
                gap-2.5
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.17em]
                text-[var(--color-charcoal)]
                lg:hidden
              "
            >
              <SlidersHorizontal
                size={15}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:rotate-[-8deg]"
              />

              Filters
            </button>

            {/* DESKTOP COLLECTION INDICATOR */}
            <div className="hidden items-center gap-3 lg:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-rose-dark)]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[var(--color-text-secondary)]">
                Collection
              </span>
            </div>
          </div>

          {/* -------------------------------------------------
              SORT
          ------------------------------------------------- */}

          <div
            ref={sortRef}
            className="relative"
          >
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={sortOpen}
              onClick={() =>
                setSortOpen((current) => !current)
              }
              className="
                group
                inline-flex
                min-h-10
                items-center
                gap-2.5
                border
                border-[var(--color-border)]
                bg-[var(--color-ivory)]
                px-3.5
                text-[11px]
                font-medium
                text-[var(--color-charcoal)]
                transition-all
                duration-200
                hover:border-[var(--color-border-dark)]

                sm:px-4
              "
            >
              <span className="hidden text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)] sm:inline">
                Sort
              </span>

              <span>{activeSort.label}</span>

              <ChevronDown
                size={14}
                strokeWidth={1.6}
                className={`transition-transform duration-200 ${
                  sortOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {/* -------------------------------------------------
                SORT MENU
            ------------------------------------------------- */}

            {sortOpen && (
              <div
                role="menu"
                className="
                  absolute
                  right-0
                  top-[calc(100%+8px)]
                  z-50
                  w-[235px]
                  overflow-hidden
                  border
                  border-[var(--color-border)]
                  bg-[var(--color-ivory)]
                  shadow-[0_20px_55px_rgba(23,23,23,0.12)]
                "
              >
                {/* MENU HEADER */}

                <div className="border-b border-[var(--color-border)] px-5 py-4">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
                    Refine view
                  </p>

                  <p className="mt-1.5 font-serif text-lg text-[var(--color-charcoal)]">
                    Sort by
                  </p>
                </div>

                {/* OPTIONS */}

                <div className="p-1.5">
                  {sortOptions.map((option) => {
                    const active =
                      option.value === selectedSort;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="menuitem"
                        onClick={() =>
                          handleSortChange(
                            option.value,
                          )
                        }
                        className={`
                          group/item
                          flex
                          w-full
                          items-center
                          justify-between
                          px-3.5
                          py-3
                          text-left
                          transition-colors
                          duration-200

                          ${
                            active
                              ? "bg-[var(--color-cream)] text-[var(--color-charcoal)]"
                              : "text-[var(--color-text-secondary)] hover:bg-[var(--color-cream)] hover:text-[var(--color-charcoal)]"
                          }
                        `}
                      >
                        <span
                          className={
                            active
                              ? "text-sm font-medium"
                              : "text-sm"
                          }
                        >
                          {option.label}
                        </span>

                        <span
                          className={`
                            h-1.5
                            w-1.5
                            rounded-full
                            bg-[var(--color-rose-dark)]
                            transition-all
                            duration-200
                            ${
                              active
                                ? "scale-100 opacity-100"
                                : "scale-50 opacity-0"
                            }
                          `}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          MOBILE FILTER DRAWER
      ===================================================== */}

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          {/* BACKDROP */}

          <button
            type="button"
            aria-label="Close filters"
            onClick={() =>
              setMobileFiltersOpen(false)
            }
            className="
              absolute
              inset-0
              bg-black/30
              transition-opacity
            "
          />

          {/* DRAWER */}

          <div
            className="
              absolute
              right-0
              top-0
              flex
              h-full
              w-[90%]
              max-w-[430px]
              flex-col
              bg-[var(--color-ivory)]
              shadow-[-18px_0_55px_rgba(23,23,23,0.12)]
            "
          >
            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-5">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  Refine
                </p>

                <h2 className="mt-1 font-serif text-[1.8rem] leading-none text-[var(--color-charcoal)]">
                  Filters
                </h2>
              </div>

              <button
                type="button"
                aria-label="Close filters"
                onClick={() =>
                  setMobileFiltersOpen(false)
                }
                className="
                  grid
                  size-9
                  place-items-center
                  border
                  border-[var(--color-border)]
                  text-[var(--color-charcoal)]
                  transition-colors
                  hover:border-[var(--color-charcoal)]
                "
              >
                <X
                  size={16}
                  strokeWidth={1.5}
                />
              </button>
            </div>

            {/* FILTER CONTENT */}

            <div className="min-h-0 flex-1 overflow-y-auto px-5">
              <ShopFilters
                products={products}
                selectedCategory={
                  selectedCategory
                }
                mobile
                onClose={() =>
                  setMobileFiltersOpen(false)
                }
              />
            </div>

            {/* BOTTOM ACTION */}

            <div className="border-t border-[var(--color-border)] bg-[var(--color-ivory)] p-4">
              <button
                type="button"
                onClick={() =>
                  setMobileFiltersOpen(false)
                }
                className="
                  flex
                  min-h-12
                  w-full
                  items-center
                  justify-center
                  bg-[var(--color-charcoal)]
                  px-5
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-white
                  transition-colors
                  hover:bg-[var(--color-soft-charcoal)]
                "
              >
                View Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}