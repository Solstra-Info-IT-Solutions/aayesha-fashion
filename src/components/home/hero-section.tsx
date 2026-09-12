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
      (current) => (current + 1) % totalSlides,
    );
  }, [totalSlides]);

  const previousSlide = useCallback(() => {
    if (totalSlides === 0) return;

    setActiveIndex(
      (current) =>
        (current - 1 + totalSlides) % totalSlides,
    );
  }, [totalSlides]);

  /* =========================================================
     AUTOPLAY
  ========================================================= */

  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    const interval = window.setInterval(
      nextSlide,
      AUTOPLAY_DELAY,
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
    if (totalSlides <= 1) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight") {
        nextSlide();
      }

      if (event.key === "ArrowLeft") {
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
    const mediaQuery = window.matchMedia(
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
      event.touches[0]?.clientX ?? null;

    touchEndX.current =
      touchStartX.current;
  }

  function handleTouchMove(
    event: React.TouchEvent<HTMLDivElement>,
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

  const activeSlide = slides[activeIndex];

  return (
    <section
      aria-label="Ayesha Fashion featured banners"
      className="
        relative
        w-full
        overflow-hidden
        bg-[var(--color-bg-soft)]
      "
    >
      {/* =====================================================
          HERO STAGE
      ===================================================== */}

      <div
        className="
          relative
          min-h-[calc(100svh-0px)]
          w-full
          overflow-hidden
          md:min-h-[100svh]
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
                "transition-opacity duration-[1200ms]",
                "ease-[cubic-bezier(0.22,1,0.36,1)]",
                isActive
                  ? "z-10 opacity-100"
                  : "z-0 opacity-0",
              ].join(" ")}
            >
              {/* ---------------------------------------------
                  DESKTOP IMAGE
              --------------------------------------------- */}

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

              {/* ---------------------------------------------
                  MOBILE IMAGE
              --------------------------------------------- */}

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

              {/* ---------------------------------------------
                  SUBTLE CINEMATIC OVERLAY

                  Keeps text readable without making the
                  photography look dark.
              --------------------------------------------- */}

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/35
                  via-black/5
                  to-transparent
                "
              />

              {/* ---------------------------------------------
                  EDITORIAL CONTENT
              --------------------------------------------- */}

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
                    container-premium
                    pb-24
                    sm:pb-28
                    md:pb-32
                    lg:pb-36
                  "
                >
                  <div
                    className="
                      max-w-[720px]
                      text-white
                    "
                  >
                    {slide.eyebrow && (
                      <p
                        className="
                          mb-4
                          font-body
                          text-[10px]
                          font-medium
                          uppercase
                          tracking-[0.28em]
                          text-white/85
                          sm:text-[11px]
                        "
                      >
                        {slide.eyebrow}
                      </p>
                    )}

                    <h1
                      className="
                        font-display
                        text-[clamp(3.25rem,7vw,7rem)]
                        font-normal
                        leading-[0.88]
                        tracking-[-0.035em]
                        text-balance
                      "
                    >
                      {slide.title}
                    </h1>

                    {slide.subtitle && (
                      <p
                        className="
                          mt-5
                          max-w-[560px]
                          font-display
                          text-[clamp(1.25rem,2vw,1.75rem)]
                          leading-[1.15]
                          text-white/90
                        "
                      >
                        {slide.subtitle}
                      </p>
                    )}

                    {slide.description && (
                      <p
                        className="
                          mt-4
                          max-w-[500px]
                          font-body
                          text-sm
                          font-light
                          leading-6
                          text-white/80
                          sm:text-[15px]
                        "
                      >
                        {slide.description}
                      </p>
                    )}

                    {slide.buttonLabel &&
                      slide.href && (
                        <a
                          href={slide.href}
                          className="
                            group
                            mt-7
                            inline-flex
                            items-center
                            gap-4
                            border-b
                            border-white/70
                            pb-2
                            font-body
                            text-[10px]
                            font-medium
                            uppercase
                            tracking-[0.22em]
                            text-white
                            transition-all
                            duration-300
                            hover:border-white
                            sm:mt-8
                            sm:text-[11px]
                          "
                        >
                          <span>
                            {slide.buttonLabel}
                          </span>

                          <ArrowRight
                            size={15}
                            strokeWidth={1.3}
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
        })}

        {/* ===================================================
            SLIDE CONTROLS
        =================================================== */}

        {totalSlides > 1 && (
          <>
            {/* ---------------------------------------------
                PREVIOUS / NEXT
            --------------------------------------------- */}

            <div
              className="
                absolute
                bottom-7
                right-5
                z-30
                flex
                items-center
                gap-2
                sm:bottom-9
                sm:right-8
                lg:right-12
                xl:right-16
              "
            >
              <button
                type="button"
                onClick={previousSlide}
                aria-label="Previous banner"
                className="
                  group
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  border
                  border-white/45
                  bg-black/10
                  text-white
                  backdrop-blur-[2px]
                  transition-all
                  duration-300
                  hover:border-white
                  hover:bg-white
                  hover:text-[var(--color-text)]
                  sm:h-11
                  sm:w-11
                "
              >
                <ArrowLeft
                  size={15}
                  strokeWidth={1.3}
                  className="
                    transition-transform
                    duration-300
                    group-hover:-translate-x-0.5
                  "
                />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next banner"
                className="
                  group
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  border
                  border-white/45
                  bg-black/10
                  text-white
                  backdrop-blur-[2px]
                  transition-all
                  duration-300
                  hover:border-white
                  hover:bg-white
                  hover:text-[var(--color-text)]
                  sm:h-11
                  sm:w-11
                "
              >
                <ArrowRight
                  size={15}
                  strokeWidth={1.3}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-0.5
                  "
                />
              </button>
            </div>

            {/* ---------------------------------------------
                INDICATORS
            --------------------------------------------- */}

            <div
              className="
                absolute
                bottom-8
                left-5
                z-30
                flex
                items-center
                gap-2
                sm:left-8
                lg:left-12
                xl:left-16
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
                      className="
                        group
                        flex
                        h-7
                        items-center
                      "
                    >
                      <span
                        className={[
                          "h-px",
                          "transition-all",
                          "duration-500",
                          isActive
                            ? "w-10 bg-white"
                            : "w-5 bg-white/45 group-hover:w-8 group-hover:bg-white/80",
                        ].join(" ")}
                      />
                    </button>
                  );
                },
              )}
            </div>

            {/* ---------------------------------------------
                PAUSE / PLAY
            --------------------------------------------- */}

            <button
              type="button"
              onClick={() =>
                setIsPaused(
                  (value) => !value,
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
                text-white/65
                transition-colors
                duration-300
                hover:text-white
                md:block
              "
            >
              {isPaused ? (
                <Play
                  size={13}
                  strokeWidth={1.3}
                />
              ) : (
                <Pause
                  size={13}
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