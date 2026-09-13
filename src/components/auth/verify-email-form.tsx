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
  Loader2,
} from "lucide-react";

import {
  useAuthStore,
} from "@/store/auth-store";

/* =========================================================
   COMPONENT
========================================================= */

export function VerifyEmailForm() {
  const searchParams =
    useSearchParams();

  const emailFromUrl =
    searchParams.get("email") ?? "";

  const verifyEmail =
    useAuthStore(
      (state) =>
        state.verifyEmail,
    );

  const resendVerification =
    useAuthStore(
      (state) =>
        state.resendVerification,
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

  const [localError, setLocalError] =
    useState("");

  const [
    resendAvailable,
    setResendAvailable,
  ] = useState(true);

  const [
    resendSeconds,
    setResendSeconds,
  ] = useState(0);

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  /* =======================================================
     SYNC EMAIL FROM URL
  ======================================================= */

  useEffect(() => {
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [emailFromUrl]);

  /* =======================================================
     RESEND TIMER
  ======================================================= */

  useEffect(() => {
    if (resendSeconds <= 0) {
      setResendAvailable(true);
      return;
    }

    const timer =
      window.setInterval(() => {
        setResendSeconds(
          (current) =>
            Math.max(
              0,
              current - 1,
            ),
        );
      }, 1000);

    return () =>
      window.clearInterval(
        timer,
      );
  }, [resendSeconds]);

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
      return "Please enter the 6-digit verification code.";
    }

    return "";
  };

  /* =======================================================
     VERIFY
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
      await verifyEmail(
        email.trim(),
        otp,
      );

      window.location.href =
        "/login?verified=1";
    } catch {
      /*
       * Auth store contains
       * the API error.
       */
    }
  };

  /* =======================================================
     RESEND
  ======================================================= */

  const handleResend = async () => {
    if (
      !resendAvailable ||
      !email.trim()
    ) {
      return;
    }

    clearError();

    setLocalError("");
    setSuccessMessage("");

    try {
      await resendVerification(
        email.trim(),
      );

      setSuccessMessage(
        "A new verification code has been sent.",
      );

      setResendAvailable(false);
      setResendSeconds(60);
      setOtp("");
    } catch {
      /*
       * Store contains API error.
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
    <div className="space-y-4">
      {/* ===================================================
          INTRO
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
          Enter the 6-digit code sent to your
          email address to verify your Aayesha
          Fashion account.
        </p>
      </div>

      {/* ===================================================
          FORM
      =================================================== */}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-4"
      >
        {/* =================================================
            EMAIL
        ================================================= */}

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

        {/* =================================================
            OTP
        ================================================= */}

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
            Verification code
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

        {/* =================================================
            ERROR
        ================================================= */}

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

        {/* =================================================
            SUCCESS
        ================================================= */}

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

        {/* =================================================
            SUBMIT
        ================================================= */}

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

              Verifying
            </>
          ) : (
            <>
              Verify email

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
      </form>

      {/* ===================================================
          RESEND
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
          Didn&apos;t receive the code?
        </p>

        <button
          type="button"
          disabled={
            !resendAvailable ||
            isLoading
          }
          onClick={handleResend}
          className="
            mt-2
            text-sm
            font-semibold
            text-[var(--color-text)]
            underline
            underline-offset-4
            transition-opacity
            duration-[var(--duration-fast)]
            hover:opacity-60
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          {resendAvailable
            ? "Resend code"
            : `Resend in ${resendSeconds}s`}
        </button>
      </div>

      {/* ===================================================
          CHANGE EMAIL
      =================================================== */}

      <p className="text-center text-sm text-[var(--color-text-secondary)]">
        Entered the wrong email?{" "}
        <Link
          href="/register"
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
          Create your account again
        </Link>
      </p>
    </div>
  );
}