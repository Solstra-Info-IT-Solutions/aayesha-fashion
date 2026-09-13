"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Play,
} from "lucide-react";

import type {
  Product,
} from "@/types/product";

import { ProductLightbox } from "@/components/product/product-lightbox";

interface ProductMediaGalleryProps {
  product: Product;
}

export function ProductMediaGallery({
  product,
}: ProductMediaGalleryProps) {
  const media = product.media ?? [];

  const primary =
    media.find(
      (item) => item.isPrimary,
    ) ??
    media.find(
      (item) => item.type === "image",
    ) ??
    media[0];

  const [activeId, setActiveId] =
    useState(primary?.id ?? "");

  const [lightboxOpen, setLightboxOpen] =
    useState(false);

  const activeIndex = Math.max(
    0,
    media.findIndex(
      (item) =>
        item.id === activeId,
    ),
  );

  const activeMedia =
    media[activeIndex] ?? primary;

  const goPrevious = () => {
    if (!media.length) return;

    const nextIndex =
      activeIndex <= 0
        ? media.length - 1
        : activeIndex - 1;

    setActiveId(
      media[nextIndex].id,
    );
  };

  const goNext = () => {
    if (!media.length) return;

    const nextIndex =
      activeIndex >= media.length - 1
        ? 0
        : activeIndex + 1;

    setActiveId(
      media[nextIndex].id,
    );
  };

  if (!activeMedia) {
    return (
      <div
        className="
          flex
          aspect-[3/4]
          items-center
          justify-center
          border
          border-[var(--color-border-light)]
          bg-[var(--color-bg-soft)]
        "
      >
        <span
          className="
            font-body
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.18em]
            text-[var(--color-text-muted)]
          "
        >
          No media available
        </span>
      </div>
    );
  }

  return (
    <>
      <div
        className="
          grid
          gap-3
          lg:grid-cols-[76px_minmax(0,1fr)]
          lg:gap-4
        "
      >
        {/* =====================================================
            THUMBNAILS
        ===================================================== */}

        <div
          className="
            order-2
            flex
            gap-2
            overflow-x-auto
            pb-1
            scrollbar-none
            lg:order-1
            lg:flex-col
            lg:overflow-visible
            lg:pb-0
          "
        >
          {media.map(
            (item, index) => {
              const isActive =
                item.id === activeId;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setActiveId(
                      item.id,
                    )
                  }
                  aria-label={`View product media ${
                    index + 1
                  }`}
                  aria-current={
                    isActive
                      ? "true"
                      : undefined
                  }
                  className={[
                    `
                      group/thumb
                      relative
                      h-[82px]
                      w-[64px]
                      shrink-0
                      overflow-hidden
                      border
                      bg-[var(--color-bg-soft)]
                      transition-all
                      duration-[var(--duration-base)]
                      ease-[var(--ease-luxury)]
                      sm:h-[94px]
                      sm:w-[72px]
                    `,
                    isActive
                      ? `
                        border-[var(--color-text)]
                      `
                      : `
                        border-[var(--color-border-light)]
                        hover:border-[var(--color-border-dark)]
                      `,
                  ].join(" ")}
                >
                  {item.type ===
                  "image" ? (
                    <Image
                      src={item.src}
                      alt={
                        item.alt ??
                        product.name
                      }
                      fill
                      className="
                        object-cover
                        transition-transform
                        duration-[var(--duration-slow)]
                        ease-[var(--ease-luxury)]
                        group-hover/thumb:scale-105
                      "
                      sizes="72px"
                    />
                  ) : (
                    <>
                      {item.poster ? (
                        <Image
                          src={
                            item.poster
                          }
                          alt={
                            item.alt ??
                            `${product.name} video`
                          }
                          fill
                          className="
                            object-cover
                            transition-transform
                            duration-[var(--duration-slow)]
                            ease-[var(--ease-luxury)]
                            group-hover/thumb:scale-105
                          "
                          sizes="72px"
                        />
                      ) : (
                        <div
                          className="
                            flex
                            h-full
                            items-center
                            justify-center
                            bg-[var(--color-text)]
                          "
                        >
                          <Play
                            size={16}
                            strokeWidth={
                              1.25
                            }
                            className="text-[var(--color-text-inverse)]"
                            fill="currentColor"
                          />
                        </div>
                      )}

                      <span
                        className="
                          absolute
                          inset-0
                          flex
                          items-center
                          justify-center
                          bg-[rgba(33,31,29,0.08)]
                        "
                      >
                        <span
                          className="
                            flex
                            h-7
                            w-7
                            items-center
                            justify-center
                            bg-[rgba(255,255,255,0.94)]
                            text-[var(--color-text)]
                          "
                        >
                          <Play
                            size={10}
                            strokeWidth={
                              1.25
                            }
                            fill="currentColor"
                          />
                        </span>
                      </span>
                    </>
                  )}

                  {/* ACTIVE INDICATOR */}

                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="
                        absolute
                        inset-x-0
                        bottom-0
                        h-[2px]
                        bg-[var(--color-text)]
                      "
                    />
                  )}
                </button>
              );
            },
          )}
        </div>

        {/* =====================================================
            MAIN MEDIA
        ===================================================== */}

        <div
          className="
            order-1
            min-w-0
            lg:order-2
          "
        >
          <div
            className="
              group/media
              relative
              overflow-hidden
              bg-[var(--color-bg-soft)]
            "
          >
            <div
              className="
                relative
                aspect-[3/4]
                w-full
              "
            >
              {activeMedia.type ===
              "image" ? (
                <Image
                  src={
                    activeMedia.src
                  }
                  alt={
                    activeMedia.alt ??
                    product.name
                  }
                  fill
                  priority
                  className="
                    object-cover
                    object-center
                    transition-transform
                    duration-[var(--duration-luxury)]
                    ease-[var(--ease-luxury)]
                    group-hover/media:scale-[1.012]
                  "
                  sizes="
                    (max-width: 1023px) 100vw,
                    (max-width: 1279px) 58vw,
                    60vw
                  "
                />
              ) : activeMedia.type ===
                "video" ? (
                <video
                  src={
                    activeMedia.src
                  }
                  poster={
                    activeMedia.poster
                  }
                  controls
                  playsInline
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />
              ) : activeMedia.type ===
                "external-video" ? (
                <iframe
                  src={
                    activeMedia.src
                  }
                  title={
                    activeMedia.alt ??
                    product.name
                  }
                  className="
                    h-full
                    w-full
                  "
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <Image
                  src={
                    activeMedia.src
                  }
                  alt={
                    activeMedia.alt ??
                    product.name
                  }
                  fill
                  className="
                    object-cover
                    object-center
                  "
                  sizes="
                    (max-width: 1023px) 100vw,
                    60vw
                  "
                />
              )}

              {/* =================================================
                  MEDIA VEIL
              ================================================= */}

              <span
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-transparent
                  transition-colors
                  duration-[var(--duration-slow)]
                  group-hover/media:bg-[rgba(33,31,29,0.018)]
                "
              />

              {/* =================================================
                  FULLSCREEN
              ================================================= */}

              <button
                type="button"
                onClick={() =>
                  setLightboxOpen(
                    true,
                  )
                }
                aria-label="Open product media fullscreen"
                className="
                  absolute
                  right-3
                  top-3
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  border
                  border-white/70
                  bg-[rgba(255,255,255,0.92)]
                  text-[var(--color-text)]
                  shadow-[var(--shadow-xs)]
                  backdrop-blur-sm
                  transition-all
                  duration-[var(--duration-base)]
                  hover:bg-white
                  hover:shadow-[var(--shadow-sm)]
                  focus-visible:outline-none
                  focus-visible:ring-1
                  focus-visible:ring-[var(--color-text)]
                  sm:right-4
                  sm:top-4
                "
              >
                <Maximize2
                  size={15}
                  strokeWidth={1.25}
                />
              </button>

              {/* =================================================
                  PREVIOUS / NEXT
              ================================================= */}

              {media.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={
                      goPrevious
                    }
                    aria-label="Previous product media"
                    className="
                      absolute
                      left-3
                      top-1/2
                      flex
                      h-10
                      w-10
                      -translate-y-1/2
                      items-center
                      justify-center
                      border
                      border-white/70
                      bg-[rgba(255,255,255,0.90)]
                      text-[var(--color-text)]
                      shadow-[var(--shadow-xs)]
                      backdrop-blur-sm
                      transition-all
                      duration-[var(--duration-base)]
                      hover:bg-white
                      focus-visible:outline-none
                      focus-visible:ring-1
                      focus-visible:ring-[var(--color-text)]
                      sm:left-4
                    "
                  >
                    <ChevronLeft
                      size={18}
                      strokeWidth={1.25}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={
                      goNext
                    }
                    aria-label="Next product media"
                    className="
                      absolute
                      right-3
                      top-1/2
                      flex
                      h-10
                      w-10
                      -translate-y-1/2
                      items-center
                      justify-center
                      border
                      border-white/70
                      bg-[rgba(255,255,255,0.90)]
                      text-[var(--color-text)]
                      shadow-[var(--shadow-xs)]
                      backdrop-blur-sm
                      transition-all
                      duration-[var(--duration-base)]
                      hover:bg-white
                      focus-visible:outline-none
                      focus-visible:ring-1
                      focus-visible:ring-[var(--color-text)]
                      sm:right-4
                    "
                  >
                    <ChevronRight
                      size={18}
                      strokeWidth={1.25}
                    />
                  </button>

                  {/* MEDIA COUNTER */}

                  <div
                    className="
                      absolute
                      bottom-3
                      left-1/2
                      -translate-x-1/2
                      border
                      border-white/20
                      bg-[rgba(33,31,29,0.68)]
                      px-3
                      py-1.5
                      font-body
                      text-[9px]
                      font-medium
                      tracking-[0.16em]
                      text-white
                      backdrop-blur-sm
                      sm:bottom-4
                    "
                    aria-live="polite"
                  >
                    {activeIndex + 1}
                    {" / "}
                    {media.length}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* MOBILE MEDIA HINT */}

          {media.length > 1 && (
            <div
              className="
                mt-3
                flex
                items-center
                justify-between
                lg:hidden
              "
            >
              <span className="eyebrow">
                Product View
              </span>

              <span
                className="
                  font-body
                  text-[9px]
                  text-[var(--color-text-muted)]
                "
              >
                Swipe or select an image
              </span>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          LIGHTBOX
      ===================================================== */}

      <ProductLightbox
        open={lightboxOpen}
        media={media}
        activeIndex={activeIndex}
        productName={product.name}
        onClose={() =>
          setLightboxOpen(false)
        }
        onChange={(index) =>
          setActiveId(
            media[index].id,
          )
        }
      />
    </>
  );
}