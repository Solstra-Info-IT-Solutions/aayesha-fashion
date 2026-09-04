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
    <section className="border border-[var(--color-border)] bg-white">
      <div className="border-b border-[var(--color-border)] px-5 py-5 sm:px-7">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
          01 · Contact
        </p>

        <h2 className="mt-2 font-[var(--font-cormorant)] text-2xl">
          Your details
        </h2>
      </div>

      <div className="grid gap-5 px-5 py-6 sm:grid-cols-2 sm:px-7">
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

        <p className="text-[10px] leading-5 text-[var(--color-text-muted)] sm:col-span-2">
          Your contact details are used for order
          confirmation and delivery updates.
        </p>
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
    <label className="block">
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em]">
        {label}
      </span>

      <input
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-12 w-full border border-[var(--color-border-dark)] bg-transparent px-4 text-sm outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-charcoal)]"
      />
    </label>
  );
}