"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Play,
} from "lucide-react";

import type { Product, ProductMedia } from "@/types/product";
import { ProductLightbox } from "@/components/product/product-lightbox";

interface ProductMediaGalleryProps {
  product: Product;
}

export function ProductMediaGallery({
  product,
}: ProductMediaGalleryProps) {
  const media = product.media ?? [];

  const primary =
    media.find((item) => item.isPrimary) ??
    media.find((item) => item.type === "image") ??
    media[0];

  const [activeId, setActiveId] = useState(primary?.id ?? "");
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activeIndex = Math.max(
    0,
    media.findIndex((item) => item.id === activeId),
  );

  const activeMedia = media[activeIndex] ?? primary;

  const goPrevious = () => {
    if (!media.length) return;

    const nextIndex =
      activeIndex <= 0 ? media.length - 1 : activeIndex - 1;

    setActiveId(media[nextIndex].id);
  };

  const goNext = () => {
    if (!media.length) return;

    const nextIndex =
      activeIndex >= media.length - 1 ? 0 : activeIndex + 1;

    setActiveId(media[nextIndex].id);
  };

  if (!activeMedia) {
    return (
      <div className="flex aspect-[3/4] items-center justify-center bg-[var(--color-cream)]">
        <span className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
          No media available
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[72px_minmax(0,1fr)]">
        {/* THUMBNAILS */}
        <div className="order-2 flex gap-2 overflow-x-auto lg:order-1 lg:flex-col">
          {media.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveId(item.id)}
              aria-label={`View product media ${index + 1}`}
              className={[
                "relative h-20 w-16 shrink-0 overflow-hidden border bg-[var(--color-cream)] transition sm:h-24 sm:w-[72px]",
                item.id === activeId
                  ? "border-[var(--color-charcoal)]"
                  : "border-transparent",
              ].join(" ")}
            >
              {item.type === "image" ? (
                <Image
                  src={item.src}
                  alt={item.alt ?? product.name}
                  fill
                  className="object-cover"
                  sizes="72px"
                />
              ) : (
                <>
                  {item.poster ? (
                    <Image
                      src={item.poster}
                      alt={item.alt ?? `${product.name} video`}
                      fill
                      className="object-cover"
                      sizes="72px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[var(--color-charcoal)]">
                      <Play
                        size={17}
                        className="text-white"
                        fill="currentColor"
                      />
                    </div>
                  )}

                  <span className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90">
                      <Play size={11} fill="currentColor" />
                    </span>
                  </span>
                </>
              )}
            </button>
          ))}
        </div>

        {/* MAIN MEDIA */}
        <div className="order-1 relative overflow-hidden bg-[var(--color-cream)] lg:order-2">
          <div className="relative aspect-[3/4]">
            {activeMedia.type === "image" ? (
              <Image
                src={activeMedia.src}
                alt={activeMedia.alt ?? product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1023px) 100vw, 58vw"
              />
            ) : activeMedia.type === "video" ? (
              <video
                src={activeMedia.src}
                poster={activeMedia.poster}
                controls
                playsInline
                className="h-full w-full object-cover"
              />
            ) : activeMedia.type === "external-video" ? (
              <iframe
                src={activeMedia.src}
                title={activeMedia.alt ?? product.name}
                className="h-full w-full"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <Image
                src={activeMedia.src}
                alt={activeMedia.alt ?? product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1023px) 100vw, 58vw"
              />
            )}

            {/* TOP RIGHT */}
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label="Open product media fullscreen"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border border-white/70 bg-white/90 text-[var(--color-charcoal)] transition hover:bg-white"
            >
              <Maximize2 size={16} />
            </button>

            {/* NAVIGATION */}
            {media.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrevious}
                  aria-label="Previous product media"
                  className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-white/90 text-[var(--color-charcoal)] transition hover:bg-white"
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next product media"
                  className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-white/90 text-[var(--color-charcoal)] transition hover:bg-white"
                >
                  <ChevronRight size={18} />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/55 px-3 py-1.5 text-[10px] font-semibold tracking-[0.12em] text-white">
                  {activeIndex + 1} / {media.length}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <ProductLightbox
        open={lightboxOpen}
        media={media}
        activeIndex={activeIndex}
        productName={product.name}
        onClose={() => setLightboxOpen(false)}
        onChange={(index) => setActiveId(media[index].id)}
      />
    </>
  );
}