"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

export type CartIconPulseHandle = {
  /** Triggers the 300ms scale-pulse (1 -> 1.15 -> 1). */
  pulse: () => void;
};

type CartIconPulseProps = {
  itemCount?: number;
  className?: string;
};

/**
 * Cart icon with an imperative `pulse()` handle. The integration pass
 * should call `ref.current?.pulse()` from the real add-to-cart success
 * handler (product-purchase-panel-drape's onAddedToBag, editorial card's
 * handleAddToBag, etc.) — this component never triggers itself on mount.
 */
export const CartIconPulse = forwardRef<CartIconPulseHandle, CartIconPulseProps>(
  function CartIconPulse({ itemCount, className }, ref) {
    const [pulseKey, setPulseKey] = useState(0);

    useImperativeHandle(ref, () => ({
      pulse: () => setPulseKey((key) => key + 1),
    }));

    return (
      <motion.span
        key={pulseKey}
        initial={{ scale: 1 }}
        animate={pulseKey > 0 ? { scale: [1, 1.15, 1] } : { scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`relative inline-flex items-center justify-center text-[var(--unbleached-cotton)] ${className ?? ""}`}
      >
        <ShoppingBag size={20} strokeWidth={1.3} />
        {typeof itemCount === "number" && itemCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--sindoor-rust)] px-1 text-[9px] text-[var(--unbleached-cotton)]">
            {itemCount}
          </span>
        )}
      </motion.span>
    );
  },
);
