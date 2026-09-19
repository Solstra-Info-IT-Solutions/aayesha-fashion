"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useTransform } from "framer-motion";

import type { HomepageHeroSlide } from "@/types/homepage";

import { FabricSceneGate } from "@/components/three/fabric-scene-gate";
import { useScrollVelocity } from "@/hooks/use-scroll-velocity";
import { useHeroScrollPin } from "@/hooks/use-hero-scroll-pin";

/* =========================================================
   MOCK DATA
   TODO (integration pass): replace with the real active
   HomepageHeroSlide from the homepage service — this shape
   matches src/types/homepage.ts exactly so swapping the prop
   is a drop-in.
========================================================= */

const MOCK_SLIDE: HomepageHeroSlide = {
  id: "mock-hero-01",
  eyebrow: "The 2026 Relaunch",
  title: "Cloth, caught\nmid-drape",
  subtitle: "Couture for the modern trousseau",
  description:
    "A new grammar of ethnic fashion — hand-finished silhouettes shot through with movement.",
  image: "/images/hero/hero-01-desktop.jpg",
  mobileImage: "/images/hero/hero-01-mobile.jpg",
  href: "/shop",
  buttonLabel: "Shop the Edit",
  sortOrder: 0,
  isActive: true,
  startsAt: null,
  endsAt: null,
};

/* =========================================================
   PAGE-LOAD CHOREOGRAPHY (~1.1s total)
========================================================= */

const logoVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.15, ease: "easeOut" },
  },
};

const wordContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.15,
      staggerChildren: 0.018,
    },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
};

const sceneVariants = {
  hidden: { opacity: 0, scale: 1.04 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

const navVariants = {
  hidden: { y: -24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.25, delay: 0.4, ease: "easeOut" },
  },
};

const ctaVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: [0.9, 1.04, 1],
    transition: { duration: 0.4, delay: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

type HeroDrapeProps = {
  slide?: HomepageHeroSlide;
};

export function HeroDrape({ slide = MOCK_SLIDE }: HeroDrapeProps) {
  const pinRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  const scrollVelocity = useScrollVelocity();
  // Cloth-settling skew: proportional to scroll velocity, eases to 0 at rest.
  const skewY = useTransform(scrollVelocity, [-60, 0, 60], [-2.5, 0, 2.5]);

  useHeroScrollPin(pinRef, headlineRef, sceneRef);

  const titleWords = slide.title.split(/\s+/);

  return (
    <section
      ref={pinRef}
      className="drape-surface relative w-full overflow-hidden"
    >
      <div className="relative h-[92vh] min-h-[640px] w-full">
        {/* =================================================
            NAV SLIVER (placeholder — real nav sits above this
            section in the layout; this is a decorative sliver
            reserved for the choreography demo only)
        ================================================= */}

        <motion.div
          variants={navVariants}
          initial="hidden"
          animate="visible"
          className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-6 lg:px-14"
        >
          <motion.span
            variants={logoVariants}
            initial="hidden"
            animate="visible"
            className="drape-font-display text-lg italic tracking-[-0.01em] text-[var(--unbleached-cotton)]"
          >
            Aayesha
          </motion.span>

          <span className="drape-font-body text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
            Relaunch 2026
          </span>
        </motion.div>

        {/* =================================================
            ASYMMETRIC 60/40 SPLIT
            Image/3D column occupies the right 60%, bleeding
            ~120px into the 40% text column via negative margin.
        ================================================= */}

        <div className="relative grid h-full grid-cols-1 lg:grid-cols-[40%_60%]">
          {/* TEXT COLUMN */}
          <div className="relative z-20 flex items-center px-6 lg:px-14">
            <div className="drape-surface/0 relative w-full max-w-xl">
              <p className="drape-font-body mb-4 text-[0.75rem] uppercase tracking-[0.3em] text-[var(--sindoor-rust)]">
                {slide.eyebrow}
              </p>

              {/* Headline: intentionally allowed to clip/bleed past the
                  viewport edge — overflow visible, not ellipsis. Skewed
                  proportional to scroll velocity ("cloth settling"). */}
              <motion.h1
                ref={headlineRef}
                style={{ skewY }}
                className="drape-font-display relative z-20 whitespace-pre text-[var(--fs-display-xl)] font-light leading-[0.92] tracking-[-0.02em] text-[var(--unbleached-cotton)] overflow-visible"
              >
                <motion.span
                  variants={wordContainerVariants}
                  initial="hidden"
                  animate="visible"
                  className="block"
                >
                  {slide.title.split("\n").map((line, lineIndex) => (
                    <span key={lineIndex} className="block overflow-visible">
                      {line.split(" ").map((word, wordIndex) => (
                        <motion.span
                          key={`${lineIndex}-${wordIndex}`}
                          variants={wordVariants}
                          className="mr-[0.25em] inline-block"
                        >
                          {word}
                        </motion.span>
                      ))}
                    </span>
                  ))}
                </motion.span>
              </motion.h1>

              <p className="drape-font-body mt-6 max-w-sm text-[var(--fs-body)] leading-relaxed text-[var(--text-muted)]">
                {slide.description}
              </p>
            </div>
          </div>

          {/* IMAGE / 3D SCENE COLUMN — bleeds ~120px left into text column */}
          <div
            ref={sceneRef}
            className="relative col-start-1 row-start-1 h-full lg:col-start-2 lg:-ml-[120px]"
          >
            <motion.div
              variants={sceneVariants}
              initial="hidden"
              animate="visible"
              className="relative h-full w-full"
            >
              <Image
                src={slide.image}
                alt={slide.title.replace(/\n/g, " ")}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center opacity-70"
              />

              {/* 3D drape scene layered above the base image */}
              <FabricSceneGate className="absolute inset-0 h-full w-full" />

              {/* Scrim so the headline stays legible where it overlaps */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[var(--kohl-umber)] via-[var(--kohl-umber)]/60 to-transparent lg:w-[45%]" />
            </motion.div>
          </div>
        </div>

        {/* =================================================
            CTA — small, bottom-left, not a big centered button
        ================================================= */}

        <motion.div
          variants={ctaVariants}
          initial="hidden"
          animate="visible"
          className="absolute bottom-8 left-6 z-30 lg:bottom-12 lg:left-14"
        >
          <a
            href={slide.href}
            className="drape-font-body group inline-flex items-center gap-2 border-b border-[var(--aged-brass)] pb-1 text-[0.6875rem] uppercase tracking-[0.22em] text-[var(--unbleached-cotton)] transition-colors duration-300 hover:border-[var(--sindoor-rust)] hover:text-[var(--sindoor-rust)]"
          >
            {slide.buttonLabel}
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroDrape;
