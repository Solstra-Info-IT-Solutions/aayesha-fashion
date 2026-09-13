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
      <span
        className="
          mb-2
          block
          text-[10px]
          font-semibold
          uppercase
          tracking-[0.18em]
          text-[var(--color-text-secondary)]
        "
      >
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
            h-11
            w-full
            border
            border-[var(--color-border)]
            bg-[var(--color-surface)]
            px-4
            pr-11
            text-sm
            text-[var(--color-text)]
            outline-none
            transition-colors
            duration-[var(--duration-base)]
            placeholder:text-[var(--color-text-muted)]
            hover:border-[var(--color-border-dark)]
            focus:border-[var(--color-accent-dark)]
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
            h-11
            w-11
            items-center
            justify-center
            text-[var(--color-text-secondary)]
            transition-colors
            duration-[var(--duration-fast)]
            hover:text-[var(--color-text)]
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
          className={`
            text-[11px]
            ${
              rule.valid
                ? "text-[var(--color-success)]"
                : "text-[var(--color-text-muted)]"
            }
          `}
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
       * Auth store already contains
       * the API error.
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
      className="space-y-4"
    >
      {/* ===================================================
          EMAIL
      =================================================== */}

      <label className="block">
        <span
          className="
            mb-2
            block
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.18em]
            text-[var(--color-text-secondary)]
          "
        >
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
            h-11
            w-full
            border
            border-[var(--color-border)]
            bg-[var(--color-surface)]
            px-4
            text-sm
            text-[var(--color-text)]
            outline-none
            transition-colors
            duration-[var(--duration-base)]
            placeholder:text-[var(--color-text-muted)]
            hover:border-[var(--color-border-dark)]
            focus:border-[var(--color-accent-dark)]
          "
        />
      </label>

      {/* ===================================================
          OTP
      =================================================== */}

      <label className="block">
        <span
          className="
            mb-2
            block
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.18em]
            text-[var(--color-text-secondary)]
          "
        >
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
            h-12
            w-full
            border
            border-[var(--color-border)]
            bg-[var(--color-surface)]
            px-4
            text-center
            font-mono
            text-lg
            tracking-[0.4em]
            text-[var(--color-text)]
            outline-none
            transition-colors
            duration-[var(--duration-base)]
            placeholder:text-[var(--color-text-muted)]
            placeholder:tracking-[0.3em]
            hover:border-[var(--color-border-dark)]
            focus:border-[var(--color-accent-dark)]
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
            border-[var(--color-error)]
            bg-[var(--color-surface-soft)]
            px-4
            py-3
            text-[12px]
            leading-5
            text-[var(--color-error)]
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
            border-[var(--color-success)]
            bg-[var(--color-surface-soft)]
            px-4
            py-3
            text-[12px]
            leading-5
            text-[var(--color-success)]
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
          group
          flex
          h-11
          w-full
          items-center
          justify-center
          gap-2
          border
          border-[var(--color-text)]
          bg-[var(--color-text)]
          px-5
          text-[10px]
          font-semibold
          uppercase
          tracking-[0.2em]
          text-[var(--color-text-inverse)]
          transition-all
          duration-[var(--duration-base)]
          hover:border-[var(--color-accent-dark)]
          hover:bg-[var(--color-accent-dark)]
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {isLoading ? (
          <>
            <Loader2
              size={15}
              strokeWidth={1.7}
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
              className="
                transition-transform
                duration-[var(--duration-base)]
                group-hover:translate-x-0.5
              "
            />
          </>
        )}
      </button>

      {/* ===================================================
          BACK TO LOGIN
      =================================================== */}

      <div
        className="
          mt-3
          border-t
          border-[var(--color-border-light)]
          pt-5
          text-center
        "
      >
        <p className="text-sm text-[var(--color-text-secondary)]">
          Remember your password?{" "}
          <Link
            href="/login"
            className="
              font-semibold
              text-[var(--color-text)]
              underline
              underline-offset-4
              transition-opacity
              duration-[var(--duration-fast)]
              hover:opacity-60
            "
          >
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
}