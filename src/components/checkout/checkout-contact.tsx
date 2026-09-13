"use client";

import type { ChangeEvent } from "react";

import { useCheckoutStore } from "@/store/checkout-store";

export function CheckoutContact() {
  const contact = useCheckoutStore(
    (state) => state.contact,
  );

  const setContact = useCheckoutStore(
    (state) => state.setContact,
  );

  const update =
    (
      field: "email" | "phone",
    ) =>
    (
      event: ChangeEvent<HTMLInputElement>,
    ) => {
      setContact({
        [field]: event.target.value,
      });
    };

  return (
    <section className="overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]">
      {/* Header */}
      <div className="border-b border-[var(--color-border-light)] px-5 py-6 sm:px-8 sm:py-7">
        <div className="flex items-start gap-4">
          <span className="mt-0.5 font-[var(--font-display)] text-lg text-[var(--color-accent)]">
            01
          </span>

          <div>
            <p className="eyebrow text-[var(--color-text-muted)]">
              Contact
            </p>

            <h2 className="mt-2 font-[var(--font-display)] text-3xl font-medium leading-none tracking-[var(--tracking-tight)] text-[var(--color-text)] sm:text-4xl">
              Your details
            </h2>

            <p className="mt-3 max-w-md text-xs leading-5 text-[var(--color-text-secondary)]">
              We&apos;ll use these details to confirm your order
              and keep you updated on its delivery.
            </p>
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="grid gap-6 px-5 py-7 sm:grid-cols-2 sm:px-8 sm:py-8">
        <Field
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={contact.email}
          onChange={update("email")}
        />

        <Field
          label="Phone number"
          type="tel"
          inputMode="numeric"
          placeholder="10-digit mobile number"
          value={contact.phone}
          onChange={(event) =>
            setContact({
              phone: event.target.value
                .replace(/\D/g, "")
                .slice(0, 10),
            })
          }
        />

        <div className="border-t border-[var(--color-border-light)] pt-4 sm:col-span-2">
          <p className="text-[11px] leading-5 text-[var(--color-text-muted)]">
            Your contact information is kept secure and is
            used only for order confirmation and delivery
            communication.
          </p>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  type,
  placeholder,
  value,
  onChange,
  inputMode,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  inputMode?: "text" | "numeric" | "tel" | "email";
}) {
  return (
    <label className="group block">
      <span className="mb-2.5 block text-[10px] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-secondary)]">
        {label}
      </span>

      <div className="relative">
        <input
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="h-13 w-full border border-[var(--color-border-dark)] bg-[var(--color-surface-soft)] px-4 text-sm text-[var(--color-text)] outline-none transition-all duration-[var(--duration-base)] placeholder:text-[var(--color-text-muted)] hover:border-[var(--color-accent-soft)] focus:border-[var(--color-accent)] focus:bg-[var(--color-surface)]"
        />

        <span className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-[var(--color-accent)] transition-all duration-[var(--duration-luxury)] group-focus-within:w-full" />
      </div>
    </label>
  );
}