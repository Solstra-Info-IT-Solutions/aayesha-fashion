"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

/*
 * Simplified per the design bible's explicit fallback allowance: a full
 * View-Transitions-API "thread sweep revealing the page underneath" is
 * impractical to land cleanly with the App Router's current transition
 * model in the time available for this visual pass. This ships a bespoke
 * crossfade for the page content, plus the thread-line as a decorative
 * overlay (CSS animation in globals.css: .drape-thread-line) that sweeps
 * left-to-right on every route change — not a real reveal-through effect.
 *
 * TODO (integration pass): if a true reveal transition is still wanted,
 * revisit with the View Transitions API skill once on a Next.js version
 * where it's stable in the App Router.
 */
export function PageTransitionThread({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <div
        key={`thread-${pathname}`}
        aria-hidden="true"
        className="drape-thread-line pointer-events-none fixed inset-x-0 top-0 z-[999] h-[2px] origin-left bg-[var(--sindoor-rust)]"
      />
    </>
  );
}
