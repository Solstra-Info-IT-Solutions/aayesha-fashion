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
      }

      if (event.key === "ArrowLeft" && media.length > 1) {
        onChange(
          activeIndex <= 0 ? media.length - 1 : activeIndex - 1,
        );
      }

      if (event.key === "ArrowRight" && media.length > 1) {
        onChange(
          activeIndex >= media.length - 1 ? 0 : activeIndex + 1,
        );
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, activeIndex, media.length, onChange, onClose]);

  if (!open || !media.length) return null;

  const active = media[activeIndex];

  return (
    <div className="fixed inset-0 z-[100] bg-black/95">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close fullscreen gallery"
        className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center border border-white/20 text-white transition hover:bg-white hover:text-black"
      >
        <X size={20} />
      </button>

      <div className="flex h-full items-center justify-center px-12 py-12">
        {active.type === "image" ? (
          <div className="relative h-full w-full max-w-5xl">
            <Image
              src={active.src}
              alt={active.alt ?? productName}
              fill
              className="object-contain"
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
            className="max-h-full max-w-full"
          />
        ) : (
          <iframe
            src={active.src}
            title={active.alt ?? productName}
            className="h-full max-h-[85vh] w-full max-w-5xl"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      {media.length > 1 && (
        <>
          <button
            type="button"
            onClick={() =>
              onChange(
                activeIndex <= 0
                  ? media.length - 1
                  : activeIndex - 1,
              )
            }
            className="absolute left-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/20 text-white transition hover:bg-white hover:text-black"
            aria-label="Previous"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            type="button"
            onClick={() =>
              onChange(
                activeIndex >= media.length - 1
                  ? 0
                  : activeIndex + 1,
              )
            }
            className="absolute right-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/20 text-white transition hover:bg-white hover:text-black"
            aria-label="Next"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs font-medium tracking-[0.15em] text-white/65">
        {activeIndex + 1} / {media.length}
      </div>
    </div>
  );
}