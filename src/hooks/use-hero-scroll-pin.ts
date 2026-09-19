"use client";

import { useEffect, type RefObject } from "react";

/**
 * Pins the hero for ~100vh of scroll while the 3D plane subtly rotates and
 * the headline skews further, then releases. Built as its own hook so the
 * integration pass can wire it into the real hero markup without touching
 * GSAP setup/teardown.
 *
 * TODO (integration pass): call this with refs to the real hero section /
 * headline / scene once they're wired to live homepage data — this hook is
 * currently exercised only by the mock hero in home/hero-drape.tsx.
 */
export function useHeroScrollPin(
  pinRef: RefObject<HTMLElement>,
  headlineRef: RefObject<HTMLElement>,
  sceneRef: RefObject<HTMLElement>,
  options?: { enabled?: boolean },
) {
  const enabled = options?.enabled ?? true;

  useEffect(() => {
    if (!enabled) return;
    if (!pinRef.current || !headlineRef.current || !sceneRef.current) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    // gsap + ScrollTrigger are loaded dynamically so this hook is safe to
    // import into server-rendered trees; the plugin registers on mount only.
    import("gsap").then(async ({ gsap }) => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const pinEl = pinRef.current;
      const headlineEl = headlineRef.current;
      const sceneEl = sceneRef.current;
      if (!pinEl || !headlineEl || !sceneEl) return;

      const ctx = gsap.context(() => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: pinEl,
            start: "top top",
            end: "+=100%",
            pin: true,
            scrub: 0.6,
          },
        });

        timeline
          .to(
            sceneEl,
            {
              rotateY: 10,
              rotateX: -3,
              ease: "none",
            },
            0,
          )
          .to(
            headlineEl,
            {
              skewY: 4,
              ease: "none",
            },
            0,
          );
      }, pinEl);

      cleanup = () => ctx.revert();
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [pinRef, headlineRef, sceneRef, enabled]);
}
