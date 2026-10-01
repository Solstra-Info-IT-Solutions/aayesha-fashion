"use client";

import {
  Banknote,
  Check,
  CreditCard,
} from "lucide-react";

import { useCheckoutStore } from "@/store/checkout-store";

export function CheckoutPayment() {
  const selected = useCheckoutStore(
    (state) => state.payment,
  );

  const setPayment = useCheckoutStore(
    (state) => state.setPayment,
  );

  return (
    <section className="overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]">
      {/* HEADER */}

      <div className="border-b border-[var(--color-border-light)] px-5 py-6 sm:px-8 sm:py-7">
        <div className="flex items-start gap-4">
          <span className="mt-0.5 font-[var(--font-display)] text-lg text-[var(--color-accent)]">
            04
          </span>

          <div>
            <p className="eyebrow text-[var(--color-text-muted)]">
              Payment
            </p>

            <h2 className="mt-2 font-[var(--font-display)] text-3xl font-medium leading-none tracking-[var(--tracking-tight)] text-[var(--color-text)] sm:text-4xl">
              Choose payment method
            </h2>

            <p className="mt-3 max-w-lg text-xs leading-5 text-[var(--color-text-secondary)] sm:text-sm">
              Select your preferred way to complete the
              purchase.
            </p>
          </div>
        </div>
      </div>

      {/* OPTIONS */}

      <div className="space-y-3 px-5 py-7 sm:px-8 sm:py-8">
        <PaymentOption
          id="cod"
          label="Cash on Delivery"
          description="Pay when your order arrives"
          icon={<Banknote size={18} />}
          active={selected === "cod"}
          onClick={() =>
            setPayment("cod")
          }
        />

        <PaymentOption
          id="online"
          label="Online Payment"
          description="Cards, UPI and supported payment methods"
          icon={<CreditCard size={18} />}
          active={selected === "online"}
          onClick={() =>
            setPayment("online")
          }
        />

        {/* SECURITY NOTE */}

        <div className="mt-5 flex gap-3 border-t border-[var(--color-border-light)] pt-5">
          <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text)]">
              Secure checkout
            </p>

            <p className="mt-1 text-[11px] leading-5 text-[var(--color-text-secondary)]">
              Your selected payment method will be securely
              processed when the order is placed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PaymentOption({
  label,
  description,
  icon,
  active,
  onClick,
}: {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "group flex w-full items-center justify-between gap-4 border p-4 text-left transition-all duration-[var(--duration-base)] sm:p-5",
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
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--color-text)]">
            {label}
          </p>

          <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">
            {description}
          </p>
        </div>
      </div>

      {/* SELECT INDICATOR */}

      <span
        className={[
          "flex h-6 w-6 shrink-0 items-center justify-center border transition-all duration-[var(--duration-base)]",
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
    </button>
  );
}