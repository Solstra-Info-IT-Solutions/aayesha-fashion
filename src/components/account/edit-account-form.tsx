"use client";

import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronDown,
  Edit3,
  Loader2,
  Mail,
  Phone,
  Save,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";

import {
  getCustomerProfile,
  updateCustomerProfile,
} from "@/lib/api/customer";

import { CustomCalendar } from "@/components/account/custom-calendar";

import { useAuthStore } from "@/store/auth-store";

import type {
  CustomerGender,
  CustomerProfile,
  UpdateCustomerProfilePayload,
} from "@/types/customer";

type FormState = {
  name: string;
  phone: string;
  avatarUrl: string;
  dateOfBirth: string;
  gender: CustomerGender;
};

function createInitialForm(
  profile: CustomerProfile,
): FormState {
  let dateOfBirth = "";

  if (profile.customer.dateOfBirth) {
    const date = new Date(
      profile.customer.dateOfBirth,
    );

    if (!Number.isNaN(date.getTime())) {
      dateOfBirth =
        `${date.getFullYear()}-${String(
          date.getMonth() + 1,
        ).padStart(2, "0")}-${String(
          date.getDate(),
        ).padStart(2, "0")}`;
    }
  }

  return {
    name: profile.user.name ?? "",
    phone:
      profile.user.phone ||
      profile.customer.phone ||
      "",
    avatarUrl:
      profile.user.avatarUrl ?? "",
    dateOfBirth,
    gender:
      profile.customer.gender ?? null,
  };
}

