"use client";

import Link from "next/link";
import { useEffect } from "react";

import {
  ChevronRight,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";

import {
  mainNavigation,
} from "@/config/navigation";

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
   COMPONENT
========================================================= */

export function MobileMenu({
  isOpen,
  onClose,
  onOpen,
}: MobileMenuProps) {
  const user = useAuthStore(
    (state) => state.user,
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const isInitialized = useAuthStore(
    (state) => state.isInitialized,
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

    document.body.style.overflow =
      "hidden";

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
      .map(
        (part) =>
          part
            .charAt(0)
            .toUpperCase(),
      )
      .join("") || "A";

  /* =======================================================
     ACCOUNT LINK
  ======================================================= */

  const accountHref =
    isInitialized &&
    isAuthenticated &&
    user
      ? "/account"
      : "/login";

  return (
    <>
      {/* =====================================================
          HAMBURGER BUTTON
      ===================================================== */}

      <button
        type="button"
        onClick={onOpen}
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          text-[var(--color-charcoal)]
          transition-colors
          duration-300
          hover:text-[var(--color-rose-dark)]
          lg:hidden
        "
      >
        {isOpen ? (
          <X
            size={20}
            strokeWidth={1.35}
          />
        ) : (
          <Menu
            size={20}
            strokeWidth={1.35}
          />
        )}
      </button>

      {/* =====================================================
          MOBILE DRAWER
      ===================================================== */}

      <div
        className={`
          fixed
          inset-0
          z-[100]
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
          className={`
            absolute
            inset-0
            bg-[rgba(23,23,23,0.28)]
            transition-opacity
            duration-300
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
            w-full
            max-w-[390px]
            flex-col
            border-r
            border-[var(--color-border)]
            bg-[var(--color-ivory)]
            shadow-[10px_0_40px_rgba(23,23,23,0.10)]
            transition-transform
            duration-300
            ease-out
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
              items-center
              justify-between
              border-b
              border-[var(--color-border)]
              px-5
              py-4
              sm:px-7
            "
          >
            <div>
              <p
                className="
                  font-[var(--font-display)]
                  text-[25px]
                  leading-none
                  tracking-[-0.02em]
                  text-[var(--color-charcoal)]
                "
              >
                Aayesha
              </p>

              <p
                className="
                  mt-1.5
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.28em]
                  text-[var(--color-muted)]
                "
              >
                Fashion
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                border
                border-[var(--color-border)]
                text-[var(--color-secondary)]
                transition-colors
                duration-300
                hover:bg-[var(--color-charcoal)]
                hover:text-white
              "
            >
              <X
                size={18}
                strokeWidth={1.35}
              />
            </button>
          </div>

          {/* =================================================
              ACCOUNT
          ================================================= */}

          <div className="px-5 pt-5 sm:px-7">
            <Link
              href={accountHref}
              onClick={onClose}
              className="
                flex
                items-center
                gap-3
                border
                border-[var(--color-border)]
                bg-white
                px-4
                py-4
                transition-colors
                duration-300
                hover:bg-[var(--color-cream)]
              "
            >
              {isInitialized &&
              isAuthenticated &&
              user ? (
                <>
                  <span
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      border
                      border-[var(--color-rose)]
                      bg-[var(--color-rose-light)]
                      font-[var(--font-display)]
                      text-base
                      text-[var(--color-charcoal)]
                    "
                  >
                    {initials}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className="
                        block
                        truncate
                        text-sm
                        font-semibold
                        text-[var(--color-charcoal)]
                      "
                    >
                      {user.name}
                    </span>

                    <span
                      className="
                        mt-0.5
                        block
                        truncate
                        text-[10px]
                        text-[var(--color-secondary)]
                      "
                    >
                      View your account
                    </span>
                  </span>
                </>
              ) : (
                <>
                  <span
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      border
                      border-[var(--color-border)]
                      bg-[var(--color-cream)]
                      text-[var(--color-charcoal)]
                    "
                  >
                    <UserRound
                      size={17}
                      strokeWidth={1.35}
                    />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className="
                        block
                        text-sm
                        font-semibold
                        text-[var(--color-charcoal)]
                      "
                    >
                      Sign In
                    </span>

                    <span
                      className="
                        mt-0.5
                        block
                        text-[10px]
                        text-[var(--color-secondary)]
                      "
                    >
                      Access your account
                    </span>
                  </span>
                </>
              )}

              <ChevronRight
                size={16}
                strokeWidth={1.4}
                className="
                  shrink-0
                  text-[var(--color-secondary)]
                "
              />
            </Link>
          </div>

          {/* =================================================
              MAIN NAVIGATION
          ================================================= */}

          <nav
            className="
              mt-6
              px-5
              sm:px-7
            "
            aria-label="Mobile navigation"
          >
            <p
              className="
                mb-3
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-[var(--color-muted)]
              "
            >
              Explore
            </p>

            <div
              className="
                overflow-hidden
                border-y
                border-[var(--color-border)]
                bg-white
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
                      px-4
                      py-4
                      last:border-b-0
                      transition-colors
                      duration-300
                      hover:bg-[var(--color-cream)]
                    "
                  >
                    <span
                      className="
                        text-sm
                        font-medium
                        text-[var(--color-charcoal)]
                      "
                    >
                      {item.label}
                    </span>

                    <ChevronRight
                      size={15}
                      strokeWidth={1.4}
                      className="
                        text-[var(--color-secondary)]
                        transition-transform
                        duration-300
                        group-hover:translate-x-0.5
                      "
                    />
                  </Link>
                ),
              )}
            </div>
          </nav>

          {/* =================================================
              QUICK LINKS
          ================================================= */}

          <div
            className="
              mt-5
              px-5
              sm:px-7
            "
          >
            <div
              className="
                grid
                grid-cols-2
                gap-2
              "
            >
              <Link
                href="/search"
                onClick={onClose}
                className="
                  flex
                  items-center
                  gap-3
                  border
                  border-[var(--color-border)]
                  bg-white
                  px-3
                  py-3.5
                  text-xs
                  font-medium
                  text-[var(--color-charcoal)]
                  transition-colors
                  duration-300
                  hover:bg-[var(--color-cream)]
                "
              >
                <Search
                  size={16}
                  strokeWidth={1.35}
                />

                Search
              </Link>

              <Link
                href="/wishlist"
                onClick={onClose}
                className="
                  flex
                  items-center
                  gap-3
                  border
                  border-[var(--color-border)]
                  bg-white
                  px-3
                  py-3.5
                  text-xs
                  font-medium
                  text-[var(--color-charcoal)]
                  transition-colors
                  duration-300
                  hover:bg-[var(--color-cream)]
                "
              >
                <Heart
                  size={16}
                  strokeWidth={1.35}
                />

                Wishlist
              </Link>

              <Link
                href="/cart"
                onClick={onClose}
                className="
                  col-span-2
                  flex
                  items-center
                  justify-between
                  border
                  border-[var(--color-charcoal)]
                  bg-[var(--color-charcoal)]
                  px-4
                  py-3.5
                  text-xs
                  font-semibold
                  text-white
                  transition-opacity
                  duration-300
                  hover:opacity-90
                "
              >
                <span className="flex items-center gap-3">
                  <ShoppingBag
                    size={16}
                    strokeWidth={1.35}
                  />

                  Shopping Bag
                </span>

                <ChevronRight
                  size={15}
                  strokeWidth={1.35}
                />
              </Link>
            </div>
          </div>

          {/* =================================================
              BOTTOM
          ================================================= */}

          <div
            className="
              mt-auto
              border-t
              border-[var(--color-border)]
              bg-[var(--color-cream)]
              px-5
              py-5
              sm:px-7
            "
          >
            <p
              className="
                max-w-[300px]
                text-[9px]
                leading-4
                uppercase
                tracking-[0.12em]
                text-[var(--color-muted)]
              "
            >
              {siteConfig.description}
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}