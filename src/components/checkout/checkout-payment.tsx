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
    <section className="border border-[var(--color-border)] bg-white">
      <div className="border-b border-[var(--color-border)] px-5 py-5 sm:px-7">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
          04 · Payment
        </p>

        <h2 className="mt-2 font-[var(--font-cormorant)] text-2xl">
          Choose payment method
        </h2>
      </div>

      <div className="space-y-3 px-5 py-6 sm:px-7">
        <PaymentOption
          id="cod"
          label="Cash on Delivery"
          description="Pay when your order arrives"
          icon={<Banknote size={19} />}
          active={selected === "cod"}
          onClick={() =>
            setPayment("cod")
          }
        />

        <PaymentOption
          id="online"
          label="Online Payment"
          description="Cards, UPI and supported payment methods"
          icon={<CreditCard size={19} />}
          active={selected === "online"}
          onClick={() =>
            setPayment("online")
          }
        />

        <div className="border-l-2 border-[var(--color-rose)] bg-[var(--color-rose-light)] px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em]">
            Secure checkout
          </p>

          <p className="mt-1 text-[11px] leading-5 text-[var(--color-text-secondary)]">
            Your selected payment method will be securely
            processed when the order is placed.
          </p>
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
      className={[
        "flex w-full items-center justify-between gap-4 border p-4 text-left transition",
        active
          ? "border-[var(--color-charcoal)] bg-[var(--color-cream)]"
          : "border-[var(--color-border)] hover:border-[var(--color-border-dark)]",
      ].join(" ")}
    >
      <div className="flex gap-3">
        <div className="mt-0.5">
          {icon}
        </div>

        <div>
          <p className="text-xs font-semibold">
            {label}
          </p>

          <p className="mt-1 text-[11px] leading-5 text-[var(--color-text-muted)]">
            {description}
          </p>
        </div>
      </div>

      {active && (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-charcoal)] text-white">
          <Check size={13} />
        </span>
      )}
    </button>
  );
}