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
        <div className="py-7 sm:py-9 lg:py-11">
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-px w-7 bg-[var(--color-rose-dark)]" />

              <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[var(--color-text-secondary)] sm:text-[9px]">
                {data.eyebrow}
              </p>
            </div>

            <span className="font-display text-sm text-[var(--color-text-muted)] sm:text-base">
              {String(posts.length).padStart(2, "0")}
            </span>
          </div>

          {/* TITLE */}
          <div className="mt-7 text-center sm:mt-9">
            <h2
              className="
                font-display
                text-[2.7rem]
                font-medium
                leading-[0.95]
                tracking-[-0.045em]
                text-[var(--color-charcoal)]
                sm:text-[3.6rem]
                md:text-[4.3rem]
                lg:text-[4.9rem]
                xl:text-[5.2rem]
              "
            >
              {data.title.lineOne}{" "}
              <span className="italic text-[var(--color-rose-dark)]">
                {data.title.lineTwo}
              </span>
            </h2>

            <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.26em] text-[var(--color-text-muted)] sm:text-[10px]">
              {data.handle}
            </p>
          </div>

          {/* INSTAGRAM GRID */}
          {posts.length > 0 && (
            <div className="mt-7 grid grid-cols-2 gap-2.5 sm:mt-9 sm:grid-cols-3 sm:gap-4 lg:mt-10 lg:gap-5">
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
                        bottom-3
                        right-3
                        flex
                        h-8
                        w-8
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

          {/* CTA */}
          {data.instagramUrl && (
            <div className="mt-7 flex justify-center sm:mt-9">
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