"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  Check,
  Loader2,
  MapPin,
} from "lucide-react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import toast from "react-hot-toast";

import { useAuthStore } from "@/store/auth-store";

import {
  createCustomerAddress,
  getCustomerAddress,
  updateCustomerAddress,
  type CreateCustomerAddressPayload,
} from "@/lib/customer-api";

/* =========================================================
   TYPES
========================================================= */

type AddressFormProps = {
  mode: "create" | "edit";
};

type FormState = {
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  isDefault: boolean;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

/* =========================================================
   INITIAL FORM
========================================================= */

const initialForm: FormState = {
  name: "",
  phone: "",
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
  landmark: "",
  isDefault: false,
};

/* =========================================================
   INDIAN STATES / UTs
========================================================= */

const INDIA_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
] as const;

/* =========================================================
   HELPERS
========================================================= */

function normalizePhoneForInput(phone: string): string {
  const value = phone.trim();

  if (value.startsWith("+91")) {
    return value.slice(3);
  }

  if (value.startsWith("91") && value.length === 12) {
    return value.slice(2);
  }

  return value;
}

function validateForm(form: FormState): FormErrors {
  const errors: FormErrors = {};

  if (form.name.trim().length < 2) {
    errors.name = "Please enter the recipient name.";
  }

  if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
    errors.phone =
      "Enter a valid 10-digit Indian mobile number.";
  }

  if (form.addressLine.trim().length < 5) {
    errors.addressLine =
      "Please enter your complete address.";
  }

  if (form.city.trim().length < 2) {
    errors.city = "Please enter your city.";
  }

  if (!form.state) {
    errors.state = "Please select your state.";
  }

  if (!/^[1-9][0-9]{5}$/.test(form.pincode.trim())) {
    errors.pincode =
      "Enter a valid 6-digit pincode.";
  }

  if (form.landmark.trim().length > 150) {
    errors.landmark =
      "Landmark must be 150 characters or less.";
  }

  return errors;
}

/* =========================================================
   COMPONENT
========================================================= */

