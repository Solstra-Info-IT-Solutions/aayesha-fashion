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
    <main className="bg-[var(--color-ivory)]">
      {/* =====================================================
          PDP HERO
      ===================================================== */}

      <section className="border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-[1500px] px-4 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-8 lg:px-10 lg:pb-24">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(390px,0.92fr)] lg:gap-16 xl:gap-20">
            {/* MEDIA */}

            <ProductMediaGallery
              product={product}
            />

            {/* INFORMATION */}

            <div className="lg:sticky lg:top-28">
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
          PRODUCT CONTENT
      ===================================================== */}

      <section className="mx-auto max-w-[1500px] px-4 py-14 sm:px-6 sm:py-18 lg:px-10 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-20">
          <div>
            <ProductAccordion
              title="Description"
              defaultOpen
            >
              <ProductDescription
                product={product}
              />
            </ProductAccordion>

            <ProductAccordion title="Materials & Care">
              <div className="max-w-2xl space-y-5 text-sm leading-7 text-[var(--color-text-secondary)]">
                {product.attributes
                  .fabric && (
                  <p>
                    <strong className="text-[var(--color-charcoal)]">
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
                    <strong className="text-[var(--color-charcoal)]">
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
                    <p className="mb-3 font-semibold text-[var(--color-charcoal)]">
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
                            <span className="absolute left-0 top-[10px] h-1 w-1 rounded-full bg-[var(--color-rose)]" />
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
              <div className="max-w-2xl text-sm leading-7 text-[var(--color-text-secondary)]">
                {product.attributes
                  .fit && (
                  <p>
                    <strong className="text-[var(--color-charcoal)]">
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
                    <strong className="text-[var(--color-charcoal)]">
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
                <p className="max-w-2xl text-sm leading-7 text-[var(--color-text-secondary)]">
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
                <p className="max-w-2xl text-sm leading-7 text-[var(--color-text-secondary)]">
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
                      <div key={faq.id}>
                        <p className="text-sm font-semibold">
                          {
                            faq.question
                          }
                        </p>

                        <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">
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

            {/* REVIEWS */}

            <div className="border-t border-[var(--color-border)] pt-7">
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.15em]">
                Customer Reviews
              </p>

              <ProductReviews
                product={product}
              />
            </div>
          </div>

          {/* =====================================================
              SIDE SUMMARY
          ===================================================== */}

          <aside className="hidden lg:block">
            <div className="border border-[var(--color-border)] bg-[var(--color-cream)] p-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[var(--color-text-muted)]">
                The Ayesha Standard
              </p>

              <h3 className="mt-3 font-[var(--font-cormorant)] text-3xl leading-tight">
                Designed to be worn, remembered,
                and loved.
              </h3>

              <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">
                Every piece is thoughtfully
                designed with an emphasis on
                elegance, comfort and enduring
                style.
              </p>

              <div className="mt-7 h-px bg-[var(--color-border)]" />

              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em]">
                    Fabric
                  </p>

                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    {
                      product.attributes
                        .fabric ??
                      "Premium materials"
                    }
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em]">
                    Occasion
                  </p>

                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    {product.attributes
                      .occasion?.join(
                        ", ",
                      ) ??
                      "Versatile styling"}
                  </p>
                </div>
              </div>
            </div>
          </aside>
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