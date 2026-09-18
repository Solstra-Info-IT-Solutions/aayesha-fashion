"use client";

import { useEffect, useMemo, useState } from "react";

import type { Product } from "@/types/product";
import { getAvailableStock } from "@/types/product";

import { getCategories } from "@/services/category.service";

import { ProductMediaGallery } from "@/components/product/product-media-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { ProductAccordion } from "@/components/product/product-accordion";
import { ProductDescription } from "@/components/product/product-description";
import { ProductSpecifications } from "@/components/product/product-specifications";
import { ProductReviews } from "@/components/product/product-reviews";
import { ProductRecommendations } from "@/components/product/product-recommendations";
import { ProductStickyBuyBar } from "@/components/product/product-sticky-buy-bar";

interface ProductDetailProps {
  product: Product;
  recommendations?: Product[];
}

function normalizeProduct(product: Product): Product {
  const safeProduct = product ?? ({} as Product);

  return {
    ...safeProduct,

    _id:
      safeProduct._id ??
      safeProduct.id ??
      "",

    id:
      safeProduct.id ??
      safeProduct._id ??
      "",

    slug:
      safeProduct.slug ??
      "",

    name:
      safeProduct.name ??
      "Product",

    categoryId:
      safeProduct.categoryId ??
      "",

    pricing: {
      mrp:
        safeProduct.pricing?.mrp ??
        0,

      sellingPrice:
        safeProduct.pricing?.sellingPrice ??
        0,

      currency:
        safeProduct.pricing?.currency ??
        "INR",
    },

    inventory: {
      stock:
        safeProduct.inventory?.stock ??
        0,

      reserved:
        safeProduct.inventory?.reserved ??
        0,

      lowStockThreshold:
        safeProduct.inventory
          ?.lowStockThreshold ??
        2,
    },

    content: {
      description:
        safeProduct.content
          ?.description ??
        "",

      descriptionFormat:
        safeProduct.content
          ?.descriptionFormat ??
        "plain",

      richContent:
        safeProduct.content
          ?.richContent,
    },

    media: Array.isArray(
      safeProduct.media,
    )
      ? safeProduct.media
      : [],

    merchandising: {
      isNew:
        safeProduct.merchandising
          ?.isNew ??
        false,

      isFeatured:
        safeProduct.merchandising
          ?.isFeatured ??
        false,

      isBestSeller:
        safeProduct.merchandising
          ?.isBestSeller ??
        false,

      badges:
        Array.isArray(
          safeProduct.merchandising
            ?.badges,
        )
          ? safeProduct.merchandising
              .badges
          : [],

      ranking:
        safeProduct.merchandising
          ?.ranking,
    },

    seo: safeProduct.seo
      ? {
          ...safeProduct.seo,
          keywords:
            Array.isArray(
              safeProduct.seo
                .keywords,
            )
              ? safeProduct.seo
                  .keywords
              : [],
        }
      : undefined,

    status:
      safeProduct.status ??
      "draft",

    publishedAt:
      safeProduct.publishedAt,

    createdAt:
      safeProduct.createdAt ??
      "",

    updatedAt:
      safeProduct.updatedAt ??
      "",
  };
}

