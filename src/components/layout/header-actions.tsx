"use client";

import Link from "next/link";
import {
  ArrowUpRight,
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
    if (!searchOpen && !accountOpen) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key !== "Escape") {
        return;
      }

      setSearchOpen(false);
      setAccountOpen(false);
    }

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
  }, [searchOpen, accountOpen]);

  /* =======================================================
     ACCOUNT OUTSIDE CLICK
  ======================================================= */

  useEffect(() => {
    if (!accountOpen) return;

    function handlePointerDown(
      event: MouseEvent,
    ) {
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
    }

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
     SEARCH
  ======================================================= */

  const openSearch = () => {
    setAccountOpen(false);
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
    if (!isInitialized) {
      return;
    }

    setSearchOpen(false);

    setAccountOpen(
      (current) => !current,
    );
  };

  /* =======================================================
     ACCOUNT LABEL
  ======================================================= */

  const accountLabel =
    isInitialized && loggedIn
      ? `Account for ${
          user?.name ?? "customer"
        }`
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
        "
      >
        {/* =================================================
            SEARCH
            Desktop only
        ================================================= */}

        <button
          type="button"
          onClick={openSearch}
          aria-label="Search"
          aria-expanded={searchOpen}
          className="
            hidden
            h-10
            w-10
            items-center
            justify-center
            text-current
            transition-colors
            duration-300
            hover:text-[var(--color-accent)]
            lg:flex
          "
        >
          <Search
            size={18}
            strokeWidth={1.25}
          />
        </button>

        {/* =================================================
            ACCOUNT
            Desktop only
        ================================================= */}

        <div
          ref={accountWrapperRef}
          className="
            relative
            hidden
            lg:block
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
              flex
              h-10
              w-10
              items-center
              justify-center
              text-current
              transition-colors
              duration-300
              hover:text-[var(--color-accent)]
            "
          >
            <UserRound
              size={18}
              strokeWidth={1.25}
            />

            {isInitialized &&
              loggedIn && (
                <span
                  aria-hidden="true"
                  className="
                    absolute
                    right-[5px]
                    top-[5px]
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-[var(--color-accent)]
                  "
                />
              )}
          </button>

          {isInitialized &&
            loggedIn && (
              <AccountPopup
                isOpen={accountOpen}
                onClose={() =>
                  setAccountOpen(false)
                }
              />
            )}

          {isInitialized &&
            !loggedIn &&
            accountOpen && (
              <GuestAccountPopup
                onClose={() =>
                  setAccountOpen(false)
                }
              />
            )}
        </div>

        {/* =================================================
            WISHLIST
            Desktop only
        ================================================= */}

        <Link
          href="/wishlist"
          aria-label="Wishlist"
          onClick={() =>
            setAccountOpen(false)
          }
          className="
            relative
            hidden
            h-10
            w-10
            items-center
            justify-center
            text-current
            transition-colors
            duration-300
            hover:text-[var(--color-accent)]
            lg:flex
          "
        >
          <Heart
            size={18}
            strokeWidth={1.25}
          />

          <WishlistCount />
        </Link>

        {/* =================================================
            SHOPPING BAG
            Mobile + Desktop
        ================================================= */}

        <Link
          href="/cart"
          aria-label="Shopping bag"
          onClick={() =>
            setAccountOpen(false)
          }
          className="
            relative
            flex
            h-9
            w-9
            items-center
            justify-center
            text-current
            transition-colors
            duration-300
            hover:text-[var(--color-accent)]
            sm:h-10
            sm:w-10
          "
        >
          <ShoppingBag
            size={18}
            strokeWidth={1.25}
          />

          <CartCount />
        </Link>
      </div>

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
              fixed
              inset-x-0
              top-[72px]
              z-[70]
              border-b
              border-[var(--color-border)]
              bg-[var(--color-bg)]
              shadow-[var(--shadow-md)]
              sm:top-[76px]
              md:top-[80px]
              lg:absolute
              lg:top-full
            "
          >
            <div
              className="
                mx-auto
                max-w-[1600px]
                px-4
                sm:px-6
                md:px-8
                lg:px-10
                xl:px-14
              "
            >
              <div
                className="
                  py-4
                  sm:py-5
                  md:py-6
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-4
                  "
                >
                  <form
                    onSubmit={
                      handleSearchSubmit
                    }
                    className="
                      min-w-0
                      flex-1
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >
                      <Search
                        size={18}
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
                        placeholder="Search products"
                        aria-label="Search products"
                        autoComplete="off"
                        className="
                          min-w-0
                          flex-1
                          border-0
                          bg-transparent
                          p-0
                          font-body
                          text-sm
                          text-[var(--color-text)]
                          outline-none
                          placeholder:text-[var(--color-text-muted)]
                          sm:text-base
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
                            tracking-[0.16em]
                            text-[var(--color-text)]
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
                        mt-3
                        h-px
                        bg-[var(--color-border)]
                      "
                    />
                  </form>

                  <button
                    type="button"
                    onClick={closeSearch}
                    aria-label="Close search"
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      text-[var(--color-text-secondary)]
                      hover:text-[var(--color-text)]
                    "
                  >
                    <X
                      size={18}
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
        top-[calc(100%+12px)]
        z-[100]
        w-[320px]
        max-w-[calc(100vw-24px)]
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
              right-3
              top-3
              flex
              h-8
              w-8
              items-center
              justify-center
              text-[var(--color-text-secondary)]
              hover:text-[var(--color-text)]
            "
          >
            <X
              size={16}
              strokeWidth={1.4}
            />
          </button>

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
              mt-2
              font-display
              text-2xl
              leading-tight
              tracking-[-0.025em]
              text-[var(--color-text)]
            "
          >
            Welcome to Aayesha
          </h3>

          <p
            className="
              mt-3
              max-w-[270px]
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

        <div
          className="
            border-b
            border-[var(--color-border)]
            p-4
          "
        >
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/login"
              onClick={onClose}
              className="
                flex
                h-10
                items-center
                justify-center
                bg-[var(--color-text)]
                font-body
                text-[9px]
                font-medium
                uppercase
                tracking-[0.16em]
                text-[var(--color-text-inverse)]
              "
            >
              Sign In
            </Link>

            <Link
              href="/register"
              onClick={onClose}
              className="
                flex
                h-10
                items-center
                justify-center
                border
                border-[var(--color-border)]
                font-body
                text-[9px]
                font-medium
                uppercase
                tracking-[0.16em]
                text-[var(--color-text)]
              "
            >
              Sign Up
            </Link>
          </div>
        </div>

        <div className="px-5 py-5">
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