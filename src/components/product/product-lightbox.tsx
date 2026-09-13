"use client";

import Image from "next/image";
import { useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import type { ProductMedia } from "@/types/product";

interface ProductLightboxProps {
  open: boolean;
  media: ProductMedia[];
  activeIndex: number;
  productName: string;
  onClose: () => void;
  onChange: (index: number) => void;
}

export function ProductLightbox({
  open,
  media,
  activeIndex,
  productName,
  onClose,
  onChange,
}: ProductLightboxProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (
        event.key === "ArrowLeft" &&
        media.length > 1
      ) {
        onChange(
          activeIndex <= 0
            ? media.length - 1
            : activeIndex - 1,
        );
      }

      if (
        event.key === "ArrowRight" &&
        media.length > 1
      ) {
        onChange(
          activeIndex >= media.length - 1
            ? 0
            : activeIndex + 1,
        );
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [
    open,
    activeIndex,
    media.length,
    onChange,
    onClose,
  ]);

  if (!open || !media.length) {
    return null;
  }

  const safeIndex =
    activeIndex >= 0 &&
    activeIndex < media.length
      ? activeIndex
      : 0;

  const active = media[safeIndex];

  const previousIndex =
    safeIndex <= 0
      ? media.length - 1
      : safeIndex - 1;

  const nextIndex =
    safeIndex >= media.length - 1
      ? 0
      : safeIndex + 1;

  return (
    <div
      className="
        fixed
        inset-0
        z-[var(--z-modal)]
        bg-[var(--color-text)]/97
        text-[var(--color-text-inverse)]
      "
      role="dialog"
      aria-modal="true"
      aria-label={`${productName} fullscreen gallery`}
    >
      {/* =====================================================
          BACKDROP
      ===================================================== */}

      <button
        type="button"
        onClick={onClose}
        aria-label="Close fullscreen gallery"
        className="
          absolute
          inset-0
          cursor-default
        "
      />

      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <div
        className="
          absolute
          inset-x-0
          top-0
          z-20
          flex
          items-center
          justify-between
          border-b
          border-white/10
          px-4
          py-4
          sm:px-7
          sm:py-5
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
              text-white/45
            "
          >
            Product View
          </p>

          <p
            className="
              mt-1
              max-w-[180px]
              truncate
              font-body
              text-[10px]
              tracking-[0.04em]
              text-white/80
              sm:max-w-sm
            "
          >
            {productName}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close fullscreen gallery"
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            border
            border-white/15
            text-white/85
            transition-all
            duration-[var(--duration-base)]
            hover:border-white/40
            hover:bg-white
            hover:text-[var(--color-text)]
            focus-visible:outline-none
            focus-visible:ring-1
            focus-visible:ring-white
            focus-visible:ring-offset-2
            focus-visible:ring-offset-[var(--color-text)]
            sm:h-11
            sm:w-11
          "
        >
          <X
            size={18}
            strokeWidth={1.25}
          />
        </button>
      </div>

      {/* =====================================================
          MAIN MEDIA
      ===================================================== */}

      <div
        className="
          relative
          z-10
          flex
          h-full
          w-full
          items-center
          justify-center
          px-14
          py-24
          sm:px-24
          sm:py-28
        "
      >
        {active.type === "image" ? (
          <div
            className="
              relative
              h-full
              w-full
              max-w-6xl
            "
          >
            <Image
              src={active.src}
              alt={
                active.alt ??
                productName
              }
              fill
              className="
                object-contain
                select-none
              "
              sizes="100vw"
              priority
            />
          </div>
        ) : active.type === "video" ? (
          <video
            src={active.src}
            poster={active.poster}
            controls
            autoPlay
            playsInline
            aria-label={
              active.alt ??
              productName
            }
            className="
              max-h-full
              max-w-full
              object-contain
              outline-none
            "
          />
        ) : (
          <iframe
            src={active.src}
            title={
              active.alt ??
              productName
            }
            className="
              h-full
              max-h-[82vh]
              w-full
              max-w-6xl
              border
              border-white/10
            "
            allow="
              autoplay;
              encrypted-media;
              picture-in-picture
            "
            allowFullScreen
          />
        )}
      </div>

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      {media.length > 1 && (
        <>
          <button
            type="button"
            onClick={() =>
              onChange(previousIndex)
            }
            aria-label="Previous product media"
            className="
              absolute
              left-3
              top-1/2
              z-30
              flex
              h-11
              w-11
              -translate-y-1/2
              items-center
              justify-center
              border
              border-white/15
              bg-black/10
              text-white/85
              backdrop-blur-sm
              transition-all
              duration-[var(--duration-base)]
              hover:border-white/40
              hover:bg-white
              hover:text-[var(--color-text)]
              focus-visible:outline-none
              focus-visible:ring-1
              focus-visible:ring-white
              sm:left-6
              sm:h-12
              sm:w-12
            "
          >
            <ChevronLeft
              size={20}
              strokeWidth={1.25}
            />
          </button>

          <button
            type="button"
            onClick={() =>
              onChange(nextIndex)
            }
            aria-label="Next product media"
            className="
              absolute
              right-3
              top-1/2
              z-30
              flex
              h-11
              w-11
              -translate-y-1/2
              items-center
              justify-center
              border
              border-white/15
              bg-black/10
              text-white/85
              backdrop-blur-sm
              transition-all
              duration-[var(--duration-base)]
              hover:border-white/40
              hover:bg-white
              hover:text-[var(--color-text)]
              focus-visible:outline-none
              focus-visible:ring-1
              focus-visible:ring-white
              sm:right-6
              sm:h-12
              sm:w-12
            "
          >
            <ChevronRight
              size={20}
              strokeWidth={1.25}
            />
          </button>
        </>
      )}

      {/* =====================================================
          BOTTOM META
      ===================================================== */}

      <div
        className="
          absolute
          inset-x-0
          bottom-0
          z-20
          flex
          items-center
          justify-center
          border-t
          border-white/10
          px-5
          py-4
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
            font-body
            text-[9px]
            font-medium
            uppercase
            tracking-[0.2em]
            text-white/55
          "
        >
          <span>
            {String(safeIndex + 1).padStart(
              2,
              "0",
            )}
          </span>

          <span
            className="
              h-px
              w-8
              bg-white/20
            "
            aria-hidden="true"
          />

          <span>
            {String(media.length).padStart(
              2,
              "0",
            )}
          </span>
        </div>
      </div>
    </div>
  );
}