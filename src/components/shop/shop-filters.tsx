"use client";

import {
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  ChevronDown,
  RotateCcw,
} from "lucide-react";

import type {
  Product,
  ProductCategory,
  ProductType,
} from "@/types/product";

import {
  getProductColors,
  getProductSizes,
} from "@/types/product";

interface ShopFiltersProps {
  products: Product[];
  selectedCategory?: ProductCategory;
  mobile?: boolean;
  onClose?: () => void;
}

type FilterSection =
  | "category"
  | "type"
  | "color"
  | "size"
  | "price"
  | "availability";

const categoryLabels: Record<
  ProductCategory,
  string
> = {
  festive: "Festive",
  ethnic: "Ethnic",
  contemporary: "Contemporary",
  "new-arrival": "New Arrivals",
};

const productTypeLabels: Record<
  ProductType,
  string
> = {
  anarkali: "Anarkali",
  kurta: "Kurta",
  "kurta-set": "Kurta Set",
  "suit-set": "Suit Set",
  lehenga: "Lehenga",
  saree: "Saree",
  dress: "Dress",
  top: "Top",
  bottom: "Bottom",
  "co-ord": "Co-ord",
  jacket: "Jacket",
  dupatta: "Dupatta",
  other: "Other",
};

const availabilityLabels = {
  "in-stock": "In Stock",
  low: "Low Stock",
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
  type: "Product Type",
  color: "Color",
  size: "Size",
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

  if (
    getCollectionBasePath() ===
    "/collections/new-arrivals"
  ) {
    params.delete("isNew");
    params.delete("isBestSeller");
  }

  if (
    getCollectionBasePath() ===
    "/collections/best-sellers"
  ) {
    params.delete("isNew");
    params.delete("isBestSeller");
  }

  const query =
    params.toString();

  return query
    ? `${getCollectionBasePath()}?${query}`
    : getCollectionBasePath();
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
      "type",
      "color",
      "size",
      "price",
      "availability",
    ]);

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

  const categoryOptions =
    useMemo(() => {
      const values =
        new Set<ProductCategory>();

      products.forEach((product) => {
        values.add(product.category);
      });

      return Array.from(values);
    }, [products]);

  const typeOptions =
    useMemo(() => {
      const values =
        new Set<ProductType>();

      products.forEach((product) => {
        values.add(product.productType);
      });

      return Array.from(values);
    }, [products]);

  const colorOptions =
    useMemo(() => {
      const map =
        new Map<
          string,
          {
            id: string;
            name: string;
            hex?: string;
          }
        >();

      products.forEach((product) => {
        getProductColors(product).forEach(
          (color) => {
            if (!map.has(color.id)) {
              map.set(color.id, {
                id: color.id,
                name: color.name,
                hex: color.hex,
              });
            }
          },
        );
      });

      return Array.from(map.values());
    }, [products]);

  const sizeOptions =
    useMemo(() => {
      const map =
        new Map<
          string,
          {
            code: string;
            label: string;
          }
        >();

      products.forEach((product) => {
        getProductSizes(product).forEach(
          (size) => {
            if (!map.has(size.code)) {
              map.set(size.code, {
                code: size.code,
                label: size.label,
              });
            }
          },
        );
      });

      return Array.from(map.values());
    }, [products]);

  const availabilityOptions =
    useMemo(() => {
      const values =
        new Set<
          | "in-stock"
          | "low"
          | "out-of-stock"
        >();

      products.forEach((product) => {
        const availableVariants =
          product.variants.filter(
            (variant) =>
              variant.status === "active" &&
              variant.inventory.stock >
                variant.inventory.reserved,
          );

        if (
          availableVariants.length === 0
        ) {
          values.add("out-of-stock");
          return;
        }

        const hasLowStock =
          availableVariants.some(
            (variant) => {
              const available =
                variant.inventory.stock -
                variant.inventory.reserved;

              return (
                available <=
                variant.inventory
                  .lowStockThreshold
              );
            },
          );

        if (hasLowStock) {
          values.add("low");
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
        {/* CATEGORY */}

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
                  category;

                const count =
                  products.filter(
                    (product) =>
                      product.category ===
                      category,
                  ).length;

                return (
                  <Link
                    key={category}
                    href={buildFilterHref(
                      "category",
                      category,
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

                      {
                        categoryLabels[
                          category
                        ]
                      }
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

        {/* PRODUCT TYPE */}

        <FilterSectionUI
          title={sectionLabels.type}
          open={openSections.includes(
            "type",
          )}
          onToggle={() =>
            toggleSection("type")
          }
        >
          <div className="space-y-0.5">
            {typeOptions.map(
              (type) => (
                <Link
                  key={type}
                  href={buildFilterHref(
                    "type",
                    type,
                  )}
                  onClick={onClose}
                  className="
                    flex
                    min-h-10
                    items-center
                    py-2
                    font-body
                    text-[11px]
                    text-[var(--color-text-secondary)]
                    transition-colors
                    duration-[var(--duration-fast)]
                    hover:text-[var(--color-text)]
                  "
                >
                  {
                    productTypeLabels[
                      type
                    ]
                  }
                </Link>
              ),
            )}
          </div>
        </FilterSectionUI>

        {/* COLOR */}

        <FilterSectionUI
          title={sectionLabels.color}
          open={openSections.includes(
            "color",
          )}
          onToggle={() =>
            toggleSection("color")
          }
        >
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {colorOptions.map(
              (color) => (
                <Link
                  key={color.id}
                  href={buildFilterHref(
                    "color",
                    color.id,
                  )}
                  onClick={onClose}
                  className="
                    group
                    flex
                    min-h-10
                    min-w-0
                    items-center
                    gap-2.5
                    py-2
                    font-body
                    text-[10px]
                    text-[var(--color-text-secondary)]
                    transition-colors
                    duration-[var(--duration-fast)]
                    hover:text-[var(--color-text)]
                  "
                >
                  <span
                    className="
                      relative
                      h-5
                      w-5
                      shrink-0
                      overflow-hidden
                      rounded-full
                      border
                      border-[var(--color-border-dark)]
                      transition-transform
                      duration-[var(--duration-fast)]
                      group-hover:scale-105
                    "
                    style={{
                      backgroundColor:
                        color.hex ??
                        "#e8e3de",
                    }}
                    aria-hidden="true"
                  />

                  <span className="truncate">
                    {color.name}
                  </span>
                </Link>
              ),
            )}
          </div>
        </FilterSectionUI>

        {/* SIZE */}

        <FilterSectionUI
          title={sectionLabels.size}
          open={openSections.includes(
            "size",
          )}
          onToggle={() =>
            toggleSection("size")
          }
        >
          <div className="flex flex-wrap gap-1.5">
            {sizeOptions.map(
              (size) => (
                <Link
                  key={size.code}
                  href={buildFilterHref(
                    "size",
                    size.code,
                  )}
                  onClick={onClose}
                  className="
                    flex
                    min-h-9
                    min-w-10
                    items-center
                    justify-center
                    border
                    border-[var(--color-border)]
                    bg-[var(--color-surface)]
                    px-2.5
                    font-body
                    text-[10px]
                    font-medium
                    text-[var(--color-text)]
                    transition-all
                    duration-[var(--duration-fast)]
                    hover:border-[var(--color-text)]
                    hover:bg-[var(--color-bg-soft)]
                    focus-visible:outline-none
                    focus-visible:ring-1
                    focus-visible:ring-[var(--color-text)]
                  "
                >
                  {size.label}
                </Link>
              ),
            )}
          </div>
        </FilterSectionUI>

        {/* PRICE */}

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

        {/* AVAILABILITY */}

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
                  href={buildFilterHref(
                    "availability",
                    status,
                  )}
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
                          : status === "low"
                            ? "bg-[var(--color-warning)]"
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