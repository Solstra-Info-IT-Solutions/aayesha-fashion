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

  /*
   * Actual authenticated state.
   *
   * We only consider the customer logged in when:
   * 1. Auth initialization is complete
   * 2. Auth store says authenticated
   * 3. User object exists
   */
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
     AUTH STATE SYNC
  ======================================================= */

  useEffect(() => {
    /*
     * Close desktop account popup when the user
     * becomes logged out.
     */
    if (!loggedIn) {
      /*
       * Do not close the popup here because
       * logged-out users are also allowed to
       * have the account popup open.
       *
       * This state remains controlled by the
       * account button.
       */
      return;
    }
  }, [loggedIn]);

  /* =======================================================
     SEARCH FOCUS
  ======================================================= */

  useEffect(() => {
    if (!searchOpen) {
      return;
    }

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
      if (event.key !== "Escape") {
        return;
      }

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
    if (!accountOpen) {
      return;
    }

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
     BODY SCROLL LOCK FOR MOBILE MENU
  ======================================================= */

  useEffect(() => {
    if (!mobileMenuOpen) {
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

    if (!trimmedQuery) {
      return;
    }

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
    /*
     * Don't do anything until the auth
     * session has finished restoring.
     *
     * This avoids accidentally showing the
     * guest state while refresh is running.
     */
    if (!isInitialized) {
      return;
    }

    /*
     * Close other overlays.
     */
    setSearchOpen(false);
    setMobileMenuOpen(false);

    /*
     * Both authenticated and guest users
     * now get an account popup.
     */
    setAccountOpen(
      (current) => !current,
    );
  };

  /* =======================================================
     MOBILE MENU
  ======================================================= */

  const openMobileMenu = () => {
    setSearchOpen(false);
    setAccountOpen(false);

    setMobileMenuOpen(true);
  };

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
      <div className="flex items-center gap-0.5">
        {/* ===================================================
            SEARCH
        =================================================== */}

        <button
          type="button"
          onClick={openSearch}
          aria-label="Search"
          aria-expanded={searchOpen}
          className="
            relative
            flex
            h-10
            w-10
            items-center
            justify-center
            text-[var(--color-charcoal)]
            transition-colors
            duration-300
            hover:text-[var(--color-rose-dark)]
          "
        >
          <Search
            size={18}
            strokeWidth={1.3}
          />
        </button>

        {/* ===================================================
            ACCOUNT
        =================================================== */}

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
              relative
              flex
              h-10
              w-10
              items-center
              justify-center
              text-[var(--color-charcoal)]
              transition-colors
              duration-300
              hover:text-[var(--color-rose-dark)]
            "
          >
            <UserRound
              size={18}
              strokeWidth={1.3}
            />

            {/* AUTHENTICATED INDICATOR */}

            {isInitialized && loggedIn ? (
              <span
                aria-hidden="true"
                className="
                  absolute
                  right-1.5
                  top-1.5
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[var(--color-rose-dark)]
                "
              />
            ) : null}
          </button>

          {/* =================================================
              LOGGED-IN ACCOUNT POPUP
          ================================================= */}

          {isInitialized && loggedIn ? (
            <AccountPopup
              isOpen={accountOpen}
              onClose={() =>
                setAccountOpen(false)
              }
            />
          ) : null}

          {/* =================================================
              LOGGED-OUT ACCOUNT POPUP
          ================================================= */}

          {isInitialized && !loggedIn && accountOpen ? (
            <GuestAccountPopup
              onClose={() =>
                setAccountOpen(false)
              }
            />
          ) : null}
        </div>

        {/* ===================================================
            WISHLIST
        =================================================== */}

        <Link
          href="/wishlist"
          aria-label="Wishlist"
          onClick={() => {
            setMobileMenuOpen(false);
            setAccountOpen(false);
          }}
          className="
            relative
            flex
            h-10
            w-10
            items-center
            justify-center
            text-[var(--color-charcoal)]
            transition-colors
            duration-300
            hover:text-[var(--color-rose-dark)]
          "
        >
          <Heart
            size={18}
            strokeWidth={1.3}
          />

          <WishlistCount />
        </Link>

        {/* ===================================================
            CART
        =================================================== */}

        <Link
          href="/cart"
          aria-label="Shopping bag"
          onClick={() => {
            setMobileMenuOpen(false);
            setAccountOpen(false);
          }}
          className="
            relative
            flex
            h-10
            w-10
            items-center
            justify-center
            text-[var(--color-charcoal)]
            transition-colors
            duration-300
            hover:text-[var(--color-rose-dark)]
          "
        >
          <ShoppingBag
            size={18}
            strokeWidth={1.3}
          />

          <CartCount />
        </Link>
      </div>

      {/* =======================================================
          MOBILE MENU PANEL
      ======================================================= */}

      {mobileMenuOpen && (
        <>
          {/* BACKDROP */}

          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMobileMenu}
            className="
              fixed
              inset-0
              z-[55]
              bg-black/15
              sm:hidden
            "
          />

          {/* PANEL */}

          <div
            className="
              fixed
              inset-x-0
              top-0
              z-[60]
              border-b
              border-[var(--color-border)]
              bg-[var(--color-ivory)]
              shadow-[0_20px_50px_rgba(23,23,23,0.10)]
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
                    font-[var(--font-display)]
                    text-[24px]
                    leading-none
                    tracking-[-0.02em]
                    text-[var(--color-charcoal)]
                  "
                >
                  Aayesha Fashion
                </p>

                <p
                  className="
                    mt-1.5
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.20em]
                    text-[var(--color-muted)]
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
                  text-[var(--color-secondary)]
                  transition-colors
                  duration-300
                  hover:bg-[var(--color-cream)]
                  hover:text-[var(--color-charcoal)]
                "
              >
                <X
                  size={18}
                  strokeWidth={1.3}
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
                    bg-white
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
                      border-[var(--color-rose)]
                      bg-[var(--color-rose-light)]
                      font-[var(--font-display)]
                      text-base
                      text-[var(--color-charcoal)]
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
                        text-sm
                        font-semibold
                        text-[var(--color-charcoal)]
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
                        text-[10px]
                        text-[var(--color-secondary)]
                      "
                    >
                      View your account
                    </span>
                  </span>

                  <ChevronRight
                    size={16}
                    strokeWidth={1.5}
                    className="
                      shrink-0
                      text-[var(--color-secondary)]
                    "
                  />
                </button>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p
                      className="
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        text-[var(--color-muted)]
                      "
                    >
                      Your Account
                    </p>

                    <p
                      className="
                        mt-1.5
                        text-xs
                        leading-5
                        text-[var(--color-secondary)]
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
                        border-[var(--color-charcoal)]
                        bg-[var(--color-charcoal)]
                        px-4
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.14em]
                        text-white
                        transition-opacity
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
                        bg-white
                        px-4
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.14em]
                        text-[var(--color-charcoal)]
                        transition-colors
                        hover:bg-[var(--color-cream)]
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
                <button
                  type="button"
                  onClick={() =>
                    navigateFromMobileMenu(
                      "/shop",
                    )
                  }
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
                    hover:bg-[var(--color-cream)]
                  "
                >
                  <span className="text-sm text-[var(--color-charcoal)]">
                    Shop
                  </span>

                  <ChevronRight
                    size={15}
                    strokeWidth={1.5}
                    className="text-[var(--color-secondary)]"
                  />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigateFromMobileMenu(
                      "/collections",
                    )
                  }
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
                    hover:bg-[var(--color-cream)]
                  "
                >
                  <span className="text-sm text-[var(--color-charcoal)]">
                    Collections
                  </span>

                  <ChevronRight
                    size={15}
                    strokeWidth={1.5}
                    className="text-[var(--color-secondary)]"
                  />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigateFromMobileMenu(
                      "/wishlist",
                    )
                  }
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
                    hover:bg-[var(--color-cream)]
                  "
                >
                  <span className="text-sm text-[var(--color-charcoal)]">
                    Wishlist
                  </span>

                  <div className="flex items-center gap-3">
                    <WishlistCount />

                    <ChevronRight
                      size={15}
                      strokeWidth={1.5}
                      className="text-[var(--color-secondary)]"
                    />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigateFromMobileMenu(
                      "/cart",
                    )
                  }
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    px-4
                    py-4
                    text-left
                    transition-colors
                    hover:bg-[var(--color-cream)]
                  "
                >
                  <span className="text-sm text-[var(--color-charcoal)]">
                    Shopping Bag
                  </span>

                  <div className="flex items-center gap-3">
                    <CartCount />

                    <ChevronRight
                      size={15}
                      strokeWidth={1.5}
                      className="text-[var(--color-secondary)]"
                    />
                  </div>
                </button>
              </div>
            </nav>

            {/* =================================================
                MOBILE FOOTER
            ================================================= */}

            <div
              className="
                border-t
                border-[var(--color-border)]
                bg-[var(--color-cream)]
                px-5
                py-4
              "
            >
              <div className="flex items-center justify-between gap-4">
                <p
                  className="
                    text-[9px]
                    uppercase
                    tracking-[0.16em]
                    text-[var(--color-muted)]
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
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.15em]
                    text-[var(--color-charcoal)]
                  "
                >
                  Search

                  <ArrowUpRight
                    size={12}
                    strokeWidth={1.4}
                  />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* =======================================================
          SEARCH PANEL
      ======================================================= */}

      {searchOpen && (
        <>
          {/* BACKDROP */}

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

          {/* PANEL */}

          <div
            className="
              absolute
              left-0
              right-0
              top-full
              z-[60]
              border-b
              border-[var(--color-border)]
              bg-[var(--color-ivory)]
              shadow-[0_18px_45px_rgba(23,23,23,0.08)]
            "
          >
            <div className="mx-auto max-w-[1600px] px-5 sm:px-8 md:px-10 lg:px-14 xl:px-20">
              <div className="border-t border-[var(--color-border)] py-5 sm:py-6">
                <div className="flex items-center justify-between gap-6">
                  {/* SEARCH FORM */}

                  <form
                    onSubmit={
                      handleSearchSubmit
                    }
                    className="min-w-0 flex-1"
                  >
                    <div className="flex items-center gap-4">
                      <Search
                        size={19}
                        strokeWidth={1.25}
                        className="
                          shrink-0
                          text-[var(--color-secondary)]
                        "
                      />

                      <input
                        ref={inputRef}
                        type="search"
                        value={query}
                        onChange={(event) =>
                          setQuery(
                            event.target
                              .value,
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
                          text-[15px]
                          font-normal
                          text-[var(--color-charcoal)]
                          outline-none
                          placeholder:text-[var(--color-muted)]
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
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.18em]
                            text-[var(--color-charcoal)]
                            transition-colors
                            duration-300
                            hover:text-[var(--color-rose-dark)]
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

                    <div className="mt-4 h-px bg-[var(--color-border)]" />

                    <div className="mt-3 flex items-center justify-between gap-4">
                      <p className="text-[9px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                        Try “anarkali”, “ivory”
                        or “festive”
                      </p>

                      <p className="hidden text-[9px] uppercase tracking-[0.18em] text-[var(--color-muted)] sm:block">
                        Press Enter to search
                      </p>
                    </div>
                  </form>

                  {/* CLOSE */}

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
                      text-[var(--color-secondary)]
                      transition-colors
                      duration-300
                      hover:text-[var(--color-charcoal)]
                    "
                  >
                    <X
                      size={19}
                      strokeWidth={1.25}
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
          bg-[var(--color-ivory)]
          shadow-[0_20px_55px_rgba(23,23,23,0.14)]
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            relative
            border-b
            border-[var(--color-border)]
            bg-white
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
              text-[var(--color-secondary)]
              transition-colors
              duration-300
              hover:bg-[var(--color-cream)]
              hover:text-[var(--color-charcoal)]
            "
          >
            <X
              size={16}
              strokeWidth={1.5}
            />
          </button>

          <div className="pr-8">
            <p
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.26em]
                text-[var(--color-rose-dark)]
              "
            >
              Your Account
            </p>

            <h3
              className="
                mt-2.5
                font-[var(--font-display)]
                text-3xl
                leading-none
                tracking-[-0.02em]
                text-[var(--color-charcoal)]
              "
            >
              Welcome to Aayesha
            </h3>

            <p
              className="
                mt-4
                max-w-[270px]
                text-xs
                leading-6
                text-[var(--color-secondary)]
              "
            >
              Sign in to manage your orders,
              addresses and account details, or
              create a new account to get started.
            </p>
          </div>
        </div>

        {/* =================================================
            AUTH ACTIONS
        ================================================= */}

        <div
          className="
            border-b
            border-[var(--color-border)]
            bg-white
            p-4
          "
        >
          <div className="grid grid-cols-2 gap-2">
            {/* SIGN IN */}

            <Link
              href="/login"
              onClick={onClose}
              className="
                flex
                h-11
                items-center
                justify-center
                border
                border-[var(--color-charcoal)]
                bg-[var(--color-charcoal)]
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.17em]
                text-white
                transition-opacity
                duration-300
                hover:opacity-90
              "
            >
              Sign In
            </Link>

            {/* SIGN UP */}

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
                bg-[var(--color-ivory)]
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.17em]
                text-[var(--color-charcoal)]
                transition-colors
                duration-300
                hover:bg-[var(--color-cream)]
              "
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* =================================================
            ACCOUNT BENEFITS
        ================================================= */}

        <div
          className="
            bg-[var(--color-ivory)]
            px-5
            py-5
          "
        >
          <p
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-[var(--color-muted)]
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
          bg-[var(--color-rose-dark)]
        "
      />

      <div>
        <p
          className="
            text-[11px]
            font-semibold
            text-[var(--color-charcoal)]
          "
        >
          {title}
        </p>

        <p
          className="
            mt-0.5
            text-[10px]
            leading-5
            text-[var(--color-secondary)]
          "
        >
          {description}
        </p>
      </div>
    </div>
  );
}