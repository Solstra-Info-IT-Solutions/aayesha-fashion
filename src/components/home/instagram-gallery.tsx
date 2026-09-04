import Image from "next/image";

import { Container } from "@/components/shared/container";
import { LinkButton } from "@/components/ui/button";

const instagramPosts = [
  {
    id: "instagram-01",
    src: "/images/instagram/instagram-01.jpg",
    alt: "Ayesha Fashion festive editorial",
  },
  {
    id: "instagram-02",
    src: "/images/instagram/instagram-02.jpg",
    alt: "Ayesha Fashion traditional styling",
  },
  {
    id: "instagram-03",
    src: "/images/instagram/instagram-03.jpg",
    alt: "Ayesha Fashion contemporary collection",
  },
  {
    id: "instagram-04",
    src: "/images/instagram/instagram-04.jpg",
    alt: "Ayesha Fashion detail and craftsmanship",
  },
  {
    id: "instagram-05",
    src: "/images/instagram/instagram-05.jpg",
    alt: "Ayesha Fashion lifestyle editorial",
  },
  {
    id: "instagram-06",
    src: "/images/instagram/instagram-06.jpg",
    alt: "Ayesha Fashion signature collection",
  },
] as const;

export function InstagramGallery() {
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
                  Social Journal
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
                Follow the{" "}
                <span className="italic text-[var(--color-rose-dark)]">
                  house.
                </span>
              </h2>

              <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.28em] text-[var(--color-text-muted)] sm:text-[10px]">
                @ayeshafashion
              </p>
            </div>
          </div>

          {/* =====================================================
              INSTAGRAM GRID
          ===================================================== */}

          <div className="mt-12 grid grid-cols-2 gap-3 sm:mt-14 sm:grid-cols-3 sm:gap-5 lg:mt-16 lg:gap-6">
            {instagramPosts.map((post) => (
              <a
                key={post.id}
                href="https://instagram.com/"
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

          {/* =====================================================
              CTA
          ===================================================== */}

          <div className="mt-10 flex justify-center border-t border-[var(--color-border)] pt-7 sm:mt-12">
            <LinkButton
              href="https://instagram.com/"
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
              Visit Our Instagram
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
}