export function AddressForm({
  mode,
}: AddressFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const isInitialized = useAuthStore(
    (state) => state.isInitialized,
  );

  const addressId = searchParams.get("id");

  const [form, setForm] =
    useState<FormState>(initialForm);

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [isLoading, setIsLoading] =
    useState(mode === "edit");

  const [isSaving, setIsSaving] =
    useState(false);

  const [pageError, setPageError] =
    useState("");

  const pageTitle = useMemo(
    () =>
      mode === "create"
        ? "Add New Address"
        : "Edit Address",
    [mode],
  );

  const pageDescription = useMemo(
    () =>
      mode === "create"
        ? "Save a delivery address for a faster checkout experience."
        : "Update the delivery details saved to your account.",
    [mode],
  );

  /* =======================================================
     AUTH + LOAD EDIT ADDRESS
  ======================================================= */

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    if (!isAuthenticated || !accessToken) {
      const callbackUrl =
        mode === "create"
          ? "/account/addresses/new"
          : `/account/addresses/edit?id=${encodeURIComponent(
              addressId ?? "",
            )}`;

      router.replace(
        `/login?callbackUrl=${encodeURIComponent(
          callbackUrl,
        )}`,
      );

      return;
    }

    if (mode === "create") {
      setIsLoading(false);
      return;
    }

    if (!addressId) {
      setPageError(
        "The address could not be identified.",
      );

      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const loadAddress = async () => {
      setIsLoading(true);
      setPageError("");

      try {
        const address = await getCustomerAddress(
          accessToken,
          addressId,
        );

        if (cancelled) {
          return;
        }

        setForm({
          name: address.name ?? "",

          phone: normalizePhoneForInput(
            address.phone ?? "",
          ),

          addressLine:
            address.addressLine ?? "",

          city: address.city ?? "",

          state: address.state ?? "",

          pincode: address.pincode ?? "",

          landmark: address.landmark ?? "",

          isDefault: Boolean(
            address.isDefault,
          ),
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Unable to load this address.";

        setPageError(message);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadAddress();

    return () => {
      cancelled = true;
    };
  }, [
    accessToken,
    addressId,
    isAuthenticated,
    isInitialized,
    mode,
    router,
  ]);

  /* =======================================================
     UPDATE FIELD
  ======================================================= */

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: "",
    }));

    setPageError("");
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!accessToken) {
      const callbackUrl =
        mode === "create"
          ? "/account/addresses/new"
          : `/account/addresses/edit?id=${encodeURIComponent(
              addressId ?? "",
            )}`;

      router.push(
        `/login?callbackUrl=${encodeURIComponent(
          callbackUrl,
        )}`,
      );

      return;
    }

    if (mode === "edit" && !addressId) {
      setPageError("Address ID is missing.");

      toast.error("Address ID is missing.");

      return;
    }

    const validationErrors =
      validateForm(form);

    if (
      Object.keys(validationErrors).length > 0
    ) {
      setErrors(validationErrors);

      const firstError =
        Object.values(validationErrors).find(
          Boolean,
        );

      if (firstError) {
        toast.error(firstError);
      }

      return;
    }

    setIsSaving(true);
    setPageError("");
    setErrors({});

    const payload: CreateCustomerAddressPayload =
      {
        name: form.name.trim(),

        phone: form.phone.trim(),

        addressLine:
          form.addressLine.trim(),

        city: form.city.trim(),

        state: form.state,

        pincode: form.pincode.trim(),

        landmark: form.landmark.trim(),

        isDefault: form.isDefault,
      };

    try {
      if (mode === "create") {
        await createCustomerAddress(
          accessToken,
          payload,
        );

        toast.success(
          "Address added successfully.",
        );
      } else {
        await updateCustomerAddress(
          accessToken,
          addressId as string,
          payload,
        );

        toast.success(
          "Address updated successfully.",
        );
      }

      router.push("/account/addresses");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : mode === "create"
            ? "Unable to add the address."
            : "Unable to update the address.";

      setPageError(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (!isInitialized || isLoading) {
    return (
      <section className="border border-[var(--color-border-light)] bg-[var(--color-surface)]">
        <div className="border-b border-[var(--color-border-light)] px-6 py-6 sm:px-8">
          <div className="h-3 w-28 animate-pulse bg-[var(--color-bg-subtle)]" />

          <div className="mt-4 h-9 w-64 animate-pulse bg-[var(--color-bg-subtle)]" />

          <div className="mt-3 h-4 w-96 max-w-full animate-pulse bg-[var(--color-bg-subtle)]" />
        </div>

        <div className="grid gap-5 p-6 sm:p-8 lg:grid-cols-2">
          {[1, 2, 3, 4, 5, 6].map(
            (item) => (
              <div
                key={item}
                className="h-11 animate-pulse bg-[var(--color-bg-subtle)]"
              />
            ),
          )}
        </div>
      </section>
    );
  }

  /* =======================================================
     AUTH FALLBACK
  ======================================================= */

  if (!isAuthenticated || !accessToken) {
    return null;
  }

  /* =======================================================
     MISSING ADDRESS
  ======================================================= */

  if (mode === "edit" && !addressId) {
    return (
      <section className="border border-[var(--color-border-light)] bg-[var(--color-surface)] px-6 py-16 text-center sm:px-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[var(--color-border-light)] bg-[var(--color-surface-soft)]">
          <MapPin
            size={24}
            strokeWidth={1.5}
            className="text-[var(--color-text-secondary)]"
          />
        </div>

        <h1 className="mt-6 font-display text-3xl text-[var(--color-text)]">
          Address unavailable
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--color-text-secondary)]">
          We could not identify the address you are
          trying to edit.
        </p>

        <Link
          href="/account/addresses"
          className="mt-7 inline-flex h-11 items-center justify-center border border-[var(--color-text)] bg-[var(--color-text)] px-6 text-[var(--text-label)] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-inverse)] transition-all duration-[var(--duration-base)] hover:bg-[var(--color-accent-dark)]"
        >
          Back to Addresses
        </Link>
      </section>
    );
  }

  /* =======================================================
     FORM
  ======================================================= */

  return (
    <section className="border border-[var(--color-border-light)] bg-[var(--color-surface)]">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="border-b border-[var(--color-border-light)] px-6 py-7 sm:px-8 sm:py-8">
        <Link
          href="/account/addresses"
          className="inline-flex items-center gap-2 text-[var(--text-label)] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text)]"
        >
          <ArrowLeft
            size={14}
            strokeWidth={1.7}
          />

          Back to Addresses
        </Link>

        <div className="mt-7">
          <p className="eyebrow text-[var(--color-text-muted)]">
            Delivery Details
          </p>

          <h1 className="mt-2 font-display text-3xl leading-none text-[var(--color-text)] sm:text-4xl">
            {pageTitle}
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--color-text-secondary)]">
            {pageDescription}
          </p>
        </div>
      </div>

      {/* ===================================================
          PAGE ERROR
      =================================================== */}

      {pageError ? (
        <div className="border-b border-[var(--color-border-light)] bg-[var(--color-surface-soft)] px-6 py-4 sm:px-8">
          <p className="text-sm text-[var(--color-error)]">
            {pageError}
          </p>
        </div>
      ) : null}

      {/* ===================================================
          FORM
      =================================================== */}

      <form
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="p-6 sm:p-8">
          {/* =================================================
              RECIPIENT
          ================================================= */}

          <div className="mb-7">
            <p className="eyebrow text-[var(--color-text-muted)]">
              01
            </p>

            <h2 className="mt-2 font-display text-2xl text-[var(--color-text)]">
              Recipient Information
            </h2>

            <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">
              Enter the name and phone number of the
              person receiving the order.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {/* NAME */}

            <div>
              <label
                htmlFor="address-name"
                className="mb-2 block text-[var(--text-label)] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-secondary)]"
              >
                Full Name
              </label>

              <input
                id="address-name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={(event) =>
                  updateField(
                    "name",
                    event.target.value,
                  )
                }
                placeholder="Enter recipient name"
                className={`h-11 w-full border bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] ${
                  errors.name
                    ? "border-[var(--color-error)]"
                    : "border-[var(--color-border)] focus:border-[var(--color-text)]"
                }`}
              />

              {errors.name ? (
                <p className="mt-2 text-xs text-[var(--color-error)]">
                  {errors.name}
                </p>
              ) : null}
            </div>

            {/* PHONE */}

            <div>
              <label
                htmlFor="address-phone"
                className="mb-2 block text-[var(--text-label)] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-secondary)]"
              >
                Mobile Number
              </label>

              <div
                className={`flex h-11 border bg-[var(--color-surface)] ${
                  errors.phone
                    ? "border-[var(--color-error)]"
                    : "border-[var(--color-border)] focus-within:border-[var(--color-text)]"
                }`}
              >
                <div className="flex shrink-0 items-center border-r border-[var(--color-border-light)] px-4 text-sm text-[var(--color-text-secondary)]">
                  +91
                </div>

                <input
                  id="address-phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={10}
                  value={form.phone}
                  onChange={(event) =>
                    updateField(
                      "phone",
                      event.target.value.replace(
                        /\D/g,
                        "",
                      ),
                    )
                  }
                  placeholder="10-digit mobile number"
                  className="min-w-0 flex-1 bg-transparent px-4 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]"
                />
              </div>

              {errors.phone ? (
                <p className="mt-2 text-xs text-[var(--color-error)]">
                  {errors.phone}
                </p>
              ) : null}
            </div>
          </div>

          {/* =================================================
              DELIVERY
          ================================================= */}

          <div className="mb-7 mt-12">
            <p className="eyebrow text-[var(--color-text-muted)]">
              02
            </p>

            <h2 className="mt-2 font-display text-2xl text-[var(--color-text)]">
              Delivery Address
            </h2>

            <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">
              Use the complete address where your order
              should be delivered.
            </p>
          </div>

          <div className="space-y-5">
            {/* ADDRESS */}

            <div>
              <label
                htmlFor="address-line"
                className="mb-2 block text-[var(--text-label)] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-secondary)]"
              >
                Address
              </label>

              <textarea
                id="address-line"
                rows={3}
                autoComplete="street-address"
                value={form.addressLine}
                onChange={(event) =>
                  updateField(
                    "addressLine",
                    event.target.value,
                  )
                }
                placeholder="House / Flat / Building / Street"
                className={`min-h-[96px] w-full resize-none border bg-[var(--color-surface)] px-4 py-3 text-sm leading-6 text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] ${
                  errors.addressLine
                    ? "border-[var(--color-error)]"
                    : "border-[var(--color-border)] focus:border-[var(--color-text)]"
                }`}
              />

              {errors.addressLine ? (
                <p className="mt-2 text-xs text-[var(--color-error)]">
                  {errors.addressLine}
                </p>
              ) : null}
            </div>

            {/* CITY + STATE */}

            <div className="grid gap-5 lg:grid-cols-2">
              <div>
                <label
                  htmlFor="address-city"
                  className="mb-2 block text-[var(--text-label)] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-secondary)]"
                >
                  City
                </label>

                <input
                  id="address-city"
                  type="text"
                  autoComplete="address-level2"
                  value={form.city}
                  onChange={(event) =>
                    updateField(
                      "city",
                      event.target.value,
                    )
                  }
                  placeholder="Enter city"
                  className={`h-11 w-full border bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] ${
                    errors.city
                      ? "border-[var(--color-error)]"
                      : "border-[var(--color-border)] focus:border-[var(--color-text)]"
                  }`}
                />

                {errors.city ? (
                  <p className="mt-2 text-xs text-[var(--color-error)]">
                    {errors.city}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="address-state"
                  className="mb-2 block text-[var(--text-label)] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-secondary)]"
                >
                  State
                </label>

                <div className="relative">
                  <select
                    id="address-state"
                    autoComplete="address-level1"
                    value={form.state}
                    onChange={(event) =>
                      updateField(
                        "state",
                        event.target.value,
                      )
                    }
                    className={`h-11 w-full appearance-none border bg-[var(--color-surface)] px-4 pr-10 text-sm text-[var(--color-text)] outline-none transition-colors ${
                      errors.state
                        ? "border-[var(--color-error)]"
                        : "border-[var(--color-border)] focus:border-[var(--color-text)]"
                    }`}
                  >
                    <option value="">
                      Select state
                    </option>

                    {INDIA_STATES.map(
                      (state) => (
                        <option
                          key={state}
                          value={state}
                        >
                          {state}
                        </option>
                      ),
                    )}
                  </select>

                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[var(--color-text-secondary)]">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>

                {errors.state ? (
                  <p className="mt-2 text-xs text-[var(--color-error)]">
                    {errors.state}
                  </p>
                ) : null}
              </div>
            </div>

            {/* PINCODE + LANDMARK */}

            <div className="grid gap-5 lg:grid-cols-2">
              <div>
                <label
                  htmlFor="address-pincode"
                  className="mb-2 block text-[var(--text-label)] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-secondary)]"
                >
                  Pincode
                </label>

                <input
                  id="address-pincode"
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={6}
                  value={form.pincode}
                  onChange={(event) =>
                    updateField(
                      "pincode",
                      event.target.value.replace(
                        /\D/g,
                        "",
                      ),
                    )
                  }
                  placeholder="6-digit pincode"
                  className={`h-11 w-full border bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] ${
                    errors.pincode
                      ? "border-[var(--color-error)]"
                      : "border-[var(--color-border)] focus:border-[var(--color-text)]"
                  }`}
                />

                {errors.pincode ? (
                  <p className="mt-2 text-xs text-[var(--color-error)]">
                    {errors.pincode}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="address-landmark"
                  className="mb-2 block text-[var(--text-label)] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-secondary)]"
                >
                  Landmark

                  <span className="ml-1 font-normal normal-case tracking-normal text-[var(--color-text-muted)]">
                    (optional)
                  </span>
                </label>

                <input
                  id="address-landmark"
                  type="text"
                  value={form.landmark}
                  onChange={(event) =>
                    updateField(
                      "landmark",
                      event.target.value,
                    )
                  }
                  placeholder="Near a known landmark"
                  className={`h-11 w-full border bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] ${
                    errors.landmark
                      ? "border-[var(--color-error)]"
                      : "border-[var(--color-border)] focus:border-[var(--color-text)]"
                  }`}
                />

                {errors.landmark ? (
                  <p className="mt-2 text-xs text-[var(--color-error)]">
                    {errors.landmark}
                  </p>
                ) : null}
              </div>
            </div>

            {/* DEFAULT */}

            <label className="flex cursor-pointer items-start gap-3 border border-[var(--color-border-light)] bg-[var(--color-surface-soft)] p-4 transition-colors hover:border-[var(--color-border)]">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(event) =>
                  updateField(
                    "isDefault",
                    event.target.checked,
                  )
                }
                className="sr-only"
              />

              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border transition-colors ${
                  form.isDefault
                    ? "border-[var(--color-text)] bg-[var(--color-text)] text-[var(--color-text-inverse)]"
                    : "border-[var(--color-border-dark)] bg-[var(--color-surface)] text-transparent"
                }`}
              >
                <Check
                  size={13}
                  strokeWidth={2}
                />
              </span>

              <span>
                <span className="block text-sm font-medium text-[var(--color-text)]">
                  Make this my default address
                </span>

                <span className="mt-1 block text-xs leading-5 text-[var(--color-text-secondary)]">
                  This address will be selected
                  automatically during checkout.
                </span>
              </span>
            </label>
          </div>
        </div>

        {/* ===================================================
            FORM ACTIONS
        =================================================== */}

        <div className="flex flex-col-reverse gap-3 border-t border-[var(--color-border-light)] bg-[var(--color-surface-soft)] px-6 py-5 sm:flex-row sm:items-center sm:justify-end sm:px-8">
          <Link
            href="/account/addresses"
            className="inline-flex h-11 items-center justify-center border border-[var(--color-border)] bg-[var(--color-surface)] px-6 text-[var(--text-label)] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text)] transition-all duration-[var(--duration-base)] hover:border-[var(--color-text)]"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex h-11 items-center justify-center gap-2 border border-[var(--color-text)] bg-[var(--color-text)] px-7 text-[var(--text-label)] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-inverse)] transition-all duration-[var(--duration-base)] hover:bg-[var(--color-accent-dark)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <Loader2
                  size={15}
                  className="animate-spin"
                  strokeWidth={1.8}
                />

                Saving...
              </>
            ) : (
              <>
                <Check
                  size={15}
                  strokeWidth={1.8}
                />

                {mode === "create"
                  ? "Save Address"
                  : "Update Address"}
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}