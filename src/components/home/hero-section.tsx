"use client";

import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Pause,
  Play,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { HomepageHeroSlide } from "@/types/homepage";

const AUTOPLAY_DELAY = 6000;

interface HeroSectionProps {
  slides: HomepageHeroSlide[];
}

export function HeroSection({
  slides,
}: HeroSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const totalSlides = slides.length;

  /* =========================================================
     SAFETY
  ========================================================= */

  useEffect(() => {
    if (activeIndex >= totalSlides && totalSlides > 0) {
      setActiveIndex(0);
    }
  }, [activeIndex, totalSlides]);

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const goToSlide = useCallback(
    (index: number) => {
      if (totalSlides === 0) {
        return;
      }

      setActiveIndex(
        (index + totalSlides) % totalSlides
      );
    },
    [totalSlides]
  );

  const nextSlide = useCallback(() => {
    if (totalSlides === 0) {
      return;
    }

    setActiveIndex(
      (current) => (current + 1) % totalSlides
    );
  }, [totalSlides]);

  const previousSlide = useCallback(() => {
    if (totalSlides === 0) {
      return;
    }

    setActiveIndex(
      (current) =>
        (current - 1 + totalSlides) % totalSlides
    );
  }, [totalSlides]);

  /* =========================================================
     AUTOPLAY
  ========================================================= */

  useEffect(() => {
    if (isPaused || totalSlides <= 1) {
      return;
    }

    const interval = window.setInterval(
      nextSlide,
      AUTOPLAY_DELAY
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [
    isPaused,
    nextSlide,
    totalSlides,
  ]);

  /* =========================================================
     KEYBOARD
  ========================================================= */

  useEffect(() => {
    if (totalSlides <= 1) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === "ArrowRight") {
        nextSlide();
      }

      if (event.key === "ArrowLeft") {
        previousSlide();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    nextSlide,
    previousSlide,
    totalSlides,
  ]);

  /* =========================================================
     REDUCED MOTION
  ========================================================= */

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (mediaQuery.matches) {
      setIsPaused(true);
    }
  }, []);

  /* =========================================================
     TOUCH / SWIPE
  ========================================================= */

  function handleTouchStart(
    event: React.TouchEvent<HTMLDivElement>
  ) {
    touchStartX.current =
      event.touches[0]?.clientX ?? null;

    touchEndX.current =
      touchStartX.current;
  }

  function handleTouchMove(
    event: React.TouchEvent<HTMLDivElement>
  ) {
    touchEndX.current =
      event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd() {
    if (
      touchStartX.current === null ||
      touchEndX.current === null
    ) {
      return;
    }

    const distance =
      touchStartX.current -
      touchEndX.current;

    if (Math.abs(distance) >= 50) {
      if (distance > 0) {
        nextSlide();
      } else {
        previousSlide();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  }

  /* =========================================================
     EMPTY STATE
  ========================================================= */

  if (totalSlides === 0) {
    return null;
  }

  const activeSlide =
    slides[activeIndex];

  return (
    <section
      aria-label="Ayesha Fashion featured banners"
      className="relative w-full overflow-hidden bg-[var(--color-warm-gray)]"
    >
      {/* =====================================================
          BANNER STAGE

          The parent MUST have an aspect ratio because all
          slides are absolutely positioned.
      ===================================================== */}

      <div
        className="
          relative
          aspect-[4/5]
          w-full
          overflow-hidden
          md:aspect-[16/11]
        "
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* ===================================================
            SLIDES
        =================================================== */}

        {slides.map((slide, index) => {
          const isActive =
            index === activeIndex;

          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={[
                "absolute inset-0",
                "transition-opacity duration-1000 ease-in-out",
                isActive
                  ? "z-10 opacity-100"
                  : "z-0 opacity-0",
              ].join(" ")}
            >
              {/* =============================================
                  DESKTOP
              ============================================= */}

              <div className="absolute inset-0 hidden items-center justify-center md:flex">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-contain"
                />
              </div>

              {/* =============================================
                  MOBILE
              ============================================= */}

              <div className="absolute inset-0 flex items-center justify-center md:hidden">
                <Image
                  src={
                    slide.mobileImage ||
                    slide.image
                  }
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
            </div>
          );
        })}

        {/* ===================================================
            PREVIOUS / NEXT
        =================================================== */}

        {totalSlides > 1 && (
          <div
            className="
              absolute
              bottom-5
              right-5
              z-30
              flex
              items-center
              gap-2
              sm:bottom-7
              sm:right-7
              lg:bottom-8
              lg:right-10
              xl:right-14
            "
          >
            <button
              type="button"
              onClick={previousSlide}
              aria-label="Previous banner"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                border
                border-white/55
                bg-black/10
                text-white
                transition-all
                duration-300
                hover:border-white
                hover:bg-white
                hover:text-[var(--color-charcoal)]
                sm:h-11
                sm:w-11
              "
            >
              <ArrowLeft
                size={16}
                strokeWidth={1.4}
              />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next banner"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                border
                border-white/55
                bg-black/10
                text-white
                transition-all
                duration-300
                hover:border-white
                hover:bg-white
                hover:text-[var(--color-charcoal)]
                sm:h-11
                sm:w-11
              "
            >
              <ArrowRight
                size={16}
                strokeWidth={1.4}
              />
            </button>
          </div>
        )}

        {/* ===================================================
            INDICATORS
        =================================================== */}

        {totalSlides > 1 && (
          <div
            className="
              absolute
              bottom-7
              left-5
              z-30
              flex
              items-center
              gap-2
              sm:left-8
              lg:left-10
              xl:left-14
            "
          >
            {slides.map(
              (slide, index) => {
                const isActive =
                  index === activeIndex;

                return (
                  <button
                    key={slide.id}
                    type="button"
                    aria-label={`Go to banner ${
                      index + 1
                    }`}
                    aria-current={
                      isActive
                    }
                    onClick={() =>
                      goToSlide(index)
                    }
                    className="group flex h-7 items-center"
                  >
                    <span
                      className={[
                        "h-px transition-all duration-500",
                        isActive
                          ? "w-10 bg-white"
                          : "w-5 bg-white/55 group-hover:w-8 group-hover:bg-white",
                      ].join(" ")}
                    />
                  </button>
                );
              }
            )}
          </div>
        )}

        {/* ===================================================
            PAUSE / PLAY
        =================================================== */}

        {totalSlides > 1 && (
          <button
            type="button"
            onClick={() =>
              setIsPaused(
                (value) => !value
              )
            }
            aria-label={
              isPaused
                ? "Resume banners"
                : "Pause banners"
            }
            className="
              absolute
              bottom-8
              left-1/2
              z-30
              hidden
              -translate-x-1/2
              text-white/70
              transition-colors
              duration-300
              hover:text-white
              md:block
            "
          >
            {isPaused ? (
              <Play
                size={14}
                strokeWidth={1.4}
              />
            ) : (
              <Pause
                size={14}
                strokeWidth={1.4}
              />
            )}
          </button>
        )}

        {/* ===================================================
            SCREEN READER CONTENT

            Keeps the backend-provided content available
            without changing the visual design.
        =================================================== */}

        <div className="sr-only">
          <h1>{activeSlide.title}</h1>

          {activeSlide.eyebrow && (
            <p>{activeSlide.eyebrow}</p>
          )}

          {activeSlide.description && (
            <p>
              {activeSlide.description}
            </p>
          )}

          {activeSlide.buttonLabel &&
            activeSlide.href && (
              <a href={activeSlide.href}>
                {activeSlide.buttonLabel}
              </a>
            )}
        </div>
      </div>
    </section>
  );
}