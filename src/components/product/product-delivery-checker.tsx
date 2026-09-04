"use client";

import { useState } from "react";
import { Check, MapPin } from "lucide-react";

export function ProductDeliveryChecker() {
  const [pincode, setPincode] = useState("");
  const [checked, setChecked] = useState(false);

  const checkDelivery = () => {
    if (!/^\d{6}$/.test(pincode)) {
      setChecked(false);
      return;
    }

    setChecked(true);
  };

  return (
    <section className="border-y border-[var(--color-border)] py-6">
      <div className="flex items-center gap-2">
        <MapPin size={17} />
        <p className="text-xs font-semibold uppercase tracking-[0.12em]">
          Check Delivery
        </p>
      </div>

      <div className="mt-4 flex">
        <input
          value={pincode}
          onChange={(event) =>
            setPincode(
              event.target.value
                .replace(/\D/g, "")
                .slice(0, 6),
            )
          }
          inputMode="numeric"
          placeholder="Enter pincode"
          className="h-12 min-w-0 flex-1 border border-r-0 border-[var(--color-border-dark)] bg-transparent px-4 text-sm outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-charcoal)]"
        />

        <button
          type="button"
          onClick={checkDelivery}
          className="h-12 bg-[var(--color-charcoal)] px-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white"
        >
          Check
        </button>
      </div>

      {checked && (
        <div className="mt-4 flex gap-2">
          <Check
            size={16}
            className="mt-0.5 shrink-0 text-[var(--color-success)]"
          />

          <div>
            <p className="text-xs font-semibold">
              Delivery available
            </p>

            <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">
              Estimated delivery within 3–7 business days.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}