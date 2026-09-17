"use client";

import {
  useEffect,
  useMemo,
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
  ProductSort,
} from "@/types/product";

import { ShopFilters } from "@/components/shop/shop-filters";

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

function getCollectionContext() {
  if (typeof window === "undefined") {
    return {
      pathname: "/shop",
      isNew: false,
      isBestSeller: false,
    };
  }

  const pathname = window.location.pathname;

  const params = new URLSearchParams(
    window.location.search,
  );

  const isNew =
    pathname === "/collections/new-arrivals" ||
    params.get("isNew") === "true";

  const isBestSeller =
    pathname === "/collections/best-sellers" ||
    params.get("isBestSeller") === "true";

  return {
    pathname,
    isNew,
    isBestSeller,
  };
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
  selectedCategory,
  selectedSort = "relevance",
}: ShopHeaderProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false);

  const [sortOpen, setSortOpen] =
    useState(false);

  const sortRef =
    useRef<HTMLDivElement>(null);

  const collectionContext =
    useMemo(
      () => getCollectionContext(),
      [],
    );

  const activeSort =
    sortOptions.find(
      (item) =>
        item.value === selectedSort,
    ) ?? sortOptions[0];

  /* ==========================================================
     COLLECTION CONTENT
  ========================================================== */

  const collectionContent = useMemo(() => {
    if (collectionContext.isNew) {
      return {
        eyebrow: "The New Edit",
        title: "New Arrivals",
        description:
          "Discover the latest Aayesha Fashion pieces, thoughtfully selected for the season ahead.",
        noteLabel: "Freshly curated",
        note:
          "New silhouettes and considered details introduced for the modern Indian wardrobe.",
      };
    }

    if (
      collectionContext.isBestSeller
    ) {
      return {
        eyebrow: "Most Loved",
        title: "Best Sellers",
        description:
          "Explore the pieces our customers keep coming back to — timeless styles chosen for their exceptional appeal.",
        noteLabel: "Customer favourites",
        note:
          "Signature pieces that continue to define the Aayesha Fashion edit.",
      };
    }

    return {
      eyebrow: "Aayesha Fashion",
      title: "The Collection",
      description:
        "A considered edit of refined Indian silhouettes, contemporary essentials and occasion dressing designed with a timeless point of view.",
      noteLabel: "Curated",
      note:
        "Designed for modern Indian wardrobes, from everyday elegance to celebrations.",
    };
  }, [
    collectionContext.isNew,
    collectionContext.isBestSeller,
  ]);

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
    const {
      pathname,
    } = getCollectionContext();

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

    if (
      pathname ===
      "/collections/new-arrivals"
    ) {
      params.delete("isNew");
      params.delete("isBestSeller");
    }

    if (
      pathname ===
      "/collections/best-sellers"
    ) {
      params.delete("isNew");
      params.delete("isBestSeller");
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
          COLLECTION INTRO
      ===================================================== */}

      <section
        className="
          border-b
          border-[var(--color-border)]
          bg-[var(--color-bg)]
        "
      >
        <div
          className="
            mx-auto
            max-w-[1600px]
            px-5
            pb-12
            pt-12

            sm:px-8
            sm:pb-14
            sm:pt-14

            lg:px-14
            lg:pb-16
            lg:pt-16

            xl:px-20
          "
        >
          <div
            className="
              grid
              gap-9
              md:grid-cols-[minmax(0,1fr)_260px]
              md:items-end
              lg:grid-cols-[minmax(0,1fr)_280px]
            "
          >
            {/* TITLE */}

            <div>
              <div
                className="
                  mb-5
                  flex
                  items-center
                  gap-3
                "
              >
                <span
                  className="
                    h-px
                    w-8
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
                    tracking-[0.24em]
                    text-[var(--color-accent)]
                  "
                >
                  {collectionContent.eyebrow}
                </span>
              </div>

              <h1
                className="
                  font-display
                  text-[clamp(3rem,6vw,5.75rem)]
                  font-medium
                  leading-[0.9]
                  tracking-[-0.035em]
                  text-[var(--color-text)]
                "
              >
                {collectionContent.title}
              </h1>

              <p
                className="
                  mt-6
                  max-w-[610px]
                  font-body
                  text-[12px]
                  leading-6
                  text-[var(--color-text-secondary)]

                  sm:text-[13px]
                  sm:leading-7
                "
              >
                {collectionContent.description}
              </p>
            </div>

            {/* EDITORIAL NOTE */}

            <div
              className="
                hidden
                border-l
                border-[var(--color-border)]
                pb-1
                pl-6
                md:block
              "
            >
              <p
                className="
                  font-body
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-[var(--color-accent)]
                "
              >
                {collectionContent.noteLabel}
              </p>

              <p
                className="
                  mt-2
                  font-body
                  text-[11px]
                  leading-6
                  text-[var(--color-text-muted)]
                "
              >
                {collectionContent.note}
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
          z-[var(--z-header)]
          border-b
          border-[var(--color-border)]
          bg-[var(--color-bg)]/95
          backdrop-blur-md

          sm:top-[78px]

          md:top-[82px]
        "
      >
        <div
          className="
            mx-auto
            flex
            min-h-[64px]
            max-w-[1600px]
            items-center
            justify-between
            px-5

            sm:px-8

            lg:px-14

            xl:px-20
          "
        >
          {/* LEFT */}

          <div
            className="
              flex
              items-center
              gap-5
            "
          >
            <button
              type="button"
              onClick={() =>
                setMobileFiltersOpen(true)
              }
              className="
                group
                inline-flex
                min-h-10
                items-center
                gap-2.5
                font-body
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-[var(--color-text)]
                lg:hidden
              "
            >
              <SlidersHorizontal
                size={15}
                strokeWidth={1.25}
                className="
                  transition-transform
                  duration-[var(--duration-base)]
                  group-hover:rotate-[-8deg]
                "
              />

              Filters
            </button>

            <div
              className="
                hidden
                items-center
                gap-3
                lg:flex
              "
            >
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
                  tracking-[0.18em]
                  text-[var(--color-text-secondary)]
                "
              >
                {collectionContent.title}
              </span>
            </div>
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
                group
                inline-flex
                min-h-10
                items-center
                gap-3
                border
                border-[var(--color-border)]
                bg-[var(--color-surface)]
                px-3.5
                font-body
                text-[10px]
                font-medium
                text-[var(--color-text)]
                transition-all
                duration-[var(--duration-base)]
                hover:border-[var(--color-border-dark)]
                hover:bg-[var(--color-surface-soft)]
                focus-visible:outline-none
                focus-visible:ring-1
                focus-visible:ring-[var(--color-text)]
                focus-visible:ring-offset-2

                sm:px-4
              "
            >
              <span
                className="
                  hidden
                  font-body
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-[var(--color-text-muted)]
                  sm:inline
                "
              >
                Sort
              </span>

              <span>
                {activeSort.label}
              </span>

              <ChevronDown
                size={13}
                strokeWidth={1.4}
                className={`
                  transition-transform
                  duration-[var(--duration-base)]
                  ${
                    sortOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
              />
            </button>

            {sortOpen && (
              <div
                role="menu"
                className="
                  absolute
                  right-0
                  top-[calc(100%+8px)]
                  z-[var(--z-dropdown)]
                  w-[245px]
                  overflow-hidden
                  border
                  border-[var(--color-border)]
                  bg-[var(--color-surface)]
                  shadow-[var(--shadow-lg)]
                "
              >
                <div
                  className="
                    border-b
                    border-[var(--color-border)]
                    px-5
                    py-4
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
                    Refine view
                  </p>

                  <p
                    className="
                      mt-1.5
                      font-display
                      text-[1.5rem]
                      font-medium
                      leading-none
                      text-[var(--color-text)]
                    "
                  >
                    Sort by
                  </p>
                </div>

                <div className="p-1.5">
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
                            group/item
                            flex
                            min-h-11
                            w-full
                            items-center
                            justify-between
                            px-3.5
                            py-3
                            text-left
                            font-body
                            transition-colors
                            duration-[var(--duration-fast)]

                            ${
                              active
                                ? "bg-[var(--color-bg-soft)] text-[var(--color-text)]"
                                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-text)]"
                            }
                          `}
                        >
                          <span
                            className={
                              active
                                ? "text-[11px] font-semibold"
                                : "text-[11px]"
                            }
                          >
                            {option.label}
                          </span>

                          <span
                            className={`
                              h-1.5
                              w-1.5
                              bg-[var(--color-accent)]
                              transition-all
                              duration-[var(--duration-fast)]
                              ${
                                active
                                  ? "scale-100 opacity-100"
                                  : "scale-50 opacity-0"
                              }
                            `}
                            aria-hidden="true"
                          />
                        </button>
                      );
                    },
                  )}
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
        <div
          className="
            fixed
            inset-0
            z-[var(--z-drawer)]
            lg:hidden
          "
          role="dialog"
          aria-modal="true"
          aria-label="Product filters"
        >
          <button
            type="button"
            aria-label="Close filters"
            onClick={() =>
              setMobileFiltersOpen(false)
            }
            className="
              absolute
              inset-0
              bg-[var(--color-text)]/40
              backdrop-blur-[2px]
            "
          />

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
              bg-[var(--color-surface)]
              shadow-[var(--shadow-lg)]
            "
          >
            <div
              className="
                flex
                shrink-0
                items-center
                justify-between
                border-b
                border-[var(--color-border)]
                px-5
                py-5
              "
            >
              <div>
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
                  Refine
                </p>

                <h2
                  className="
                    mt-1
                    font-display
                    text-[2rem]
                    font-medium
                    leading-none
                    text-[var(--color-text)]
                  "
                >
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
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  border
                  border-[var(--color-border)]
                  text-[var(--color-text)]
                  transition-all
                  duration-[var(--duration-base)]
                  hover:border-[var(--color-text)]
                  hover:bg-[var(--color-bg-soft)]
                  focus-visible:outline-none
                  focus-visible:ring-1
                  focus-visible:ring-[var(--color-text)]
                "
              >
                <X
                  size={17}
                  strokeWidth={1.25}
                />
              </button>
            </div>

            <div
              className="
                min-h-0
                flex-1
                overflow-y-auto
                px-5
              "
            >
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

            <div
              className="
                shrink-0
                border-t
                border-[var(--color-border)]
                bg-[var(--color-surface)]
                p-4
              "
            >
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
                  bg-[var(--color-text)]
                  px-5
                  font-body
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-[var(--color-text-inverse)]
                  transition-all
                  duration-[var(--duration-base)]
                  hover:bg-[var(--color-accent-dark)]
                  focus-visible:outline-none
                  focus-visible:ring-1
                  focus-visible:ring-[var(--color-text)]
                  focus-visible:ring-offset-2
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