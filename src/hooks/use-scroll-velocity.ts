"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring } from "framer-motion";

/**
 * Tracks scroll velocity as a signed, clamped value that decays back to 0
 * when scrolling stops — "cloth settling". Drives the hero headline skewY.
 *
 * Returns a Framer Motion MotionValue (spring-smoothed) so callers can feed
 * it straight into useTransform without extra state plumbing.
 */
export function useScrollVelocity(maxAbsVelocity = 60) {
  const rawVelocity = useMotionValue(0);
  const velocity = useSpring(rawVelocity, {
    stiffness: 220,
    damping: 30,
    mass: 0.6,
  });

  const lastScrollY = useRef(0);
  const settleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    function handleScroll() {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      lastScrollY.current = currentY;

      const clamped = Math.max(
        -maxAbsVelocity,
        Math.min(maxAbsVelocity, delta),
      );

      rawVelocity.set(clamped);

      if (settleTimeout.current) {
        clearTimeout(settleTimeout.current);
      }

      // Settle back to 0 shortly after scrolling stops.
      settleTimeout.current = setTimeout(() => {
        rawVelocity.set(0);
      }, 120);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (settleTimeout.current) {
        clearTimeout(settleTimeout.current);
      }
    };
  }, [maxAbsVelocity, rawVelocity]);

  return velocity;
}

/** WebGL capability check — gate the 3D canvas behind this + reduced motion. */
export function useWebGLSupported() {
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      setSupported(Boolean(gl));
    } catch {
      setSupported(false);
    }
  }, []);

  return supported;
}
