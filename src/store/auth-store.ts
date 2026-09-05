"use client";

import { create } from "zustand";

import {
  apiFetch,
  ApiError,
} from "@/lib/api";

/* =========================================================
   TYPES
========================================================= */

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

type RegisterResponse = {
  user: AuthUser;
  requiresEmailVerification: true;
};

type LoginResponse = {
  user: AuthUser;
  accessToken: string;
};

type MeResponse = {
  user: AuthUser;
};

type RefreshResponse = {
  user: AuthUser;
  accessToken: string;
};

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;

  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  error: string | null;

  register: (
    name: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string,
  ) => Promise<RegisterResponse>;

  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<void>;

  verifyEmail: (
    email: string,
    otp: string,
  ) => Promise<AuthUser>;

  resendVerification: (
    email: string,
  ) => Promise<void>;

  forgotPassword: (
    email: string,
  ) => Promise<void>;

  verifyResetOtp: (
    email: string,
    otp: string,
  ) => Promise<void>;

  resetPassword: (
    email: string,
    otp: string,
    password: string,
    confirmPassword: string,
  ) => Promise<void>;

  changePassword: (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) => Promise<void>;

  fetchMe: () => Promise<AuthUser | null>;

  refreshSession: () => Promise<boolean>;

  logout: () => Promise<void>;

  initializeAuth: () => Promise<void>;

  clearError: () => void;
};

/* =========================================================
   STORE
========================================================= */

