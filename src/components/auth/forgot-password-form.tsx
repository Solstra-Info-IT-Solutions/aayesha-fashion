"use client";

import {
  useState,
  type FormEvent,
} from "react";

import Link from "next/link";

import {
  ArrowRight,
  Loader2,
} from "lucide-react";

import {
  useAuthStore,
} from "@/store/auth-store";

/* =========================================================
   COMPONENT
========================================================= */

export function ForgotPasswordForm() {
  const forgotPassword =
    useAuthStore(
      (state) =>
        state.forgotPassword,
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
    useState("");

  const [localError, setLocalError] =
    useState("");

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    clearError();
    setLocalError("");

    const normalizedEmail =
      email.trim();

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        normalizedEmail,
      )
    ) {
      setLocalError(
        "Please enter a valid email address.",
      );

      return;
    }

    try {
      await forgotPassword(
        normalizedEmail,
      );

      window.location.href =
        `/reset-password?email=${encodeURIComponent(
          normalizedEmail,
        )}`;
    } catch {
      /*
       * Auth store already handles
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
          DESCRIPTION
      =================================================== */}

      <div
        className="
          border-l-2
          border-[var(--color-accent)]
          bg-[var(--color-surface-soft)]
          px-4
          py-3
        "
      >
        <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
          Enter the email address associated
          with your account. We&apos;ll send
          you a secure password reset code.
        </p>
      </div>

      {/* ===================================================
          EMAIL
      =================================================== */}

      <label className="block pt-1">
        <span
          className="
            mb-2
            block
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.16em]
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
            setEmail(event.target.value);

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
            text-sm
            leading-5
            text-[var(--color-error)]
          "
        >
          {errorMessage}
        </div>
      ) : null}

      {/* ===================================================
          SUBMIT
      =================================================== */}

      <button
        type="submit"
        disabled={isLoading}
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
          hover:bg-[var(--color-accent-dark)]
          hover:border-[var(--color-accent-dark)]
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

            Sending code
          </>
        ) : (
          <>
            Send reset code

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