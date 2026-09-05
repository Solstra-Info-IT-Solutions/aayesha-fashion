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
  ApiError,
} from "@/lib/api";

import {
  useAuthStore,
} from "@/store/auth-store";

/* =========================================================
   COMPONENT
========================================================= */

export function LoginForm() {
  const searchParams =
    useSearchParams();

  const verified =
    searchParams.get("verified");

  const login =
    useAuthStore(
      (state) => state.login,
    );

  const isLoading =
    useAuthStore(
      (state) => state.isLoading,
    );

  const storeError =
    useAuthStore(
      (state) => state.error,
    );

  const clearError =
    useAuthStore(
      (state) => state.clearError,
    );

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    rememberMe,
    setRememberMe,
  ] = useState(false);

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    localError,
    setLocalError,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  /* =======================================================
     VERIFIED MESSAGE
  ======================================================= */

  useEffect(() => {
    if (verified === "1") {
      setSuccessMessage(
        "Your email has been verified successfully. Please sign in.",
      );
    }
  }, [verified]);

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

    if (!password) {
      return "Please enter your password.";
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

    const validationError =
      validate();

    if (validationError) {
      setLocalError(
        validationError,
      );

      return;
    }

    try {
      await login(
        email.trim(),
        password,
        rememberMe,
      );

      /*
       * Login successful.
       */
      window.location.href =
        "/";
    } catch (error) {
      /*
       * Backend specifically tells us that the user's
       * credentials are valid but the email is not verified.
       *
       * Send the user directly to the email verification
       * screen with their email pre-filled.
       */

      if (
        error instanceof ApiError &&
        error.code ===
          "EMAIL_NOT_VERIFIED"
      ) {
        window.location.href =
          `/verify-email?email=${encodeURIComponent(
            email.trim(),
          )}`;

        return;
      }

      /*
       * Other API errors are already stored in auth store.
       */
    }
  };

  const errorMessage =
    localError ||
    storeError;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-[13px]"
    >
      {/* ===================================================
          SUCCESS
      =================================================== */}

      {successMessage ? (
        <div
          role="status"
          className="border border-[#cfdacf] bg-[#f5f8f4] px-4 py-3 text-[12px] leading-5 text-[var(--color-charcoal)]"
        >
          {successMessage}
        </div>
      ) : null}

      {/* ===================================================
          EMAIL
      =================================================== */}

      <label className="block">
        <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-secondary)]">
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

            if (localError) {
              setLocalError("");
            }

            clearError();
          }}
          className="h-12 w-full rounded-none border border-[var(--color-border)] bg-white px-4 text-[13px] text-[var(--color-charcoal)] outline-none transition placeholder:text-[#aaa] focus:border-[var(--color-charcoal)]"
        />
      </label>

      {/* ===================================================
          PASSWORD
      =================================================== */}

      <div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-secondary)]"
            >
              Password
            </label>

            <Link
              href="/forgot-password"
              className="text-[11px] text-[var(--color-secondary)] underline underline-offset-4 transition hover:text-[var(--color-charcoal)]"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <input
              id="login-password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={password}
              placeholder="Enter your password"
              autoComplete="current-password"
              onChange={(event) => {
                setPassword(
                  event.target.value,
                );

                if (localError) {
                  setLocalError("");
                }

                clearError();
              }}
              className="h-12 w-full rounded-none border border-[var(--color-border)] bg-white px-4 pr-12 text-[13px] text-[var(--color-charcoal)] outline-none transition placeholder:text-[#aaa] focus:border-[var(--color-charcoal)]"
            />

            <button
              type="button"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
              onClick={() =>
                setShowPassword(
                  (current) =>
                    !current,
                )
              }
              className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center text-[var(--color-secondary)] transition hover:text-[var(--color-charcoal)]"
            >
              {showPassword ? (
                <EyeOff
                  size={17}
                  strokeWidth={1.6}
                />
              ) : (
                <Eye
                  size={17}
                  strokeWidth={1.6}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================
          REMEMBER ME
      =================================================== */}

      <label className="flex cursor-pointer items-center gap-2.5 pt-0.5">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(event) =>
            setRememberMe(
              event.target.checked,
            )
          }
          className="h-3.5 w-3.5 rounded-none border-[var(--color-border)] accent-[var(--color-charcoal)]"
        />

        <span className="text-[11px] text-[var(--color-secondary)]">
          Keep me signed in
        </span>
      </label>

      {/* ===================================================
          ERROR
      =================================================== */}

      {errorMessage ? (
        <div
          role="alert"
          className="border border-[var(--color-rose-dark)] bg-[var(--color-rose-light)] px-4 py-3 text-[12px] leading-5 text-[var(--color-charcoal)]"
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
        className="flex h-12 w-full items-center justify-center gap-2 bg-[var(--color-charcoal)] px-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <Loader2
              size={16}
              className="animate-spin"
            />

            Signing in
          </>
        ) : (
          <>
            Sign in

            <ArrowRight
              size={15}
              strokeWidth={1.7}
            />
          </>
        )}
      </button>

      {/* ===================================================
          REGISTER
      =================================================== */}

      <p className="pt-1 text-center text-[12px] text-[var(--color-secondary)]">
        New to Aayesha Fashion?{" "}
        <Link
          href="/register"
          className="font-medium text-[var(--color-charcoal)] underline underline-offset-4 transition hover:opacity-60"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}