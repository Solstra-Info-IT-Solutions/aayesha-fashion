"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  ChevronRight,
  Heart,
  LogOut,
  MapPin,
  Menu,
  Search,
  ShoppingBag,
  User,
  UserCog,
  UserRound,
  X,
} from "lucide-react";

import { mainNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { useAuthStore } from "@/store/auth-store";

/* =========================================================
   TYPES
========================================================= */

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

/* =========================================================
   ACCOUNT LINKS
========================================================= */

const accountLinks = [
  {
    label: "Your Orders",
    href: "/account/orders",
    description: "View and track orders",
    icon: ShoppingBag,
  },
  {
    label: "Profile Details",
    href: "/account",
    description: "Your personal information",
    icon: User,
  },
  {
    label: "Saved Addresses",
    href: "/account/addresses",
    description: "Manage delivery addresses",
    icon: MapPin,
  },
  {
    label: "Edit Account",
    href: "/account/edit",
    description: "Update account details",
    icon: UserCog,
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export function MobileMenu({
  isOpen,
  onClose,
  onOpen,
}: MobileMenuProps) {
  const router = useRouter();

  const [isLoggingOut, setIsLoggingOut] =
    useState(false);

  const user = useAuthStore(
    (state) => state.user,
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const isInitialized = useAuthStore(
    (state) => state.isInitialized,
  );

  const logout = useAuthStore(
    (state) => state.logout,
  );

  /* =======================================================
     BODY SCROLL LOCK
  ======================================================= */

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [isOpen]);

  /* =======================================================
     ESCAPE KEY
  ======================================================= */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [isOpen, onClose]);

  /* =======================================================
     INITIALS
  ======================================================= */

  const initials =
    user?.name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) =>
        part.charAt(0).toUpperCase(),
      )
      .join("") || "A";

  /* =======================================================
     AUTH STATE
  ======================================================= */

  const isLoggedIn =
    isInitialized &&
    isAuthenticated &&
    !!user;

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await logout();

      toast.success(
        "You have been signed out.",
      );

      onClose();

      router.push("/");
      router.refresh();
    } catch {
      toast.error(
        "Unable to sign out. Please try again.",
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* =====================================================
          HAMBURGER BUTTON
      ===================================================== */}

      <button
        type="button"
        onClick={isOpen ? onClose : onOpen}
        aria-label={
          isOpen
            ? "Close navigation menu"
            : "Open navigation menu"
        }
        aria-expanded={isOpen}
        className="
          group
          flex
          h-10
          w-10
          items-center
          justify-center
          text-[var(--color-text)]
          transition-all
          duration-[var(--duration-base)]
          hover:text-[var(--color-accent)]
          lg:hidden
        "
      >
        <span
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            transition-transform
            duration-[var(--duration-base)]
            group-hover:scale-[1.04]
          "
        >
          {isOpen ? (
            <X
              size={20}
              strokeWidth={1.25}
            />
          ) : (
            <Menu
              size={20}
              strokeWidth={1.25}
            />
          )}
        </span>
      </button>

      {/* =====================================================
          MOBILE DRAWER
      ===================================================== */}

      <div
        className={`
          fixed
          inset-0
          z-[var(--z-drawer)]
          lg:hidden
          ${
            isOpen
              ? "pointer-events-auto"
              : "pointer-events-none"
          }
        `}
        aria-hidden={!isOpen}
      >
        {/* ===================================================
            BACKDROP
        =================================================== */}

        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          tabIndex={isOpen ? 0 : -1}
          className={`
            absolute
            inset-0
            bg-[rgba(33,31,29,0.38)]
            backdrop-blur-[2px]
            transition-opacity
            duration-[var(--duration-slow)]
            ${
              isOpen
                ? "opacity-100"
                : "opacity-0"
            }
          `}
        />

        {/* ===================================================
            DRAWER
        =================================================== */}

        <aside
          className={`
            relative
            flex
            h-full
            w-[88vw]
            max-w-[430px]
            flex-col
            border-r
            border-[var(--color-border)]
            bg-[var(--color-bg)]
            shadow-[var(--shadow-lg)]
            transition-transform
            duration-[var(--duration-luxury)]
            ease-[var(--ease-luxury)]
            ${
              isOpen
                ? "translate-x-0"
                : "-translate-x-full"
            }
          `}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          {/* =================================================
              DRAWER HEADER
          ================================================= */}

          <div
            className="
              flex
              shrink-0
              items-center
              justify-between
              border-b
              border-[var(--color-border)]
              px-5
              py-5
              sm:px-7
            "
          >
            <Link
              href="/"
              onClick={onClose}
              className="group block"
              aria-label="Aayesha Fashion home"
            >
              <p
                className="
                  font-display
                  text-[30px]
                  font-medium
                  leading-none
                  tracking-[-0.03em]
                  text-[var(--color-text)]
                  transition-colors
                  duration-[var(--duration-base)]
                  group-hover:text-[var(--color-accent)]
                "
              >
                Aayesha
              </p>

              <p
                className="
                  mt-1.5
                  font-body
                  text-[7px]
                  font-semibold
                  uppercase
                  tracking-[0.32em]
                  text-[var(--color-text-muted)]
                "
              >
                Fashion
              </p>
            </Link>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="
                group
                flex
                h-9
                w-9
                items-center
                justify-center
                border
                border-[var(--color-border)]
                bg-transparent
                text-[var(--color-text-secondary)]
                transition-all
                duration-[var(--duration-base)]
                hover:border-[var(--color-text)]
                hover:bg-[var(--color-text)]
                hover:text-[var(--color-text-inverse)]
              "
            >
              <X
                size={17}
                strokeWidth={1.25}
                className="
                  transition-transform
                  duration-[var(--duration-base)]
                  group-hover:rotate-90
                "
              />
            </button>
          </div>

          {/* =================================================
              SCROLLABLE CONTENT
          ================================================= */}

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {/* =================================================
                ACCOUNT / AUTH
            ================================================= */}

            <div className="px-5 pt-6 sm:px-7">
              {isLoggedIn ? (
                <Link
                  href="/account"
                  onClick={onClose}
                  className="
                    group
                    flex
                    items-center
                    gap-3.5
                    border
                    border-[var(--color-border)]
                    bg-[var(--color-surface)]
                    px-4
                    py-4
                    transition-all
                    duration-[var(--duration-base)]
                    hover:border-[var(--color-border-dark)]
                    hover:shadow-[var(--shadow-sm)]
                  "
                >
                  {/* AVATAR */}

                  <span
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      border
                      border-[var(--color-accent-soft)]
                      bg-[var(--color-bg-soft)]
                      font-display
                      text-base
                      font-medium
                      text-[var(--color-text)]
                    "
                  >
                    {initials}
                  </span>

                  {/* USER INFO */}

                  <span className="min-w-0 flex-1">
                    <span
                      className="
                        block
                        truncate
                        font-body
                        text-[12px]
                        font-semibold
                        text-[var(--color-text)]
                      "
                    >
                      {user.name}
                    </span>

                    <span
                      className="
                        mt-1
                        block
                        truncate
                        font-body
                        text-[10px]
                        text-[var(--color-text-secondary)]
                      "
                    >
                      {user.email}
                    </span>
                  </span>

                  <ChevronRight
                    size={16}
                    strokeWidth={1.25}
                    className="
                      shrink-0
                      text-[var(--color-text-muted)]
                      transition-all
                      duration-[var(--duration-base)]
                      group-hover:translate-x-0.5
                      group-hover:text-[var(--color-accent)]
                    "
                  />
                </Link>
              ) : (
                <div className="space-y-4">
                  {/* AUTH HEADING */}

                  <div>
                    <p className="eyebrow">
                      Your Account
                    </p>

                    <p
                      className="
                        mt-2
                        max-w-[330px]
                        font-body
                        text-[11px]
                        leading-5
                        text-[var(--color-text-secondary)]
                      "
                    >
                      Sign in or create an account
                      to manage your orders and
                      personal details.
                    </p>
                  </div>

                  {/* AUTH BUTTONS */}

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      onClick={onClose}
                      className="
                        flex
                        h-11
                        items-center
                        justify-center
                        border
                        border-[var(--color-text)]
                        bg-[var(--color-text)]
                        px-4
                        font-body
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.16em]
                        text-[var(--color-text-inverse)]
                        transition-all
                        duration-[var(--duration-base)]
                        hover:bg-[var(--color-accent-dark)]
                        hover:border-[var(--color-accent-dark)]
                      "
                    >
                      Sign In
                    </Link>

                    <Link
                      href="/register"
                      onClick={onClose}
                      className="
                        flex
                        h-11
                        items-center
                        justify-center
                        border
                        border-[var(--color-border)]
                        bg-[var(--color-surface)]
                        px-4
                        font-body
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.16em]
                        text-[var(--color-text)]
                        transition-all
                        duration-[var(--duration-base)]
                        hover:border-[var(--color-text)]
                        hover:bg-[var(--color-bg-soft)]
                      "
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* =================================================
                ACCOUNT NAVIGATION
            ================================================= */}

            {isLoggedIn && (
              <section className="mt-7 px-5 sm:px-7">
                <div className="mb-3 flex items-end justify-between">
                  <p className="eyebrow">
                    My Account
                  </p>

                  <Link
                    href="/account"
                    onClick={onClose}
                    className="
                      link-luxury
                      font-body
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.12em]
                      text-[var(--color-accent)]
                    "
                  >
                    View All
                  </Link>
                </div>

                <div
                  className="
                    overflow-hidden
                    border
                    border-[var(--color-border)]
                    bg-[var(--color-surface)]
                  "
                >
                  {accountLinks.map(
                    (item, index) => {
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className="
                            group
                            flex
                            items-center
                            gap-3.5
                            px-4
                            py-4
                            transition-colors
                            duration-[var(--duration-base)]
                            hover:bg-[var(--color-bg-soft)]
                          "
                        >
                          {/* ICON */}

                          <span
                            className="
                              flex
                              h-9
                              w-9
                              shrink-0
                              items-center
                              justify-center
                              border
                              border-[var(--color-border)]
                              bg-[var(--color-bg)]
                              text-[var(--color-text-secondary)]
                              transition-all
                              duration-[var(--duration-base)]
                              group-hover:border-[var(--color-accent-soft)]
                              group-hover:bg-[var(--color-accent-soft)]
                              group-hover:text-[var(--color-text)]
                            "
                          >
                            <Icon
                              size={15}
                              strokeWidth={1.35}
                            />
                          </span>

                          {/* TEXT */}

                          <span className="min-w-0 flex-1">
                            <span
                              className="
                                block
                                font-body
                                text-[11px]
                                font-semibold
                                text-[var(--color-text)]
                              "
                            >
                              {item.label}
                            </span>

                            <span
                              className="
                                mt-1
                                block
                                font-body
                                text-[9px]
                                leading-4
                                text-[var(--color-text-muted)]
                              "
                            >
                              {item.description}
                            </span>
                          </span>

                          <ChevronRight
                            size={14}
                            strokeWidth={1.25}
                            className="
                              shrink-0
                              text-[var(--color-text-muted)]
                              transition-all
                              duration-[var(--duration-base)]
                              group-hover:translate-x-0.5
                              group-hover:text-[var(--color-accent)]
                            "
                          />
                        </Link>
                      );
                    },
                  )}

                  {/* SIGN OUT */}

                  <button
                    type="button"
                    onClick={() => {
                      void handleLogout();
                    }}
                    disabled={isLoggingOut}
                    className="
                      group
                      flex
                      w-full
                      items-center
                      gap-3.5
                      border-t
                      border-[var(--color-border)]
                      px-4
                      py-4
                      text-left
                      transition-colors
                      duration-[var(--duration-base)]
                      hover:bg-[var(--color-bg-soft)]
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    <span
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        border
                        border-[var(--color-border)]
                        bg-[var(--color-bg)]
                        text-[var(--color-text-secondary)]
                        transition-all
                        duration-[var(--duration-base)]
                        group-hover:border-[var(--color-accent-soft)]
                        group-hover:bg-[var(--color-accent-soft)]
                        group-hover:text-[var(--color-text)]
                      "
                    >
                      <LogOut
                        size={15}
                        strokeWidth={1.35}
                      />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className="
                          block
                          font-body
                          text-[11px]
                          font-semibold
                          text-[var(--color-text)]
                        "
                      >
                        {isLoggingOut
                          ? "Signing Out..."
                          : "Sign Out"}
                      </span>

                      <span
                        className="
                          mt-1
                          block
                          font-body
                          text-[9px]
                          leading-4
                          text-[var(--color-text-muted)]
                        "
                      >
                        Sign out from this device
                      </span>
                    </span>

                    {!isLoggingOut && (
                      <ChevronRight
                        size={14}
                        strokeWidth={1.25}
                        className="
                          shrink-0
                          text-[var(--color-text-muted)]
                          transition-all
                          duration-[var(--duration-base)]
                          group-hover:translate-x-0.5
                          group-hover:text-[var(--color-accent)]
                        "
                      />
                    )}
                  </button>
                </div>
              </section>
            )}

            {/* =================================================
                MAIN NAVIGATION
            ================================================= */}

            <nav
              className="mt-8 px-5 sm:px-7"
              aria-label="Mobile navigation"
            >
              <p className="eyebrow mb-3">
                Explore
              </p>

              <div
                className="
                  border-y
                  border-[var(--color-border)]
                  bg-[var(--color-surface)]
                "
              >
                {mainNavigation.map(
                  (item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className="
                        group
                        flex
                        items-center
                        justify-between
                        border-b
                        border-[var(--color-border)]
                        px-1
                        py-4.5
                        last:border-b-0
                      "
                    >
                      <span
                        className="
                          font-display
                          text-[22px]
                          font-medium
                          leading-none
                          tracking-[-0.01em]
                          text-[var(--color-text)]
                          transition-colors
                          duration-[var(--duration-base)]
                          group-hover:text-[var(--color-accent)]
                        "
                      >
                        {item.label}
                      </span>

                      <span
                        className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          border
                          border-[var(--color-border)]
                          text-[var(--color-text-muted)]
                          transition-all
                          duration-[var(--duration-base)]
                          group-hover:border-[var(--color-accent-soft)]
                          group-hover:bg-[var(--color-accent-soft)]
                          group-hover:text-[var(--color-text)]
                        "
                      >
                        <ChevronRight
                          size={15}
                          strokeWidth={1.2}
                          className="
                            transition-transform
                            duration-[var(--duration-base)]
                            group-hover:translate-x-0.5
                          "
                        />
                      </span>
                    </Link>
                  ),
                )}
              </div>
            </nav>

            {/* =================================================
                QUICK LINKS
            ================================================= */}

            <div className="mt-7 px-5 sm:px-7">
              <p className="eyebrow mb-3">
                Quick Access
              </p>

              <div className="grid grid-cols-2 gap-2">
                {/* SEARCH */}

                <Link
                  href="/search"
                  onClick={onClose}
                  className="
                    group
                    flex
                    items-center
                    gap-3
                    border
                    border-[var(--color-border)]
                    bg-[var(--color-surface)]
                    px-3.5
                    py-3.5
                    font-body
                    text-[10px]
                    font-medium
                    text-[var(--color-text)]
                    transition-all
                    duration-[var(--duration-base)]
                    hover:border-[var(--color-text)]
                    hover:bg-[var(--color-bg-soft)]
                  "
                >
                  <Search
                    size={15}
                    strokeWidth={1.25}
                    className="
                      text-[var(--color-text-secondary)]
                      transition-colors
                      duration-[var(--duration-base)]
                      group-hover:text-[var(--color-accent)]
                    "
                  />

                  Search
                </Link>

                {/* WISHLIST */}

                <Link
                  href="/wishlist"
                  onClick={onClose}
                  className="
                    group
                    flex
                    items-center
                    gap-3
                    border
                    border-[var(--color-border)]
                    bg-[var(--color-surface)]
                    px-3.5
                    py-3.5
                    font-body
                    text-[10px]
                    font-medium
                    text-[var(--color-text)]
                    transition-all
                    duration-[var(--duration-base)]
                    hover:border-[var(--color-text)]
                    hover:bg-[var(--color-bg-soft)]
                  "
                >
                  <Heart
                    size={15}
                    strokeWidth={1.25}
                    className="
                      text-[var(--color-text-secondary)]
                      transition-colors
                      duration-[var(--duration-base)]
                      group-hover:text-[var(--color-accent)]
                    "
                  />

                  Wishlist
                </Link>

                {/* SHOPPING BAG */}

                <Link
                  href="/cart"
                  onClick={onClose}
                  className="
                    group
                    col-span-2
                    flex
                    items-center
                    justify-between
                    border
                    border-[var(--color-text)]
                    bg-[var(--color-text)]
                    px-4
                    py-3.5
                    font-body
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.14em]
                    text-[var(--color-text-inverse)]
                    transition-all
                    duration-[var(--duration-base)]
                    hover:border-[var(--color-accent-dark)]
                    hover:bg-[var(--color-accent-dark)]
                  "
                >
                  <span className="flex items-center gap-3">
                    <ShoppingBag
                      size={15}
                      strokeWidth={1.25}
                    />

                    Shopping Bag
                  </span>

                  <ChevronRight
                    size={15}
                    strokeWidth={1.25}
                    className="
                      transition-transform
                      duration-[var(--duration-base)]
                      group-hover:translate-x-0.5
                    "
                  />
                </Link>
              </div>
            </div>

            {/* =================================================
                EDITORIAL NOTE
            ================================================= */}

            <div className="px-5 pb-8 pt-8 sm:px-7">
              <div
                className="
                  border-t
                  border-[var(--color-border)]
                  pt-5
                "
              >
                <p
                  className="
                    font-display
                    text-[21px]
                    italic
                    leading-tight
                    text-[var(--color-text)]
                  "
                >
                  Made for moments
                  <br />
                  worth remembering.
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              BOTTOM
          ================================================= */}

          <div
            className="
              shrink-0
              border-t
              border-[var(--color-border)]
              bg-[var(--color-bg-soft)]
              px-5
              py-4
              sm:px-7
            "
          >
            {isLoggedIn ? (
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p
                    className="
                      truncate
                      font-body
                      text-[10px]
                      font-semibold
                      text-[var(--color-text)]
                    "
                  >
                    Signed in as {user.name}
                  </p>

                  <p
                    className="
                      mt-1
                      truncate
                      font-body
                      text-[9px]
                      text-[var(--color-text-muted)]
                    "
                  >
                    {user.email}
                  </p>
                </div>

                <Link
                  href="/account"
                  onClick={onClose}
                  aria-label="Open account"
                  className="
                    group
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    border
                    border-[var(--color-border)]
                    bg-[var(--color-surface)]
                    text-[var(--color-text-secondary)]
                    transition-all
                    duration-[var(--duration-base)]
                    hover:border-[var(--color-text)]
                    hover:bg-[var(--color-text)]
                    hover:text-[var(--color-text-inverse)]
                  "
                >
                  <UserRound
                    size={15}
                    strokeWidth={1.25}
                  />
                </Link>
              </div>
            ) : (
              <p
                className="
                  max-w-[320px]
                  font-body
                  text-[8px]
                  leading-4
                  uppercase
                  tracking-[0.12em]
                  text-[var(--color-text-muted)]
                "
              >
                {siteConfig.description}
              </p>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}