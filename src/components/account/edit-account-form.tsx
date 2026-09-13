"use client";

import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronDown,
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

/* =========================================================
   HELPERS
========================================================= */

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

function getInitials(name: string) {
  const trimmed = name.trim();

  if (!trimmed) {
    return "AF";
  }

  const parts = trimmed.split(/\s+/);

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${parts[0][0]}${
    parts[parts.length - 1][0]
  }`.toUpperCase();
}

/* =========================================================
   COMPONENT
========================================================= */

export function EditAccountForm() {
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

  const [errorMessage, setErrorMessage] =
    useState("");

  const [genderOpen, setGenderOpen] =
    useState(false);

  const [calendarOpen, setCalendarOpen] =
    useState(false);

  /* =========================================================
     LOAD PROFILE
  ========================================================= */

  const loadProfile = useCallback(
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
          createInitialForm(response),
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

    if (!accessToken || !form) {
      return;
    }

    const name = form.name.trim();
    const phone = form.phone.trim();

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

        gender: form.gender,
      };

    try {
      const response =
        await updateCustomerProfile(
          accessToken,
          payload,
        );

      setProfile(response);

      setForm(
        createInitialForm(response),
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
      <section className="min-h-[60vh] bg-[var(--color-bg)]">
        <div className="mx-auto flex min-h-[60vh] max-w-[720px] items-center justify-center px-5 text-center">
          <div>
            <p className="eyebrow text-[var(--color-text-muted)]">
              Account
            </p>

            <h1 className="mt-3 font-display text-4xl leading-none text-[var(--color-text)] sm:text-5xl">
              Sign in to edit your account
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[var(--color-text-secondary)]">
              Please sign in before changing your
              account details.
            </p>

            <Link
              href="/login?callbackUrl=/account/edit"
              className="mt-7 inline-flex h-11 items-center justify-center border border-[var(--color-text)] bg-[var(--color-text)] px-7 text-[var(--text-label)] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-inverse)] transition-all duration-[var(--duration-base)] hover:bg-[var(--color-accent-dark)]"
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
      <section className="min-h-[70vh] bg-[var(--color-bg)]">
        <div className="mx-auto flex min-h-[70vh] max-w-[720px] items-center justify-center px-5">
          <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
            <Loader2
              size={18}
              strokeWidth={1.7}
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
      <section className="min-h-[60vh] bg-[var(--color-bg)]">
        <div className="mx-auto flex min-h-[60vh] max-w-[720px] items-center justify-center px-5 text-center">
          <div>
            <p className="eyebrow text-[var(--color-text-muted)]">
              Account
            </p>

            <h1 className="mt-3 font-display text-4xl leading-none text-[var(--color-text)]">
              Unable to load account
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[var(--color-text-secondary)]">
              {errorMessage ||
                "Something went wrong while loading your account."}
            </p>

            <button
              type="button"
              onClick={() => {
                void loadProfile();
              }}
              className="mt-7 inline-flex h-11 items-center justify-center border border-[var(--color-text)] bg-[var(--color-text)] px-7 text-[var(--text-label)] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-inverse)] transition-all duration-[var(--duration-base)] hover:bg-[var(--color-accent-dark)]"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  const initials = getInitials(
    profile.user.name,
  );

  return (
    <section className="min-h-screen bg-[var(--color-bg)]">
      <div className="mx-auto w-full max-w-[1080px] px-5 py-10 sm:px-8 lg:py-14">
        {/* =====================================================
            BACK
        ====================================================== */}

        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-[var(--text-label)] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text)]"
        >
          <ArrowLeft
            size={14}
            strokeWidth={1.7}
          />

          Back to Account
        </Link>

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mt-7 border-b border-[var(--color-border)] pb-8">
          <p className="eyebrow text-[var(--color-accent)]">
            Account Settings
          </p>

          <div className="mt-3">
            <h1 className="font-display text-[42px] leading-[0.95] text-[var(--color-text)] sm:text-[52px]">
              Edit Account
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--color-text-secondary)]">
              Update your personal information and
              keep your account details current.
            </p>
          </div>
        </div>

        {/* =====================================================
            ERROR
        ====================================================== */}

        {errorMessage && (
          <div
            role="alert"
            className="mt-6 border border-[var(--color-error)] bg-[var(--color-surface-soft)] px-5 py-4 text-sm leading-6 text-[var(--color-error)]"
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
          <div className="border border-[var(--color-border)] bg-[var(--color-surface)]">
            {/* =================================================
                PROFILE HEADER
            ================================================== */}

            <div className="border-b border-[var(--color-border)] px-6 py-7 sm:px-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg-soft)] font-display text-2xl text-[var(--color-text)]">
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
                  <p className="eyebrow text-[var(--color-text-muted)]">
                    Profile
                  </p>

                  <h2 className="mt-2 font-display text-3xl leading-none text-[var(--color-text)]">
                    {profile.user.name}
                  </h2>

                  <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
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
                <div className="flex h-9 w-9 items-center justify-center border border-[var(--color-border-light)] bg-[var(--color-surface-soft)]">
                  <UserRound
                    size={17}
                    strokeWidth={1.6}
                    className="text-[var(--color-accent)]"
                  />
                </div>

                <div>
                  <p className="eyebrow text-[var(--color-text-muted)]">
                    Personal Details
                  </p>

                  <h2 className="mt-1 font-display text-[27px] leading-none text-[var(--color-text)]">
                    Account Information
                  </h2>
                </div>
              </div>

              <div className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2">
                {/* =================================================
                    FULL NAME
                ================================================== */}

                <div>
                  <label
                    htmlFor="account-name"
                    className="mb-2 block text-[var(--text-label)] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-secondary)]"
                  >
                    Full Name
                  </label>

                  <div className="relative">
                    <UserRound
                      size={15}
                      strokeWidth={1.7}
                      className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
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
                      className="h-11 w-full border-b border-[var(--color-border)] bg-transparent pl-7 pr-2 text-sm text-[var(--color-text)] outline-none transition-colors duration-[var(--duration-base)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)]"
                    />
                  </div>
                </div>

                {/* =================================================
                    EMAIL
                ================================================== */}

                <div>
                  <label
                    htmlFor="account-email"
                    className="mb-2 block text-[var(--text-label)] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-secondary)]"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={15}
                      strokeWidth={1.7}
                      className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                    />

                    <input
                      id="account-email"
                      type="email"
                      value={
                        profile.user.email
                      }
                      readOnly
                      className="h-11 w-full cursor-not-allowed border-b border-[var(--color-border-light)] bg-transparent pl-7 pr-2 text-sm text-[var(--color-text-secondary)] outline-none"
                    />
                  </div>

                  <p className="mt-2 text-[11px] leading-5 text-[var(--color-text-muted)]">
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
                    className="mb-2 block text-[var(--text-label)] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-secondary)]"
                  >
                    Phone Number
                  </label>

                  <div className="relative">
                    <Phone
                      size={15}
                      strokeWidth={1.7}
                      className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
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
                      className="h-11 w-full border-b border-[var(--color-border)] bg-transparent pl-7 pr-2 text-sm text-[var(--color-text)] outline-none transition-colors duration-[var(--duration-base)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)]"
                    />
                  </div>
                </div>

                {/* =================================================
                    GENDER
                ================================================== */}

                <div className="relative">
                  <label className="mb-2 block text-[var(--text-label)] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-secondary)]">
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
                    className={`flex h-11 w-full items-center justify-between border-b bg-transparent text-left text-sm outline-none transition-colors duration-[var(--duration-base)] ${
                      genderOpen
                        ? "border-[var(--color-accent)]"
                        : "border-[var(--color-border)] hover:border-[var(--color-text)]"
                    }`}
                  >
                    <span
                      className={
                        form.gender
                          ? "text-[var(--color-text)]"
                          : "text-[var(--color-text-muted)]"
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
                      size={15}
                      strokeWidth={1.7}
                      className={`text-[var(--color-text-secondary)] transition-transform duration-200 ${
                        genderOpen
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {genderOpen && (
                    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[var(--z-dropdown)] overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)]">
                      <div className="border-b border-[var(--color-border-light)] bg-[var(--color-surface-soft)] px-4 py-3">
                        <p className="text-[var(--text-label)] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-muted)]">
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
                                    ? "bg-[var(--color-bg-soft)] text-[var(--color-text)]"
                                    : "text-[var(--color-text)] hover:bg-[var(--color-surface-soft)]"
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
                                    className="text-[var(--color-accent)]"
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
                  <label className="mb-2 block text-[var(--text-label)] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-secondary)]">
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
                    className={`flex h-11 w-full items-center justify-between border-b bg-transparent text-left outline-none transition-colors duration-[var(--duration-base)] ${
                      calendarOpen
                        ? "border-[var(--color-accent)]"
                        : "border-[var(--color-border)] hover:border-[var(--color-text)]"
                    }`}
                  >
                    <span
                      className={
                        form.dateOfBirth
                          ? "text-sm text-[var(--color-text)]"
                          : "text-sm text-[var(--color-text-muted)]"
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
                      size={16}
                      strokeWidth={1.7}
                      className="text-[var(--color-text-secondary)]"
                    />
                  </button>

                  {calendarOpen && (
                    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[var(--z-dropdown)] sm:left-auto sm:right-auto">
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
                    className="mb-2 block text-[var(--text-label)] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-secondary)]"
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
                    className="h-11 w-full border-b border-[var(--color-border)] bg-transparent text-sm text-[var(--color-text)] outline-none transition-colors duration-[var(--duration-base)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)]"
                  />

                  <p className="mt-2 text-[11px] leading-5 text-[var(--color-text-muted)]">
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
                  className="inline-flex h-11 items-center justify-center border border-[var(--color-border)] bg-[var(--color-surface)] px-7 text-[var(--text-label)] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text)] transition-all duration-[var(--duration-base)] hover:border-[var(--color-text)]"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex h-11 items-center justify-center gap-2 border border-[var(--color-text)] bg-[var(--color-text)] px-7 text-[var(--text-label)] font-semibold uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-inverse)] transition-all duration-[var(--duration-base)] hover:bg-[var(--color-accent-dark)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? (
                    <Loader2
                      size={15}
                      strokeWidth={1.8}
                      className="animate-spin"
                    />
                  ) : (
                    <Save
                      size={15}
                      strokeWidth={1.8}
                    />
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

          <div className="mt-5 flex gap-3 border-l-2 border-[var(--color-accent-soft)] pl-4">
            <Check
              size={16}
              strokeWidth={1.8}
              className="mt-0.5 shrink-0 text-[var(--color-accent)]"
            />

            <p className="text-xs leading-5 text-[var(--color-text-secondary)]">
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