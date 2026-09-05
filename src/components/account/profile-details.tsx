"use client";

import Link from "next/link";

import {
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronDown,
  Edit3,
  Loader2,
  Mail,
  Phone,
  Ruler,
  Save,
  UserRound,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";

import { getCustomerProfile, updateCustomerProfile } from "@/lib/api/customer";
import { useAuthStore } from "@/store/auth-store";

import type {
  CustomerGender,
  CustomerProfile,
  UpdateCustomerProfilePayload,
} from "@/types/customer";

const availableSizes = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
];

const availableColors = [
  "Black",
  "Ivory",
  "Beige",
  "Blush",
  "Rose",
  "Navy",
  "Olive",
];

type FormState = {
  name: string;
  phone: string;
  avatarUrl: string;
  dateOfBirth: string;
  gender: CustomerGender;
  preferredSizes: string[];
  preferredColors: string[];
  marketingEmails: boolean;
  marketingWhatsapp: boolean;
};

function createFormState(
  profile: CustomerProfile,
): FormState {
  const date = profile.customer.dateOfBirth
    ? new Date(profile.customer.dateOfBirth)
    : null;

  const formattedDate = date
    ? `${date.getFullYear()}-${String(
        date.getMonth() + 1,
      ).padStart(2, "0")}-${String(
        date.getDate(),
      ).padStart(2, "0")}`
    : "";

  return {
    name: profile.user.name ?? "",
    phone: profile.user.phone || profile.customer.phone || "",
    avatarUrl: profile.user.avatarUrl ?? "",
    dateOfBirth: formattedDate,
    gender: profile.customer.gender ?? null,
    preferredSizes: [
      ...(profile.customer.preferredSizes ?? []),
    ],
    preferredColors: [
      ...(profile.customer.preferredColors ?? []),
    ],
    marketingEmails:
      profile.customer.marketingEmails ?? false,
    marketingWhatsapp:
      profile.customer.marketingWhatsapp ?? false,
  };
}

