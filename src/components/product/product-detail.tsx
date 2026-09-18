"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import type { Product } from "@/types/product";

import {
  getAvailableStock,
  getInventoryStatus,
} from "@/types/product";

import { getCategories } from "@/services/category.service";
import { addToCart } from "@/services/cart.service";

import { useAuthStore } from "@/store/auth-store";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  MapPin,
  Check,
} from "lucide-react";

interface ProductDetailProps {
  product: Product;
  recommendations?: Product[];
}

/* ============================================================
   SAFE PRODUCT
============================================================ */

function normalizeProduct(
  product: Product,
): Product {
  const source =
    product ?? ({} as Product);

  return {
    ...source,

    _id:
      source._id ??
      source.id ??
      "",

    id:
      source.id ??
      source._id ??
      "",

    slug:
      source.slug ?? "",

    name:
      source.name ??
      "Product",

    categoryId:
      source.categoryId ??
      "",

    pricing: {
      mrp:
        source.pricing?.mrp ??
        0,

      sellingPrice:
        source.pricing
          ?.sellingPrice ??
        0,

      currency:
        source.pricing?.currency ??
        "INR",
    },

    inventory: {
      stock:
        source.inventory?.stock ??
        0,

      reserved:
        source.inventory?.reserved ??
        0,

      lowStockThreshold:
        source.inventory
          ?.lowStockThreshold ??
        2,
    },

    content: {
      description:
        source.content?.description ??
        "",

      descriptionFormat:
        source.content
          ?.descriptionFormat ??
        "plain",

      richContent:
        source.content?.richContent,
    },

    media: Array.isArray(
      source.media,
    )
      ? source.media
      : [],

    merchandising: {
      isNew:
        source.merchandising
          ?.isNew ?? false,

      isFeatured:
        source.merchandising
          ?.isFeatured ?? false,

      isBestSeller:
        source.merchandising
          ?.isBestSeller ?? false,

      badges:
        Array.isArray(
          source.merchandising
            ?.badges,
        )
          ? source.merchandising
              .badges
          : [],

      ranking:
        source.merchandising
          ?.ranking,
    },

    seo: source.seo
      ? {
          ...source.seo,

          keywords:
            Array.isArray(
              source.seo
                .keywords,
            )
              ? source.seo.keywords
              : [],
        }
      : undefined,

    status:
      source.status ??
      "draft",

    publishedAt:
      source.publishedAt,

    createdAt:
      source.createdAt ??
      "",

    updatedAt:
      source.updatedAt ??
      "",
  };
}

/* ============================================================
   HELPERS
============================================================ */

function formatPrice(
  value: number,
): string {
  return `₹${Number(
    value ?? 0,
  ).toLocaleString("en-IN")}`;
}

function getDiscount(
  mrp: number,
  sellingPrice: number,
): number {
  if (
    mrp <= 0 ||
    sellingPrice >= mrp
  ) {
    return 0;
  }

  return Math.round(
    ((mrp - sellingPrice) /
      mrp) *
      100,
  );
}

/* ============================================================
   COMPONENT
============================================================ */

