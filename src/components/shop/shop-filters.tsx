"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  ChevronDown,
  RotateCcw,
} from "lucide-react";

import type { Product } from "@/types/product";
import { getInventoryStatus } from "@/types/product";

import { getCategories } from "@/services/category.service";
import type { Category } from "@/types/category";

interface ShopFiltersProps {
  products: Product[];
  selectedCategory?: string;
  mobile?: boolean;
  onClose?: () => void;
}

type FilterSection =
  | "category"
  | "price"
  | "availability";

const availabilityLabels = {
  "in-stock": "In Stock",
  "out-of-stock": "Out of Stock",
} as const;

const priceRanges = [
  {
    label: "Under ₹5,000",
    min: 0,
    max: 5000,
  },
  {
    label: "₹5,000 – ₹8,000",
    min: 5000,
    max: 8000,
  },
  {
    label: "₹8,000 – ₹12,000",
    min: 8000,
    max: 12000,
  },
  {
    label: "Above ₹12,000",
    min: 12000,
    max: Infinity,
  },
];

const sectionLabels: Record<
  FilterSection,
  string
> = {
  category: "Category",
  price: "Price",
  availability: "Availability",
};

function getCollectionBasePath() {
  if (typeof window === "undefined") {
    return "/shop";
  }

  const pathname =
    window.location.pathname;

  if (
    pathname ===
    "/collections/new-arrivals"
  ) {
    return "/collections/new-arrivals";
  }

  if (
    pathname ===
    "/collections/best-sellers"
  ) {
    return "/collections/best-sellers";
  }

  return "/shop";
}

function buildFilterHref(
  key: string,
  value: string,
) {
  const params =
    new URLSearchParams(
      window.location.search,
    );

  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }

  const query =
    params.toString();

  return query
    ? `${getCollectionBasePath()}?${query}`
    : getCollectionBasePath();
}

function formatCategoryName(
  category: Category,
): string {
  return category.name;
}

