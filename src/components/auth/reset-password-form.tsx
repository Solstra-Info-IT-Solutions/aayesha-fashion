"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

import {
  useAuthStore,
} from "@/store/auth-store";

/* =========================================================
   PASSWORD FIELD
========================================================= */

function PasswordField({
  label,
  value,
  placeholder,
  autoComplete,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  autoComplete: string;
  onChange: (value: string) => void;
}) {
  const [visible, setVisible] =
    useState(false);

  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--color-secondary)]">
        {label}
      </span>

      <div className="relative">
        <input
          type={
            visible
              ? "text"
              : "password"
          }
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(event) =>
            onChange(
              event.target.value,
            )
          }
          className="
            h-12
            w-full
            border
            border-[var(--color-border)]
            bg-white
            px-4
            pr-12
            text-sm
            text-[var(--color-charcoal)]
            outline-none
            transition-colors
            duration-200
            placeholder:text-[var(--color-muted)]
            hover:border-[#d8d1ca]
            focus:border-[var(--color-charcoal)]
          "
        />

        <button
          type="button"
          aria-label={
            visible
              ? "Hide password"
              : "Show password"
          }
          onClick={() =>
            setVisible(
              (current) =>
                !current,
            )
          }
          className="
            absolute
            right-0
            top-0
            flex
            h-12
            w-12
            items-center
            justify-center
            text-[var(--color-secondary)]
            transition-colors
            duration-200
            hover:text-[var(--color-charcoal)]
          "
        >
          {visible ? (
            <EyeOff
              size={17}
              strokeWidth={1.7}
            />
          ) : (
            <Eye
              size={17}
              strokeWidth={1.7}
            />
          )}
        </button>
      </div>
    </label>
  );
}

/* =========================================================
   PASSWORD RULES
========================================================= */

