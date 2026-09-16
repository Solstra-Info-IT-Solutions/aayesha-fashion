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
    if (
      activeIndex >= totalSlides &&
      totalSlides > 0
    ) {
      setActiveIndex(0);
    }
  }, [activeIndex, totalSlides]);

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const goToSlide = useCallback(
    (index: number) => {
      if (totalSlides === 0) return;

      setActiveIndex(
        (index + totalSlides) % totalSlides,
      );
    },
    [totalSlides],
  );

  const nextSlide = useCallback(() => {
    if (totalSlides === 0) return;

    setActiveIndex(
      (current) =>
        (current + 1) % totalSlides,
    );
  }, [totalSlides]);

  const previousSlide = useCallback(() => {
    if (totalSlides === 0) return;

    setActiveIndex(
      (current) =>
        (current - 1 + totalSlides) %
        totalSlides,
    );
  }, [totalSlides]);

  /* =========================================================
     AUTOPLAY
  ========================================================= */

  useEffect(() => {
    if (
      isPaused ||
      totalSlides <= 1
    ) {
      return;
    }

    const interval =
      window.setInterval(
        nextSlide,
        AUTOPLAY_DELAY,
      );

    return () => {
      window.clearInterval(
        interval,
      );
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
      event: KeyboardEvent,
    ) {
      if (
        event.key === "ArrowRight"
      ) {
        nextSlide();
      }

      if (
        event.key === "ArrowLeft"
      ) {
        previousSlide();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
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
    const mediaQuery =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );

    if (mediaQuery.matches) {
      setIsPaused(true);
    }
  }, []);

  /* =========================================================
     TOUCH / SWIPE
  ========================================================= */

  function handleTouchStart(
    event: React.TouchEvent<HTMLDivElement>,
  ) {
    touchStartX.current =
      event.touches[0]?.clientX ??
      null;

    touchEndX.current =
      touchStartX.current;
  }

  function handleTouchMove(
    event: React.TouchEvent<HTMLDivElement>,
  ) {
    touchEndX.current =
      event.touches[0]?.clientX ??
      null;
  }

  function handleTouchEnd() {
    if (
      touchStartX.current ===
        null ||
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
      className="
        w-full
        overflow-hidden
        bg-[var(--color-bg-soft)]
      "
    >
      {/* =====================================================
          HERO
      ===================================================== */}

      <div
        className="
          relative
          h-[72svh]
          min-h-[500px]
          max-h-[760px]
          w-full
          overflow-hidden
          sm:h-[76svh]
          md:h-[78svh]
          md:min-h-[560px]
          lg:h-[80svh]
          lg:max-h-[800px]
        "
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* ===================================================
            SLIDES
        =================================================== */}

        {slides.map(
          (slide, index) => {
            const isActive =
              index === activeIndex;

            return (
              <div
                key={slide.id}
                aria-hidden={!isActive}
                className={[
                  "absolute inset-0",
                  "transition-opacity duration-1000",
                  "ease-out",
                  isActive
                    ? "z-10 opacity-100"
                    : "z-0 opacity-0",
                ].join(" ")}
              >
                {/* -------------------------------------------
                    DESKTOP IMAGE
                ------------------------------------------- */}

                <div className="absolute inset-0 hidden md:block">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="
                      object-cover
                      object-center
                    "
                  />
                </div>

                {/* -------------------------------------------
                    MOBILE IMAGE
                ------------------------------------------- */}

                <div className="absolute inset-0 md:hidden">
                  <Image
                    src={
                      slide.mobileImage ||
                      slide.image
                    }
                    alt={slide.title}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="
                      object-cover
                      object-center
                    "
                  />
                </div>

                {/* -------------------------------------------
                    LIGHT OVERLAY
                ------------------------------------------- */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/45
                    via-black/5
                    to-transparent
                  "
                />

                {/* -------------------------------------------
                    MINIMAL CONTENT
                ------------------------------------------- */}

                <div
                  className="
                    absolute
                    inset-x-0
                    bottom-0
                    z-20
                  "
                >
                  <div
                    className="
                      mx-auto
                      w-full
                      max-w-[1440px]
                      px-5
                      pb-20
                      sm:px-8
                      sm:pb-24
                      lg:px-12
                      lg:pb-28
                      xl:px-16
                    "
                  >
                    <div
                      className="
                        max-w-[520px]
                        text-white
                      "
                    >
                      {/* TITLE */}

                      <h1
                        className="
                          font-display
                          text-[2rem]
                          font-normal
                          leading-[1.05]
                          tracking-[-0.025em]
                          sm:text-[2.5rem]
                          md:text-[3rem]
                          lg:text-[3.5rem]
                        "
                      >
                        {slide.title}
                      </h1>

                      {/* CTA */}

                      {slide.buttonLabel &&
                        slide.href && (
                          <a
                            href={
                              slide.href
                            }
                            className="
                              group
                              mt-5
                              inline-flex
                              items-center
                              gap-2.5
                              border-b
                              border-white/70
                              pb-1.5
                              font-body
                              text-[10px]
                              font-medium
                              uppercase
                              tracking-[0.2em]
                              text-white
                              transition-colors
                              duration-300
                              hover:border-white
                              sm:mt-6
                              sm:text-[11px]
                            "
                          >
                            <span>
                              {
                                slide.buttonLabel
                              }
                            </span>

                            <ArrowRight
                              size={
                                14
                              }
                              strokeWidth={
                                1.3
                              }
                              className="
                                transition-transform
                                duration-300
                                group-hover:translate-x-1
                              "
                            />
                          </a>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            );
          },
        )}

        {/* ===================================================
            CONTROLS
        =================================================== */}

        {totalSlides > 1 && (
          <>
            {/* ---------------------------------------------
                SLIDE INDICATORS
            --------------------------------------------- */}

            <div
              className="
                absolute
                bottom-7
                left-5
                z-30
                flex
                items-center
                gap-1.5
                sm:bottom-8
                sm:left-8
                lg:bottom-10
                lg:left-12
                xl:left-16
              "
              aria-label="Slide navigation"
            >
              {slides.map(
                (slide, index) => {
                  const isActive =
                    index ===
                    activeIndex;

                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() =>
                        goToSlide(
                          index,
                        )
                      }
                      aria-label={`Go to banner ${
                        index + 1
                      }`}
                      aria-current={
                        isActive
                          ? "true"
                          : undefined
                      }
                      className="
                        flex
                        h-5
                        items-center
                        px-0.5
                      "
                    >
                      <span
                        className={[
                          "block h-px",
                          "transition-all duration-500",
                          isActive
                            ? "w-8 bg-white"
                            : "w-4 bg-white/45",
                        ].join(" ")}
                      />
                    </button>
                  );
                },
              )}
            </div>

            {/* ---------------------------------------------
                PREVIOUS / NEXT
            --------------------------------------------- */}

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
                sm:right-8
                lg:bottom-9
                lg:right-12
                xl:right-16
              "
            >
              <button
                type="button"
                onClick={
                  previousSlide
                }
                aria-label="Previous banner"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  border
                  border-white/50
                  bg-black/10
                  text-white
                  backdrop-blur-sm
                  transition-all
                  duration-300
                  hover:border-white
                  hover:bg-white
                  hover:text-[var(--color-text)]
                  sm:h-10
                  sm:w-10
                "
              >
                <ArrowLeft
                  size={14}
                  strokeWidth={1.3}
                />
              </button>

              <button
                type="button"
                onClick={
                  nextSlide
                }
                aria-label="Next banner"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  border
                  border-white/50
                  bg-black/10
                  text-white
                  backdrop-blur-sm
                  transition-all
                  duration-300
                  hover:border-white
                  hover:bg-white
                  hover:text-[var(--color-text)]
                  sm:h-10
                  sm:w-10
                "
              >
                <ArrowRight
                  size={14}
                  strokeWidth={1.3}
                />
              </button>
            </div>

            {/* ---------------------------------------------
                PAUSE / PLAY
            --------------------------------------------- */}

            <button
              type="button"
              onClick={() =>
                setIsPaused(
                  (value) =>
                    !value,
                )
              }
              aria-label={
                isPaused
                  ? "Resume banners"
                  : "Pause banners"
              }
              className="
                absolute
                bottom-7
                left-1/2
                z-30
                hidden
                -translate-x-1/2
                text-white/60
                transition-colors
                duration-300
                hover:text-white
                md:block
              "
            >
              {isPaused ? (
                <Play
                  size={12}
                  strokeWidth={1.3}
                />
              ) : (
                <Pause
                  size={12}
                  strokeWidth={1.3}
                />
              )}
            </button>
          </>
        )}

        {/* ===================================================
            SCREEN READER CONTENT
        =================================================== */}

        <div className="sr-only">
          <h1>
            {activeSlide.title}
          </h1>

          {activeSlide.eyebrow && (
            <p>
              {
                activeSlide.eyebrow
              }
            </p>
          )}

          {activeSlide.subtitle && (
            <p>
              {
                activeSlide.subtitle
              }
            </p>
          )}

          {activeSlide.description && (
            <p>
              {
                activeSlide.description
              }
            </p>
          )}

          {activeSlide.buttonLabel &&
            activeSlide.href && (
              <a
                href={
                  activeSlide.href
                }
              >
                {
                  activeSlide.buttonLabel
                }
              </a>
            )}
        </div>
      </div>
    </section>
  );
}