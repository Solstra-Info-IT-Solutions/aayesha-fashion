"use client";

import {
  FormEvent,
  useState,
} from "react";

import { Eye, EyeOff } from "lucide-react";

import { useAuthStore } from "@/store/auth-store";

/* =========================================================
   INPUT FIELD
========================================================= */

type InputFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  onChange: (value: string) => void;
};

function InputField({
  label,
  value,
  placeholder,
  type = "text",
  autoComplete,
  onChange,
}: InputFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-secondary)]">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-12 w-full rounded-none border border-[var(--color-border)] bg-white px-4 text-[13px] text-[var(--color-charcoal)] outline-none transition placeholder:text-[#aaa] focus:border-[var(--color-charcoal)]"
      />
    </div>
  );
}

/* =========================================================
   PASSWORD FIELD
========================================================= */

type PasswordFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  autoComplete?: string;
  onChange: (value: string) => void;
};

function PasswordField({
  label,
  value,
  placeholder,
  autoComplete,
  onChange,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] =
    useState(false);

  return (
    <div>
      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-secondary)]">
        {label}
      </label>

      <div className="relative">
        <input
          type={
            showPassword
              ? "text"
              : "password"
          }
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(event) =>
            onChange(event.target.value)
          }
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
              (current) => !current,
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
      valid: /[A-Z]/.test(
        password,
      ),
    },
    {
      label: "One lowercase letter",
      valid: /[a-z]/.test(
        password,
      ),
    },
    {
      label: "One number",
      valid: /\d/.test(password),
    },
    {
      label: "One special character",
      valid: /[^A-Za-z0-9]/.test(
        password,
      ),
    },
  ];

  return (
    <div className="mt-3 space-y-1.5">
      {rules.map((rule) => (
        <div
          key={rule.label}
          className={`flex items-center gap-2 text-[10px] ${
            rule.valid
              ? "text-[var(--color-charcoal)]"
              : "text-[var(--color-muted)]"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              rule.valid
                ? "bg-[var(--color-charcoal)]"
                : "bg-[#d6d1cc]"
            }`}
          />

          <span>
            {rule.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   REGISTER FORM
========================================================= */

export function RegisterForm() {
  const register =
    useAuthStore(
      (state) => state.register,
    );

  const storeError =
    useAuthStore(
      (state) => state.error,
    );

  const isLoading =
    useAuthStore(
      (state) => state.isLoading,
    );

  const clearError =
    useAuthStore(
      (state) => state.clearError,
    );

  const [
    name,
    setName,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    phone,
    setPhone,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    localError,
    setLocalError,
  ] = useState("");

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validate = () => {
    if (
      name.trim().length < 2
    ) {
      return "Please enter your full name.";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email.trim(),
      )
    ) {
      return "Please enter a valid email address.";
    }

    if (
      !/^(?:\+91|91)?[6-9]\d{9}$/.test(
        phone.trim(),
      )
    ) {
      return "Please enter a valid Indian mobile number.";
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

    if (!/\d/.test(password)) {
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

    const validationError =
      validate();

    if (validationError) {
      setLocalError(
        validationError,
      );

      return;
    }

    try {
      await register(
        name.trim(),
        email.trim(),
        phone.trim(),
        password,
        confirmPassword,
      );

      window.location.href =
        `/verify-email?email=${encodeURIComponent(
          email.trim(),
        )}`;
    } catch {
      /*
       * Auth store already stores the API error.
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
          NAME
      =================================================== */}

      <InputField
        label="Full name"
        value={name}
        placeholder="Your full name"
        autoComplete="name"
        onChange={(value) => {
          setName(value);

          if (localError) {
            setLocalError("");
          }
        }}
      />

      {/* ===================================================
          EMAIL
      =================================================== */}

      <InputField
        label="Email address"
        type="email"
        value={email}
        placeholder="you@example.com"
        autoComplete="email"
        onChange={(value) => {
          setEmail(value);

          if (localError) {
            setLocalError("");
          }
        }}
      />

      {/* ===================================================
          PHONE
      =================================================== */}

      <InputField
        label="Mobile number"
        type="tel"
        value={phone}
        placeholder="9876543210"
        autoComplete="tel"
        onChange={(value) => {
          setPhone(value);

          if (localError) {
            setLocalError("");
          }
        }}
      />

      {/* ===================================================
          PASSWORD
      =================================================== */}

      <div>
        <PasswordField
          label="Password"
          value={password}
          placeholder="Create a secure password"
          autoComplete="new-password"
          onChange={(value) => {
            setPassword(value);

            if (localError) {
              setLocalError("");
            }
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
        label="Confirm password"
        value={confirmPassword}
        placeholder="Re-enter your password"
        autoComplete="new-password"
        onChange={(value) => {
          setConfirmPassword(
            value,
          );

          if (localError) {
            setLocalError("");
          }
        }}
      />

      {/* ===================================================
          ERROR
      =================================================== */}

      {errorMessage ? (
        <div
          role="alert"
          className="border border-[var(--color-rose-dark)] bg-[var(--color-rose-light)] px-4 py-3 text-sm leading-5 text-[var(--color-charcoal)]"
        >
          {errorMessage}
        </div>
      ) : null}

      {/* ===================================================
          TERMS
      =================================================== */}

      <p className="text-[11px] leading-5 text-[var(--color-secondary)]">
        By creating an account, you
        agree to our terms and
        acknowledge our privacy
        practices.
      </p>

      {/* ===================================================
          SUBMIT
      =================================================== */}

      <button
        type="submit"
        disabled={isLoading}
        className="h-12 w-full bg-[var(--color-charcoal)] px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading
          ? "Creating account..."
          : "Create account"}
      </button>
    </form>
  );
}