function getInitials(
  name: string,
) {
  const trimmed =
    name.trim();

  if (!trimmed) {
    return "AF";
  }

  const parts =
    trimmed.split(/\s+/);

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${parts[0][0]}${
    parts[parts.length - 1][0]
  }`.toUpperCase();
}

export function EditAccountForm() {
  const accessToken =
    useAuthStore(
      (state) =>
        state.accessToken,
    );

  const isAuthenticated =
    useAuthStore(
      (state) =>
        state.isAuthenticated,
    );

  const [profile, setProfile] =
    useState<CustomerProfile | null>(
      null,
    );

  const [form, setForm] =
    useState<FormState | null>(
      null,
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [genderOpen, setGenderOpen] =
    useState(false);

  const [calendarOpen, setCalendarOpen] =
    useState(false);

  /* =========================================================
     LOAD PROFILE
  ========================================================= */

  const loadProfile =
    useCallback(
      async () => {
        if (!accessToken) {
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        setErrorMessage("");

        try {
          const response =
            await getCustomerProfile(
              accessToken,
            );

          setProfile(response);

          setForm(
            createInitialForm(
              response,
            ),
          );
        } catch (error) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to load your account details.",
          );
        } finally {
          setIsLoading(false);
        }
      },
      [accessToken],
    );

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
     FIELD UPDATE
  ========================================================= */

  const updateField = <
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

    setErrorMessage("");
  };

  /* =========================================================
     SAVE
  ========================================================= */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      !accessToken ||
      !form
    ) {
      return;
    }

    const name =
      form.name.trim();

    const phone =
      form.phone.trim();

    setErrorMessage("");

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

    const payload: UpdateCustomerProfilePayload =
      {
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

        gender:
          form.gender,
      };

    try {
      const response =
        await updateCustomerProfile(
          accessToken,
          payload,
        );

      setProfile(response);

      setForm(
        createInitialForm(
          response,
        ),
      );

      setGenderOpen(false);
      setCalendarOpen(false);

      toast.success(
        "Account details updated successfully.",
      );

      window.location.href =
        "/account";
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to update your account.";

      setErrorMessage(message);

      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  /* =========================================================
     AUTH
  ========================================================= */

  if (!isAuthenticated) {
    return (
      <section className="min-h-[60vh] bg-[var(--color-ivory)]">
        <div className="mx-auto flex min-h-[60vh] max-w-[720px] items-center justify-center px-5 text-center">
          <div>
            <h1 className="font-display text-[38px] text-[var(--color-ink)]">
              Sign in to edit your account
            </h1>

            <p className="mt-4 text-sm leading-6 text-[var(--color-secondary)]">
              Please sign in before changing your
              account details.
            </p>

            <Link
              href="/login?callbackUrl=/account/edit"
              className="mt-6 inline-flex h-11 items-center justify-center border border-[#171717] bg-[#171717] px-6 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors duration-200 hover:bg-[#292c2c]"
            >
              Sign In
            </Link>
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
      <section className="min-h-[70vh] bg-[var(--color-ivory)]">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-[var(--color-secondary)]">
            <Loader2
              size={18}
              className="animate-spin"
            />

            Loading your account...
          </div>
        </div>
      </section>
    );
  }

  /* =========================================================
     ERROR STATE
  ========================================================= */

  if (!profile || !form) {
    return (
      <section className="min-h-[60vh] bg-[var(--color-ivory)]">
        <div className="mx-auto flex min-h-[60vh] max-w-[720px] items-center justify-center px-5 text-center">
          <div>
            <h1 className="font-display text-[36px] text-[var(--color-ink)]">
              Unable to load account
            </h1>

            <p className="mt-3 text-sm leading-6 text-[var(--color-secondary)]">
              {errorMessage ||
                "Something went wrong while loading your account."}
            </p>

            <button
              type="button"
              onClick={() => {
                void loadProfile();
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

  const initials =
    getInitials(
      profile.user.name,
    );

  return (
    <section className="min-h-screen bg-[var(--color-ivory)]">
      <div className="mx-auto w-full max-w-[1000px] px-5 py-10 sm:px-8 lg:py-14">
        {/* =====================================================
            BACK
        ====================================================== */}

        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-secondary)] transition hover:text-[var(--color-ink)]"
        >
          <ArrowLeft
            size={15}
            strokeWidth={1.8}
          />

          Back to Account
        </Link>

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mt-7 border-b border-[var(--color-border)] pb-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--color-rose-dark)]">
            Account Settings
          </p>

          <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-display text-[40px] leading-none text-[var(--color-ink)] sm:text-[48px]">
                Edit Account
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--color-secondary)]">
                Update your personal information and
                keep your account details current.
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            ERROR
        ====================================================== */}

        {errorMessage && (
          <div
            role="alert"
            className="mt-6 border border-red-200 bg-red-50 px-5 py-4 text-sm leading-6 text-red-700"
          >
            {errorMessage}
          </div>
        )}

        {/* =====================================================
            FORM
        ====================================================== */}

        <form
          onSubmit={handleSubmit}
          className="mt-8"
        >
          <div className="border border-[var(--color-border)] bg-white">
            {/* =================================================
                PROFILE HEADER
            ================================================== */}

            <div className="border-b border-[var(--color-border)] px-6 py-6 sm:px-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full border border-[var(--color-rose)] bg-[var(--color-rose-light)] font-display text-2xl text-[var(--color-ink)]">
                  {form.avatarUrl ? (
                    <img
                      src={form.avatarUrl}
                      alt={
                        profile.user.name ||
                        "Profile"
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-[var(--color-muted)]">
                    Profile
                  </p>

                  <h2 className="mt-1 font-display text-[28px] text-[var(--color-ink)]">
                    {profile.user.name}
                  </h2>

                  <p className="mt-1 text-sm text-[var(--color-secondary)]">
                    {profile.user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                PERSONAL DETAILS
            ================================================== */}

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-5">
                <UserRound
                  size={19}
                  strokeWidth={1.7}
                  className="text-[var(--color-secondary)]"
                />

                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--color-rose-dark)]">
                    Personal Details
                  </p>

                  <h2 className="mt-1 font-display text-[27px] text-[var(--color-ink)]">
                    Account Information
                  </h2>
                </div>
              </div>

              <div className="mt-7 grid gap-7 sm:grid-cols-2">
                {/* =================================================
                    FULL NAME
                ================================================== */}

                <div>
                  <label
                    htmlFor="account-name"
                    className="mb-2.5 block text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--color-secondary)]"
                  >
                    Full Name
                  </label>

                  <div className="relative">
                    <UserRound
                      size={16}
                      className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
                    />

                    <input
                      id="account-name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={(event) => {
                        updateField(
                          "name",
                          event.target.value,
                        );
                      }}
                      autoComplete="name"
                      className="h-12 w-full border-b border-[var(--color-border)] bg-transparent pl-7 pr-2 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-rose-dark)]"
                    />
                  </div>
                </div>

                {/* =================================================
                    EMAIL
                ================================================== */}

                <div>
                  <label
                    htmlFor="account-email"
                    className="mb-2.5 block text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--color-secondary)]"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={16}
                      className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
                    />

                    <input
                      id="account-email"
                      type="email"
                      value={
                        profile.user.email
                      }
                      readOnly
                      className="h-12 w-full cursor-not-allowed border-b border-[var(--color-border)] bg-transparent pl-7 pr-2 text-sm text-[var(--color-secondary)] outline-none"
                    />
                  </div>

                  <p className="mt-2 text-[11px] leading-5 text-[var(--color-muted)]">
                    Email changes require a separate
                    verification flow.
                  </p>
                </div>

                {/* =================================================
                    PHONE
                ================================================== */}

                <div>
                  <label
                    htmlFor="account-phone"
                    className="mb-2.5 block text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--color-secondary)]"
                  >
                    Phone Number
                  </label>

                  <div className="relative">
                    <Phone
                      size={16}
                      className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
                    />

                    <input
                      id="account-phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(event) => {
                        updateField(
                          "phone",
                          event.target.value,
                        );
                      }}
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="+91 9876543210"
                      className="h-12 w-full border-b border-[var(--color-border)] bg-transparent pl-7 pr-2 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-rose-dark)]"
                    />
                  </div>
                </div>

                {/* =================================================
                    GENDER
                ================================================== */}

                <div className="relative">
                  <label className="mb-2.5 block text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--color-secondary)]">
                    Gender
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setGenderOpen(
                        (current) =>
                          !current,
                      );

                      setCalendarOpen(false);
                    }}
                    className={`flex h-12 w-full items-center justify-between border-b bg-transparent text-left text-sm outline-none transition-colors duration-200 ${
                      genderOpen
                        ? "border-[var(--color-rose-dark)]"
                        : "border-[var(--color-border)] hover:border-[var(--color-ink)]"
                    }`}
                  >
                    <span
                      className={
                        form.gender
                          ? "text-[var(--color-ink)]"
                          : "text-[var(--color-muted)]"
                      }
                    >
                      {form.gender ===
                      "female"
                        ? "Female"
                        : form.gender ===
                            "male"
                          ? "Male"
                          : form.gender ===
                              "other"
                            ? "Other"
                            : "Prefer not to say"}
                    </span>

                    <ChevronDown
                      size={16}
                      strokeWidth={1.7}
                      className={`text-[var(--color-secondary)] transition-transform duration-200 ${
                        genderOpen
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {genderOpen && (
                    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 overflow-hidden border border-[var(--color-border)] bg-white shadow-[0_18px_50px_rgba(23,23,23,0.12)]">
                      <div className="border-b border-[var(--color-border)] bg-[var(--color-ivory)] px-4 py-3">
                        <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-[var(--color-muted)]">
                          Select preference
                        </p>
                      </div>

                      <div className="p-1.5">
                        {[
                          {
                            value: null,
                            label:
                              "Prefer not to say",
                          },
                          {
                            value:
                              "female" as const,
                            label:
                              "Female",
                          },
                          {
                            value:
                              "male" as const,
                            label:
                              "Male",
                          },
                          {
                            value:
                              "other" as const,
                            label:
                              "Other",
                          },
                        ].map(
                          (
                            option,
                          ) => {
                            const selected =
                              form.gender ===
                              option.value;

                            return (
                              <button
                                key={
                                  option.value ??
                                  "none"
                                }
                                type="button"
                                onClick={() => {
                                  updateField(
                                    "gender",
                                    option.value,
                                  );

                                  setGenderOpen(
                                    false,
                                  );
                                }}
                                className={`flex w-full items-center justify-between px-4 py-3 text-sm transition-colors duration-150 ${
                                  selected
                                    ? "bg-[var(--color-rose-light)] text-[var(--color-ink)]"
                                    : "text-[var(--color-ink)] hover:bg-[var(--color-ivory)]"
                                }`}
                              >
                                <span>
                                  {
                                    option.label
                                  }
                                </span>

                                {selected && (
                                  <Check
                                    size={15}
                                    strokeWidth={
                                      1.8
                                    }
                                    className="text-[var(--color-rose-dark)]"
                                  />
                                )}
                              </button>
                            );
                          },
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* =================================================
                    DATE OF BIRTH
                ================================================== */}

                <div className="relative">
                  <label className="mb-2.5 block text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--color-secondary)]">
                    Date of Birth
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setCalendarOpen(
                        (current) =>
                          !current,
                      );

                      setGenderOpen(false);
                    }}
                    className={`flex h-12 w-full items-center justify-between border-b bg-transparent text-left outline-none transition-colors duration-200 ${
                      calendarOpen
                        ? "border-[var(--color-rose-dark)]"
                        : "border-[var(--color-border)] hover:border-[var(--color-ink)]"
                    }`}
                  >
                    <span
                      className={
                        form.dateOfBirth
                          ? "text-sm text-[var(--color-ink)]"
                          : "text-sm text-[var(--color-muted)]"
                      }
                    >
                      {form.dateOfBirth
                        ? new Intl.DateTimeFormat(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          ).format(
                            new Date(
                              `${form.dateOfBirth}T00:00:00`,
                            ),
                          )
                        : "Select date of birth"}
                    </span>

                    <CalendarDays
                      size={17}
                      strokeWidth={1.7}
                      className="text-[var(--color-secondary)]"
                    />
                  </button>

                  {calendarOpen && (
                    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 sm:left-auto sm:right-auto">
                      <CustomCalendar
                        value={
                          form.dateOfBirth
                        }
                        onChange={(
                          value,
                        ) => {
                          updateField(
                            "dateOfBirth",
                            value,
                          );
                        }}
                        onClose={() => {
                          setCalendarOpen(
                            false,
                          );
                        }}
                        maxDate={new Date()
                          .toISOString()
                          .slice(0, 10)}
                      />
                    </div>
                  )}
                </div>

                {/* =================================================
                    AVATAR URL
                ================================================== */}

                <div>
                  <label
                    htmlFor="account-avatar"
                    className="mb-2.5 block text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--color-secondary)]"
                  >
                    Profile Image URL
                  </label>

                  <input
                    id="account-avatar"
                    name="avatarUrl"
                    type="url"
                    value={
                      form.avatarUrl
                    }
                    onChange={(event) => {
                      updateField(
                        "avatarUrl",
                        event.target.value,
                      );
                    }}
                    placeholder="https://..."
                    className="h-12 w-full border-b border-[var(--color-border)] bg-transparent text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-rose-dark)]"
                  />

                  <p className="mt-2 text-[11px] leading-5 text-[var(--color-muted)]">
                    Enter a publicly accessible image
                    URL.
                  </p>
                </div>
              </div>

              {/* =================================================
                  ACTIONS
              ================================================== */}

              <div className="mt-10 flex flex-col gap-3 border-t border-[var(--color-border)] pt-7 sm:flex-row sm:justify-end">
                <Link
                  href="/account"
                  className="inline-flex h-11 items-center justify-center border border-[var(--color-border)] bg-white px-6 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)] transition hover:border-[var(--color-ink)]"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex h-11 items-center justify-center gap-2 border border-[#171717] bg-[#171717] px-7 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors duration-200 hover:bg-[#292c2c] disabled:cursor-not-allowed disabled:opacity-60"
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
            </div>
          </div>

          {/* =====================================================
              NOTE
          ====================================================== */}

          <div className="mt-5 flex gap-3 border-l-2 border-[var(--color-rose)] pl-4">
            <Check
              size={16}
              strokeWidth={1.8}
              className="mt-0.5 shrink-0 text-[var(--color-rose-dark)]"
            />

            <p className="text-xs leading-5 text-[var(--color-secondary)]">
              Your account information is securely
              saved to your Aayesha Fashion customer
              profile. Changes take effect after you
              save your account.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}