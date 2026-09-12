import Image from "next/image";

import { Container } from "@/components/shared/container";
import { LinkButton } from "@/components/ui/button";
import type { HomepageInstagram } from "@/types/homepage";

interface InstagramGalleryProps {
  data: HomepageInstagram;
}

export function InstagramGallery({
  data,
}: InstagramGalleryProps) {
  const posts = data.posts
    .filter((post) => post.isActive)
    .sort(
      (a, b) => a.sortOrder - b.sortOrder
    );

  return (
    <section
      id="instagram"
      className="bg-[var(--color-ivory)]"
    >
      <Container>
        <div className="pt-16 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24">
          {/* =====================================================
              HEADER
          ===================================================== */}

          <div className="border-t border-[var(--color-border)] pt-5 sm:pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="h-px w-9 bg-[var(--color-rose-dark)]" />

                <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-[var(--color-text-secondary)] sm:text-[9px]">
                  {data.eyebrow}
                </p>
              </div>

              <span className="font-display text-lg text-[var(--color-text-muted)] sm:text-xl">
                12
              </span>
            </div>

            <div className="mt-9 text-center sm:mt-11">
              <h2
                className="
                  font-display
                  text-[3rem]
                  font-medium
                  leading-none
                  tracking-[-0.045em]
                  text-[var(--color-charcoal)]
                  sm:text-[4rem]
                  md:text-[4.8rem]
                  lg:text-[5.4rem]
                "
              >
                {data.title.lineOne}{" "}
                <span className="italic text-[var(--color-rose-dark)]">
                  {data.title.lineTwo}
                </span>
              </h2>

              <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.28em] text-[var(--color-text-muted)] sm:text-[10px]">
                {data.handle}
              </p>
            </div>
          </div>

          {/* =====================================================
              INSTAGRAM GRID
          ===================================================== */}

          {posts.length > 0 && (
            <div className="mt-12 grid grid-cols-2 gap-3 sm:mt-14 sm:grid-cols-3 sm:gap-5 lg:mt-16 lg:gap-6">
              {posts.map((post) => (
                <a
                  key={post.id}
                  href={
                    post.href ||
                    data.instagramUrl
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${post.alt} on Instagram`}
                  className="group relative block overflow-hidden bg-[var(--color-warm-gray)]"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={post.src}
                      alt={post.alt}
                      fill
                      sizes="
                        (max-width: 639px) 50vw,
                        (max-width: 1023px) 33vw,
                        33vw
                      "
                      className="
                        object-cover
                        object-center
                        transition-transform
                        duration-[1000ms]
                        ease-out
                        group-hover:scale-[1.035]
                      "
                    />

                    {/* HOVER OVERLAY */}

                    <div
                      className="
                        absolute
                        inset-0
                        bg-black/0
                        transition-colors
                        duration-500
                        group-hover:bg-black/20
                      "
                    />

                    {/* HOVER ICON */}

                    <span
                      className="
                        absolute
                        bottom-4
                        right-4
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        border
                        border-white/50
                        bg-black/10
                        text-white
                        opacity-0
                        backdrop-blur-sm
                        transition-all
                        duration-300
                        group-hover:opacity-100
                      "
                    >
                      ↗
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* =====================================================
              CTA
          ===================================================== */}

          {data.instagramUrl && (
            <div className="mt-10 flex justify-center border-t border-[var(--color-border)] pt-7 sm:mt-12">
              <LinkButton
                href={data.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="md"
                icon={
                  <span aria-hidden="true">
                    ↗
                  </span>
                }
              >
                {data.ctaLabel}
              </LinkButton>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}