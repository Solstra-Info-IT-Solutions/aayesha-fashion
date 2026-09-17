"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ChevronDown,
} from "lucide-react";

import type {
  Product,
  ProductSort,
} from "@/types/product";

interface ShopHeaderProps {
  products?: Product[];
  selectedCategory?: string;
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

function getPageTitle() {
  if (typeof window === "undefined") {
    return "Shop";
  }

  const pathname = window.location.pathname;

  if (
    pathname === "/collections/new-arrivals"
  ) {
    return "New Arrivals";
  }

  if (
    pathname === "/collections/best-sellers"
  ) {
    return "Best Sellers";
  }

  if (pathname === "/shop") {
    return "Shop";
  }

  return "Shop";
}

function buildCurrentPath(
  pathname: string,
  params: URLSearchParams,
) {
  const query = params.toString();

  return query
    ? `${pathname}?${query}`
    : pathname;
}

export function ShopHeader({
  products = [],
  selectedSort = "relevance",
}: ShopHeaderProps) {
  const [sortOpen, setSortOpen] =
    useState(false);

  const sortRef =
    useRef<HTMLDivElement>(null);

  const pageTitle = useMemo(
    () => getPageTitle(),
    [],
  );

  const activeSort =
    sortOptions.find(
      (item) =>
        item.value === selectedSort,
    ) ?? sortOptions[0];

  /* ==========================================================
     OUTSIDE CLICK / ESCAPE
  ========================================================== */

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent,
    ) {
      if (
        sortRef.current &&
        !sortRef.current.contains(
          event.target as Node,
        )
      ) {
        setSortOpen(false);
      }
    }

    function handleEscape(
      event: KeyboardEvent,
    ) {
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

  /* ==========================================================
     SORT
  ========================================================== */

  function handleSortChange(
    value: ProductSort,
  ) {
    const pathname =
      window.location.pathname;

    const params =
      new URLSearchParams(
        window.location.search,
      );

    if (value === "relevance") {
      params.delete("sort");
    } else {
      params.set(
        "sort",
        value,
      );
    }

    setSortOpen(false);

    const destination =
      buildCurrentPath(
        pathname,
        params,
      );

    window.location.href =
      destination;
  }

  return (
    <>
      {/* =====================================================
          SIMPLE PAGE HEADER
      ===================================================== */}

      <div className="py-5 sm:py-6">
        <h1
          className="
            font-display
            text-[1.9rem]
            font-medium
            leading-none
            tracking-[-0.025em]
            text-[var(--color-text)]

            sm:text-[2.1rem]

            lg:text-[2.3rem]
          "
        >
          {pageTitle}
        </h1>
      </div>

      {/* =====================================================
          TOOLBAR
      ===================================================== */}

      <div
        className="
          flex
          min-h-[52px]
          items-center
          justify-between
          border-t
          border-[var(--color-border-light)]
        "
      >
        {/* PRODUCT COUNT */}

        <div className="flex items-center gap-2.5">
          <span
            className="
              h-1.5
              w-1.5
              bg-[var(--color-accent)]
            "
            aria-hidden="true"
          />

          <span
            className="
              font-body
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.17em]
              text-[var(--color-text-secondary)]
            "
          >
            {products.length}{" "}
            {products.length === 1
              ? "Product"
              : "Products"}
          </span>
        </div>

        {/* SORT */}

        <div
          ref={sortRef}
          className="relative"
        >
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={sortOpen}
            onClick={() =>
              setSortOpen(
                (current) => !current,
              )
            }
            className="
              inline-flex
              min-h-9
              items-center
              gap-2.5
              border
              border-[var(--color-border-light)]
              bg-[var(--color-bg)]
              px-3
              font-body
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-[var(--color-text)]
              transition-colors
              duration-200
              hover:border-[var(--color-border-dark)]
            "
          >
            <span className="text-[var(--color-text-muted)]">
              Sort:
            </span>

            <span>
              {activeSort.label}
            </span>

            <ChevronDown
              size={12}
              strokeWidth={1.4}
              className={`
                transition-transform
                duration-200
                ${
                  sortOpen
                    ? "rotate-180"
                    : ""
                }
              `}
            />
          </button>

          {/* SORT MENU */}

          {sortOpen && (
            <div
              role="menu"
              className="
                absolute
                right-0
                top-[calc(100%+6px)]
                z-[var(--z-dropdown)]
                w-[210px]
                overflow-hidden
                border
                border-[var(--color-border)]
                bg-[var(--color-surface)]
                shadow-[var(--shadow-lg)]
              "
            >
              {sortOptions.map(
                (option) => {
                  const active =
                    option.value ===
                    selectedSort;

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
                        flex
                        min-h-10
                        w-full
                        items-center
                        justify-between
                        px-4
                        py-2.5
                        text-left
                        font-body
                        text-[10px]
                        transition-colors
                        duration-200
                        ${
                          active
                            ? "bg-[var(--color-bg-soft)] font-semibold text-[var(--color-text)]"
                            : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-text)]"
                        }
                      `}
                    >
                      <span>
                        {option.label}
                      </span>

                      {active && (
                        <span
                          className="
                            h-1.5
                            w-1.5
                            bg-[var(--color-accent)]
                          "
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                },
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}