"use client";

import { useCheckoutStore } from "@/store/checkout-store";

export function CheckoutAddress() {
  const address = useCheckoutStore(
    (state) => state.address,
  );

  const setAddress = useCheckoutStore(
    (state) => state.setAddress,
  );

  return (
    <section className="border border-[var(--color-border)] bg-white">
      <div className="border-b border-[var(--color-border)] px-5 py-5 sm:px-7">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
          02 · Delivery Address
        </p>

        <h2 className="mt-2 font-[var(--font-cormorant)] text-2xl">
          Where should we deliver?
        </h2>
      </div>

      <div className="grid gap-5 px-5 py-6 sm:grid-cols-2 sm:px-7">
        <Field
          label="First Name"
          value={address.firstName}
          onChange={(value) =>
            setAddress({
              firstName: value,
            })
          }
        />

        <Field
          label="Last Name"
          value={address.lastName}
          onChange={(value) =>
            setAddress({
              lastName: value,
            })
          }
        />

        <div className="sm:col-span-2">
          <Field
            label="Address"
            value={address.addressLine1}
            onChange={(value) =>
              setAddress({
                addressLine1: value,
              })
            }
            placeholder="House / Flat / Street"
          />
        </div>

        <div className="sm:col-span-2">
          <Field
            label="Apartment / Area"
            value={address.addressLine2 ?? ""}
            onChange={(value) =>
              setAddress({
                addressLine2: value,
              })
            }
            placeholder="Apartment, locality, area"
          />
        </div>

        <Field
          label="Landmark"
          value={address.landmark ?? ""}
          onChange={(value) =>
            setAddress({
              landmark: value,
            })
          }
          placeholder="Optional"
        />

        <Field
          label="City"
          value={address.city}
          onChange={(value) =>
            setAddress({
              city: value,
            })
          }
        />

        <Field
          label="State"
          value={address.state}
          onChange={(value) =>
            setAddress({
              state: value,
            })
          }
        />

        <Field
          label="PIN Code"
          value={address.postalCode}
          inputMode="numeric"
          onChange={(value) =>
            setAddress({
              postalCode: value
                .replace(/\D/g, "")
                .slice(0, 6),
            })
          }
        />

        <label className="flex items-center gap-3 sm:col-span-2">
          <input
            type="checkbox"
            checked={!!address.isDefault}
            onChange={(event) =>
              setAddress({
                isDefault:
                  event.target.checked,
              })
            }
            className="h-4 w-4 accent-[var(--color-charcoal)]"
          />

          <span className="text-xs text-[var(--color-text-secondary)]">
            Save this address for future orders
          </span>
        </label>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder = "",
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputMode?:
    | "numeric"
    | "text";
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em]">
        {label}
      </span>

      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        inputMode={inputMode}
        className="h-12 w-full border border-[var(--color-border-dark)] bg-transparent px-4 text-sm outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-charcoal)]"
      />
    </label>
  );
}