export function ProductDetail({
  product,
  recommendations = [],
}: ProductDetailProps) {
  const safeProduct = useMemo(
    () => normalizeProduct(product),
    [product],
  );

  const safeRecommendations = useMemo(
    () =>
      Array.isArray(
        recommendations,
      )
        ? recommendations
            .filter(Boolean)
            .map(normalizeProduct)
        : [],
    [recommendations],
  );

  const [quantity, setQuantity] =
    useState(1);

  const [categoryLabel, setCategoryLabel] =
    useState("");

  const maxStock =
    getAvailableStock(
      safeProduct,
    );

  const safeQuantity = Math.min(
    Math.max(quantity, 1),
    Math.max(maxStock, 1),
  );

  useEffect(() => {
    let cancelled = false;

    async function loadCategory() {
      try {
        const categories =
          await getCategories();

        const category =
          Array.isArray(categories)
            ? categories.find(
                (item) =>
                  item.id ===
                  safeProduct.categoryId,
              )
            : undefined;

        if (!cancelled) {
          setCategoryLabel(
            category?.name ?? "",
          );
        }
      } catch (error) {
        console.error(
          "Failed to load product category:",
          error,
        );

        if (!cancelled) {
          setCategoryLabel("");
        }
      }
    }

    if (safeProduct.categoryId) {
      loadCategory();
    } else {
      setCategoryLabel("");
    }

    return () => {
      cancelled = true;
    };
  }, [safeProduct.categoryId]);

  return (
    <main className="bg-[var(--color-bg)]">
      {/* =====================================================
          PRODUCT HERO
      ===================================================== */}

      <section
        className="
          border-b
          border-[var(--color-border-light)]
          bg-[var(--color-bg)]
        "
      >
        <div
          className="
            mx-auto
            max-w-[1600px]
            px-4
            pb-16
            pt-4
            sm:px-6
            sm:pb-20
            sm:pt-6
            lg:px-10
            lg:pb-24
            lg:pt-8
            xl:px-12
          "
        >
          <div
            className="
              mb-6
              flex
              items-center
              gap-2
              overflow-hidden
              font-body
              text-[9px]
              font-medium
              uppercase
              tracking-[0.16em]
              text-[var(--color-text-muted)]
              sm:mb-8
            "
          >
            <span className="shrink-0">
              Shop
            </span>

            <span
              aria-hidden="true"
              className="text-[var(--color-border-dark)]"
            >
              /
            </span>

            <span className="truncate text-[var(--color-text-secondary)]">
              {categoryLabel}
            </span>
          </div>

          <div
            className="
              grid
              items-start
              gap-10
              lg:grid-cols-[minmax(0,1.08fr)_minmax(390px,0.92fr)]
              lg:gap-14
              xl:gap-20
            "
          >
            <div className="min-w-0">
              <ProductMediaGallery
                product={safeProduct}
              />
            </div>

            <div
              className="
                min-w-0
                lg:sticky
                lg:top-28
              "
            >
              <ProductInfo
                product={safeProduct}
                quantity={safeQuantity}
                onQuantityChange={(value) =>
                  setQuantity(
                    Math.min(
                      Math.max(
                        value,
                        1,
                      ),
                      Math.max(
                        maxStock,
                        1,
                      ),
                    ),
                  )
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PRODUCT INFORMATION
      ===================================================== */}

      <section
        className="
          border-b
          border-[var(--color-border-light)]
          bg-[var(--color-surface)]
        "
      >
        <div
          className="
            mx-auto
            max-w-[1600px]
            px-4
            py-16
            sm:px-6
            sm:py-20
            lg:px-10
            lg:py-24
            xl:px-12
          "
        >
          <div
            className="
              grid
              gap-12
              lg:grid-cols-[minmax(0,1fr)_360px]
              lg:gap-20
              xl:gap-28
            "
          >
            <div className="min-w-0">
              <div className="mb-8">
                <p className="eyebrow">
                  Product Details
                </p>

                <h2
                  className="
                    mt-3
                    font-display
                    text-[clamp(2rem,3vw,3rem)]
                    font-medium
                    leading-none
                    tracking-[-0.025em]
                    text-[var(--color-text)]
                  "
                >
                  Everything in the
                  <span className="italic">
                    {" "}
                    detail.
                  </span>
                </h2>
              </div>

              {/* DESCRIPTION */}

              <ProductAccordion
                title="Description"
                defaultOpen
              >
                <ProductDescription
                  product={safeProduct}
                />
              </ProductAccordion>

              {/* MATERIALS & CARE */}

              <ProductAccordion title="Materials & Care">
                <div
                  className="
                    max-w-2xl
                    space-y-5
                    font-body
                    text-sm
                    leading-7
                    text-[var(--color-text-secondary)]
                  "
                >
                  {safeProduct.content
                    ?.description ? (
                    <div
                      className="
                        prose
                        prose-sm
                        max-w-none
                        text-[var(--color-text-secondary)]
                      "
                      dangerouslySetInnerHTML={{
                        __html:
                          safeProduct.content
                            .description,
                      }}
                    />
                  ) : (
                    <p>
                      Product care
                      information will
                      be updated soon.
                    </p>
                  )}
                </div>
              </ProductAccordion>

              {/* SIZE & FIT */}

              <ProductAccordion title="Size & Fit">
                <div
                  className="
                    max-w-2xl
                    font-body
                    text-sm
                    leading-7
                    text-[var(--color-text-secondary)]
                  "
                >
                  <p>
                    Please refer to the
                    product description
                    and available
                    product information
                    for sizing details.
                  </p>
                </div>
              </ProductAccordion>

              {/* PRODUCT DETAILS */}

              <ProductAccordion title="Product Details">
                <ProductSpecifications
                  product={safeProduct}
                />
              </ProductAccordion>

              {/* SHIPPING */}

              <ProductAccordion title="Shipping & Delivery">
                <p
                  className="
                    max-w-2xl
                    font-body
                    text-sm
                    leading-7
                    text-[var(--color-text-secondary)]
                  "
                >
                  Shipping and delivery
                  information will be
                  provided during checkout
                  based on the delivery
                  address.
                </p>
              </ProductAccordion>

              {/* RETURNS */}

              <ProductAccordion title="Returns & Exchange">
                <p
                  className="
                    max-w-2xl
                    font-body
                    text-sm
                    leading-7
                    text-[var(--color-text-secondary)]
                  "
                >
                  Please refer to the
                  store return and
                  exchange policy
                  applicable to this
                  product.
                </p>
              </ProductAccordion>

              {/* REVIEWS */}

              <div
                className="
                  mt-2
                  border-t
                  border-[var(--color-border)]
                  pt-8
                "
              >
                <p className="eyebrow mb-5">
                  Customer Reviews
                </p>

                <ProductReviews
                  product={safeProduct}
                />
              </div>
            </div>

            {/* THE AYESHA STANDARD */}

            <aside className="hidden lg:block">
              <div
                className="
                  sticky
                  top-28
                  border
                  border-[var(--color-border)]
                  bg-[var(--color-bg-soft)]
                  p-7
                  xl:p-8
                "
              >
                <p className="eyebrow">
                  The Ayesha Standard
                </p>

                <h3
                  className="
                    mt-4
                    font-display
                    text-[32px]
                    font-medium
                    leading-[1.02]
                    tracking-[-0.02em]
                    text-[var(--color-text)]
                  "
                >
                  Designed to be worn,
                  remembered, and loved.
                </h3>

                <p
                  className="
                    mt-5
                    font-body
                    text-sm
                    leading-7
                    text-[var(--color-text-secondary)]
                  "
                >
                  Every piece is
                  thoughtfully designed
                  with an emphasis on
                  elegance, comfort and
                  enduring style.
                </p>

                <div className="my-7 h-px bg-[var(--color-border)]" />

                <div className="space-y-6">
                  <div>
                    <p className="eyebrow">
                      Price
                    </p>

                    <p
                      className="
                        mt-1.5
                        font-body
                        text-sm
                        text-[var(--color-text-secondary)]
                      "
                    >
                      ₹
                      {safeProduct.pricing
                        ?.sellingPrice
                        ?.toLocaleString(
                          "en-IN",
                        ) ?? "0"}
                    </p>
                  </div>

                  <div>
                    <p className="eyebrow">
                      Availability
                    </p>

                    <p
                      className="
                        mt-1.5
                        font-body
                        text-sm
                        text-[var(--color-text-secondary)]
                      "
                    >
                      {maxStock > 0
                        ? `${maxStock} available`
                        : "Currently unavailable"}
                    </p>
                  </div>
                </div>

                <div
                  className="
                    mt-8
                    border-t
                    border-[var(--color-border)]
                    pt-6
                  "
                >
                  <p
                    className="
                      font-display
                      text-xl
                      italic
                      text-[var(--color-accent-dark)]
                    "
                  >
                    Made for moments
                    worth remembering.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* =====================================================
          RECOMMENDATIONS
      ===================================================== */}

      <ProductRecommendations
        recommendations={
          safeRecommendations
        }
        product={safeProduct}
      />

      {/* =====================================================
          MOBILE STICKY BUY BAR
      ===================================================== */}

      <ProductStickyBuyBar
        product={safeProduct}
      />
    </main>
  );
}