export function ProductDetail({
  product,
  recommendations = [],
}: ProductDetailProps) {
  const router = useRouter();

  const {
    isAuthenticated,
  } = useAuthStore();

  const safeProduct = useMemo(
    () =>
      normalizeProduct(product),
    [product],
  );

  const safeRecommendations =
    useMemo(
      () =>
        Array.isArray(
          recommendations,
        )
          ? recommendations
              .filter(Boolean)
              .map(
                normalizeProduct,
              )
          : [],
      [recommendations],
    );

  /* ==========================================================
     STATE
  ========================================================== */

  const [categoryName, setCategoryName] =
    useState("");

  const [selectedImage, setSelectedImage] =
    useState(0);

  const [quantity, setQuantity] =
    useState(1);

  const [wishlist, setWishlist] =
    useState(false);

  const [openSection, setOpenSection] =
    useState<string | null>(
      "description",
    );

  const [pincode, setPincode] =
    useState("");

  const [deliveryChecked, setDeliveryChecked] =
    useState(false);

  const [addingToCart, setAddingToCart] =
    useState(false);

  const [buyingNow, setBuyingNow] =
    useState(false);

  /* ==========================================================
     PRODUCT VALUES
  ========================================================== */

  const maxStock =
    getAvailableStock(
      safeProduct,
    );

  const inventoryStatus =
    getInventoryStatus(
      safeProduct,
    );

  const mrp =
    safeProduct.pricing?.mrp ??
    0;

  const sellingPrice =
    safeProduct.pricing
      ?.sellingPrice ?? 0;

  const discount =
    getDiscount(
      mrp,
      sellingPrice,
    );

  const media = Array.isArray(
    safeProduct.media,
  )
    ? safeProduct.media.filter(
        (item) =>
          item?.type ===
            "image" &&
          Boolean(item?.src),
      )
    : [];

  const currentMedia =
    media[selectedImage] ??
    media[0] ??
    null;

  /* ==========================================================
     CATEGORY
  ========================================================== */

  useEffect(() => {
    let cancelled = false;

    async function loadCategory() {
      try {
        const categories =
          await getCategories();

        if (
          !Array.isArray(
            categories,
          )
        ) {
          return;
        }

        const category =
          categories.find(
            (item) =>
              item.id ===
              safeProduct.categoryId,
          );

        if (!cancelled) {
          setCategoryName(
            category?.name ?? "",
          );
        }
      } catch {
        if (!cancelled) {
          setCategoryName("");
        }
      }
    }

    if (
      safeProduct.categoryId
    ) {
      loadCategory();
    }

    return () => {
      cancelled = true;
    };
  }, [
    safeProduct.categoryId,
  ]);

  /* ==========================================================
     RESET WHEN PRODUCT CHANGES
  ========================================================== */

  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
    setWishlist(false);
  }, [safeProduct._id]);

  /* ==========================================================
     QUANTITY
  ========================================================== */

  function decreaseQuantity() {
    setQuantity(
      (current) =>
        Math.max(
          current - 1,
          1,
        ),
    );
  }

  function increaseQuantity() {
    if (maxStock <= 0) {
      return;
    }

    setQuantity(
      (current) =>
        Math.min(
          current + 1,
          maxStock,
        ),
    );
  }

  /* ==========================================================
     CART
  ========================================================== */

  async function handleAddToCart() {
    if (!isAuthenticated) {
      router.push(
        `/login?redirect=${encodeURIComponent(
          `/products/${safeProduct._id}`,
        )}`,
      );

      return;
    }

    if (maxStock <= 0) {
      return;
    }

    try {
      setAddingToCart(true);

      await addToCart(
        safeProduct._id,
        quantity,
      );
    } catch (error) {
      console.error(
        "Failed to add product to cart:",
        error,
      );
    } finally {
      setAddingToCart(false);
    }
  }

  async function handleBuyNow() {
    if (!isAuthenticated) {
      router.push(
        `/login?redirect=${encodeURIComponent(
          `/products/${safeProduct._id}`,
        )}`,
      );

      return;
    }

    if (maxStock <= 0) {
      return;
    }

    try {
      setBuyingNow(true);

      await addToCart(
        safeProduct._id,
        quantity,
      );

      router.push(
        "/checkout",
      );
    } catch (error) {
      console.error(
        "Failed to buy product:",
        error,
      );
    } finally {
      setBuyingNow(false);
    }
  }

  /* ==========================================================
     IMAGE NAVIGATION
  ========================================================== */

  function previousImage() {
    if (media.length <= 1) {
      return;
    }

    setSelectedImage(
      (current) =>
        current <= 0
          ? media.length - 1
          : current - 1,
    );
  }

  function nextImage() {
    if (media.length <= 1) {
      return;
    }

    setSelectedImage(
      (current) =>
        current >=
        media.length - 1
          ? 0
          : current + 1,
    );
  }

  /* ==========================================================
     ACCORDION
  ========================================================== */

  function toggleSection(
    section: string,
  ) {
    setOpenSection(
      (current) =>
        current === section
          ? null
          : section,
    );
  }

  /* ==========================================================
     PINCODE
  ========================================================== */

  function checkDelivery() {
    setDeliveryChecked(
      /^[1-9][0-9]{5}$/.test(
        pincode,
      ),
    );
  }

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <main className="bg-[var(--color-bg)]">
      {/* ======================================================
          PRODUCT
      ====================================================== */}

      <section className="border-b border-[var(--color-border-light)]">
        <div
          className="
            mx-auto
            w-full
            max-w-[1500px]
            px-4
            py-5
            sm:px-6
            sm:py-7
            lg:px-10
            lg:py-8
            xl:px-12
          "
        >
          {/* ==================================================
              BREADCRUMB
          ================================================== */}

          <div
            className="
              mb-5
              flex
              items-center
              gap-2
              overflow-hidden
              text-[9px]
              font-medium
              uppercase
              tracking-[0.15em]
              text-[var(--color-text-muted)]
              sm:mb-7
            "
          >
            <button
              type="button"
              onClick={() =>
                router.push(
                  "/shop",
                )
              }
              className="shrink-0 hover:text-[var(--color-text)]"
            >
              Shop
            </button>

            {categoryName && (
              <>
                <span>/</span>

                <span className="truncate text-[var(--color-text-secondary)]">
                  {categoryName}
                </span>
              </>
            )}

            <span>/</span>

            <span className="truncate text-[var(--color-text-secondary)]">
              {safeProduct.name}
            </span>
          </div>

          {/* ==================================================
              MAIN GRID
          ================================================== */}

          <div
            className="
              grid
              items-start
              gap-8
              lg:grid-cols-[minmax(0,1.18fr)_minmax(360px,0.82fr)]
              lg:gap-12
              xl:gap-16
            "
          >
            {/* =================================================
                IMAGE AREA
            ================================================= */}

            <div className="min-w-0">
              <div
                className="
                  grid
                  gap-3
                  sm:grid-cols-[76px_minmax(0,1fr)]
                  lg:grid-cols-[86px_minmax(0,1fr)]
                "
              >
                {/* THUMBNAILS */}

                {media.length > 1 && (
                  <div
                    className="
                      order-2
                      flex
                      gap-2
                      overflow-x-auto
                      sm:order-1
                      sm:flex-col
                      sm:overflow-y-auto
                    "
                  >
                    {media.map(
                      (
                        item,
                        index,
                      ) => (
                        <button
                          key={
                            item.id ??
                            `${item.src}-${index}`
                          }
                          type="button"
                          onClick={() =>
                            setSelectedImage(
                              index,
                            )
                          }
                          className={`
                            h-[78px]
                            w-[62px]
                            shrink-0
                            overflow-hidden
                            border
                            bg-[var(--color-bg-soft)]
                            transition
                            sm:h-[92px]
                            sm:w-[76px]
                            lg:h-[104px]
                            lg:w-[86px]
                            ${
                              selectedImage ===
                              index
                                ? "border-[var(--color-text)]"
                                : "border-[var(--color-border)]"
                            }
                          `}
                        >
                          <img
                            src={
                              item.src
                            }
                            alt={
                              item.alt ||
                              safeProduct.name
                            }
                            className="
                              h-full
                              w-full
                              object-cover
                            "
                          />
                        </button>
                      ),
                    )}
                  </div>
                )}

                {/* MAIN IMAGE */}

                <div
                  className="
                    relative
                    order-1
                    aspect-[3/4]
                    min-h-[460px]
                    w-full
                    overflow-hidden
                    bg-[var(--color-bg-soft)]
                    sm:order-2
                    sm:min-h-[560px]
                    lg:min-h-[620px]
                    xl:min-h-[680px]
                  "
                >
                  {currentMedia?.src ? (
                    <img
                      src={
                        currentMedia.src
                      }
                      alt={
                        currentMedia.alt ||
                        safeProduct.name
                      }
                      className="
                        h-full
                        w-full
                        object-cover
                        object-center
                        transition-transform
                        duration-500
                      "
                    />
                  ) : (
                    <div
                      className="
                        flex
                        h-full
                        items-center
                        justify-center
                        bg-[var(--color-bg-soft)]
                      "
                    >
                      <span
                        className="
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-[0.15em]
                          text-[var(--color-text-muted)]
                        "
                      >
                        No image available
                      </span>
                    </div>
                  )}

                  {/* IMAGE ARROWS */}

                  {media.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={
                          previousImage
                        }
                        aria-label="Previous image"
                        className="
                          absolute
                          left-3
                          top-1/2
                          flex
                          h-9
                          w-9
                          -translate-y-1/2
                          items-center
                          justify-center
                          rounded-full
                          bg-white/90
                          text-[var(--color-text)]
                          shadow-sm
                          backdrop-blur
                          transition
                          hover:bg-white
                        "
                      >
                        <ChevronLeft
                          size={16}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={
                          nextImage
                        }
                        aria-label="Next image"
                        className="
                          absolute
                          right-3
                          top-1/2
                          flex
                          h-9
                          w-9
                          -translate-y-1/2
                          items-center
                          justify-center
                          rounded-full
                          bg-white/90
                          text-[var(--color-text)]
                          shadow-sm
                          backdrop-blur
                          transition
                          hover:bg-white
                        "
                      >
                        <ChevronRight
                          size={16}
                        />
                      </button>
                    </>
                  )}

                  {/* IMAGE COUNT */}

                  {media.length >
                    1 && (
                    <div
                      className="
                        absolute
                        bottom-3
                        right-3
                        bg-black/65
                        px-2.5
                        py-1.5
                        text-[8px]
                        font-medium
                        tracking-[0.1em]
                        text-white
                        backdrop-blur
                      "
                    >
                      {selectedImage +
                        1}{" "}
                      / {media.length}
                    </div>
                  )}

                  {/* BADGE */}

                  {safeProduct
                    .merchandising
                    ?.badges
                    ?.length >
                    0 && (
                    <div
                      className="
                        absolute
                        left-3
                        top-3
                      "
                    >
                      <span
                        className="
                          bg-[var(--color-text)]
                          px-2.5
                          py-1.5
                          text-[8px]
                          font-semibold
                          uppercase
                          tracking-[0.12em]
                          text-white
                        "
                      >
                        {
                          safeProduct
                            .merchandising
                            .badges[0]
                        }
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* =================================================
                PRODUCT INFO
            ================================================= */}

            <div
              className="
                min-w-0
                lg:sticky
                lg:top-24
              "
            >
              {/* TITLE */}

              <div className="border-b border-[var(--color-border)] pb-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    {categoryName && (
                      <p
                        className="
                          mb-2
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-[0.15em]
                          text-[var(--color-text-muted)]
                        "
                      >
                        {categoryName}
                      </p>
                    )}

                    <h1
                      className="
                        max-w-xl
                        font-display
                        text-[26px]
                        font-medium
                        leading-[1.08]
                        tracking-[-0.02em]
                        text-[var(--color-text)]
                        sm:text-[30px]
                        lg:text-[32px]
                      "
                    >
                      {
                        safeProduct.name
                      }
                    </h1>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setWishlist(
                        (current) =>
                          !current,
                      )
                    }
                    aria-label="Wishlist"
                    className={`
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      border
                      ${
                        wishlist
                          ? "border-[var(--color-text)] bg-[var(--color-text)] text-white"
                          : "border-[var(--color-border)] text-[var(--color-text)]"
                      }
                    `}
                  >
                    <Heart
                      size={16}
                      strokeWidth={
                        1.4
                      }
                      fill={
                        wishlist
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                </div>
              </div>

              {/* PRICE */}

              <div className="border-b border-[var(--color-border)] py-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className="
                      text-[23px]
                      font-semibold
                      tracking-[-0.02em]
                      text-[var(--color-text)]
                    "
                  >
                    {formatPrice(
                      sellingPrice,
                    )}
                  </span>

                  {mrp >
                    sellingPrice && (
                    <>
                      <span
                        className="
                          text-sm
                          text-[var(--color-text-muted)]
                          line-through
                        "
                      >
                        {formatPrice(
                          mrp,
                        )}
                      </span>

                      {discount >
                        0 && (
                        <span
                          className="
                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-[0.1em]
                            text-[var(--color-accent-dark)]
                          "
                        >
                          {discount}% off
                        </span>
                      )}
                    </>
                  )}
                </div>

                <p className="mt-1.5 text-[9px] text-[var(--color-text-muted)]">
                  Inclusive of applicable
                  taxes
                </p>
              </div>

              {/* AVAILABILITY */}

              <div className="border-b border-[var(--color-border)] py-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[var(--color-text-muted)]">
                    Availability
                  </span>

                  <span
                    className={`
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.1em]
                      ${
                        inventoryStatus ===
                        "out-of-stock"
                          ? "text-[var(--color-error)]"
                          : inventoryStatus ===
                              "low-stock"
                            ? "text-[var(--color-accent-dark)]"
                            : "text-[var(--color-success)]"
                      }
                    `}
                  >
                    {inventoryStatus ===
                    "out-of-stock"
                      ? "Sold Out"
                      : inventoryStatus ===
                          "low-stock"
                        ? `Only ${maxStock} left`
                        : `${maxStock} available`}
                  </span>
                </div>
              </div>

              {/* QUANTITY + CART */}

              <div className="border-b border-[var(--color-border)] py-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.13em]">
                    Quantity
                  </span>

                  <span className="text-[9px] text-[var(--color-text-muted)]">
                    {maxStock > 0
                      ? `${maxStock} in stock`
                      : "Unavailable"}
                  </span>
                </div>

                <div className="flex gap-2">
                  {/* QUANTITY */}

                  <div className="flex h-11 shrink-0 border border-[var(--color-border-dark)]">
                    <button
                      type="button"
                      onClick={
                        decreaseQuantity
                      }
                      disabled={
                        quantity <=
                          1 ||
                        maxStock <=
                          0
                      }
                      className="
                        flex
                        w-9
                        items-center
                        justify-center
                        disabled:opacity-30
                      "
                    >
                      <Minus
                        size={13}
                      />
                    </button>

                    <span
                      className="
                        flex
                        w-9
                        items-center
                        justify-center
                        border-x
                        border-[var(--color-border)]
                        text-[11px]
                        font-semibold
                      "
                    >
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={
                        increaseQuantity
                      }
                      disabled={
                        maxStock <=
                          0 ||
                        quantity >=
                          maxStock
                      }
                      className="
                        flex
                        w-9
                        items-center
                        justify-center
                        disabled:opacity-30
                      "
                    >
                      <Plus
                        size={13}
                      />
                    </button>
                  </div>

                  {/* ADD TO BAG */}

                  <button
                    type="button"
                    onClick={
                      handleAddToCart
                    }
                    disabled={
                      maxStock <=
                        0 ||
                      addingToCart ||
                      buyingNow
                    }
                    className="
                      flex
                      h-11
                      flex-1
                      items-center
                      justify-center
                      gap-2
                      bg-[var(--color-text)]
                      px-4
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.14em]
                      text-white
                      transition
                      hover:bg-[var(--color-accent-dark)]
                      disabled:opacity-40
                    "
                  >
                    <ShoppingBag
                      size={15}
                      strokeWidth={
                        1.4
                      }
                    />

                    {addingToCart
                      ? "Adding..."
                      : "Add to Bag"}
                  </button>
                </div>

                {/* BUY NOW */}

                <button
                  type="button"
                  onClick={
                    handleBuyNow
                  }
                  disabled={
                    maxStock <=
                      0 ||
                    addingToCart ||
                    buyingNow
                  }
                  className="
                    mt-2
                    h-11
                    w-full
                    border
                    border-[var(--color-text)]
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.14em]
                    text-[var(--color-text)]
                    transition
                    hover:bg-[var(--color-text)]
                    hover:text-white
                    disabled:opacity-40
                  "
                >
                  {buyingNow
                    ? "Processing..."
                    : "Buy Now"}
                </button>
              </div>

              {/* DELIVERY */}

              <div className="border-b border-[var(--color-border)] py-5">
                <div className="flex gap-3">
                  <MapPin
                    size={17}
                    strokeWidth={
                      1.4
                    }
                    className="mt-0.5 shrink-0"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.13em]">
                      Check Delivery
                    </p>

                    <p className="mt-1 text-[9px] leading-5 text-[var(--color-text-muted)]">
                      Enter your pincode
                      to check delivery
                      availability.
                    </p>

                    <div className="mt-3 flex">
                      <input
                        value={
                          pincode
                        }
                        onChange={(
                          event,
                        ) => {
                          setPincode(
                            event.target.value
                              .replace(
                                /\D/g,
                                "",
                              )
                              .slice(
                                0,
                                6,
                              ),
                          );

                          setDeliveryChecked(
                            false,
                          );
                        }}
                        inputMode="numeric"
                        maxLength={
                          6
                        }
                        placeholder="Enter pincode"
                        className="
                          h-10
                          min-w-0
                          flex-1
                          border
                          border-r-0
                          border-[var(--color-border-dark)]
                          bg-transparent
                          px-3
                          text-[11px]
                          outline-none
                        "
                      />

                      <button
                        type="button"
                        onClick={
                          checkDelivery
                        }
                        className="
                          h-10
                          min-w-[72px]
                          bg-[var(--color-text)]
                          px-3
                          text-[8px]
                          font-semibold
                          uppercase
                          tracking-[0.12em]
                          text-white
                        "
                      >
                        Check
                      </button>
                    </div>

                    {deliveryChecked && (
                      <div className="mt-2 flex items-center gap-1.5 text-[9px] text-[var(--color-success)]">
                        <Check
                          size={12}
                        />
                        Delivery available
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SERVICE FEATURES */}

              <div className="grid grid-cols-3">
                <div className="border-r border-[var(--color-border)] px-2 py-4 text-center">
                  <Truck
                    size={17}
                    strokeWidth={
                      1.3
                    }
                    className="mx-auto"
                  />

                  <p className="mt-2 text-[8px] font-semibold uppercase tracking-[0.08em]">
                    Delivery
                  </p>

                  <p className="mt-1 text-[8px] text-[var(--color-text-muted)]">
                    Across India
                  </p>
                </div>

                <div className="border-r border-[var(--color-border)] px-2 py-4 text-center">
                  <ShieldCheck
                    size={17}
                    strokeWidth={
                      1.3
                    }
                    className="mx-auto"
                  />

                  <p className="mt-2 text-[8px] font-semibold uppercase tracking-[0.08em]">
                    Secure
                  </p>

                  <p className="mt-1 text-[8px] text-[var(--color-text-muted)]">
                    Safe checkout
                  </p>
                </div>

                <div className="px-2 py-4 text-center">
                  <RotateCcw
                    size={17}
                    strokeWidth={
                      1.3
                    }
                    className="mx-auto"
                  />

                  <p className="mt-2 text-[8px] font-semibold uppercase tracking-[0.08em]">
                    Returns
                  </p>

                  <p className="mt-1 text-[8px] text-[var(--color-text-muted)]">
                    Easy process
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          DETAILS
      ====================================================== */}

      <section className="border-b border-[var(--color-border-light)] bg-[var(--color-surface)]">
        <div
          className="
            mx-auto
            w-full
            max-w-[1500px]
            px-4
            py-10
            sm:px-6
            sm:py-14
            lg:px-10
            lg:py-16
            xl:px-12
          "
        >
          <div
            className="
              grid
              gap-10
              lg:grid-cols-[minmax(0,1fr)_300px]
              lg:gap-16
            "
          >
            {/* DETAILS */}

            <div className="min-w-0">
              <div className="mb-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                  Product Information
                </p>

                <h2
                  className="
                    mt-2
                    font-display
                    text-[25px]
                    font-medium
                    tracking-[-0.02em]
                    text-[var(--color-text)]
                  "
                >
                  Product Details
                </h2>
              </div>

              <div className="border-t border-[var(--color-border)]">
                {/* DESCRIPTION */}

                <div className="border-b border-[var(--color-border)]">
                  <button
                    type="button"
                    onClick={() =>
                      toggleSection(
                        "description",
                      )
                    }
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      py-4
                      text-left
                    "
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-[0.13em]">
                      Description
                    </span>

                    <ChevronDown
                      size={15}
                      className={`transition-transform ${
                        openSection ===
                        "description"
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {openSection ===
                    "description" && (
                    <div className="pb-5">
                      {safeProduct
                        .content
                        ?.description ? (
                        <div
                          className="
                            max-w-3xl
                            text-[13px]
                            leading-7
                            text-[var(--color-text-secondary)]
                            prose
                            prose-sm
                          "
                          dangerouslySetInnerHTML={{
                            __html:
                              safeProduct
                                .content
                                .description,
                          }}
                        />
                      ) : (
                        <p className="text-[12px] text-[var(--color-text-muted)]">
                          Description
                          will be
                          updated
                          soon.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* PRODUCT DETAILS */}

                <div className="border-b border-[var(--color-border)]">
                  <button
                    type="button"
                    onClick={() =>
                      toggleSection(
                        "details",
                      )
                    }
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      py-4
                      text-left
                    "
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-[0.13em]">
                      Product Details
                    </span>

                    <ChevronDown
                      size={15}
                      className={`transition-transform ${
                        openSection ===
                        "details"
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {openSection ===
                    "details" && (
                    <div className="grid pb-5 sm:grid-cols-2">
                      {[
                        [
                          "Category",
                          categoryName ||
                            "—",
                        ],
                        [
                          "Status",
                          safeProduct.status,
                        ],
                        [
                          "Currency",
                          safeProduct
                            .pricing
                            ?.currency ??
                            "INR",
                        ],
                        [
                          "Available Stock",
                          String(
                            maxStock,
                          ),
                        ],
                      ].map(
                        ([
                          label,
                          value,
                        ]) => (
                          <div
                            key={
                              label
                            }
                            className="border-b border-[var(--color-border-light)] py-3 pr-5"
                          >
                            <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                              {label}
                            </p>

                            <p className="mt-1 text-[12px] text-[var(--color-text-secondary)]">
                              {value}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>

                {/* SHIPPING */}

                <div className="border-b border-[var(--color-border)]">
                  <button
                    type="button"
                    onClick={() =>
                      toggleSection(
                        "shipping",
                      )
                    }
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      py-4
                      text-left
                    "
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-[0.13em]">
                      Shipping & Delivery
                    </span>

                    <ChevronDown
                      size={15}
                      className={`transition-transform ${
                        openSection ===
                        "shipping"
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {openSection ===
                    "shipping" && (
                    <p className="max-w-3xl pb-5 text-[12px] leading-6 text-[var(--color-text-secondary)]">
                      Shipping and
                      delivery
                      availability
                      is calculated
                      during checkout
                      based on your
                      delivery
                      address.
                    </p>
                  )}
                </div>

                {/* RETURNS */}

                <div className="border-b border-[var(--color-border)]">
                  <button
                    type="button"
                    onClick={() =>
                      toggleSection(
                        "returns",
                      )
                    }
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      py-4
                      text-left
                    "
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-[0.13em]">
                      Returns & Exchange
                    </span>

                    <ChevronDown
                      size={15}
                      className={`transition-transform ${
                        openSection ===
                        "returns"
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {openSection ===
                    "returns" && (
                    <p className="max-w-3xl pb-5 text-[12px] leading-6 text-[var(--color-text-secondary)]">
                      Please refer to
                      the store return
                      and exchange
                      policy applicable
                      to this product.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* DESKTOP SIDE CARD */}

            <aside className="hidden lg:block">
              <div
                className="
                  border
                  border-[var(--color-border)]
                  bg-[var(--color-bg-soft)]
                  p-6
                "
              >
                <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                  Ayesha Fashion
                </p>

                <h3
                  className="
                    mt-3
                    font-display
                    text-[24px]
                    font-medium
                    leading-[1.08]
                    tracking-[-0.02em]
                  "
                >
                  Thoughtfully
                  designed.
                </h3>

                <p className="mt-4 text-[11px] leading-6 text-[var(--color-text-secondary)]">
                  Designed with an
                  emphasis on elegance,
                  comfort and timeless
                  style.
                </p>

                <div className="my-5 h-px bg-[var(--color-border)]" />

                <div className="space-y-4">
                  <div>
                    <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                      Price
                    </p>

                    <p className="mt-1 text-[13px] text-[var(--color-text-secondary)]">
                      {formatPrice(
                        sellingPrice,
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                      Availability
                    </p>

                    <p className="mt-1 text-[13px] text-[var(--color-text-secondary)]">
                      {maxStock >
                      0
                        ? `${maxStock} available`
                        : "Currently unavailable"}
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ======================================================
          RECOMMENDATIONS
      ====================================================== */}

      {safeRecommendations
        .length > 0 && (
        <section className="border-b border-[var(--color-border-light)]">
          <div
            className="
              mx-auto
              w-full
              max-w-[1500px]
              px-4
              py-10
              sm:px-6
              sm:py-14
              lg:px-10
              lg:py-16
              xl:px-12
            "
          >
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                  You may also like
                </p>

                <h2
                  className="
                    mt-2
                    font-display
                    text-[25px]
                    font-medium
                    tracking-[-0.02em]
                  "
                >
                  More from this edit
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/shop?category=${encodeURIComponent(
                      safeProduct.categoryId,
                    )}`,
                  )
                }
                className="hidden text-[9px] font-semibold uppercase tracking-[0.13em] underline underline-offset-4 sm:block"
              >
                View all
              </button>
            </div>

            <div
              className="
                grid
                grid-cols-2
                gap-x-3
                gap-y-7
                sm:grid-cols-3
                sm:gap-x-5
                lg:grid-cols-4
                lg:gap-x-6
              "
            >
              {safeRecommendations.map(
                (item) => {
                  const image =
                    Array.isArray(
                      item.media,
                    )
                      ? item.media.find(
                          (
                            media,
                          ) =>
                            media?.type ===
                              "image" &&
                            Boolean(
                              media?.src,
                            ),
                        )
                      : null;

                  return (
                    <button
                      key={
                        item._id
                      }
                      type="button"
                      onClick={() =>
                        router.push(
                          `/products/${item._id}`,
                        )
                      }
                      className="group min-w-0 text-left"
                    >
                      <div
                        className="
                          aspect-[3/4]
                          overflow-hidden
                          bg-[var(--color-bg-soft)]
                        "
                      >
                        {image ? (
                          <img
                            src={
                              image.src
                            }
                            alt={
                              image.alt ||
                              item.name
                            }
                            className="
                              h-full
                              w-full
                              object-cover
                              transition-transform
                              duration-500
                              group-hover:scale-[1.025]
                            "
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[8px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                            No image
                          </div>
                        )}
                      </div>

                      <p className="mt-3 line-clamp-2 text-[11px] font-medium leading-5">
                        {
                          item.name
                        }
                      </p>

                      <p className="mt-1 text-[11px] text-[var(--color-text-secondary)]">
                        {formatPrice(
                          item
                            .pricing
                            ?.sellingPrice ??
                            0,
                        )}
                      </p>
                    </button>
                  );
                },
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}