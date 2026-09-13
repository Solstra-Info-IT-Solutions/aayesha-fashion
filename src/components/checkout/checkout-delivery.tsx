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
    <section className="overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]">
      {/* HEADER */}

      <div className="border-b border-[var(--color-border-light)] px-5 py-6 sm:px-8 sm:py-7">
        <div className="flex items-start gap-4">
          <span className="mt-0.5 font-[var(--font-display)] text-lg text-[var(--color-accent)]">
            03
          </span>

          <div>
            <p className="eyebrow text-[var(--color-text-muted)]">
              Delivery
            </p>

            <h2 className="mt-2 font-[var(--font-display)] text-3xl font-medium leading-none tracking-[var(--tracking-tight)] text-[var(--color-text)] sm:text-4xl">
              Choose delivery
            </h2>

            <p className="mt-3 text-xs leading-5 text-[var(--color-text-secondary)] sm:text-sm">
              Select the delivery option that works best
              for you.
            </p>
          </div>
        </div>
      </div>

      {/* OPTIONS */}

      <div className="space-y-3 px-5 py-7 sm:px-8 sm:py-8">
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
              aria-pressed={active}
              className={[
                "group flex w-full items-center justify-between gap-5 border p-4 text-left transition-all duration-[var(--duration-base)] sm:p-5",
                active
                  ? "border-[var(--color-accent)] bg-[var(--color-bg-subtle)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-dark)]",
              ].join(" ")}
            >
              {/* LEFT */}

              <div className="flex min-w-0 items-start gap-4">
                <div
                  className={[
                    "flex h-9 w-9 shrink-0 items-center justify-center border transition-colors",
                    active
                      ? "border-[var(--color-accent)] bg-[var(--color-surface)] text-[var(--color-accent)]"
                      : "border-[var(--color-border)] text-[var(--color-text-secondary)] group-hover:border-[var(--color-accent-soft)]",
                  ].join(" ")}
                >
                  <Truck size={17} />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-[var(--color-text)]">
                      {option.label}
                    </p>

                    {option.id === "express" ? (
                      <span className="border border-[var(--color-accent-soft)] bg-[var(--color-accent-soft)] px-2 py-1 text-[8px] font-semibold uppercase tracking-[var(--tracking-wide)] text-[var(--color-accent-dark)]">
                        Priority
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">
                    {option.description}
                  </p>

                  <p className="mt-2 text-[10px] font-semibold uppercase tracking-[var(--tracking-wide)] text-[var(--color-text-muted)]">
                    {option.estimatedDays}
                  </p>
                </div>
              </div>

              {/* RIGHT */}

              <div className="flex shrink-0 items-center gap-3">
                <span className="text-xs font-semibold text-[var(--color-text)] sm:text-sm">
                  {option.price === 0
                    ? "Free"
                    : `₹${option.price}`}
                </span>

                <span
                  className={[
                    "flex h-6 w-6 items-center justify-center border transition-all duration-[var(--duration-base)]",
                    active
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-text-inverse)]"
                      : "border-[var(--color-border-dark)] bg-[var(--color-surface)] text-transparent",
                  ].join(" ")}
                  aria-hidden="true"
                >
                  <Check
                    size={13}
                    strokeWidth={2.5}
                  />
                </span>
              </div>
            </button>
          );
        })}

        {/* DELIVERY NOTE */}

        <div className="border-t border-[var(--color-border-light)] pt-5">
          <p className="text-[11px] leading-5 text-[var(--color-text-muted)]">
            Delivery timelines are estimated business days
            and may vary slightly depending on your location.
          </p>
        </div>
      </div>
    </section>
  );
}