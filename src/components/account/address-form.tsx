"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Loader2, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { useAuthStore } from "@/store/auth-store";
import {
  createAddress,
  getAddress,
  updateAddress,
} from "@/lib/address-api";
import type {
  Address,
  CreateAddressPayload,
} from "@/types/address";

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
];

const normalizePhoneForInput = (phone: string) => {
  const value = phone.trim();

  if (value.startsWith("+91")) {
    return value.slice(3);
  }

  if (value.startsWith("91") && value.length === 12) {
    return value.slice(2);
  }

  return value;
};

const validateForm = (form: FormState) => {
  const errors: Partial<Record<keyof FormState, string>> = {};

  if (form.name.trim().length < 2) {
    errors.name = "Please enter the recipient name.";
  }

  if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
    errors.phone = "Enter a valid 10-digit Indian mobile number.";
  }

  if (form.addressLine.trim().length < 5) {
    errors.addressLine = "Please enter your complete address.";
  }

  if (form.city.trim().length < 2) {
    errors.city = "Please enter your city.";
  }

  if (!form.state) {
    errors.state = "Please select your state.";
  }

  if (!/^[1-9][0-9]{5}$/.test(form.pincode.trim())) {
    errors.pincode = "Enter a valid 6-digit pincode.";
  }

  if (form.landmark.trim().length > 150) {
    errors.landmark = "Landmark must be 150 characters or less.";
  }

  return errors;
};