export function ShopFilters({
  products,
  selectedCategory,
  mobile = false,
  onClose,
}: ShopFiltersProps) {
  const [openSections, setOpenSections] =
    useState<FilterSection[]>([
      "category",
      "price",
      "availability",
    ]);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const initialPrice =
    typeof window !== "undefined"
      ? (() => {
          const params =
            new URLSearchParams(
              window.location.search,
            );

          const min =
            params.get("minPrice");

          const max =
            params.get("maxPrice");

          return (
            priceRanges.find(
              (range) =>
                String(range.min) === min &&
                String(range.max) === max,
            )?.label ?? null
          );
        })()
      : null;

  const [
    selectedPrice,
    setSelectedPrice,
  ] = useState<string | null>(
    initialPrice,
  );

  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      try {
        const result =
          await getCategories();

        if (mounted) {
          setCategories(result);
        }
      } catch {
        if (mounted) {
          setCategories([]);
        }
      }
    }

    loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  const categoryOptions =
    useMemo(() => {
      if (categories.length > 0) {
        return categories;
      }

      const ids = new Set<string>();

      products.forEach((product) => {
        if (product.categoryId) {
          ids.add(product.categoryId);
        }
      });

      return Array.from(ids).map(
        (id) =>
          ({
            id,
            name: id,
            slug: id,
          }) as Category,
      );
    }, [categories, products]);

  const availabilityOptions =
    useMemo(() => {
      const values =
        new Set<
          "in-stock" | "out-of-stock"
        >();

      products.forEach((product) => {
        const status =
          getInventoryStatus(product);

        if (
          status === "out-of-stock"
        ) {
          values.add("out-of-stock");
        } else {
          values.add("in-stock");
        }
      });

      return Array.from(values);
    }, [products]);

  function toggleSection(
    section: FilterSection,
  ) {
    setOpenSections((current) =>
      current.includes(section)
        ? current.filter(
            (item) => item !== section,
          )
        : [...current, section],
    );
  }

  function resetFilters() {
    setSelectedPrice(null);

    const pathname =
      getCollectionBasePath();

    window.location.href = pathname;
  }

  function handlePriceChange(
    label: string,
    min: number,
    max: number,
  ) {
    setSelectedPrice(label);

    const params =
      new URLSearchParams(
        window.location.search,
      );

    params.set(
      "minPrice",
      String(min),
    );

    if (Number.isFinite(max)) {
      params.set(
        "maxPrice",
        String(max),
      );
    } else {
      params.delete("maxPrice");
    }

    const pathname =
      getCollectionBasePath();

    const query =
      params.toString();

    window.location.href =
      query
        ? `${pathname}?${query}`
        : pathname;
  }

  return (
    <div
      className={
        mobile
          ? "pb-8"
          : "sticky top-[116px]"
      }
    >
      {/* =====================================================
          FILTER HEADER
      ===================================================== */}

      <div
        className="
          mb-5
          flex
          items-end
          justify-between
          gap-4
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
              text-[1.9rem]
              font-medium
              leading-none
              text-[var(--color-text)]
            "
          >
            Shop by
          </h2>
        </div>

        <button
          type="button"
          onClick={resetFilters}
          className="
            inline-flex
            min-h-9
            items-center
            gap-1.5
            font-body
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.14em]
            text-[var(--color-text-muted)]
            transition-colors
            duration-[var(--duration-fast)]
            hover:text-[var(--color-text)]
            focus-visible:outline-none
            focus-visible:ring-1
            focus-visible:ring-[var(--color-text)]
          "
        >
          <RotateCcw
            size={12}
            strokeWidth={1.4}
          />

          Reset
        </button>
      </div>

      {/* =====================================================
          FILTER SECTIONS
      ===================================================== */}

      <div
        className="
          divide-y
          divide-[var(--color-border)]
          border-y
          border-[var(--color-border)]
        "
      >
        {/* =================================================
            CATEGORY
        ================================================= */}

        <FilterSectionUI
          title={sectionLabels.category}
          open={openSections.includes(
            "category",
          )}
          onToggle={() =>
            toggleSection("category")
          }
        >
          <div className="space-y-0.5">
            {categoryOptions.map(
              (category) => {
                const active =
                  selectedCategory ===
                  category.id;

                const count =
                  products.filter(
                    (product) =>
                      product.categoryId ===
                      category.id,
                  ).length;

                return (
                  <Link
                    key={category.id}
                    href={buildFilterHref(
                      "category",
                      category.id,
                    )}
                    onClick={onClose}
                    className={`
                      group
                      flex
                      min-h-10
                      items-center
                      justify-between
                      gap-3
                      py-2
                      font-body
                      text-[11px]
                      transition-colors
                      duration-[var(--duration-fast)]
                      ${
                        active
                          ? "font-semibold text-[var(--color-text)]"
                          : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                      }
                    `}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className={`
                          h-1
                          w-1
                          bg-[var(--color-accent)]
                          transition-opacity
                          ${
                            active
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-60"
                          }
                        `}
                        aria-hidden="true"
                      />

                      {formatCategoryName(
                        category,
                      )}
                    </span>

                    <span
                      className="
                        font-body
                        text-[9px]
                        text-[var(--color-text-muted)]
                      "
                    >
                      {count}
                    </span>
                  </Link>
                );
              },
            )}
          </div>
        </FilterSectionUI>

        {/* =================================================
            PRICE
        ================================================= */}

        <FilterSectionUI
          title={sectionLabels.price}
          open={openSections.includes(
            "price",
          )}
          onToggle={() =>
            toggleSection("price")
          }
        >
          <div className="space-y-0.5">
            {priceRanges.map(
              (range) => (
                <label
                  key={range.label}
                  className="
                    group
                    flex
                    min-h-10
                    cursor-pointer
                    items-center
                    gap-3
                    py-2
                  "
                >
                  <input
                    type="radio"
                    name={
                      mobile
                        ? "mobile-price"
                        : "desktop-price"
                    }
                    checked={
                      selectedPrice ===
                      range.label
                    }
                    onChange={() =>
                      handlePriceChange(
                        range.label,
                        range.min,
                        range.max,
                      )
                    }
                    className="
                      h-4
                      w-4
                      shrink-0
                      accent-[var(--color-accent-dark)]
                    "
                  />

                  <span
                    className={`
                      font-body
                      text-[11px]
                      transition-colors
                      ${
                        selectedPrice ===
                        range.label
                          ? "font-medium text-[var(--color-text)]"
                          : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-text)]"
                      }
                    `}
                  >
                    {range.label}
                  </span>
                </label>
              ),
            )}
          </div>
        </FilterSectionUI>

        {/* =================================================
            AVAILABILITY
        ================================================= */}

        <FilterSectionUI
          title={
            sectionLabels.availability
          }
          open={openSections.includes(
            "availability",
          )}
          onToggle={() =>
            toggleSection(
              "availability",
            )
          }
        >
          <div className="space-y-0.5">
            {availabilityOptions.map(
              (status) => (
                <Link
                  key={status}
                  href={
                    status === "in-stock"
                      ? buildFilterHref(
                          "availability",
                          status,
                        )
                      : buildFilterHref(
                          "availability",
                          "",
                        )
                  }
                  onClick={onClose}
                  className="
                    flex
                    min-h-10
                    items-center
                    gap-2.5
                    py-2
                    font-body
                    text-[11px]
                    text-[var(--color-text-secondary)]
                    transition-colors
                    duration-[var(--duration-fast)]
                    hover:text-[var(--color-text)]
                  "
                >
                  <span
                    className={`
                      h-1.5
                      w-1.5
                      shrink-0
                      ${
                        status ===
                        "in-stock"
                          ? "bg-[var(--color-success)]"
                          : "bg-[var(--color-text-muted)]"
                      }
                    `}
                    aria-hidden="true"
                  />

                  {
                    availabilityLabels[
                      status
                    ]
                  }
                </Link>
              ),
            )}
          </div>
        </FilterSectionUI>
      </div>

      {/* =====================================================
          EDITORIAL NOTE
      ===================================================== */}

      {!mobile && (
        <div
          className="
            mt-6
            border
            border-[var(--color-border)]
            bg-[var(--color-bg-soft)]
            p-5
          "
        >
          <p
            className="
              font-display
              text-[1.45rem]
              font-medium
              leading-none
              text-[var(--color-text)]
            "
          >
            Find your signature
            style
          </p>

          <p
            className="
              mt-2.5
              font-body
              text-[10px]
              leading-6
              text-[var(--color-text-secondary)]
            "
          >
            Explore refined silhouettes
            designed for celebrations,
            everyday elegance and modern
            Indian dressing.
          </p>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   FILTER SECTION UI
============================================================ */

interface FilterSectionUIProps {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FilterSectionUI({
  title,
  open,
  onToggle,
  children,
}: FilterSectionUIProps) {
  return (
    <div className="py-4">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="
          flex
          min-h-8
          w-full
          items-center
          justify-between
          gap-4
          text-left
          focus-visible:outline-none
          focus-visible:ring-1
          focus-visible:ring-[var(--color-text)]
        "
      >
        <span
          className="
            font-body
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.18em]
            text-[var(--color-text)]
          "
        >
          {title}
        </span>

        <ChevronDown
          size={14}
          strokeWidth={1.3}
          className={`
            shrink-0
            text-[var(--color-text-muted)]
            transition-transform
            duration-[var(--duration-base)]
            ${
              open
                ? "rotate-180"
                : ""
            }
          `}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="pt-4">
          {children}
        </div>
      )}
    </div>
  );
}