function PasswordRules({
  password,
}: {
  password: string;
}) {
  const rules = [
    {
      label: "8–72 characters",
      valid:
        password.length >= 8 &&
        password.length <= 72,
    },
    {
      label: "One uppercase letter",
      valid:
        /[A-Z]/.test(password),
    },
    {
      label: "One lowercase letter",
      valid:
        /[a-z]/.test(password),
    },
    {
      label: "One number",
      valid:
        /\d/.test(password),
    },
    {
      label: "One special character",
      valid:
        /[^A-Za-z0-9]/.test(
          password,
        ),
    },
  ];

  return (
    <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
      {rules.map((rule) => (
        <p
          key={rule.label}
          className={`text-[11px] ${
            rule.valid
              ? "text-[var(--color-charcoal)]"
              : "text-[var(--color-muted)]"
          }`}
        >
          <span className="mr-1.5">
            {rule.valid
              ? "✓"
              : "•"}
          </span>

          {rule.label}
        </p>
      ))}
    </div>
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export function ResetPasswordForm() {
  const searchParams =
    useSearchParams();

  const emailFromUrl =
    searchParams.get(
      "email",
    ) ?? "";

  const resetPassword =
    useAuthStore(
      (state) =>
        state.resetPassword,
    );

  const isLoading =
    useAuthStore(
      (state) =>
        state.isLoading,
    );

  const storeError =
    useAuthStore(
      (state) =>
        state.error,
    );

  const clearError =
    useAuthStore(
      (state) =>
        state.clearError,
    );

  const [email, setEmail] =
    useState(emailFromUrl);

  const [otp, setOtp] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [localError, setLocalError] =
    useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  /* =======================================================
     SYNC EMAIL
  ======================================================= */

  useEffect(() => {
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [emailFromUrl]);

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validate = () => {
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email.trim(),
      )
    ) {
      return "Please enter a valid email address.";
    }

    if (
      !/^\d{6}$/.test(otp)
    ) {
      return "Please enter the 6-digit reset code.";
    }

    if (
      password.length < 8
    ) {
      return "Password must contain at least 8 characters.";
    }

    if (
      password.length > 72
    ) {
      return "Password cannot exceed 72 characters.";
    }

    if (
      !/[A-Z]/.test(password)
    ) {
      return "Password must contain at least one uppercase letter.";
    }

    if (
      !/[a-z]/.test(password)
    ) {
      return "Password must contain at least one lowercase letter.";
    }

    if (
      !/\d/.test(password)
    ) {
      return "Password must contain at least one number.";
    }

    if (
      !/[^A-Za-z0-9]/.test(
        password,
      )
    ) {
      return "Password must contain at least one special character.";
    }

    if (
      password !==
      confirmPassword
    ) {
      return "Passwords do not match.";
    }

    return "";
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    clearError();

    setLocalError("");
    setSuccessMessage("");

    const validationError =
      validate();

    if (validationError) {
      setLocalError(
        validationError,
      );

      return;
    }

    try {
      await resetPassword(
        email.trim(),
        otp,
        password,
        confirmPassword,
      );

      setSuccessMessage(
        "Password reset successfully. Redirecting to sign in...",
      );

      window.setTimeout(() => {
        window.location.href =
          "/login";
      }, 900);
    } catch {
      /*
       * Auth store already contains the API error.
       */
    }
  };

  const errorMessage =
    localError ||
    storeError;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-[13px]"
    >
      {/* ===================================================
          EMAIL
      =================================================== */}

      <label className="block">
        <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--color-secondary)]">
          Email address
        </span>

        <input
          type="email"
          value={email}
          placeholder="you@example.com"
          autoComplete="email"
          onChange={(event) => {
            setEmail(
              event.target.value,
            );

            setLocalError("");
            clearError();
          }}
          className="
            h-12
            w-full
            border
            border-[var(--color-border)]
            bg-white
            px-4
            text-sm
            text-[var(--color-charcoal)]
            outline-none
            transition-colors
            duration-200
            placeholder:text-[var(--color-muted)]
            hover:border-[#d8d1ca]
            focus:border-[var(--color-charcoal)]
          "
        />
      </label>

      {/* ===================================================
          OTP
      =================================================== */}

      <label className="block">
        <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--color-secondary)]">
          Reset code
        </span>

        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={otp}
          placeholder="000000"
          onChange={(event) => {
            const value =
              event.target.value.replace(
                /\D/g,
                "",
              );

            setOtp(
              value.slice(
                0,
                6,
              ),
            );

            setLocalError("");
            clearError();
          }}
          className="
            h-14
            w-full
            border
            border-[var(--color-border)]
            bg-white
            px-4
            text-center
            font-mono
            text-xl
            tracking-[0.45em]
            text-[var(--color-charcoal)]
            outline-none
            transition-colors
            duration-200
            placeholder:text-[var(--color-muted)]
            placeholder:tracking-[0.3em]
            focus:border-[var(--color-charcoal)]
          "
        />
      </label>

      {/* ===================================================
          NEW PASSWORD
      =================================================== */}

      <div>
        <PasswordField
          label="New password"
          value={password}
          placeholder="Create a new password"
          autoComplete="new-password"
          onChange={(value) => {
            setPassword(value);

            setLocalError("");
            clearError();
          }}
        />

        <PasswordRules
          password={password}
        />
      </div>

      {/* ===================================================
          CONFIRM PASSWORD
      =================================================== */}

      <PasswordField
        label="Confirm new password"
        value={confirmPassword}
        placeholder="Re-enter your new password"
        autoComplete="new-password"
        onChange={(value) => {
          setConfirmPassword(
            value,
          );

          setLocalError("");
          clearError();
        }}
      />

      {/* ===================================================
          ERROR
      =================================================== */}

      {errorMessage ? (
        <div
          role="alert"
          className="
            border
            border-[var(--color-rose-dark)]
            bg-[var(--color-rose-light)]
            px-4
            py-3
            text-sm
            leading-5
            text-[var(--color-charcoal)]
          "
        >
          {errorMessage}
        </div>
      ) : null}

      {/* ===================================================
          SUCCESS
      =================================================== */}

      {successMessage ? (
        <div
          role="status"
          className="
            border
            border-[var(--color-border)]
            bg-[var(--color-cream)]
            px-4
            py-3
            text-sm
            leading-5
            text-[var(--color-charcoal)]
          "
        >
          {successMessage}
        </div>
      ) : null}

      {/* ===================================================
          SUBMIT
      =================================================== */}

      <button
        type="submit"
        disabled={
          isLoading ||
          otp.length !== 6
        }
        className="
          flex
          h-12
          w-full
          items-center
          justify-center
          gap-2
          bg-[var(--color-charcoal)]
          px-5
          text-[10px]
          font-medium
          uppercase
          tracking-[0.2em]
          text-white
          transition-colors
          duration-200
          hover:bg-black
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {isLoading ? (
          <>
            <Loader2
              size={15}
              className="animate-spin"
            />

            Resetting password
          </>
        ) : (
          <>
            Reset password

            <ArrowRight
              size={15}
              strokeWidth={1.7}
            />
          </>
        )}
      </button>

      {/* ===================================================
          BACK TO LOGIN
      =================================================== */}

      <div className="mt-2 border-t border-[var(--color-border)] pt-5 text-center">
        <p className="text-sm text-[var(--color-secondary)]">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-medium text-[var(--color-charcoal)] underline underline-offset-4 transition-opacity hover:opacity-60"
          >
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
}