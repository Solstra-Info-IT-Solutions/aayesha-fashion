"use client";

import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
};

export function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  max = 10,
}: QuantitySelectorProps) {
  const decrease = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const increase = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className="inline-flex h-12 items-center border border-[var(--color-border-dark)]">
      <button
        type="button"
        onClick={decrease}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
        className="
          flex
          h-full
          w-12
          items-center
          justify-center
          text-[var(--color-charcoal)]
          transition-colors
          duration-200
          hover:bg-[var(--color-cream)]
          disabled:cursor-not-allowed
          disabled:opacity-30
        "
      >
        <Minus size={15} strokeWidth={1.4} />
      </button>

      <span
        aria-live="polite"
        className="
          flex
          h-full
          min-w-12
          items-center
          justify-center
          border-x
          border-[var(--color-border-dark)]
          px-3
          text-sm
          font-semibold
          text-[var(--color-charcoal)]
        "
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={increase}
        disabled={quantity >= max}
        aria-label="Increase quantity"
        className="
          flex
          h-full
          w-12
          items-center
          justify-center
          text-[var(--color-charcoal)]
          transition-colors
          duration-200
          hover:bg-[var(--color-cream)]
          disabled:cursor-not-allowed
          disabled:opacity-30
        "
      >
        <Plus size={15} strokeWidth={1.4} />
      </button>
    </div>
  );
}