export function AddressForm({ mode }: AddressFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );
  const isInitialized = useAuthStore(
    (state) => state.isInitialized,
  );

  const addressId = searchParams.get("id");

  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isSaving, setIsSaving] = useState(false);
  const [pageError, setPageError] = useState("");

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

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    if (!isAuthenticated || !accessToken) {
      router.replace(
        `/login?callbackUrl=${encodeURIComponent(
          mode === "create"
            ? "/account/addresses/new"
            : `/account/addresses/edit?id=${addressId ?? ""}`,
        )}`,
      );
      return;
    }

    if (mode !== "edit") {
      setIsLoading(false);
      return;
    }

    if (!addressId) {
      setPageError("The address could not be identified.");
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const loadAddress = async () => {
      setIsLoading(true);
      setPageError("");

      try {
        const address = await getAddress(
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
          addressLine: address.addressLine ?? "",
          city: address.city ?? "",
          state: address.state ?? "",
          pincode: address.pincode ?? "",
          landmark: address.landmark ?? "",
          isDefault: Boolean(address.isDefault),
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
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!accessToken) {
      router.push(
        `/login?callbackUrl=${
          mode === "create"
            ? "/account/addresses/new"
            : `/account/addresses/edit?id=${addressId ?? ""}`
        }`,
      );
      return;
    }

    const validationErrors = validateForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      const firstError = Object.values(
        validationErrors,
      ).find(Boolean);

      if (firstError) {
        toast.error(firstError);
      }

      return;
    }

    if (mode === "edit" && !addressId) {
      toast.error("Address ID is missing.");
      return;
    }

    setIsSaving(true);
    setPageError("");

    const payload: CreateAddressPayload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      addressLine: form.addressLine.trim(),
      city: form.city.trim(),
      state: form.state,
      pincode: form.pincode.trim(),
      landmark: form.landmark.trim(),
      isDefault: form.isDefault,
    };

    try {
      if (mode === "create") {
        await createAddress(accessToken, payload);

        toast.success("Address added successfully.");
      } else {
        await updateAddress(
          accessToken,
          addressId as string,
          payload,
        );

        toast.success("Address updated successfully.");
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

  if (!isInitialized || isLoading) {
    return (
      <section className="border border-[#e7e2dd] bg-white">
        <div className="border-b border-[#e7e2dd] px-6 py-6 sm:px-8">
          <div className="h-4 w-28 animate-pulse bg-[#f5f1ec]" />
          <div className="mt-3 h-9 w-64 animate-pulse bg-[#f5f1ec]" />
          <div className="mt-3 h-4 w-96 max-w-full animate-pulse bg-[#f5f1ec]" />
        </div>

        <div className="grid gap-5 p-6 sm:p-8 lg:grid-cols-2">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-14 animate-pulse bg-[#f5f1ec]"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!isAuthenticated || !accessToken) {
    return null;
  }

  if (mode === "edit" && !addressId) {
    return (
      <section className="border border-[#e7e2dd] bg-white px-6 py-16 text-center sm:px-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#e7e2dd] bg-[#fcfbf9]">
          <MapPin
            size={24}
            strokeWidth={1.5}
            className="text-[#6f706f]"
          />
        </div>

        <h1 className="mt-6 font-[var(--font-display)] text-3xl text-[#171717]">
          Address unavailable
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6f706f]">
          We could not identify the address you are trying to edit.
        </p>

        <Link
          href="/account/addresses"
          className="mt-7 inline-flex h-11 items-center justify-center border border-[#171717] bg-[#171717] px-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:bg-[#292c2c]"
        >
          Back to Addresses
        </Link>
      </section>
    );
  }

  return (
    <section className="border border-[#e7e2dd] bg-white">
      <div className="border-b border-[#e7e2dd] px-6 py-6 sm:px-8">
        <Link
          href="/account/addresses"
          className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6f706f] transition-colors hover:text-[#171717]"
        >
          <ArrowLeft
            size={14}
            strokeWidth={1.7}
          />
          Back to Addresses
        </Link>

        <div className="mt-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#969696]">
            Delivery Details
          </p>

          <h1 className="mt-2 font-[var(--font-display)] text-3xl leading-none text-[#171717] sm:text-4xl">
            {pageTitle}
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#6f706f]">
            {pageDescription}
          </p>
        </div>
      </div>

      {pageError ? (
        <div className="border-b border-[#e7e2dd] bg-[#fcfbf9] px-6 py-4 sm:px-8">
          <p className="text-sm text-[#7f4a50]">
            {pageError}
          </p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} noValidate>
        <div className="p-6 sm:p-8">
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-[#171717]">
              Recipient Information
            </h2>

            <p className="mt-1 text-xs leading-5 text-[#6f706f]">
              Enter the name and phone number of the person
              receiving the order.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <label
                htmlFor="address-name"
                className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6f706f]"
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
                className={`h-12 w-full border bg-white px-4 text-sm text-[#171717] outline-none transition-colors placeholder:text-[#aaa] ${
                  errors.name
                    ? "border-[#c47c84]"
                    : "border-[#d8d1ca] focus:border-[#171717]"
                }`}
              />

              {errors.name ? (
                <p className="mt-2 text-xs text-[#9a545c]">
                  {errors.name}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="address-phone"
                className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6f706f]"
              >
                Mobile Number
              </label>

              <div
                className={`flex h-12 border bg-white ${
                  errors.phone
                    ? "border-[#c47c84]"
                    : "border-[#d8d1ca] focus-within:border-[#171717]"
                }`}
              >
                <div className="flex shrink-0 items-center border-r border-[#e7e2dd] px-4 text-sm text-[#6f706f]">
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
                  className="min-w-0 flex-1 bg-transparent px-4 text-sm text-[#171717] outline-none placeholder:text-[#aaa]"
                />
              </div>

              {errors.phone ? (
                <p className="mt-2 text-xs text-[#9a545c]">
                  {errors.phone}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mb-8 mt-10">
            <h2 className="text-sm font-semibold text-[#171717]">
              Delivery Address
            </h2>

            <p className="mt-1 text-xs leading-5 text-[#6f706f]">
              Use the complete address where your order should
              be delivered.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="address-line"
                className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6f706f]"
              >
                Address
              </label>

              <textarea
                id="address-line"
                rows={4}
                autoComplete="street-address"
                value={form.addressLine}
                onChange={(event) =>
                  updateField(
                    "addressLine",
                    event.target.value,
                  )
                }
                placeholder="House / Flat / Building / Street"
                className={`w-full resize-none border bg-white px-4 py-3 text-sm leading-6 text-[#171717] outline-none transition-colors placeholder:text-[#aaa] ${
                  errors.addressLine
                    ? "border-[#c47c84]"
                    : "border-[#d8d1ca] focus:border-[#171717]"
                }`}
              />

              {errors.addressLine ? (
                <p className="mt-2 text-xs text-[#9a545c]">
                  {errors.addressLine}
                </p>
              ) : null}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <label
                  htmlFor="address-city"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6f706f]"
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
                  className={`h-12 w-full border bg-white px-4 text-sm text-[#171717] outline-none transition-colors placeholder:text-[#aaa] ${
                    errors.city
                      ? "border-[#c47c84]"
                      : "border-[#d8d1ca] focus:border-[#171717]"
                  }`}
                />

                {errors.city ? (
                  <p className="mt-2 text-xs text-[#9a545c]">
                    {errors.city}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="address-state"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6f706f]"
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
                    className={`h-12 w-full appearance-none border bg-white px-4 pr-10 text-sm text-[#171717] outline-none transition-colors ${
                      errors.state
                        ? "border-[#c47c84]"
                        : "border-[#d8d1ca] focus:border-[#171717]"
                    }`}
                  >
                    <option value="">
                      Select state
                    </option>

                    {INDIA_STATES.map((state) => (
                      <option
                        key={state}
                        value={state}
                      >
                        {state}
                      </option>
                    ))}
                  </select>

                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#6f706f]">
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
                  <p className="mt-2 text-xs text-[#9a545c]">
                    {errors.state}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <label
                  htmlFor="address-pincode"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6f706f]"
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
                  className={`h-12 w-full border bg-white px-4 text-sm text-[#171717] outline-none transition-colors placeholder:text-[#aaa] ${
                    errors.pincode
                      ? "border-[#c47c84]"
                      : "border-[#d8d1ca] focus:border-[#171717]"
                  }`}
                />

                {errors.pincode ? (
                  <p className="mt-2 text-xs text-[#9a545c]">
                    {errors.pincode}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="address-landmark"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6f706f]"
                >
                  Landmark
                  <span className="ml-1 font-normal normal-case tracking-normal text-[#a0a0a0]">
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
                  className={`h-12 w-full border bg-white px-4 text-sm text-[#171717] outline-none transition-colors placeholder:text-[#aaa] ${
                    errors.landmark
                      ? "border-[#c47c84]"
                      : "border-[#d8d1ca] focus:border-[#171717]"
                  }`}
                />

                {errors.landmark ? (
                  <p className="mt-2 text-xs text-[#9a545c]">
                    {errors.landmark}
                  </p>
                ) : null}
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-3 border border-[#e7e2dd] bg-[#fcfbf9] p-4 transition-colors hover:border-[#d8d1ca]">
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
                    ? "border-[#171717] bg-[#171717] text-white"
                    : "border-[#cfc8c1] bg-white text-transparent"
                }`}
              >
                <Check
                  size={13}
                  strokeWidth={2}
                />
              </span>

              <span>
                <span className="block text-sm font-medium text-[#171717]">
                  Make this my default address
                </span>

                <span className="mt-1 block text-xs leading-5 text-[#6f706f]">
                  This address will be selected automatically
                  during checkout.
                </span>
              </span>
            </label>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-[#e7e2dd] bg-[#fcfbf9] px-6 py-5 sm:flex-row sm:items-center sm:justify-end sm:px-8">
          <Link
            href="/account/addresses"
            className="inline-flex h-11 items-center justify-center border border-[#d8d1ca] bg-white px-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#171717] transition-colors duration-200 hover:border-[#171717]"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex h-11 items-center justify-center gap-2 border border-[#171717] bg-[#171717] px-7 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:bg-[#292c2c] disabled:cursor-not-allowed disabled:opacity-60"
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