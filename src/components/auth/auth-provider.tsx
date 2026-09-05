"use client";

import {
  useEffect,
  type ReactNode,
} from "react";

import {
  useAuthStore,
} from "@/store/auth-store";

/* =========================================================
   TYPES
========================================================= */

type AuthProviderProps = {
  children: ReactNode;
};

/* =========================================================
   PROVIDER
========================================================= */

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const initializeAuth =
    useAuthStore(
      (state) =>
        state.initializeAuth,
    );

  useEffect(() => {
    void initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
}