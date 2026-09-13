"use client";

import { useMemo, useState } from "react";

import type { Product } from "@/types/product";
import { getVariantInventoryStatus } from "@/types/product";

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

export function ProductDetail({
  product,
  recommendations = [],
}: ProductDetailProps) {
  const firstAvailableVariant = useMemo(() => {
    return (
      product.variants.find(
        (variant) =>
          variant.status === "active" &&
          getVariantInventoryStatus(variant) !==
            "out-of-stock",
      ) ?? product.variants[0]
    );
  }, [product.variants]);

  const [selectedColorId, setSelectedColorId] =
    useState(
      firstAvailableVariant?.color.id ?? "",
    );

  const [selectedSizeCode, setSelectedSizeCode] =
    useState(
      firstAvailableVariant?.size.code ?? "",
    );

  const [quantity, setQuantity] = useState(1);

  const [sizeGuideOpen, setSizeGuideOpen] =
    useState(false);

  const selectedVariant = useMemo(() => {
    return (
      product.variants.find(
        (variant) =>
          variant.color.id === selectedColorId &&
          variant.size.code === selectedSizeCode &&
          variant.status === "active",
      ) ?? null
    );
  }, [
    product.variants,
    selectedColorId,
    selectedSizeCode,
  ]);

  const handleColorChange = (
    colorId: string,
  ) => {
    setSelectedColorId(colorId);

    const availableVariant =
      product.variants.find(
        (variant) =>
          variant.color.id === colorId &&
          variant.status === "active" &&
          getVariantInventoryStatus(
            variant,
          ) !== "out-of-stock",
      );

    setSelectedSizeCode(
      availableVariant?.size.code ?? "",
    );

    setQuantity(1);
  };

  const handleSizeChange = (
    sizeCode: string,
  ) => {
    setSelectedSizeCode(sizeCode);
    setQuantity(1);
  };

  const maxStock = selectedVariant
    ? Math.max(
        0,
        selectedVariant.inventory.stock -
          selectedVariant.inventory.reserved,
      )
    : 0;

  const safeQuantity = Math.min(
    Math.max(quantity, 1),
    Math.max(maxStock, 1),
  );

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
          {/* Editorial breadcrumb cue */}

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
              {product.category
                .replace(/-/g, " ")
                .replace(/\b\w/g, (letter) =>
                  letter.toUpperCase(),
                )}
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
            {/* =================================================
                PRODUCT MEDIA
            ================================================= */}

            <div className="min-w-0">
              <ProductMediaGallery
                product={product}
              />
            </div>

            {/* =================================================
                PRODUCT INFORMATION
            ================================================= */}

            <div
              className="
                min-w-0
                lg:sticky
                lg:top-28
              "
            >
              <ProductInfo
                product={product}
                selectedColorId={
                  selectedColorId
                }
                selectedSizeCode={
                  selectedSizeCode
                }
                selectedVariant={
                  selectedVariant
                }
                quantity={safeQuantity}
                sizeGuideOpen={
                  sizeGuideOpen
                }
                onColorChange={
                  handleColorChange
                }
                onSizeChange={
                  handleSizeChange
                }
                onQuantityChange={(
                  value,
                ) =>
                  setQuantity(
                    Math.min(
                      Math.max(value, 1),
                      Math.max(
                        maxStock,
                        1,
                      ),
                    ),
                  )
                }
                onSizeGuideChange={
                  setSizeGuideOpen
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
            {/* =================================================
                ACCORDIONS
            ================================================= */}

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

              <ProductAccordion
                title="Description"
                defaultOpen
              >
                <ProductDescription
                  product={product}
                />
              </ProductAccordion>

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
                  {product.attributes
                    .fabric && (
                    <p>
                      <strong className="font-semibold text-[var(--color-text)]">
                        Fabric:
                      </strong>{" "}
                      {
                        product.attributes
                          .fabric
                      }
                    </p>
                  )}

                  {product.attributes
                    .composition && (
                    <p>
                      <strong className="font-semibold text-[var(--color-text)]">
                        Composition:
                      </strong>{" "}
                      {
                        product.attributes
                          .composition
                      }
                    </p>
                  )}

                  {product.attributes
                    .careInstructions
                    ?.length ? (
                    <div>
                      <p className="mb-3 font-semibold text-[var(--color-text)]">
                        Care Instructions
                      </p>

                      <ul className="space-y-2">
                        {product.attributes.careInstructions.map(
                          (
                            instruction,
                          ) => (
                            <li
                              key={
                                instruction
                              }
                              className="relative pl-4"
                            >
                              <span
                                aria-hidden="true"
                                className="
                                  absolute
                                  left-0
                                  top-[11px]
                                  h-1
                                  w-1
                                  rounded-full
                                  bg-[var(--color-accent)]
                                "
                              />

                              {
                                instruction
                              }
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </ProductAccordion>

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
                  {product.attributes
                    .fit && (
                    <p>
                      <strong className="font-semibold text-[var(--color-text)]">
                        Fit:
                      </strong>{" "}
                      {
                        product.attributes
                          .fit
                      }
                    </p>
                  )}

                  {product.attributes
                    .silhouette && (
                    <p className="mt-3">
                      <strong className="font-semibold text-[var(--color-text)]">
                        Silhouette:
                      </strong>{" "}
                      {
                        product.attributes
                          .silhouette
                      }
                    </p>
                  )}

                  {product.content
                    .fitNote && (
                    <p className="mt-5">
                      {
                        product.content
                          .fitNote
                      }
                    </p>
                  )}
                </div>
              </ProductAccordion>

              <ProductAccordion title="Product Details">
                <ProductSpecifications
                  product={product}
                />
              </ProductAccordion>

              {product.content
                .shippingContent && (
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
                    {
                      product.content
                        .shippingContent
                    }
                  </p>
                </ProductAccordion>
              )}

              {product.content
                .returnContent && (
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
                    {
                      product.content
                        .returnContent
                    }
                  </p>
                </ProductAccordion>
              )}

              {product.faqs?.length ? (
                <ProductAccordion title="Frequently Asked Questions">
                  <div className="max-w-2xl space-y-7">
                    {product.faqs.map(
                      (faq) => (
                        <div
                          key={faq.id}
                          className="border-b border-[var(--color-border-light)] pb-6 last:border-0"
                        >
                          <p
                            className="
                              font-body
                              text-sm
                              font-semibold
                              text-[var(--color-text)]
                            "
                          >
                            {
                              faq.question
                            }
                          </p>

                          <p
                            className="
                              mt-2
                              font-body
                              text-sm
                              leading-7
                              text-[var(--color-text-secondary)]
                            "
                          >
                            {
                              faq.answer
                            }
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </ProductAccordion>
              ) : null}

              {/* =================================================
                  REVIEWS
              ================================================= */}

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
                  product={product}
                />
              </div>
            </div>

            {/* =================================================
                THE AYESHA STANDARD
            ================================================= */}

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
                  Every piece is thoughtfully
                  designed with an emphasis on
                  elegance, comfort and enduring
                  style.
                </p>

                <div className="my-7 h-px bg-[var(--color-border)]" />

                <div className="space-y-6">
                  <div>
                    <p className="eyebrow">
                      Fabric
                    </p>

                    <p
                      className="
                        mt-1.5
                        font-body
                        text-sm
                        text-[var(--color-text-secondary)]
                      "
                    >
                      {
                        product.attributes
                          .fabric ??
                        "Premium materials"
                      }
                    </p>
                  </div>

                  <div>
                    <p className="eyebrow">
                      Occasion
                    </p>

                    <p
                      className="
                        mt-1.5
                        font-body
                        text-sm
                        text-[var(--color-text-secondary)]
                      "
                    >
                      {product.attributes
                        .occasion?.join(
                          ", ",
                        ) ??
                        "Versatile styling"}
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
                    Made for moments worth
                    remembering.
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
          recommendations
        }
        product={product}
      />

      {/* =====================================================
          MOBILE STICKY BUY BAR
      ===================================================== */}

      <ProductStickyBuyBar
        product={product}
        variant={selectedVariant}
      />
    </main>
  );
}