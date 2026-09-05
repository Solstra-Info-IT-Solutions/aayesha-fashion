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
       * Auth store already handles the API error.
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
          DESCRIPTION
      =================================================== */}

      <div className="mb-2 border-l-2 border-[var(--color-rose)] pl-4">
        <p className="text-sm leading-6 text-[var(--color-secondary)]">
          Enter the email address associated
          with your account. We&apos;ll send
          you a secure password reset code.
        </p>
      </div>

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
          SUBMIT
      =================================================== */}

      <button
        type="submit"
        disabled={isLoading}
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

            Sending code
          </>
        ) : (
          <>
            Send reset code

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