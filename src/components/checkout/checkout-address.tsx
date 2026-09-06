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

    /*
     * This is a newly entered checkout address.
     * Do not treat it as a saved/default address.
     */
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
      <section className="border border-[var(--color-border)] bg-white">
        {/* HEADER */}

        <div className="border-b border-[var(--color-border)] px-5 py-5 sm:px-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
            02 · Delivery Address
          </p>

          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-[var(--font-cormorant)] text-2xl">
                Where should we deliver?
              </h2>

              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Select a saved address or add a new
                delivery address.
              </p>
            </div>

            <Link
              href="/account/addresses"
              className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-charcoal)] transition-opacity hover:opacity-60"
            >
              Manage Addresses
            </Link>
          </div>
        </div>

        {/* CONTENT */}

        <div className="space-y-5 px-5 py-6 sm:px-7">
          {isLoadingAddresses ? (
            <AddressLoadingState />
          ) : (
            <>
              {/* ERROR */}

              {addressError ? (
                <div className="flex items-start justify-between gap-4 border border-[var(--color-border)] bg-[var(--color-ivory)] px-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-charcoal)]">
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
                    className="inline-flex shrink-0 items-center gap-2 border border-[var(--color-border-dark)] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-charcoal)] transition-colors hover:bg-[var(--color-ivory)]"
                  >
                    <RefreshCw size={13} />
                    Retry
                  </button>
                </div>
              ) : null}

              {/* SAVED ADDRESSES */}

              {!addressError &&
              savedAddresses.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
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
                            className={`w-full border text-left transition-colors ${
                              isSelected
                                ? "border-[var(--color-charcoal)] bg-[var(--color-ivory)]"
                                : "border-[var(--color-border)] bg-white hover:border-[var(--color-border-dark)]"
                            }`}
                          >
                            <div className="flex items-start gap-4 px-4 py-4 sm:px-5">
                              {/* SELECT INDICATOR */}

                              <div
                                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border ${
                                  isSelected
                                    ? "border-[var(--color-charcoal)] bg-[var(--color-charcoal)] text-white"
                                    : "border-[var(--color-border-dark)] bg-white"
                                }`}
                              >
                                {isSelected ? (
                                  <Check
                                    size={12}
                                    strokeWidth={2.5}
                                  />
                                ) : null}
                              </div>

                              {/* ADDRESS DETAILS */}

                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-sm font-semibold text-[var(--color-charcoal)]">
                                    {savedAddress.name}
                                  </p>

                                  {savedAddress.isDefault ? (
                                    <span className="border border-[var(--color-rose-light)] bg-[var(--color-rose-light)] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-[var(--color-charcoal)]">
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
                                className={`mt-0.5 shrink-0 ${
                                  isSelected
                                    ? "text-[var(--color-charcoal)]"
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
                className={`flex w-full items-center justify-between border px-4 py-4 text-left transition-colors sm:px-5 ${
                  showManualForm
                    ? "border-[var(--color-charcoal)] bg-[var(--color-ivory)]"
                    : "border-[var(--color-border)] hover:border-[var(--color-border-dark)]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center border border-[var(--color-border-dark)] bg-white">
                    <Plus size={15} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[var(--color-charcoal)]">
                      Add a new address
                    </p>

                    <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                      Enter a different delivery address.
                    </p>
                  </div>
                </div>

                <ChevronDown
                  size={16}
                  className={`transition-transform ${
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
                <div className="border-t border-[var(--color-border)] pt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                    Selected delivery address
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <p className="text-xs font-medium text-[var(--color-charcoal)]">
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
    <div className="grid gap-5 border-t border-[var(--color-border)] pt-5 sm:grid-cols-2">
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
  );
}

/* ============================================================
   LOADING STATE
============================================================ */

function AddressLoadingState() {
  return (
    <div className="space-y-3">
      {[1, 2].map((item) => (
        <div
          key={item}
          className="animate-pulse border border-[var(--color-border)] px-5 py-5"
        >
          <div className="h-3 w-28 bg-[var(--color-cream)]" />

          <div className="mt-3 h-3 w-40 bg-[var(--color-cream)]" />

          <div className="mt-2 h-3 w-full max-w-md bg-[var(--color-cream)]" />

          <div className="mt-2 h-3 w-3/4 max-w-sm bg-[var(--color-cream)]" />
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

  /*
   * Important:
   * Saved address phone is synced with checkout contact.
   * The backend address API may return +91 / 91 / 10-digit,
   * so normalize it before storing it.
   */
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
    <label className="block">
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em]">
        {label}
      </span>

      <input
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        placeholder={placeholder}
        inputMode={inputMode}
        className="h-12 w-full border border-[var(--color-border-dark)] bg-transparent px-4 text-sm outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-charcoal)]"
      />
    </label>
  );
}