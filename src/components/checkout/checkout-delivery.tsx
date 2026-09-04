"use client";

import { Check, Truck } from "lucide-react";

import { useCheckoutStore } from "@/store/checkout-store";

const options = [
  {
    id: "standard" as const,
    label: "Standard Delivery",
    description: "Reliable delivery across India",
    price: 0,
    estimatedDays: "3–7 business days",
  },
  {
    id: "express" as const,
    label: "Express Delivery",
    description: "Priority handling and faster delivery",
    price: 199,
    estimatedDays: "1–3 business days",
  },
];

export function CheckoutDelivery() {
  const selected = useCheckoutStore(
    (state) => state.delivery,
  );

  const setDelivery = useCheckoutStore(
    (state) => state.setDelivery,
  );

  return (
    <section className="border border-[var(--color-border)] bg-white">
      <div className="border-b border-[var(--color-border)] px-5 py-5 sm:px-7">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
          03 · Delivery
        </p>

        <h2 className="mt-2 font-[var(--font-cormorant)] text-2xl">
          Choose delivery
        </h2>
      </div>

      <div className="space-y-3 px-5 py-6 sm:px-7">
        {options.map((option) => {
          const active =
            selected === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() =>
                setDelivery(option.id)
              }
              className={[
                "flex w-full items-center justify-between gap-5 border p-4 text-left transition",
                active
                  ? "border-[var(--color-charcoal)] bg-[var(--color-cream)]"
                  : "border-[var(--color-border)] hover:border-[var(--color-border-dark)]",
              ].join(" ")}
            >
              <div className="flex min-w-0 gap-3">
                <Truck
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <div>
                  <p className="text-xs font-semibold">
                    {option.label}
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-[var(--color-text-muted)]">
                    {option.description}
                  </p>

                  <p className="mt-2 text-[10px] font-medium">
                    {option.estimatedDays}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span className="text-xs font-semibold">
                  {option.price === 0
                    ? "Free"
                    : `₹${option.price}`}
                </span>

                {active && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-charcoal)] text-white">
                    <Check size={13} />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}