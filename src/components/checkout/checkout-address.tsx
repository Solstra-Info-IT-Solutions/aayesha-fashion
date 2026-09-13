"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronDown,
  MapPin,
  Plus,
  RefreshCw,
} from "lucide-react";

import { useCheckoutStore } from "@/store/checkout-store";
import { useAuthStore } from "@/store/auth-store";

import {
  getCustomerAddresses,
  type CustomerAddress,
} from "@/lib/customer-api";

import type { CheckoutAddress } from "@/types/checkout";

export function CheckoutAddress() {
  const address = useCheckoutStore(
    (state) => state.address,
  );

  const setAddress = useCheckoutStore(
    (state) => state.setAddress,
  );

  const setContact = useCheckoutStore(
    (state) => state.setContact,
  );

  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const isInitialized = useAuthStore(
    (state) => state.isInitialized,
  );

  const [savedAddresses, setSavedAddresses] =
    useState<CustomerAddress[]>([]);

  const [isLoadingAddresses, setIsLoadingAddresses] =
    useState(false);

  const [addressError, setAddressError] =
    useState<string | null>(null);

  const [showManualForm, setShowManualForm] =
    useState(false);

  const [selectedAddressId, setSelectedAddressId] =
    useState<string | null>(null);

  const selectedSavedAddress = useMemo(
    () =>
      savedAddresses.find(
        (item) => item.id === selectedAddressId,
      ) ?? null,
    [savedAddresses, selectedAddressId],
  );

  /* ==========================================================
     LOAD SAVED ADDRESSES
  ========================================================== */

  useEffect(() => {
    if (
      !isInitialized ||
      !isAuthenticated ||
      !accessToken
    ) {
      setSavedAddresses([]);
      setSelectedAddressId(null);
      return;
    }

    let isMounted = true;

    const loadAddresses = async () => {
      setIsLoadingAddresses(true);
      setAddressError(null);

      try {
        const addresses =
          await getCustomerAddresses(
            accessToken,
          );

        if (!isMounted) {
          return;
        }

        setSavedAddresses(addresses);

        const defaultAddress =
          addresses.find(
            (item) => item.isDefault,
          ) ??
          addresses[0] ??
          null;

        if (!defaultAddress) {
          setSelectedAddressId(null);
          setShowManualForm(true);
          return;
        }

        setSelectedAddressId(
          defaultAddress.id,
        );
        setShowManualForm(false);

        applySavedAddress(
          defaultAddress,
          setAddress,
          setContact,
        );
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setAddressError(
          error instanceof Error
            ? error.message
            : "Unable to load your saved addresses.",
        );
      } finally {
        if (isMounted) {
          setIsLoadingAddresses(false);
        }
      }
    };

    void loadAddresses();

    return () => {
      isMounted = false;
    };
  }, [
    accessToken,
    isAuthenticated,
    isInitialized,
    setAddress,
    setContact,
  ]);

  /* ==========================================================
     SELECT SAVED ADDRESS
  ========================================================== */

  const handleSavedAddressSelect = (
    savedAddress: CustomerAddress,
  ) => {
    setSelectedAddressId(
      savedAddress.id,
    );

    setShowManualForm(false);

    applySavedAddress(
      savedAddress,
      setAddress,
      setContact,
    );
  };

  /* ==========================================================
     SWITCH TO MANUAL ADDRESS
  ========================================================== */

  const handleManualAddress = () => {
    setSelectedAddressId(null);
    setShowManualForm(true);

    setAddress({
      isDefault: false,
    });
  };

  const shouldShowSavedAddressView =
    isInitialized &&
    isAuthenticated &&
    (isLoadingAddresses ||
      savedAddresses.length > 0 ||
      !!addressError);

  /* ==========================================================
     AUTHENTICATED CUSTOMER VIEW
  ========================================================== */

  if (shouldShowSavedAddressView) {
    return (
      <section className="overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]">
        {/* HEADER */}

        <div className="border-b border-[var(--color-border-light)] px-5 py-6 sm:px-8 sm:py-7">
          <div className="flex items-start gap-4">
            <span className="mt-0.5 font-[var(--font-display)] text-lg text-[var(--color-accent)]">
              02
            </span>

            <div className="min-w-0 flex-1">
              <p className="eyebrow text-[var(--color-text-muted)]">
                Delivery Address
              </p>

              <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="font-[var(--font-display)] text-3xl font-medium leading-none tracking-[var(--tracking-tight)] text-[var(--color-text)] sm:text-4xl">
                    Where should we deliver?
                  </h2>

                  <p className="mt-3 max-w-lg text-xs leading-5 text-[var(--color-text-secondary)] sm:text-sm">
                    Select a saved address or add a new
                    delivery address.
                  </p>
                </div>

                <Link
                  href="/account/addresses"
                  className="link-luxury shrink-0 text-[10px] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text)]"
                >
                  Manage Addresses
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}

        <div className="space-y-6 px-5 py-7 sm:px-8 sm:py-8">
          {isLoadingAddresses ? (
            <AddressLoadingState />
          ) : (
            <>
              {/* ERROR */}

              {addressError ? (
                <div className="flex items-start justify-between gap-4 border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-4 sm:px-5">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text)]">
                      We couldn&apos;t load your saved
                      addresses.
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">
                      You can still enter a new delivery
                      address below.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      window.location.reload();
                    }}
                    className="inline-flex shrink-0 items-center gap-2 border border-[var(--color-border-dark)] bg-[var(--color-surface)] px-3 py-2 text-[10px] font-semibold uppercase tracking-[var(--tracking-wide)] text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-bg-subtle)]"
                  >
                    <RefreshCw size={13} />
                    Retry
                  </button>
                </div>
              ) : null}

              {/* SAVED ADDRESSES */}

              {!addressError &&
              savedAddresses.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[var(--color-border-light)] pb-3">
                    <p className="eyebrow text-[var(--color-text-muted)]">
                      Saved Addresses
                    </p>

                    <span className="text-[11px] text-[var(--color-text-muted)]">
                      {savedAddresses.length}{" "}
                      {savedAddresses.length === 1
                        ? "address"
                        : "addresses"}
                    </span>
                  </div>

                  <div className="grid gap-3">
                    {savedAddresses.map(
                      (savedAddress) => {
                        const isSelected =
                          savedAddress.id ===
                          selectedAddressId;

                        return (
                          <button
                            key={savedAddress.id}
                            type="button"
                            onClick={() =>
                              handleSavedAddressSelect(
                                savedAddress,
                              )
                            }
                            aria-pressed={isSelected}
                            className={`group w-full border text-left transition-all duration-[var(--duration-base)] ${
                              isSelected
                                ? "border-[var(--color-accent)] bg-[var(--color-bg-subtle)]"
                                : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-dark)]"
                            }`}
                          >
                            <div className="flex items-start gap-4 px-4 py-5 sm:px-5">
                              {/* SELECT INDICATOR */}

                              <div
                                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border transition-colors ${
                                  isSelected
                                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-text-inverse)]"
                                    : "border-[var(--color-border-dark)] bg-[var(--color-surface)] text-transparent group-hover:border-[var(--color-accent)]"
                                }`}
                              >
                                <Check
                                  size={12}
                                  strokeWidth={2.5}
                                />
                              </div>

                              {/* ADDRESS DETAILS */}

                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-sm font-semibold text-[var(--color-text)]">
                                    {savedAddress.name}
                                  </p>

                                  {savedAddress.isDefault ? (
                                    <span className="border border-[var(--color-accent-soft)] bg-[var(--color-accent-soft)] px-2 py-1 text-[9px] font-semibold uppercase tracking-[var(--tracking-wide)] text-[var(--color-accent-dark)]">
                                      Default
                                    </span>
                                  ) : null}
                                </div>

                                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                                  {savedAddress.phone}
                                </p>

                                <p className="mt-2 text-xs leading-5 text-[var(--color-text-secondary)]">
                                  {savedAddress.addressLine}

                                  {savedAddress.landmark
                                    ? `, ${savedAddress.landmark}`
                                    : ""}

                                  <br />

                                  {savedAddress.city}
                                  {", "}
                                  {savedAddress.state}{" "}
                                  {savedAddress.pincode}
                                </p>
                              </div>

                              {/* LOCATION ICON */}

                              <MapPin
                                size={16}
                                className={`mt-0.5 shrink-0 transition-colors ${
                                  isSelected
                                    ? "text-[var(--color-accent)]"
                                    : "text-[var(--color-text-muted)]"
                                }`}
                              />
                            </div>
                          </button>
                        );
                      },
                    )}
                  </div>
                </div>
              ) : null}

              {/* ADD NEW ADDRESS */}

              <button
                type="button"
                onClick={handleManualAddress}
                aria-expanded={showManualForm}
                className={`group flex w-full items-center justify-between border px-4 py-4 text-left transition-all duration-[var(--duration-base)] sm:px-5 ${
                  showManualForm
                    ? "border-[var(--color-accent)] bg-[var(--color-bg-subtle)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-dark)]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center border border-[var(--color-border-dark)] bg-[var(--color-surface)] text-[var(--color-text)] transition-colors group-hover:border-[var(--color-accent)]">
                    <Plus size={15} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text)]">
                      Add a new address
                    </p>

                    <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                      Enter a different delivery address.
                    </p>
                  </div>
                </div>

                <ChevronDown
                  size={16}
                  className={`text-[var(--color-text-secondary)] transition-transform duration-[var(--duration-base)] ${
                    showManualForm
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {/* MANUAL FORM */}

              {showManualForm ? (
                <ManualAddressForm
                  address={address}
                  setAddress={setAddress}
                />
              ) : null}

              {/* SELECTED ADDRESS SUMMARY */}

              {selectedSavedAddress &&
              !showManualForm ? (
                <div className="border-t border-[var(--color-border-light)] pt-5">
                  <p className="eyebrow text-[var(--color-text-muted)]">
                    Selected delivery address
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <p className="text-xs font-semibold text-[var(--color-text)]">
                      {selectedSavedAddress.name}
                    </p>

                    <span className="text-[var(--color-text-muted)]">
                      ·
                    </span>

                    <p className="text-xs text-[var(--color-text-secondary)]">
                      {selectedSavedAddress.phone}
                    </p>
                  </div>

                  <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                    {selectedSavedAddress.city}
                    {", "}
                    {selectedSavedAddress.state}{" "}
                    {selectedSavedAddress.pincode}
                  </p>
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>
    );
  }

  /* ==========================================================
     GUEST / MANUAL ADDRESS VIEW
  ========================================================== */

  return (
    <section className="overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="border-b border-[var(--color-border-light)] px-5 py-6 sm:px-8 sm:py-7">
        <div className="flex items-start gap-4">
          <span className="mt-0.5 font-[var(--font-display)] text-lg text-[var(--color-accent)]">
            02
          </span>

          <div>
            <p className="eyebrow text-[var(--color-text-muted)]">
              Delivery Address
            </p>

            <h2 className="mt-2 font-[var(--font-display)] text-3xl font-medium leading-none tracking-[var(--tracking-tight)] text-[var(--color-text)] sm:text-4xl">
              Where should we deliver?
            </h2>

            <p className="mt-3 max-w-lg text-xs leading-5 text-[var(--color-text-secondary)] sm:text-sm">
              Enter the address where you&apos;d like your
              order delivered.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 px-5 py-7 sm:grid-cols-2 sm:px-8 sm:py-8">
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

        <SaveAddressCheckbox
          checked={!!address.isDefault}
          onChange={(checked) =>
            setAddress({
              isDefault: checked,
            })
          }
        />
      </div>
    </section>
  );
}

/* ============================================================
   MANUAL ADDRESS FORM
============================================================ */

function ManualAddressForm({
  address,
  setAddress,
}: {
  address: CheckoutAddress;
  setAddress: (
    address: Partial<CheckoutAddress>,
  ) => void;
}) {
  return (
    <div className="grid gap-6 border-t border-[var(--color-border-light)] pt-6 sm:grid-cols-2">
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

      <SaveAddressCheckbox
        checked={!!address.isDefault}
        onChange={(checked) =>
          setAddress({
            isDefault: checked,
          })
        }
      />
    </div>
  );
}

/* ============================================================
   SAVE ADDRESS CHECKBOX
============================================================ */

function SaveAddressCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 border-t border-[var(--color-border-light)] pt-5 sm:col-span-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(event.target.checked)
        }
        className="h-4 w-4 accent-[var(--color-accent)]"
      />

      <span className="text-xs text-[var(--color-text-secondary)] transition-colors group-hover:text-[var(--color-text)]">
        Save this address for future orders
      </span>
    </label>
  );
}

/* ============================================================
   LOADING STATE
============================================================ */

function AddressLoadingState() {
  return (
    <div
      className="space-y-3"
      aria-busy="true"
      aria-label="Loading saved addresses"
    >
      {[1, 2].map((item) => (
        <div
          key={item}
          className="animate-pulse border border-[var(--color-border)] px-5 py-5"
        >
          <div className="h-3 w-28 bg-[var(--color-bg-soft)]" />

          <div className="mt-3 h-3 w-40 bg-[var(--color-bg-soft)]" />

          <div className="mt-2 h-3 w-full max-w-md bg-[var(--color-bg-soft)]" />

          <div className="mt-2 h-3 w-3/4 max-w-sm bg-[var(--color-bg-soft)]" />
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   APPLY SAVED ADDRESS
============================================================ */

function applySavedAddress(
  savedAddress: CustomerAddress,
  setAddress: (
    address: Partial<CheckoutAddress>,
  ) => void,
  setContact: (
    contact: {
      email?: string;
      phone?: string;
    },
  ) => void,
) {
  const { firstName, lastName } =
    splitName(savedAddress.name);

  setAddress({
    firstName,
    lastName,
    addressLine1:
      savedAddress.addressLine,
    addressLine2: "",
    landmark:
      savedAddress.landmark ?? "",
    city: savedAddress.city,
    state: savedAddress.state,
    postalCode:
      savedAddress.pincode,
    country: "India",
    isDefault:
      savedAddress.isDefault,
  });

  setContact({
    phone: normalizeIndianPhone(
      savedAddress.phone,
    ),
  });
}

/* ============================================================
   NAME SPLITTER
============================================================ */

function splitName(name: string): {
  firstName: string;
  lastName: string;
} {
  const normalized = name.trim();

  if (!normalized) {
    return {
      firstName: "",
      lastName: "",
    };
  }

  const parts =
    normalized.split(/\s+/);

  if (parts.length === 1) {
    return {
      firstName: parts[0],
      lastName: "",
    };
  }

  return {
    firstName: parts[0],
    lastName:
      parts.slice(1).join(" "),
  };
}

/* ============================================================
   PHONE NORMALIZER
============================================================ */

function normalizeIndianPhone(
  phone: string,
): string {
  const digits =
    phone.replace(/\D/g, "");

  if (
    digits.length === 12 &&
    digits.startsWith("91")
  ) {
    return digits.slice(2);
  }

  if (
    digits.length === 11 &&
    digits.startsWith("0")
  ) {
    return digits.slice(1);
  }

  return digits.slice(-10);
}

/* ============================================================
   ADDRESS MATCHER
============================================================ */

function isSameAddress(
  savedAddress: CustomerAddress,
  checkoutAddress: CheckoutAddress,
): boolean {
  const fullName = [
    checkoutAddress.firstName,
    checkoutAddress.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim()
    .toLowerCase();

  return (
    savedAddress.name
      .trim()
      .toLowerCase() ===
      fullName &&
    savedAddress.addressLine
      .trim()
      .toLowerCase() ===
      checkoutAddress.addressLine1
        .trim()
        .toLowerCase() &&
    savedAddress.city
      .trim()
      .toLowerCase() ===
      checkoutAddress.city
        .trim()
        .toLowerCase() &&
    savedAddress.state
      .trim()
      .toLowerCase() ===
      checkoutAddress.state
        .trim()
        .toLowerCase() &&
    savedAddress.pincode
      .trim() ===
      checkoutAddress.postalCode
        .trim() &&
    (savedAddress.landmark ?? "")
      .trim()
      .toLowerCase() ===
      (checkoutAddress.landmark ?? "")
        .trim()
        .toLowerCase()
  );
}

/* ============================================================
   FIELD
============================================================ */

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
  inputMode?: "numeric" | "text";
}) {
  return (
    <label className="group block">
      <span className="mb-2.5 block text-[10px] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-secondary)]">
        {label}
      </span>

      <div className="relative">
        <input
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value,
            )
          }
          placeholder={placeholder}
          inputMode={inputMode}
          className="h-13 w-full border border-[var(--color-border-dark)] bg-[var(--color-surface-soft)] px-4 text-sm text-[var(--color-text)] outline-none transition-all duration-[var(--duration-base)] placeholder:text-[var(--color-text-muted)] hover:border-[var(--color-accent-soft)] focus:border-[var(--color-accent)] focus:bg-[var(--color-surface)]"
        />

        <span className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-[var(--color-accent)] transition-all duration-[var(--duration-luxury)] group-focus-within:w-full" />
      </div>
    </label>
  );
}