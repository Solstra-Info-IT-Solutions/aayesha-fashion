export type AuthUser = {
  id: string;

  name: string;

  email: string;

  phone: string;

  avatarUrl: string;

  role: "customer" | "admin";

  status:
    | "active"
    | "inactive"
    | "suspended"
    | "blocked";

  emailVerified: boolean;

  phoneVerified: boolean;

  createdAt: string;

  updatedAt: string;
};

/* =========================================================
   REGISTER
========================================================= */

export type RegisterPayload = {
  name: string;

  email: string;

  phone: string;

  password: string;

  confirmPassword: string;
};

export type RegisterResponse = {
  user: AuthUser;

  requiresEmailVerification: true;
};

/* =========================================================
   LOGIN
========================================================= */

export type LoginPayload = {
  email: string;

  password: string;

  rememberMe?: boolean;
};

export type LoginResponse = {
  user: AuthUser;

  accessToken: string;
};

/* =========================================================
   EMAIL VERIFICATION
========================================================= */

export type VerifyEmailPayload = {
  email: string;

  otp: string;
};

export type VerifyEmailResponse = {
  user: AuthUser;
};

/* =========================================================
   RESEND VERIFICATION
========================================================= */

export type ResendVerificationPayload = {
  email: string;
};

/* =========================================================
   FORGOT PASSWORD
========================================================= */

export type ForgotPasswordPayload = {
  email: string;
};

/* =========================================================
   RESET OTP
========================================================= */

export type VerifyResetOtpPayload = {
  email: string;

  otp: string;
};

/* =========================================================
   RESET PASSWORD
========================================================= */

export type ResetPasswordPayload = {
  email: string;

  otp: string;

  password: string;

  confirmPassword: string;
};

/* =========================================================
   CHANGE PASSWORD
========================================================= */

export type ChangePasswordPayload = {
  currentPassword: string;

  newPassword: string;

  confirmPassword: string;
};

/* =========================================================
   REFRESH
========================================================= */

export type RefreshResponse = {
  user: AuthUser;

  accessToken: string;
};

/* =========================================================
   CURRENT USER
========================================================= */

export type MeResponse = {
  user: AuthUser;
};

/* =========================================================
   API MESSAGE
========================================================= */

export type AuthMessageResponse = {
  message: string;
};