export const useAuthStore =
  create<AuthState>((set, get) => ({
    /* =======================================================
       INITIAL STATE
    ======================================================= */

    user: null,

    accessToken: null,

    isAuthenticated: false,

    isLoading: false,

    isInitialized: false,

    error: null,

    /* =======================================================
       REGISTER
    ======================================================= */

    register: async (
      name,
      email,
      phone,
      password,
      confirmPassword,
    ) => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        const result =
          await apiFetch<RegisterResponse>(
            "/auth/register",
            {
              method: "POST",

              body: JSON.stringify({
                name,
                email,
                phone,
                password,
                confirmPassword,
              }),
            },
          );

        return result;
      } catch (error) {
        const message =
          getAuthErrorMessage(error);

        set({
          error: message,
        });

        throw error;
      } finally {
        set({
          isLoading: false,
        });
      }
    },

    /* =======================================================
       LOGIN
    ======================================================= */

    login: async (
      email,
      password,
      rememberMe = false,
    ) => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        const result =
          await apiFetch<LoginResponse>(
            "/auth/login",
            {
              method: "POST",

              body: JSON.stringify({
                email,
                password,
                rememberMe,
              }),
            },
          );

        set({
          user: result.user,

          accessToken:
            result.accessToken,

          isAuthenticated: true,

          error: null,
        });
      } catch (error) {
        const message =
          getAuthErrorMessage(error);

        set({
          error: message,

          user: null,

          accessToken: null,

          isAuthenticated: false,
        });

        throw error;
      } finally {
        set({
          isLoading: false,
        });
      }
    },

    /* =======================================================
       VERIFY EMAIL
    ======================================================= */

    verifyEmail: async (
      email,
      otp,
    ) => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        const result =
          await apiFetch<{
            user: AuthUser;
          }>(
            "/auth/verify-email",
            {
              method: "POST",

              body: JSON.stringify({
                email,
                otp,
              }),
            },
          );

        set({
          user: result.user,

          error: null,
        });

        return result.user;
      } catch (error) {
        const message =
          getAuthErrorMessage(error);

        set({
          error: message,
        });

        throw error;
      } finally {
        set({
          isLoading: false,
        });
      }
    },

    /* =======================================================
       RESEND VERIFICATION OTP
    ======================================================= */

    resendVerification: async (
      email,
    ) => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        await apiFetch<undefined>(
          "/auth/resend-verification",
          {
            method: "POST",

            body: JSON.stringify({
              email,
            }),
          },
        );
      } catch (error) {
        const message =
          getAuthErrorMessage(error);

        set({
          error: message,
        });

        throw error;
      } finally {
        set({
          isLoading: false,
        });
      }
    },

    /* =======================================================
       FORGOT PASSWORD
    ======================================================= */

    forgotPassword: async (
      email,
    ) => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        await apiFetch<undefined>(
          "/auth/forgot-password",
          {
            method: "POST",

            body: JSON.stringify({
              email,
            }),
          },
        );
      } catch (error) {
        const message =
          getAuthErrorMessage(error);

        set({
          error: message,
        });

        throw error;
      } finally {
        set({
          isLoading: false,
        });
      }
    },

    /* =======================================================
       VERIFY RESET OTP
    ======================================================= */

    verifyResetOtp: async (
      email,
      otp,
    ) => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        await apiFetch<undefined>(
          "/auth/verify-reset-otp",
          {
            method: "POST",

            body: JSON.stringify({
              email,
              otp,
            }),
          },
        );
      } catch (error) {
        const message =
          getAuthErrorMessage(error);

        set({
          error: message,
        });

        throw error;
      } finally {
        set({
          isLoading: false,
        });
      }
    },

    /* =======================================================
       RESET PASSWORD
    ======================================================= */

    resetPassword: async (
      email,
      otp,
      password,
      confirmPassword,
    ) => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        await apiFetch<undefined>(
          "/auth/reset-password",
          {
            method: "POST",

            body: JSON.stringify({
              email,
              otp,
              password,
              confirmPassword,
            }),
          },
        );

        /*
         * Password reset ends the current local session.
         */

        set({
          user: null,

          accessToken: null,

          isAuthenticated: false,

          error: null,
        });
      } catch (error) {
        const message =
          getAuthErrorMessage(error);

        set({
          error: message,
        });

        throw error;
      } finally {
        set({
          isLoading: false,
        });
      }
    },

    /* =======================================================
       CHANGE PASSWORD
    ======================================================= */

    changePassword: async (
      currentPassword,
      newPassword,
      confirmPassword,
    ) => {
      const accessToken =
        get().accessToken;

      if (!accessToken) {
        const error =
          new Error(
            "Authentication is required.",
          );

        set({
          error: error.message,
        });

        throw error;
      }

      set({
        isLoading: true,
        error: null,
      });

      try {
        await apiFetch<undefined>(
          "/auth/change-password",
          {
            method: "POST",

            accessToken,

            body: JSON.stringify({
              currentPassword,
              newPassword,
              confirmPassword,
            }),
          },
        );

        /*
         * Backend requires sign-in again after password change.
         */

        set({
          user: null,

          accessToken: null,

          isAuthenticated: false,

          error: null,
        });
      } catch (error) {
        const message =
          getAuthErrorMessage(error);

        set({
          error: message,
        });

        throw error;
      } finally {
        set({
          isLoading: false,
        });
      }
    },

    /* =======================================================
       FETCH CURRENT USER
    ======================================================= */

    fetchMe: async () => {
      const accessToken =
        get().accessToken;

      if (!accessToken) {
        return null;
      }

      try {
        const result =
          await apiFetch<MeResponse>(
            "/auth/me",
            {
              method: "GET",

              accessToken,
            },
          );

        set({
          user: result.user,

          isAuthenticated: true,

          error: null,
        });

        return result.user;
      } catch (error) {
        if (
          error instanceof ApiError &&
          error.status === 401
        ) {
          return null;
        }

        throw error;
      }
    },

    /* =======================================================
       REFRESH SESSION
    ======================================================= */

    refreshSession:
      async () => {
        try {
          const result =
            await apiFetch<RefreshResponse>(
              "/auth/refresh",
              {
                method: "POST",
              },
            );

          set({
            user: result.user,

            accessToken:
              result.accessToken,

            isAuthenticated: true,

            error: null,
          });

          return true;
        } catch {
          set({
            user: null,

            accessToken: null,

            isAuthenticated: false,
          });

          return false;
        }
      },

    /* =======================================================
       LOGOUT
    ======================================================= */

    logout: async () => {
  const accessToken =
    get().accessToken;

  set({
    isLoading: true,
    error: null,
  });

  try {
    if (accessToken) {
      await apiFetch<undefined>(
        "/auth/logout",
        {
          method: "POST",
          accessToken,
        },
      );
    }
  } catch {
    // Local auth state should still be cleared.
  } finally {
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }
},

    /* =======================================================
       INITIALIZE AUTH
    ======================================================= */

    initializeAuth:
      async () => {
        if (
          get().isInitialized
        ) {
          return;
        }

        set({
          isLoading: true,
          error: null,
        });

        try {
          /*
           * Access token is memory-only.
           * Restore the session using the HTTP-only
           * refresh-token cookie after a page reload.
           */

          const refreshed =
            await get().refreshSession();

          if (!refreshed) {
            set({
              user: null,

              accessToken: null,

              isAuthenticated: false,
            });
          }
        } catch {
          set({
            user: null,

            accessToken: null,

            isAuthenticated: false,
          });
        } finally {
          set({
            isInitialized: true,

            isLoading: false,
          });
        }
      },

    /* =======================================================
       CLEAR ERROR
    ======================================================= */

    clearError: () => {
      set({
        error: null,
      });
    },
  }));

/* =========================================================
   AUTH ERROR MESSAGE
========================================================= */

function getAuthErrorMessage(
  error: unknown,
): string {
  if (
    error instanceof ApiError
  ) {
    return error.message;
  }

  if (
    error instanceof Error
  ) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}