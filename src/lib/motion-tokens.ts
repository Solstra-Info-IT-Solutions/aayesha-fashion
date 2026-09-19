/**
 * Motion tokens mirrored from the CSS custom properties in
 * src/app/globals.css so Framer Motion / GSAP timelines stay in sync
 * with the CSS-driven transitions across the site.
 */

export const EASE_LUXURY = [0.22, 1, 0.36, 1] as const;
export const EASE_SNAP = [0.65, 0, 0.35, 1] as const;
export const EASE_ENTER = [0.16, 1, 0.3, 1] as const;

export const DUR_INSTANT = 0.12;
export const DUR_FAST = 0.22;
export const DUR_MEDIUM = 0.42;
export const DUR_SLOW = 0.7;
