"use client";

import Link from "next/link";
import {
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronDown,
  Edit3,
  Home,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Ruler,
  Save,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  getCustomerProfile,
  updateCustomerProfile,
} from "@/lib/api/customer";

import { deleteCustomerAccount } from "@/lib/customer-api";

import { useAuthStore } from "@/store/auth-store";

import {
  AccountConfirmDialog,
} from "@/components/account/account-confirm-dialog";

import type {
  CustomerGender,
  CustomerProfile,
  UpdateCustomerProfilePayload,
} from "@/types/customer";

/* =========================================================
   CONSTANTS
========================================================= */

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

/* =========================================================
   TYPES
========================================================= */

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

/* =========================================================
   HELPERS
========================================================= */

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
    phone:
      profile.user.phone ||
      profile.customer.phone ||
      "",
    avatarUrl:
      profile.user.avatarUrl ?? "",
    dateOfBirth: formattedDate,
    gender:
      profile.customer.gender ?? null,
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
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${parts[0][0]}${parts[
    parts.length - 1
  ][0]}`.toUpperCase();
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

/* =========================================================
   COMPONENT
========================================================= */

export function ProfileDetails() {
  const router = useRouter();

  /* =======================================================
     AUTH STATE
  ======================================================= */

  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const logout = useAuthStore(
    (state) => state.logout,
  );

  /* =======================================================
     PROFILE STATE
  ======================================================= */

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

  /* =======================================================
     ACCOUNT ACTION STATE
  ======================================================= */

  const [confirmType, setConfirmType] =
    useState<"delete" | "logout" | null>(
      null,
    );

  const [isProcessingAccountAction, setIsProcessingAccountAction] =
    useState(false);

  /* =======================================================
     LOAD PROFILE
  ======================================================= */

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

  /* =======================================================
     FORM HELPERS
  ======================================================= */

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

  /* =======================================================
     SAVE PROFILE
  ======================================================= */

  const handleSave = async () => {
    if (
      !accessToken ||
      !form ||
      !profile
    ) {
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

  /* =======================================================
     CANCEL EDIT
  ======================================================= */

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

  /* =======================================================
     ACCOUNT CONFIRM DIALOG
  ======================================================= */

  const closeConfirmDialog = () => {
    if (isProcessingAccountAction) {
      return;
    }

    setConfirmType(null);
  };

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogoutConfirm = async () => {
    if (isProcessingAccountAction) {
      return;
    }

    setIsProcessingAccountAction(true);

    try {
      await logout();

      toast.success(
        "You have been signed out.",
      );

      setConfirmType(null);

      /*
       * Mandatory home-page redirect.
       */
      router.replace("/");

      router.refresh();
    } catch {
      toast.error(
        "Unable to sign out. Please try again.",
      );
    } finally {
      setIsProcessingAccountAction(false);
    }
  };

  /* =======================================================
     DELETE ACCOUNT
  ======================================================= */

  const handleDeleteConfirm = async () => {
    if (isProcessingAccountAction) {
      return;
    }

    if (!accessToken) {
      toast.error(
        "Your session has expired. Please sign in again.",
      );

      setConfirmType(null);

      router.replace("/login");

      return;
    }

    setIsProcessingAccountAction(true);

    try {
      /*
       * Delete the customer account first.
       */
      await deleteCustomerAccount(
        accessToken,
      );

      /*
       * The delete endpoint invalidates the
       * account/session. We still clear the
       * frontend auth state.
       */
      try {
        await logout();
      } catch {
        /*
         * Ignore logout failure because account
         * deletion has already succeeded.
         */
      }

      toast.success(
        "Your account has been deleted.",
      );

      setConfirmType(null);

      /*
       * Mandatory home-page redirect after
       * successful account deletion.
       */
      router.replace("/?accountDeleted=1");

      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to delete your account.";

      toast.error(message);
    } finally {
      setIsProcessingAccountAction(false);
    }
  };

  /* =======================================================
     DERIVED VALUES
  ======================================================= */

  const initials = useMemo(
    () =>
      getInitials(
        profile?.user.name ?? "",
      ),
    [profile?.user.name],
  );

  /* =======================================================
     AUTH GUARD
  ======================================================= */

  if (!isAuthenticated) {
    return (
      <section className="min-h-[70vh] bg-[var(--color-ivory)]">
        <div className="mx-auto flex min-h-[70vh] max-w-[720px] items-center justify-center px-5 py-16 text-center">
          <div>
            <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[var(--color-border)] bg-white">
              <UserRound
                size={21}
                strokeWidth={1.4}
                className="text-[var(--color-secondary)]"
              />
            </div>

            <p className="mt-6 text-[9px] font-semibold uppercase tracking-[0.24em] text-[var(--color-rose-dark)]">
              My Account
            </p>

            <h1 className="mt-3 font-[var(--font-display)] text-[38px] leading-none tracking-[-0.025em] text-[var(--color-ink)]">
              Sign in to view your account
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[var(--color-secondary)]">
              Please sign in to access your profile,
              preferences and account settings.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
              <Link
                href="/login?callbackUrl=/account"
                className="
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  border
                  border-[var(--color-ink)]
                  bg-[var(--color-ink)]
                  px-6
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-white
                  transition-colors
                  hover:bg-[var(--color-soft-charcoal)]
                "
              >
                Sign In
              </Link>

              <Link
                href="/"
                className="
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  gap-2
                  border
                  border-[var(--color-border)]
                  bg-white
                  px-6
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-[var(--color-ink)]
                  transition-colors
                  hover:bg-[var(--color-cream)]
                "
              >
                <Home size={14} />

                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* =======================================================
     LOADING
  ======================================================= */

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

  /* =======================================================
     PROFILE UNAVAILABLE
  ======================================================= */

  if (!profile || !form) {
    return (
      <section className="min-h-[70vh] bg-[var(--color-ivory)]">
        <div className="mx-auto flex min-h-[70vh] max-w-[720px] items-center justify-center px-5 text-center">
          <div>
            <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[var(--color-border)] bg-white">
              <UserRound
                size={21}
                strokeWidth={1.4}
                className="text-[var(--color-secondary)]"
              />
            </div>

            <p className="mt-6 text-[9px] font-semibold uppercase tracking-[0.24em] text-[var(--color-rose-dark)]">
              My Account
            </p>

            <h1 className="mt-3 font-[var(--font-display)] text-[36px] leading-none text-[var(--color-ink)]">
              Profile unavailable
            </h1>

            <p className="mt-4 text-sm leading-7 text-[var(--color-secondary)]">
              {errorMessage ||
                "We could not load your account details."}
            </p>

            <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  void loadProfile();
                }}
                className="
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  border
                  border-[var(--color-ink)]
                  bg-[var(--color-ink)]
                  px-6
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.15em]
                  text-white
                "
              >
                Try Again
              </button>

              <Link
                href="/"
                className="
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  gap-2
                  border
                  border-[var(--color-border)]
                  bg-white
                  px-6
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.15em]
                  text-[var(--color-ink)]
                  transition-colors
                  hover:bg-[var(--color-cream)]
                "
              >
                <Home size={14} />

                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <>
      <section className="min-h-screen bg-[var(--color-ivory)]">
        <div className="mx-auto w-full max-w-[1280px] px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
          {/* =================================================
              TOP NAVIGATION
          ================================================== */}

          <div className="mb-7 flex items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5">
            <Link
              href="/"
              className="
                group
                inline-flex
                items-center
                gap-2
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-[var(--color-secondary)]
                transition-colors
                hover:text-[var(--color-charcoal)]
              "
            >
              <Home
                size={14}
                strokeWidth={1.35}
              />

              <span>Back to Home</span>
            </Link>

            <Link
              href="/account"
              className="
                hidden
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-[var(--color-rose-dark)]
                sm:inline-flex
              "
            >
              Account Overview
            </Link>
          </div>

          {/* =================================================
              PAGE HEADER
          ================================================== */}

          <div className="border-b border-[var(--color-border)] pb-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--color-rose-dark)]">
              My Account
            </p>

            <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="font-[var(--font-display)] text-[38px] leading-none tracking-[-0.025em] text-[var(--color-ink)] sm:text-[46px]">
                  Profile Details
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--color-secondary)]">
                  Manage your personal details,
                  style preferences and communication
                  settings from one place.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {!isEditing ? (
                  <Link
                    href="/account/edit"
                    className="
                      inline-flex
                      h-11
                      items-center
                      justify-center
                      gap-2
                      border
                      border-[var(--color-ink)]
                      bg-[var(--color-ink)]
                      px-5
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.14em]
                      text-white
                      transition-colors
                      duration-200
                      hover:bg-[var(--color-soft-charcoal)]
                    "
                  >
                    <Edit3
                      size={15}
                      strokeWidth={1.7}
                    />

                    Edit Profile
                  </Link>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="
                        inline-flex
                        h-11
                        items-center
                        justify-center
                        gap-2
                        border
                        border-[var(--color-border)]
                        bg-white
                        px-5
                        text-xs
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        text-[var(--color-ink)]
                        transition
                        hover:border-[var(--color-ink)]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
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
                      className="
                        inline-flex
                        h-11
                        items-center
                        justify-center
                        gap-2
                        border
                        border-[var(--color-ink)]
                        bg-[var(--color-ink)]
                        px-5
                        text-xs
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        text-white
                        transition
                        hover:bg-[var(--color-soft-charcoal)]
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
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
                  </>
                )}
              </div>
            </div>
          </div>

          {/* =================================================
              FEEDBACK
          ================================================== */}

          {errorMessage && (
            <div
              role="alert"
              className="
                mt-6
                border
                border-red-200
                bg-red-50
                px-5
                py-4
                text-sm
                leading-6
                text-red-700
              "
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

              Your profile has been updated
              successfully.
            </div>
          )}

          {/* =================================================
              MAIN GRID
          ================================================== */}

          <div className="mt-10 grid gap-7 lg:grid-cols-[300px_minmax(0,1fr)]">
            {/* =================================================
                ACCOUNT SUMMARY
            ================================================== */}

            <aside className="h-fit border border-[var(--color-border)] bg-white">
              <div className="p-7">
                <div className="flex items-center gap-5">
                  <div className="grid h-[74px] w-[74px] shrink-0 place-items-center overflow-hidden rounded-full border border-[var(--color-rose)] bg-[var(--color-rose-light)] font-[var(--font-display)] text-2xl text-[var(--color-ink)]">
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

                  <div className="min-w-0">
                    <h2 className="truncate font-[var(--font-display)] text-[27px] leading-tight text-[var(--color-ink)]">
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

              {/* =================================================
                  ACCOUNT QUICK ACTIONS
              ================================================== */}

              <div className="border-t border-[var(--color-border)] bg-[var(--color-cream)] p-3">
                <Link
                  href="/account/orders"
                  className="
                    flex
                    items-center
                    gap-3
                    px-3
                    py-3
                    text-left
                    transition-colors
                    hover:bg-white
                  "
                >
                  <ShoppingBagIcon />

                  <span className="flex-1">
                    <span className="block text-xs font-semibold text-[var(--color-ink)]">
                      Your Orders
                    </span>

                    <span className="mt-0.5 block text-[10px] text-[var(--color-muted)]">
                      View and track your orders
                    </span>
                  </span>

                  <ChevronRight
                    size={14}
                    className="text-[var(--color-secondary)]"
                  />
                </Link>

                <Link
                  href="/account/addresses"
                  className="
                    flex
                    items-center
                    gap-3
                    px-3
                    py-3
                    text-left
                    transition-colors
                    hover:bg-white
                  "
                >
                  <MapPin
                    size={15}
                    strokeWidth={1.6}
                    className="text-[var(--color-secondary)]"
                  />

                  <span className="flex-1">
                    <span className="block text-xs font-semibold text-[var(--color-ink)]">
                      Saved Addresses
                    </span>

                    <span className="mt-0.5 block text-[10px] text-[var(--color-muted)]">
                      Manage delivery addresses
                    </span>
                  </span>

                  <ChevronRight
                    size={14}
                    className="text-[var(--color-secondary)]"
                  />
                </Link>
              </div>
            </aside>

            {/* =================================================
                DETAILS
            ================================================== */}

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

                    <h2 className="mt-1 font-[var(--font-display)] text-[28px] text-[var(--color-ink)]">
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
                        className="
                          h-12
                          w-full
                          border-b
                          border-[var(--color-border)]
                          bg-transparent
                          text-sm
                          text-[var(--color-ink)]
                          outline-none
                          transition
                          focus:border-[var(--color-rose-dark)]
                        "
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
                        className="
                          h-12
                          w-full
                          border-b
                          border-[var(--color-border)]
                          bg-transparent
                          text-sm
                          text-[var(--color-ink)]
                          outline-none
                          transition
                          focus:border-[var(--color-rose-dark)]
                        "
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
                              event.target
                                .value;

                            updateForm(
                              "gender",
                              value === ""
                                ? null
                                : (value as CustomerGender),
                            );
                          }}
                          className="
                            h-12
                            w-full
                            appearance-none
                            border-b
                            border-[var(--color-border)]
                            bg-transparent
                            pr-8
                            text-sm
                            text-[var(--color-ink)]
                            outline-none
                            focus:border-[var(--color-rose-dark)]
                          "
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
                          className="
                            pointer-events-none
                            absolute
                            right-0
                            top-1/2
                            -translate-y-1/2
                            text-[var(--color-secondary)]
                          "
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
                          value={
                            form.dateOfBirth
                          }
                          onChange={(event) => {
                            updateForm(
                              "dateOfBirth",
                              event.target.value,
                            );
                          }}
                          className="
                            h-12
                            w-full
                            border-b
                            border-[var(--color-border)]
                            bg-transparent
                            text-sm
                            text-[var(--color-ink)]
                            outline-none
                            focus:border-[var(--color-rose-dark)]
                          "
                        />

                        <CalendarDays
                          size={16}
                          className="
                            pointer-events-none
                            absolute
                            right-0
                            top-1/2
                            -translate-y-1/2
                            text-[var(--color-secondary)]
                          "
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

                  <h2 className="mt-1 font-[var(--font-display)] text-[28px] text-[var(--color-ink)]">
                    Style Preferences
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--color-secondary)]">
                    Choose your preferred sizes and
                    colours. These preferences are
                    saved to your account.
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
                              className={`
                                min-w-12
                                border
                                px-4
                                py-3
                                text-xs
                                font-medium
                                tracking-[0.08em]
                                transition
                                ${
                                  selected
                                    ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white"
                                    : "border-[var(--color-border)] bg-white text-[var(--color-ink)]"
                                }
                                ${
                                  isEditing
                                    ? "hover:border-[var(--color-rose-dark)]"
                                    : "cursor-default"
                                }
                              `}
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
                              className={`
                                border
                                px-4
                                py-3
                                text-xs
                                transition
                                ${
                                  selected
                                    ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white"
                                    : "border-[var(--color-border)] bg-white text-[var(--color-ink)]"
                                }
                                ${
                                  isEditing
                                    ? "hover:border-[var(--color-rose-dark)]"
                                    : "cursor-default"
                                }
                              `}
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

                  <h2 className="mt-1 font-[var(--font-display)] text-[28px] text-[var(--color-ink)]">
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
                    className={`
                      flex
                      min-h-[92px]
                      items-center
                      justify-between
                      border
                      px-5
                      py-4
                      text-left
                      transition
                      ${
                        form.marketingEmails
                          ? "border-[var(--color-rose-dark)] bg-[var(--color-rose-light)]"
                          : "border-[var(--color-border)] bg-white"
                      }
                      ${
                        isEditing
                          ? "cursor-pointer hover:border-[var(--color-rose-dark)]"
                          : "cursor-default"
                      }
                    `}
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
                      className={`
                        flex
                        h-5
                        w-9
                        shrink-0
                        items-center
                        rounded-full
                        p-0.5
                        transition
                        ${
                          form.marketingEmails
                            ? "bg-[var(--color-ink)]"
                            : "bg-[var(--color-border)]"
                        }
                      `}
                    >
                      <span
                        className={`
                          h-4
                          w-4
                          rounded-full
                          bg-white
                          transition-transform
                          ${
                            form.marketingEmails
                              ? "translate-x-4"
                              : "translate-x-0"
                          }
                        `}
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
                    className={`
                      flex
                      min-h-[92px]
                      items-center
                      justify-between
                      border
                      px-5
                      py-4
                      text-left
                      transition
                      ${
                        form.marketingWhatsapp
                          ? "border-[var(--color-rose-dark)] bg-[var(--color-rose-light)]"
                          : "border-[var(--color-border)] bg-white"
                      }
                      ${
                        isEditing
                          ? "cursor-pointer hover:border-[var(--color-rose-dark)]"
                          : "cursor-default"
                      }
                    `}
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
                      className={`
                        flex
                        h-5
                        w-9
                        shrink-0
                        items-center
                        rounded-full
                        p-0.5
                        transition
                        ${
                          form.marketingWhatsapp
                            ? "bg-[var(--color-ink)]"
                            : "bg-[var(--color-border)]"
                        }
                      `}
                    >
                      <span
                        className={`
                          h-4
                          w-4
                          rounded-full
                          bg-white
                          transition-transform
                          ${
                            form.marketingWhatsapp
                              ? "translate-x-4"
                              : "translate-x-0"
                          }
                        `}
                      />
                    </div>
                  </button>
                </div>
              </section>

              {/* =================================================
                  ACCOUNT SECURITY / DANGER ZONE
              ================================================== */}

              <section className="border border-[var(--color-border)] bg-white">
                <div className="border-b border-[var(--color-border)] px-6 py-5 sm:px-7">
                  <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-rose-dark)]">
                    Account Management
                  </p>

                  <h2 className="mt-1 font-[var(--font-display)] text-[28px] text-[var(--color-ink)]">
                    Account Actions
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--color-secondary)]">
                    Manage your active session or permanently
                    remove your Aayesha Fashion account.
                  </p>
                </div>

                <div className="grid gap-3 p-6 sm:p-7 md:grid-cols-2">
                  {/* SIGN OUT */}

                  <button
                    type="button"
                    onClick={() =>
                      setConfirmType("logout")
                    }
                    disabled={
                      isProcessingAccountAction
                    }
                    className="
                      group
                      flex
                      min-h-[88px]
                      items-center
                      gap-4
                      border
                      border-[var(--color-border)]
                      bg-[var(--color-ivory)]
                      px-5
                      py-4
                      text-left
                      transition-colors
                      duration-300
                      hover:border-[var(--color-charcoal)]
                      hover:bg-[var(--color-cream)]
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    <span
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        border
                        border-[var(--color-border)]
                        bg-white
                        text-[var(--color-secondary)]
                        transition-colors
                        group-hover:border-[var(--color-charcoal)]
                        group-hover:text-[var(--color-charcoal)]
                      "
                    >
                      {isProcessingAccountAction &&
                      confirmType ===
                        "logout" ? (
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                      ) : (
                        <LogOut
                          size={16}
                          strokeWidth={1.6}
                        />
                      )}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-[var(--color-ink)]">
                        {isProcessingAccountAction &&
                        confirmType === "logout"
                          ? "Signing Out..."
                          : "Sign Out"}
                      </span>

                      <span className="mt-1 block text-[10px] leading-5 text-[var(--color-muted)]">
                        Sign out from this device and return
                        to the home page.
                      </span>
                    </span>

                    <ChevronRight
                      size={15}
                      strokeWidth={1.4}
                      className="shrink-0 text-[var(--color-secondary)]"
                    />
                  </button>

                  {/* DELETE ACCOUNT */}

                  <button
                    type="button"
                    onClick={() =>
                      setConfirmType("delete")
                    }
                    disabled={
                      isProcessingAccountAction
                    }
                    className="
                      group
                      flex
                      min-h-[88px]
                      items-center
                      gap-4
                      border
                      border-[#ead4d6]
                      bg-[#fffafa]
                      px-5
                      py-4
                      text-left
                      transition-colors
                      duration-300
                      hover:border-[#c98f95]
                      hover:bg-[var(--color-rose-light)]
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    <span
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        border
                        border-[#ead4d6]
                        bg-white
                        text-[#7f4a50]
                      "
                    >
                      {isProcessingAccountAction &&
                      confirmType ===
                        "delete" ? (
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                      ) : (
                        <Trash2
                          size={16}
                          strokeWidth={1.6}
                        />
                      )}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-[#7f4a50]">
                        {isProcessingAccountAction &&
                        confirmType === "delete"
                          ? "Deleting Account..."
                          : "Delete Account"}
                      </span>

                      <span className="mt-1 block text-[10px] leading-5 text-[var(--color-muted)]">
                        Permanently remove your account and
                        associated customer profile.
                      </span>
                    </span>

                    <ChevronRight
                      size={15}
                      strokeWidth={1.4}
                      className="shrink-0 text-[#9c6a70]"
                    />
                  </button>
                </div>
              </section>

              {/* =================================================
                  BOTTOM ACTIONS
              ================================================== */}

              <div className="border-t border-[var(--color-border)] pt-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-medium text-[var(--color-ink)]">
                      Aayesha Fashion Account
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-[var(--color-muted)]">
                      Keep your information current for a
                      smoother shopping experience.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href="/"
                      className="
                        inline-flex
                        h-11
                        items-center
                        justify-center
                        gap-2
                        border
                        border-[var(--color-border)]
                        bg-white
                        px-5
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.15em]
                        text-[var(--color-ink)]
                        transition-colors
                        hover:bg-[var(--color-cream)]
                      "
                    >
                      <Home size={14} />

                      Back to Home
                    </Link>

                    {!isEditing ? (
                      <Link
                        href="/account/edit"
                        className="
                          inline-flex
                          h-11
                          items-center
                          justify-center
                          gap-2
                          border
                          border-[var(--color-ink)]
                          bg-[var(--color-ink)]
                          px-6
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-[0.15em]
                          text-white
                          transition-colors
                          hover:bg-[var(--color-soft-charcoal)]
                        "
                      >
                        <Edit3 size={14} />

                        Edit Account
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          void handleSave();
                        }}
                        disabled={isSaving}
                        className="
                          inline-flex
                          h-11
                          items-center
                          justify-center
                          gap-2
                          border
                          border-[var(--color-ink)]
                          bg-[var(--color-ink)]
                          px-6
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-[0.15em]
                          text-white
                          transition
                          hover:bg-[var(--color-soft-charcoal)]
                          disabled:cursor-not-allowed
                          disabled:opacity-60
                        "
                      >
                        {isSaving ? (
                          <Loader2
                            size={14}
                            className="animate-spin"
                          />
                        ) : (
                          <Save size={14} />
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
          </div>
        </div>
      </section>

      {/* =====================================================
          CONFIRMATION DIALOG
      ===================================================== */}

      <AccountConfirmDialog
        open={confirmType !== null}
        type={
          confirmType === "delete"
            ? "delete"
            : "logout"
        }
        loading={
          isProcessingAccountAction
        }
        onCancel={
          closeConfirmDialog
        }
        onConfirm={() => {
          if (
            confirmType === "delete"
          ) {
            void handleDeleteConfirm();
            return;
          }

          if (
            confirmType === "logout"
          ) {
            void handleLogoutConfirm();
          }
        }}
      />
    </>
  );
}

/* =========================================================
   SMALL ICON COMPONENT
========================================================= */

function ShoppingBagIcon() {
  return (
    <span
      className="
        flex
        h-9
        w-9
        shrink-0
        items-center
        justify-center
        border
        border-[var(--color-border)]
        bg-white
        text-[var(--color-secondary)]
      "
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 8H18L19 21H5L6 8Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />

        <path
          d="M9 8V6C9 4.34315 10.3431 3 12 3C13.6569 3 15 4.34315 15 6V8"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}