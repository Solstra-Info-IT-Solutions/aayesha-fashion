"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  ChevronRight,
  Heart,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { WishlistCount } from "./wishlist-count";
import { CartCount } from "./cart-count";
import { AccountPopup } from "./account-popup";

import { useAuthStore } from "@/store/auth-store";

/* =========================================================
   COMPONENT
========================================================= */

export function HeaderActions() {
  const router = useRouter();

  /* =======================================================
     AUTH STATE
  ======================================================= */

  const user = useAuthStore(
    (state) => state.user,
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const isInitialized = useAuthStore(
    (state) => state.isInitialized,
  );

  const loggedIn =
    isInitialized &&
    isAuthenticated &&
    Boolean(user);

  /* =======================================================
     LOCAL STATE
  ======================================================= */

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [accountOpen, setAccountOpen] =
    useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [query, setQuery] =
    useState("");

  const inputRef =
    useRef<HTMLInputElement>(null);

  const accountWrapperRef =
    useRef<HTMLDivElement>(null);

  /* =======================================================
     SEARCH FOCUS
  ======================================================= */

  useEffect(() => {
    if (!searchOpen) return;

    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 80);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchOpen]);

  /* =======================================================
     ESCAPE KEY
  ======================================================= */

  useEffect(() => {
    if (
      !searchOpen &&
      !accountOpen &&
      !mobileMenuOpen
    ) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key !== "Escape") return;

      setSearchOpen(false);
      setAccountOpen(false);
      setMobileMenuOpen(false);
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
  }, [
    searchOpen,
    accountOpen,
    mobileMenuOpen,
  ]);

  /* =======================================================
     ACCOUNT OUTSIDE CLICK
  ======================================================= */

  useEffect(() => {
    if (!accountOpen) return;

    const handlePointerDown = (
      event: MouseEvent,
    ) => {
      const target =
        event.target as Node;

      if (
        accountWrapperRef.current &&
        !accountWrapperRef.current.contains(
          target,
        )
      ) {
        setAccountOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handlePointerDown,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handlePointerDown,
      );
    };
  }, [accountOpen]);

  /* =======================================================
     BODY SCROLL LOCK
  ======================================================= */

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [mobileMenuOpen]);

  /* =======================================================
     SEARCH
  ======================================================= */

  const openSearch = () => {
    setAccountOpen(false);
    setMobileMenuOpen(false);
    setSearchOpen(true);
  };

  const closeSearch = () => {
    setSearchOpen(false);
  };

  const handleSearchSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const trimmedQuery =
      query.trim();

    if (!trimmedQuery) return;

    setSearchOpen(false);

    router.push(
      `/search?q=${encodeURIComponent(
        trimmedQuery,
      )}`,
    );
  };

  /* =======================================================
     ACCOUNT
  ======================================================= */

  const handleAccountClick = () => {
    if (!isInitialized) return;

    setSearchOpen(false);
    setMobileMenuOpen(false);

    setAccountOpen(
      (current) => !current,
    );
  };

  /* =======================================================
     MOBILE MENU
  ======================================================= */

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const navigateFromMobileMenu =
    (href: string) => {
      setMobileMenuOpen(false);
      router.push(href);
    };

  /* =======================================================
     ACCOUNT LABEL
  ======================================================= */

  const accountLabel =
    isInitialized && loggedIn
      ? `Account for ${user?.name ?? "customer"}`
      : "Sign in or account";

  return (
    <>
      {/* ===================================================
          HEADER ACTIONS
      =================================================== */}

      <div
        className="
          flex
          items-center
          gap-0
        "
      >
        {/* =================================================
            SEARCH
        ================================================= */}

        <button
          type="button"
          onClick={openSearch}
          aria-label="Search"
          aria-expanded={searchOpen}
          className="
            group
            relative
            flex
            h-10
            w-10
            items-center
            justify-center
            text-[var(--color-text)]
            transition-colors
            duration-[var(--duration-base)]
            hover:text-[var(--color-accent)]
          "
        >
          <Search
            size={18}
            strokeWidth={1.25}
            className="
              transition-transform
              duration-[var(--duration-base)]
              ease-[var(--ease-luxury)]
              group-hover:scale-[1.06]
            "
          />
        </button>

        {/* =================================================
            ACCOUNT
        ================================================= */}

        <div
          ref={accountWrapperRef}
          className="
            relative
            hidden
            sm:block
          "
        >
          <button
            type="button"
            onClick={handleAccountClick}
            aria-label={accountLabel}
            aria-expanded={
              isInitialized
                ? accountOpen
                : undefined
            }
            aria-haspopup={
              isInitialized
                ? "menu"
                : undefined
            }
            className="
              group
              relative
              flex
              h-10
              w-10
              items-center
              justify-center
              text-[var(--color-text)]
              transition-colors
              duration-[var(--duration-base)]
              hover:text-[var(--color-accent)]
            "
          >
            <UserRound
              size={18}
              strokeWidth={1.25}
              className="
                transition-transform
                duration-[var(--duration-base)]
                ease-[var(--ease-luxury)]
                group-hover:scale-[1.06]
              "
            />

            {isInitialized && loggedIn && (
              <span
                aria-hidden="true"
                className="
                  absolute
                  right-[7px]
                  top-[7px]
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[var(--color-accent)]
                "
              />
            )}
          </button>

          {/* LOGGED-IN ACCOUNT */}

          {isInitialized && loggedIn ? (
            <AccountPopup
              isOpen={accountOpen}
              onClose={() =>
                setAccountOpen(false)
              }
            />
          ) : null}

          {/* GUEST ACCOUNT */}

          {isInitialized &&
          !loggedIn &&
          accountOpen ? (
            <GuestAccountPopup
              onClose={() =>
                setAccountOpen(false)
              }
            />
          ) : null}
        </div>

        {/* =================================================
            WISHLIST
        ================================================= */}

        <Link
          href="/wishlist"
          aria-label="Wishlist"
          onClick={() => {
            setMobileMenuOpen(false);
            setAccountOpen(false);
          }}
          className="
            group
            relative
            flex
            h-10
            w-10
            items-center
            justify-center
            text-[var(--color-text)]
            transition-colors
            duration-[var(--duration-base)]
            hover:text-[var(--color-accent)]
          "
        >
          <Heart
            size={18}
            strokeWidth={1.25}
            className="
              transition-transform
              duration-[var(--duration-base)]
              ease-[var(--ease-luxury)]
              group-hover:scale-[1.06]
            "
          />

          <WishlistCount />
        </Link>

        {/* =================================================
            SHOPPING BAG
        ================================================= */}

        <Link
          href="/cart"
          aria-label="Shopping bag"
          onClick={() => {
            setMobileMenuOpen(false);
            setAccountOpen(false);
          }}
          className="
            group
            relative
            flex
            h-10
            w-10
            items-center
            justify-center
            text-[var(--color-text)]
            transition-colors
            duration-[var(--duration-base)]
            hover:text-[var(--color-accent)]
          "
        >
          <ShoppingBag
            size={18}
            strokeWidth={1.25}
            className="
              transition-transform
              duration-[var(--duration-base)]
              ease-[var(--ease-luxury)]
              group-hover:scale-[1.06]
            "
          />

          <CartCount />
        </Link>
      </div>

      {/* =====================================================
          MOBILE MENU PANEL
      ===================================================== */}

      {mobileMenuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMobileMenu}
            className="
              fixed
              inset-0
              z-[55]
              bg-black/15
              backdrop-blur-[1px]
              sm:hidden
            "
          />

          <div
            className="
              fixed
              inset-x-0
              top-0
              z-[60]
              border-b
              border-[var(--color-border)]
              bg-[var(--color-bg)]
              shadow-[var(--shadow-lg)]
              sm:hidden
            "
          >
            {/* =================================================
                PANEL HEADER
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
              "
            >
              <div>
                <p
                  className="
                    font-display
                    text-[25px]
                    leading-none
                    tracking-[-0.025em]
                    text-[var(--color-text)]
                  "
                >
                  Aayesha Fashion
                </p>

                <p
                  className="
                    mt-1.5
                    font-body
                    text-[8px]
                    font-medium
                    uppercase
                    tracking-[0.22em]
                    text-[var(--color-text-muted)]
                  "
                >
                  Discover your style
                </p>
              </div>

              <button
                type="button"
                onClick={closeMobileMenu}
                aria-label="Close menu"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  border
                  border-[var(--color-border)]
                  text-[var(--color-text-secondary)]
                  transition-colors
                  duration-[var(--duration-base)]
                  hover:bg-[var(--color-bg-soft)]
                  hover:text-[var(--color-text)]
                "
              >
                <X
                  size={18}
                  strokeWidth={1.25}
                />
              </button>
            </div>

            {/* =================================================
                ACCOUNT
            ================================================= */}

            <div className="px-5 pt-5">
              {isInitialized && loggedIn ? (
                <button
                  type="button"
                  onClick={() =>
                    navigateFromMobileMenu(
                      "/account",
                    )
                  }
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    border
                    border-[var(--color-border)]
                    bg-[var(--color-surface)]
                    px-4
                    py-4
                    text-left
                  "
                >
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
                      text-[var(--color-text)]
                    "
                  >
                    {user?.name
                      ?.trim()
                      .split(/\s+/)
                      .slice(0, 2)
                      .map(
                        (part) =>
                          part
                            .charAt(0)
                            .toUpperCase(),
                      )
                      .join("") || "A"}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className="
                        block
                        truncate
                        font-body
                        text-sm
                        font-medium
                        text-[var(--color-text)]
                      "
                    >
                      {user?.name ||
                        "My Account"}
                    </span>

                    <span
                      className="
                        mt-0.5
                        block
                        truncate
                        font-body
                        text-[10px]
                        text-[var(--color-text-secondary)]
                      "
                    >
                      View your account
                    </span>
                  </span>

                  <ChevronRight
                    size={16}
                    strokeWidth={1.4}
                    className="
                      shrink-0
                      text-[var(--color-text-secondary)]
                    "
                  />
                </button>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p
                      className="
                        eyebrow
                        text-[var(--color-text-muted)]
                      "
                    >
                      Your Account
                    </p>

                    <p
                      className="
                        mt-1.5
                        font-body
                        text-xs
                        leading-5
                        text-[var(--color-text-secondary)]
                      "
                    >
                      Sign in or create an account
                      to manage your orders and
                      details.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      onClick={closeMobileMenu}
                      className="
                        flex
                        h-11
                        items-center
                        justify-center
                        border
                        border-[var(--color-text)]
                        bg-[var(--color-text)]
                        font-body
                        text-[10px]
                        font-medium
                        uppercase
                        tracking-[0.16em]
                        text-[var(--color-text-inverse)]
                        transition-opacity
                        duration-[var(--duration-base)]
                        hover:opacity-90
                      "
                    >
                      Sign In
                    </Link>

                    <Link
                      href="/register"
                      onClick={closeMobileMenu}
                      className="
                        flex
                        h-11
                        items-center
                        justify-center
                        border
                        border-[var(--color-border)]
                        bg-[var(--color-surface)]
                        font-body
                        text-[10px]
                        font-medium
                        uppercase
                        tracking-[0.16em]
                        text-[var(--color-text)]
                        transition-colors
                        duration-[var(--duration-base)]
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
                NAVIGATION
            ================================================= */}

            <nav
              className="px-5 py-5"
              aria-label="Mobile navigation"
            >
              <p
                className="
                  eyebrow
                  mb-3
                  text-[var(--color-text-muted)]
                "
              >
                Explore
              </p>

              <div
                className="
                  overflow-hidden
                  border-y
                  border-[var(--color-border)]
                  bg-[var(--color-surface)]
                "
              >
                <MobileNavigationItem
                  label="Shop"
                  onClick={() =>
                    navigateFromMobileMenu(
                      "/shop",
                    )
                  }
                />

                <MobileNavigationItem
                  label="Collections"
                  onClick={() =>
                    navigateFromMobileMenu(
                      "/collections",
                    )
                  }
                />

                <div
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    border-b
                    border-[var(--color-border)]
                    px-4
                    py-4
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      navigateFromMobileMenu(
                        "/wishlist",
                      )
                    }
                    className="
                      flex
                      min-w-0
                      flex-1
                      items-center
                      justify-between
                      text-left
                    "
                  >
                    <span
                      className="
                        font-body
                        text-sm
                        text-[var(--color-text)]
                      "
                    >
                      Wishlist
                    </span>

                    <WishlistCount />
                  </button>

                  <ChevronRight
                    size={15}
                    strokeWidth={1.4}
                    className="
                      ml-3
                      shrink-0
                      text-[var(--color-text-secondary)]
                    "
                  />
                </div>

                <div
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    px-4
                    py-4
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      navigateFromMobileMenu(
                        "/cart",
                      )
                    }
                    className="
                      flex
                      min-w-0
                      flex-1
                      items-center
                      justify-between
                      text-left
                    "
                  >
                    <span
                      className="
                        font-body
                        text-sm
                        text-[var(--color-text)]
                      "
                    >
                      Shopping Bag
                    </span>

                    <CartCount />
                  </button>

                  <ChevronRight
                    size={15}
                    strokeWidth={1.4}
                    className="
                      ml-3
                      shrink-0
                      text-[var(--color-text-secondary)]
                    "
                  />
                </div>
              </div>
            </nav>

            {/* =================================================
                MOBILE FOOTER
            ================================================= */}

            <div
              className="
                border-t
                border-[var(--color-border)]
                bg-[var(--color-bg-soft)]
                px-5
                py-4
              "
            >
              <div className="flex items-center justify-between gap-4">
                <p
                  className="
                    font-body
                    text-[9px]
                    uppercase
                    tracking-[0.16em]
                    text-[var(--color-text-muted)]
                  "
                >
                  Timeless. Elegant. Yours.
                </p>

                <button
                  type="button"
                  onClick={openSearch}
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    font-body
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.15em]
                    text-[var(--color-text)]
                  "
                >
                  Search

                  <ArrowUpRight
                    size={12}
                    strokeWidth={1.3}
                  />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* =====================================================
          SEARCH PANEL
      ===================================================== */}

      {searchOpen && (
        <>
          <button
            type="button"
            aria-label="Close search"
            onClick={closeSearch}
            className="
              fixed
              inset-0
              z-[55]
              bg-black/15
              backdrop-blur-[1px]
            "
          />

          <div
            className="
              absolute
              left-0
              right-0
              top-full
              z-[60]
              border-b
              border-[var(--color-border)]
              bg-[var(--color-bg)]
              shadow-[var(--shadow-md)]
            "
          >
            <div
              className="
                mx-auto
                max-w-[1600px]
                px-5
                sm:px-8
                md:px-10
                lg:px-12
                xl:px-16
              "
            >
              <div
                className="
                  border-t
                  border-[var(--color-border)]
                  py-5
                  sm:py-6
                "
              >
                <div className="flex items-center justify-between gap-6">
                  <form
                    onSubmit={
                      handleSearchSubmit
                    }
                    className="min-w-0 flex-1"
                  >
                    <div className="flex items-center gap-4">
                      <Search
                        size={19}
                        strokeWidth={1.2}
                        className="
                          shrink-0
                          text-[var(--color-text-secondary)]
                        "
                      />

                      <input
                        ref={inputRef}
                        type="search"
                        value={query}
                        onChange={(event) =>
                          setQuery(
                            event.target.value,
                          )
                        }
                        placeholder="Search pieces, collections or styles"
                        aria-label="Search products"
                        autoComplete="off"
                        className="
                          min-w-0
                          flex-1
                          border-0
                          bg-transparent
                          p-0
                          font-body
                          text-[15px]
                          font-normal
                          text-[var(--color-text)]
                          outline-none
                          placeholder:text-[var(--color-text-muted)]
                          sm:text-[17px]
                        "
                      />

                      {query.trim() && (
                        <button
                          type="submit"
                          className="
                            hidden
                            items-center
                            gap-2
                            font-body
                            text-[10px]
                            font-medium
                            uppercase
                            tracking-[0.18em]
                            text-[var(--color-text)]
                            transition-colors
                            duration-[var(--duration-base)]
                            hover:text-[var(--color-accent)]
                            sm:inline-flex
                          "
                        >
                          Search

                          <ArrowUpRight
                            size={14}
                            strokeWidth={1.3}
                          />
                        </button>
                      )}
                    </div>

                    <div
                      className="
                        mt-4
                        h-px
                        bg-[var(--color-border)]
                      "
                    />

                    <div className="mt-3 flex items-center justify-between gap-4">
                      <p
                        className="
                          font-body
                          text-[9px]
                          uppercase
                          tracking-[0.16em]
                          text-[var(--color-text-muted)]
                        "
                      >
                        Try “anarkali”, “ivory”
                        or “festive”
                      </p>

                      <p
                        className="
                          hidden
                          font-body
                          text-[9px]
                          uppercase
                          tracking-[0.16em]
                          text-[var(--color-text-muted)]
                          sm:block
                        "
                      >
                        Press Enter to search
                      </p>
                    </div>
                  </form>

                  <button
                    type="button"
                    onClick={closeSearch}
                    aria-label="Close search"
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      text-[var(--color-text-secondary)]
                      transition-colors
                      duration-[var(--duration-base)]
                      hover:text-[var(--color-text)]
                    "
                  >
                    <X
                      size={19}
                      strokeWidth={1.2}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

/* =========================================================
   MOBILE NAVIGATION ITEM
========================================================= */

function MobileNavigationItem({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex
        w-full
        items-center
        justify-between
        border-b
        border-[var(--color-border)]
        px-4
        py-4
        text-left
        transition-colors
        duration-[var(--duration-base)]
        hover:bg-[var(--color-bg-soft)]
      "
    >
      <span
        className="
          font-body
          text-sm
          text-[var(--color-text)]
        "
      >
        {label}
      </span>

      <ChevronRight
        size={15}
        strokeWidth={1.4}
        className="
          text-[var(--color-text-secondary)]
        "
      />
    </button>
  );
}

/* =========================================================
   GUEST ACCOUNT POPUP
========================================================= */

function GuestAccountPopup({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div
      className="
        absolute
        right-0
        top-[calc(100%+14px)]
        z-[100]
        w-[340px]
        max-w-[calc(100vw-32px)]
      "
    >
      <div
        className="
          overflow-hidden
          border
          border-[var(--color-border)]
          bg-[var(--color-bg)]
          shadow-[var(--shadow-lg)]
        "
      >
        {/* HEADER */}

        <div
          className="
            relative
            border-b
            border-[var(--color-border)]
            bg-[var(--color-surface)]
            px-5
            py-5
          "
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close account menu"
            className="
              absolute
              right-4
              top-4
              flex
              h-8
              w-8
              items-center
              justify-center
              text-[var(--color-text-secondary)]
              transition-colors
              duration-[var(--duration-base)]
              hover:bg-[var(--color-bg-soft)]
              hover:text-[var(--color-text)]
            "
          >
            <X
              size={16}
              strokeWidth={1.4}
            />
          </button>

          <div className="pr-8">
            <p
              className="
                eyebrow
                text-[var(--color-accent)]
              "
            >
              Your Account
            </p>

            <h3
              className="
                mt-2.5
                font-display
                text-3xl
                leading-none
                tracking-[-0.025em]
                text-[var(--color-text)]
              "
            >
              Welcome to Aayesha
            </h3>

            <p
              className="
                mt-4
                max-w-[270px]
                font-body
                text-xs
                leading-6
                text-[var(--color-text-secondary)]
              "
            >
              Sign in to manage your orders,
              addresses and account details, or
              create a new account to get started.
            </p>
          </div>
        </div>

        {/* AUTH ACTIONS */}

        <div
          className="
            border-b
            border-[var(--color-border)]
            bg-[var(--color-surface)]
            p-4
          "
        >
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
                font-body
                text-[9px]
                font-medium
                uppercase
                tracking-[0.17em]
                text-[var(--color-text-inverse)]
                transition-opacity
                duration-[var(--duration-base)]
                hover:opacity-90
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
                bg-[var(--color-bg)]
                font-body
                text-[9px]
                font-medium
                uppercase
                tracking-[0.17em]
                text-[var(--color-text)]
                transition-colors
                duration-[var(--duration-base)]
                hover:bg-[var(--color-bg-soft)]
              "
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* ACCOUNT BENEFITS */}

        <div
          className="
            bg-[var(--color-bg)]
            px-5
            py-5
          "
        >
          <p
            className="
              eyebrow
              text-[var(--color-text-muted)]
            "
          >
            With an account
          </p>

          <div className="mt-4 space-y-3">
            <GuestBenefit
              title="Track your orders"
              description="View order status and history."
            />

            <GuestBenefit
              title="Save your addresses"
              description="Checkout faster with saved details."
            />

            <GuestBenefit
              title="Manage your profile"
              description="Keep your account information updated."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   GUEST BENEFIT
========================================================= */

function GuestBenefit({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="
          mt-1
          h-1.5
          w-1.5
          shrink-0
          rounded-full
          bg-[var(--color-accent)]
        "
      />

      <div>
        <p
          className="
            font-body
            text-[11px]
            font-medium
            text-[var(--color-text)]
          "
        >
          {title}
        </p>

        <p
          className="
            mt-0.5
            font-body
            text-[10px]
            leading-5
            text-[var(--color-text-secondary)]
          "
        >
          {description}
        </p>
      </div>
    </div>
  );
}