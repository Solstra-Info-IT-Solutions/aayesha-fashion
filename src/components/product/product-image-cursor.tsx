"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

/**
 * Wraps a product image with a custom "VIEW" ring cursor, scoped to the
 * image's own bounds (default cursor returns outside it). Pointer position
 * is tracked relative to the wrapper only — no global cursor override.
 */
export function ProductImageCursor({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;

    setPosition({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });
  }

  return (
    <div
      ref={containerRef}
      className={`drape-cursor-zone ${className ?? ""}`}
      onPointerEnter={() => setIsHovering(true)}
      onPointerLeave={() => setIsHovering(false)}
      onPointerMove={handlePointerMove}
    >
      {children}

      {isHovering && (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.15 }}
          className="pointer-events-none absolute z-20 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--unbleached-cotton)]/70"
          style={{ left: position.x, top: position.y }}
        >
          <span className="drape-font-body text-[9px] uppercase tracking-[0.22em] text-[var(--unbleached-cotton)]">
            View
          </span>
        </motion.div>
      )}
    </div>
  );
}