function getInitials(name: string) {
  const value = name.trim();

  if (!value) {
    return "AF";
  }

  const parts = value.split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatDate(value: string | null) {
  if (!value) {
    return "Not added";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not added";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function ProfileDetails() {
  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const [profile, setProfile] =
    useState<CustomerProfile | null>(null);

  const [form, setForm] =
    useState<FormState | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [isEditing, setIsEditing] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [showSuccess, setShowSuccess] =
    useState(false);

  /* =========================================================
     LOAD PROFILE
  ========================================================= */

  const loadProfile = useCallback(async () => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response =
  await getCustomerProfile(accessToken);

setProfile(response);

setForm(
  createFormState(response),
);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load your profile.";

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    void loadProfile();
  }, [
    isAuthenticated,
    loadProfile,
  ]);

  /* =========================================================
     FORM HELPERS
  ========================================================= */

  const updateForm = <
    K extends keyof FormState,
  >(
    key: K,
    value: FormState[K],
  ) => {
    setForm((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [key]: value,
      };
    });

    setShowSuccess(false);
  };

  const toggleSize = (size: string) => {
    setForm((current) => {
      if (!current) {
        return current;
      }

      const exists =
        current.preferredSizes.includes(size);

      return {
        ...current,
        preferredSizes: exists
          ? current.preferredSizes.filter(
              (item) => item !== size,
            )
          : [
              ...current.preferredSizes,
              size,
            ],
      };
    });

    setShowSuccess(false);
  };

  const toggleColor = (color: string) => {
    setForm((current) => {
      if (!current) {
        return current;
      }

      const exists =
        current.preferredColors.includes(
          color,
        );

      return {
        ...current,
        preferredColors: exists
          ? current.preferredColors.filter(
              (item) => item !== color,
            )
          : [
              ...current.preferredColors,
              color,
            ],
      };
    });

    setShowSuccess(false);
  };

  /* =========================================================
     SAVE
  ========================================================= */

  const handleSave = async () => {
    if (!accessToken || !form || !profile) {
      return;
    }

    setErrorMessage("");
    setShowSuccess(false);

    const name = form.name.trim();
    const phone = form.phone.trim();

    if (name.length < 2) {
      setErrorMessage(
        "Please enter your full name.",
      );
      return;
    }

    if (
      !/^(?:\+91|91)?[6-9]\d{9}$/.test(
        phone,
      )
    ) {
      setErrorMessage(
        "Please enter a valid Indian phone number.",
      );
      return;
    }

    setIsSaving(true);

    const payload: UpdateCustomerProfilePayload = {
      name,
      phone,
      avatarUrl:
        form.avatarUrl.trim(),
      dateOfBirth:
        form.dateOfBirth
          ? new Date(
              `${form.dateOfBirth}T00:00:00`,
            ).toISOString()
          : null,
      gender: form.gender,
      preferredSizes: [
        ...form.preferredSizes,
      ],
      preferredColors: [
        ...form.preferredColors,
      ],
      marketingEmails:
        form.marketingEmails,
      marketingWhatsapp:
        form.marketingWhatsapp,
    };

    try {
      const response =
  await updateCustomerProfile(
    accessToken,
    payload,
  );

setProfile(response);

setForm(
  createFormState(response),
);

      setIsEditing(false);
      setShowSuccess(true);

      toast.success(
        "Profile updated successfully.",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to update your profile.";

      setErrorMessage(message);

      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  /* =========================================================
     CANCEL
  ========================================================= */

  const handleCancel = () => {
    if (!profile) {
      return;
    }

    setForm(
      createFormState(profile),
    );

    setIsEditing(false);
    setErrorMessage("");
    setShowSuccess(false);
  };

  /* =========================================================
     DERIVED
  ========================================================= */

  const initials = useMemo(
    () =>
      getInitials(
        profile?.user.name ?? "",
      ),
    [profile?.user.name],
  );

  /* =========================================================
     AUTH STATE
  ========================================================= */

  if (!isAuthenticated) {
    return (
      <section className="min-h-[60vh] bg-[var(--color-ivory)]">
        <div className="mx-auto flex min-h-[60vh] max-w-[720px] items-center justify-center px-5 py-16 text-center">
          <div>
            <h1 className="font-display text-[38px] text-[var(--color-ink)]">
              Sign in to view your account
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[var(--color-secondary)]">
              Please sign in to access your profile,
              preferences and account settings.
            </p>
          </div>
        </div>
      </section>
    );
  }

  /* =========================================================
     LOADING
  ========================================================= */

  if (isLoading) {
    return (
      <section className="min-h-screen bg-[var(--color-ivory)]">
        <div className="mx-auto flex min-h-[70vh] max-w-[1280px] items-center justify-center px-5">
          <div className="flex items-center gap-3 text-sm text-[var(--color-secondary)]">
            <Loader2
              size={18}
              className="animate-spin"
            />

            <span>
              Loading your profile...
            </span>
          </div>
        </div>
      </section>
    );
  }

  if (!profile || !form) {
  return (
    <section className="min-h-[60vh] bg-[var(--color-ivory)]">
      <div className="mx-auto flex min-h-[60vh] max-w-[720px] items-center justify-center px-5 text-center">
        <div>
          <h1 className="font-display text-[36px] text-[var(--color-ink)]">
            Profile unavailable
          </h1>

          <p className="mt-3 text-sm leading-6 text-[var(--color-secondary)]">
            {errorMessage ||
              "We could not load your account details."}
          </p>

          <button
            type="button"
            onClick={() => {
              window.location.href =
                "/login?callbackUrl=/account";
            }}
            className="mt-6 inline-flex h-11 items-center justify-center border border-[#171717] bg-[#171717] px-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:bg-[#292c2c]"
          >
            Try Again
          </button>
        </div>
      </div>
    </section>
  );
}

  return (
    <section className="min-h-screen bg-[var(--color-ivory)]">
      <div className="mx-auto w-full max-w-[1280px] px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="border-b border-[var(--color-border)] pb-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--color-rose-dark)]">
            My Account
          </p>

          <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-display text-[38px] leading-none text-[var(--color-ink)] sm:text-[44px]">
                Profile Details
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--color-secondary)]">
                Manage your personal details,
                style preferences and communication
                settings.
              </p>
            </div>

            {!isEditing ? (
<Link
  href="/account/edit"
  className="inline-flex h-11 w-fit items-center justify-center gap-2 border border-[#171717] bg-[#171717] px-5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors duration-200 hover:border-[#292c2c] hover:bg-[#292c2c]"
>
  <Edit3
    size={15}
    strokeWidth={1.8}
  />

  Edit Profile
</Link>
            ) : (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="inline-flex h-11 items-center justify-center gap-2 border border-[var(--color-border)] bg-white px-5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)] transition hover:border-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X size={15} />

                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    void handleSave();
                  }}
                  disabled={isSaving}
                  className="inline-flex h-11 items-center justify-center gap-2 border border-[var(--color-ink)] bg-[var(--color-ink)] px-5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--color-soft-charcoal)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? (
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                  ) : (
                    <Save size={15} />
                  )}

                  {isSaving
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* =====================================================
            FEEDBACK
        ====================================================== */}

        {errorMessage && (
          <div
            role="alert"
            className="mt-6 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
          >
            {errorMessage}
          </div>
        )}

        {showSuccess && (
          <div className="mt-6 flex items-center gap-2 border border-[var(--color-rose)] bg-[var(--color-rose-light)] px-5 py-4 text-sm text-[var(--color-ink)]">
            <Check
              size={17}
              className="text-[var(--color-rose-dark)]"
            />

            Your profile has been updated successfully.
          </div>
        )}

        {/* =====================================================
            MAIN GRID
        ====================================================== */}

        <div className="mt-10 grid gap-7 lg:grid-cols-[300px_minmax(0,1fr)]">
          {/* ===================================================
              ACCOUNT SUMMARY
          ==================================================== */}

          <aside className="h-fit border border-[var(--color-border)] bg-white">
            <div className="p-7">
              <div className="flex items-center gap-5">
                <div className="grid h-[74px] w-[74px] shrink-0 place-items-center overflow-hidden rounded-full border border-[var(--color-rose)] bg-[var(--color-rose-light)] font-display text-2xl text-[var(--color-ink)]">
                  {form.avatarUrl ? (
                    <img
                      src={form.avatarUrl}
                      alt={profile.user.name || "Profile"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                <div className="min-w-0">
                  <h2 className="truncate font-display text-[27px] leading-tight text-[var(--color-ink)]">
                    {profile.user.name ||
                      "Your Account"}
                  </h2>

                  <p className="mt-1 truncate text-sm text-[var(--color-secondary)]">
                    {profile.user.email}
                  </p>
                </div>
              </div>

              <div className="mt-7 border-t border-[var(--color-border)] pt-6">
                <div className="flex items-start gap-3">
                  <Mail
                    size={17}
                    strokeWidth={1.7}
                    className="mt-0.5 text-[var(--color-secondary)]"
                  />

                  <div className="min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-[var(--color-muted)]">
                      Email
                    </p>

                    <p className="mt-1 break-all text-sm text-[var(--color-ink)]">
                      {profile.user.email}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-start gap-3">
                  <Phone
                    size={17}
                    strokeWidth={1.7}
                    className="mt-0.5 text-[var(--color-secondary)]"
                  />

                  <div className="min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-[var(--color-muted)]">
                      Phone
                    </p>

                    <p className="mt-1 text-sm text-[var(--color-ink)]">
                      {profile.user.phone ||
                        profile.customer.phone ||
                        "Not added"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 text-[var(--color-rose-dark)]">
                  <BadgeCheck
                    size={17}
                    strokeWidth={1.8}
                  />

                  <span className="text-xs font-medium">
                    {profile.user.emailVerified
                      ? "Email verified"
                      : "Email not verified"}
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* ===================================================
              DETAILS
          ==================================================== */}

          <div className="space-y-7">
            {/* =================================================
                PERSONAL INFORMATION
            ================================================== */}

            <section className="border border-[var(--color-border)] bg-white">
              <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-5 sm:px-7">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-rose-dark)]">
                    Account
                  </p>

                  <h2 className="mt-1 font-display text-[28px] text-[var(--color-ink)]">
                    Personal Information
                  </h2>
                </div>

                <UserRound
                  size={20}
                  strokeWidth={1.6}
                  className="text-[var(--color-secondary)]"
                />
              </div>

              <div className="grid gap-x-7 gap-y-6 p-6 sm:grid-cols-2 sm:p-7">
                {/* NAME */}

                <div>
                  <label className="mb-2.5 block text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--color-secondary)]">
                    Full Name
                  </label>

                  {isEditing ? (
                    <input
                      value={form.name}
                      onChange={(event) => {
                        updateForm(
                          "name",
                          event.target.value,
                        );
                      }}
                      autoComplete="name"
                      className="h-12 w-full border-b border-[var(--color-border)] bg-transparent text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-rose-dark)]"
                    />
                  ) : (
                    <div className="flex min-h-12 items-center border-b border-[var(--color-border)] text-sm text-[var(--color-ink)]">
                      {profile.user.name ||
                        "Not added"}
                    </div>
                  )}
                </div>

                {/* EMAIL */}

                <div>
                  <label className="mb-2.5 block text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--color-secondary)]">
                    Email Address
                  </label>

                  <div className="flex min-h-12 items-center justify-between gap-4 border-b border-[var(--color-border)] text-sm text-[var(--color-ink)]">
                    <span className="break-all">
                      {profile.user.email}
                    </span>

                    <span className="shrink-0 text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]">
                      {profile.user.emailVerified
                        ? "Verified"
                        : "Unverified"}
                    </span>
                  </div>

                  <p className="mt-2 text-[11px] leading-5 text-[var(--color-muted)]">
                    Email address is managed
                    separately from profile editing.
                  </p>
                </div>

                {/* PHONE */}

                <div>
                  <label className="mb-2.5 block text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--color-secondary)]">
                    Phone Number
                  </label>

                  {isEditing ? (
                    <input
                      value={form.phone}
                      onChange={(event) => {
                        updateForm(
                          "phone",
                          event.target.value,
                        );
                      }}
                      inputMode="tel"
                      autoComplete="tel"
                      className="h-12 w-full border-b border-[var(--color-border)] bg-transparent text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-rose-dark)]"
                    />
                  ) : (
                    <div className="flex min-h-12 items-center border-b border-[var(--color-border)] text-sm text-[var(--color-ink)]">
                      {profile.user.phone ||
                        profile.customer.phone ||
                        "Not added"}
                    </div>
                  )}
                </div>

                {/* GENDER */}

                <div>
                  <label className="mb-2.5 block text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--color-secondary)]">
                    Gender
                  </label>

                  {isEditing ? (
                    <div className="relative">
                      <select
                        value={
                          form.gender ?? ""
                        }
                        onChange={(event) => {
                          const value =
                            event.target.value;

                          updateForm(
                            "gender",
                            value === ""
                              ? null
                              : (value as CustomerGender),
                          );
                        }}
                        className="h-12 w-full appearance-none border-b border-[var(--color-border)] bg-transparent pr-8 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-rose-dark)]"
                      >
                        <option value="">
                          Prefer not to say
                        </option>

                        <option value="female">
                          Female
                        </option>

                        <option value="male">
                          Male
                        </option>

                        <option value="other">
                          Other
                        </option>
                      </select>

                      <ChevronDown
                        size={16}
                        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[var(--color-secondary)]"
                      />
                    </div>
                  ) : (
                    <div className="flex min-h-12 items-center border-b border-[var(--color-border)] text-sm capitalize text-[var(--color-ink)]">
                      {profile.customer.gender ||
                        "Not added"}
                    </div>
                  )}
                </div>

                {/* DOB */}

                <div>
                  <label className="mb-2.5 block text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--color-secondary)]">
                    Date of Birth
                  </label>

                  {isEditing ? (
                    <div className="relative">
                      <input
                        type="date"
                        value={form.dateOfBirth}
                        onChange={(event) => {
                          updateForm(
                            "dateOfBirth",
                            event.target.value,
                          );
                        }}
                        className="h-12 w-full border-b border-[var(--color-border)] bg-transparent text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-rose-dark)]"
                      />

                      <CalendarDays
                        size={16}
                        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[var(--color-secondary)]"
                      />
                    </div>
                  ) : (
                    <div className="flex min-h-12 items-center justify-between border-b border-[var(--color-border)] text-sm text-[var(--color-ink)]">
                      <span>
                        {formatDate(
                          profile.customer
                            .dateOfBirth,
                        )}
                      </span>

                      <CalendarDays
                        size={16}
                        strokeWidth={1.7}
                        className="text-[var(--color-secondary)]"
                      />
                    </div>
                  )}
                </div>

                {/* STATUS */}

                <div>
                  <label className="mb-2.5 block text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--color-secondary)]">
                    Account Status
                  </label>

                  <div className="flex min-h-12 items-center border-b border-[var(--color-border)]">
                    <span className="inline-flex items-center gap-2 text-sm capitalize text-[var(--color-ink)]">
                      <span className="h-2 w-2 rounded-full bg-[var(--color-rose-dark)]" />

                      {profile.user.status}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                STYLE PREFERENCES
            ================================================== */}

            <section className="border border-[var(--color-border)] bg-white">
              <div className="border-b border-[var(--color-border)] px-6 py-5 sm:px-7">
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-rose-dark)]">
                  Personalisation
                </p>

                <h2 className="mt-1 font-display text-[28px] text-[var(--color-ink)]">
                  Style Preferences
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--color-secondary)]">
                  Choose your preferred sizes and
                  colours. These preferences are saved
                  to your account.
                </p>
              </div>

              <div className="p-6 sm:p-7">
                {/* SIZES */}

                <div>
                  <div className="flex items-center gap-2">
                    <Ruler
                      size={16}
                      strokeWidth={1.7}
                      className="text-[var(--color-secondary)]"
                    />

                    <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-[var(--color-secondary)]">
                      Preferred Sizes
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {availableSizes.map(
                      (size) => {
                        const selected =
                          form.preferredSizes.includes(
                            size,
                          );

                        return (
                          <button
                            key={size}
                            type="button"
                            disabled={!isEditing}
                            onClick={() => {
                              toggleSize(size);
                            }}
                            className={`min-w-12 border px-4 py-3 text-xs font-medium tracking-[0.08em] transition ${
                              selected
                                ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white"
                                : "border-[var(--color-border)] bg-white text-[var(--color-ink)]"
                            } ${
                              isEditing
                                ? "hover:border-[var(--color-rose-dark)]"
                                : "cursor-default"
                            }`}
                          >
                            {size}
                          </button>
                        );
                      },
                    )}
                  </div>
                </div>

                {/* COLOURS */}

                <div className="mt-8 border-t border-[var(--color-border)] pt-7">
                  <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-[var(--color-secondary)]">
                    Preferred Colours
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {availableColors.map(
                      (color) => {
                        const selected =
                          form.preferredColors.includes(
                            color,
                          );

                        return (
                          <button
                            key={color}
                            type="button"
                            disabled={!isEditing}
                            onClick={() => {
                              toggleColor(color);
                            }}
                            className={`border px-4 py-3 text-xs transition ${
                              selected
                                ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white"
                                : "border-[var(--color-border)] bg-white text-[var(--color-ink)]"
                            } ${
                              isEditing
                                ? "hover:border-[var(--color-rose-dark)]"
                                : "cursor-default"
                            }`}
                          >
                            {color}
                          </button>
                        );
                      },
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                COMMUNICATION
            ================================================== */}

            <section className="border border-[var(--color-border)] bg-white">
              <div className="border-b border-[var(--color-border)] px-6 py-5 sm:px-7">
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-rose-dark)]">
                  Communication
                </p>

                <h2 className="mt-1 font-display text-[28px] text-[var(--color-ink)]">
                  Communication Preferences
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--color-secondary)]">
                  Control which brand communications
                  you would like to receive.
                </p>
              </div>

              <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-7">
                {/* EMAIL */}

                <button
                  type="button"
                  disabled={!isEditing}
                  onClick={() => {
                    updateForm(
                      "marketingEmails",
                      !form.marketingEmails,
                    );
                  }}
                  className={`flex min-h-[92px] items-center justify-between border px-5 py-4 text-left transition ${
                    form.marketingEmails
                      ? "border-[var(--color-rose-dark)] bg-[var(--color-rose-light)]"
                      : "border-[var(--color-border)] bg-white"
                  } ${
                    isEditing
                      ? "cursor-pointer hover:border-[var(--color-rose-dark)]"
                      : "cursor-default"
                  }`}
                >
                  <div className="pr-4">
                    <p className="text-sm font-medium text-[var(--color-ink)]">
                      Email Updates
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[var(--color-secondary)]">
                      Collection launches, offers and
                      account updates.
                    </p>
                  </div>

                  <div
                    className={`flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition ${
                      form.marketingEmails
                        ? "bg-[var(--color-ink)]"
                        : "bg-[var(--color-border)]"
                    }`}
                  >
                    <span
                      className={`h-4 w-4 rounded-full bg-white transition-transform ${
                        form.marketingEmails
                          ? "translate-x-4"
                          : "translate-x-0"
                      }`}
                    />
                  </div>
                </button>

                {/* WHATSAPP */}

                <button
                  type="button"
                  disabled={!isEditing}
                  onClick={() => {
                    updateForm(
                      "marketingWhatsapp",
                      !form.marketingWhatsapp,
                    );
                  }}
                  className={`flex min-h-[92px] items-center justify-between border px-5 py-4 text-left transition ${
                    form.marketingWhatsapp
                      ? "border-[var(--color-rose-dark)] bg-[var(--color-rose-light)]"
                      : "border-[var(--color-border)] bg-white"
                  } ${
                    isEditing
                      ? "cursor-pointer hover:border-[var(--color-rose-dark)]"
                      : "cursor-default"
                  }`}
                >
                  <div className="pr-4">
                    <p className="text-sm font-medium text-[var(--color-ink)]">
                      WhatsApp Updates
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[var(--color-secondary)]">
                      Selected brand communication and
                      important updates.
                    </p>
                  </div>

                  <div
                    className={`flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition ${
                      form.marketingWhatsapp
                        ? "bg-[var(--color-ink)]"
                        : "bg-[var(--color-border)]"
                    }`}
                  >
                    <span
                      className={`h-4 w-4 rounded-full bg-white transition-transform ${
                        form.marketingWhatsapp
                          ? "translate-x-4"
                          : "translate-x-0"
                      }`}
                    />
                  </div>
                </button>
              </div>
            </section>

            {/* =================================================
                BOTTOM ACTION
            ================================================== */}

            <div className="flex flex-col gap-4 border-t border-[var(--color-border)] pt-7 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-lg text-xs leading-5 text-[var(--color-muted)]">
                Your preferences are stored with your
                Aayesha Fashion customer profile.
              </p>

              {!isEditing ? (
                <Link
  href="/account/edit"
  className="inline-flex h-11 items-center justify-center gap-2 border border-[var(--color-ink)] bg-white px-6 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)] transition hover:border-[var(--color-rose-dark)] hover:bg-[var(--color-rose-light)]"
>
  <Edit3 size={15} />
  Edit Account
</Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    void handleSave();
                  }}
                  disabled={isSaving}
                  className="inline-flex h-11 items-center justify-center gap-2 border border-[var(--color-ink)] bg-[var(--color-ink)] px-6 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--color-soft-charcoal)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? (
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                  ) : (
                    <Save size={15} />
                  )}

                  {isSaving
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}