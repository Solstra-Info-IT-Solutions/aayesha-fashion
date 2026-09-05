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
    searchParams.get(
      "email",
    ) ?? "";

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
       * Auth store contains the API error.
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
    <div className="space-y-[13px]">
      {/* ===================================================
          INTRO
      =================================================== */}

      <div className="mb-2 border-l-2 border-[var(--color-rose)] pl-4">
        <p className="text-sm leading-6 text-[var(--color-secondary)]">
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
        className="space-y-[13px]"
      >
        {/* =================================================
            EMAIL
        ================================================= */}

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

        {/* =================================================
            OTP
        ================================================= */}

        <label className="block">
          <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--color-secondary)]">
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
              hover:border-[#d8d1ca]
              focus:border-[var(--color-charcoal)]
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

        {/* =================================================
            SUCCESS
        ================================================= */}

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

              Verifying
            </>
          ) : (
            <>
              Verify email

              <ArrowRight
                size={15}
                strokeWidth={1.7}
              />
            </>
          )}
        </button>
      </form>

      {/* ===================================================
          RESEND
      =================================================== */}

      <div className="mt-2 border-t border-[var(--color-border)] pt-5 text-center">
        <p className="text-sm text-[var(--color-secondary)]">
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
            font-medium
            text-[var(--color-charcoal)]
            underline
            underline-offset-4
            transition-opacity
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

      <p className="text-center text-sm text-[var(--color-secondary)]">
        Entered the wrong email?{" "}
        <Link
          href="/register"
          className="
            font-medium
            text-[var(--color-charcoal)]
            underline
            underline-offset-4
            transition-opacity
            hover:opacity-60
          "
        >
          Create your account again
        </Link>
      </p>
    </div>
  );
}