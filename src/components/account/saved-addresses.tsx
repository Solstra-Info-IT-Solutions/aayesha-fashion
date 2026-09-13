"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  Check,
  ChevronRight,
  Edit3,
  MapPin,
  Plus,
  Star,
  Trash2,
} from "lucide-react";

import toast from "react-hot-toast";

import { useAuthStore } from "@/store/auth-store";

import {
  deleteCustomerAddress,
  getCustomerAddresses,
  setCustomerDefaultAddress,
} from "@/lib/customer-api";

import type {
  CustomerAddress,
} from "@/lib/customer-api";

/* =========================================================
   COMPONENT
========================================================= */

export function SavedAddresses() {
  const accessToken =
    useAuthStore(
      (state) =>
        state.accessToken,
    );

  const isAuthenticated =
    useAuthStore(
      (state) =>
        state.isAuthenticated,
    );

  const isInitialized =
    useAuthStore(
      (state) =>
        state.isInitialized,
    );

  const [
    addresses,
    setAddresses,
  ] = useState<CustomerAddress[]>(
    [],
  );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    deletingId,
    setDeletingId,
  ] = useState<string | null>(
    null,
  );

  const [
    defaultId,
    setDefaultId,
  ] = useState<string | null>(
    null,
  );

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  /* =======================================================
     LOAD ADDRESSES
  ======================================================= */

  const loadAddresses =
    useCallback(
      async () => {
        if (!accessToken) {
          setAddresses([]);
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        setErrorMessage("");

        try {
          const data =
            await getCustomerAddresses(
              accessToken,
            );

          setAddresses(data);
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Unable to load your saved addresses.";

          setErrorMessage(message);
        } finally {
          setIsLoading(false);
        }
      },
      [accessToken],
    );

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    if (
      !isAuthenticated ||
      !accessToken
    ) {
      setAddresses([]);
      setIsLoading(false);
      return;
    }

    void loadAddresses();
  }, [
    isInitialized,
    isAuthenticated,
    accessToken,
    loadAddresses,
  ]);

  /* =======================================================
     SET DEFAULT
  ======================================================= */

  const handleSetDefault =
    async (
      addressId: string,
    ) => {
      if (
        !accessToken ||
        defaultId
      ) {
        return;
      }

      setDefaultId(addressId);
      setErrorMessage("");

      try {
        const updatedAddress =
          await setCustomerDefaultAddress(
            accessToken,
            addressId,
          );

        setAddresses(
          (current) =>
            current.map(
              (address) => ({
                ...address,
                isDefault:
                  address.id ===
                  updatedAddress.id,
              }),
            ),
        );

        toast.success(
          "Default address updated.",
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to update the default address.";

        setErrorMessage(
          message,
        );

        toast.error(message);
      } finally {
        setDefaultId(null);
      }
    };

  /* =======================================================
     DELETE ADDRESS
  ======================================================= */

  const handleDelete =
    async (
      address: CustomerAddress,
    ) => {
      if (
        !accessToken ||
        deletingId
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          `Delete the saved address for ${address.name}?`,
        );

      if (!confirmed) {
        return;
      }

      setDeletingId(address.id);
      setErrorMessage("");

      try {
        await deleteCustomerAddress(
          accessToken,
          address.id,
        );

        setAddresses(
          (current) =>
            current.filter(
              (item) =>
                item.id !==
                address.id,
            ),
        );

        toast.success(
          "Address deleted successfully.",
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to delete the address.";

        setErrorMessage(
          message,
        );

        toast.error(message);
      } finally {
        setDeletingId(null);
      }
    };

  /* =======================================================
     LOADING
  ======================================================= */

  if (
    !isInitialized ||
    isLoading
  ) {
    return (
      <section className="border border-[var(--color-border-light)] bg-white">
        <div className="border-b border-[var(--color-border-light)] px-6 py-6 sm:px-8">
          <div className="h-7 w-52 animate-pulse bg-[var(--color-bg-subtle)]" />

          <div className="mt-3 h-4 w-80 max-w-full animate-pulse bg-[var(--color-bg-subtle)]" />
        </div>

        <div className="grid gap-5 p-6 sm:p-8 lg:grid-cols-2">
          {[1, 2].map(
            (item) => (
              <div
                key={item}
                className="
                  h-64
                  animate-pulse
                  border
                  border-[var(--color-border-light)]
                  bg-[var(--color-surface-soft)]
                "
              />
            ),
          )}
        </div>
      </section>
    );
  }

  /* =======================================================
     AUTH REQUIRED
  ======================================================= */

  if (
    !isAuthenticated ||
    !accessToken
  ) {
    return (
      <section className="border border-[var(--color-border-light)] bg-white px-6 py-16 text-center sm:px-8">
        <MapPin
          size={28}
          strokeWidth={1.5}
          className="mx-auto text-[var(--color-text-secondary)]"
        />

        <h1 className="mt-5 font-[var(--font-display)] text-3xl text-[var(--color-text)]">
          Saved Addresses
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--color-text-secondary)]">
          Sign in to save and manage your delivery addresses.
        </p>

        <Link
          href="/login?callbackUrl=/account/addresses"
          className="
            mt-7
            inline-flex
            h-11
            items-center
            justify-center
            border
            border-[var(--color-text)]
            bg-[var(--color-text)]
            px-6
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.14em]
            text-white
            transition-colors
            duration-200
            hover:bg-[var(--color-charcoal-soft)]
          "
        >
          Sign In
        </Link>
      </section>
    );
  }

  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <section className="border border-[var(--color-border-light)] bg-white">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-5 border-b border-[var(--color-border-light)] px-6 py-6 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
            Delivery
          </p>

          <h1 className="mt-2 font-[var(--font-display)] text-3xl leading-none text-[var(--color-text)] sm:text-4xl">
            Saved Addresses
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--color-text-secondary)]">
            Manage the addresses you use for your Aayesha Fashion
            orders.
          </p>
        </div>

        <Link
          href="/account/addresses/new"
          className="
            inline-flex
            h-11
            w-fit
            shrink-0
            items-center
            justify-center
            gap-2
            border
            border-[var(--color-text)]
            bg-[var(--color-text)]
            px-5
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.14em]
            text-white
            transition-colors
            duration-200
            hover:bg-[var(--color-charcoal-soft)]
          "
        >
          <Plus
            size={15}
            strokeWidth={1.8}
          />

          Add New Address
        </Link>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {errorMessage ? (
        <div className="border-b border-[var(--color-border-light)] bg-[var(--color-surface-soft)] px-6 py-4 sm:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--color-error)]">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={() =>
                void loadAddresses()
              }
              className="
                inline-flex
                h-9
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
                text-[var(--color-text)]
                transition-colors
                hover:border-[var(--color-text)]
              "
            >
              Try Again
            </button>
          </div>
        </div>
      ) : null}

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {addresses.length === 0 ? (
        <div className="px-6 py-20 text-center sm:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[var(--color-border-light)] bg-[var(--color-surface-soft)]">
            <MapPin
              size={24}
              strokeWidth={1.5}
              className="text-[var(--color-text-secondary)]"
            />
          </div>

          <h2 className="mt-6 font-[var(--font-display)] text-3xl text-[var(--color-text)]">
            No saved addresses
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--color-text-secondary)]">
            Add your preferred delivery address to make checkout
            faster and easier.
          </p>

          <Link
            href="/account/addresses/new"
            className="
              mt-7
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              border
              border-[var(--color-text)]
              bg-[var(--color-text)]
              px-6
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-white
              transition-colors
              duration-200
              hover:bg-[var(--color-charcoal-soft)]
            "
          >
            <Plus
              size={15}
              strokeWidth={1.8}
            />

            Add Address
          </Link>
        </div>
      ) : (
        /* ===================================================
           ADDRESS GRID
        =================================================== */

        <div className="grid gap-5 p-6 sm:p-8 lg:grid-cols-2">
          {addresses.map(
            (address) => {
              const isDeleting =
                deletingId ===
                address.id;

              const isSettingDefault =
                defaultId ===
                address.id;

              return (
                <article
                  key={
                    address.id
                  }
                  className="
                    group
                    border
                    border-[var(--color-border-light)]
                    bg-[var(--color-surface-soft)]
                    transition-colors
                    duration-200
                    hover:border-[var(--color-border)]
                  "
                >
                  {/* ADDRESS HEADER */}

                  <div className="flex items-start justify-between gap-5 border-b border-[var(--color-border-light)] px-5 py-5">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-sm font-semibold text-[var(--color-text)]">
                          {address.name}
                        </h2>

                        {address.isDefault ? (
                          <span className="inline-flex items-center gap-1 border border-[color:var(--color-accent-soft)] bg-[var(--color-rose-light)] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text)]">
                            <Star
                              size={10}
                              fill="currentColor"
                              strokeWidth={1.5}
                            />

                            Default
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                        +91{" "}
                        {address.phone}
                      </p>
                    </div>

                    <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-[var(--color-border-light)] bg-white text-[var(--color-text-secondary)]">
                      <MapPin
                        size={15}
                        strokeWidth={1.6}
                      />
                    </span>
                  </div>

                  {/* ADDRESS DETAILS */}

                  <div className="px-5 py-5">
                    <address className="not-italic text-sm leading-6 text-[var(--color-text-secondary)]">
                      <span className="block">
                        {
                          address.addressLine
                        }
                      </span>

                      <span className="block">
                        {
                          address.city
                        }
                        ,{" "}
                        {
                          address.state
                        }
                      </span>

                      <span className="block font-medium text-[var(--color-text)]">
                        {
                          address.pincode
                        }
                      </span>

                      {address.landmark ? (
                        <span className="mt-2 block text-xs text-[var(--color-text-secondary)]">
                          Landmark:{" "}
                          {
                            address.landmark
                          }
                        </span>
                      ) : null}
                    </address>
                  </div>

                  {/* ACTIONS */}

                  <div className="grid border-t border-[var(--color-border-light)] sm:grid-cols-3">
                    <Link
                      href={`/account/addresses/edit?id=${encodeURIComponent(
                        address.id,
                      )}`}
                      className="
                        inline-flex
                        h-11
                        items-center
                        justify-center
                        gap-2
                        border-b
                        border-[var(--color-border-light)]
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        text-[var(--color-text)]
                        transition-colors
                        hover:bg-[var(--color-bg-subtle)]
                        sm:border-b-0
                        sm:border-r
                      "
                    >
                      <Edit3
                        size={14}
                        strokeWidth={1.7}
                      />

                      Edit
                    </Link>

                    <button
                      type="button"
                      disabled={
                        address.isDefault ||
                        Boolean(
                          defaultId,
                        ) ||
                        isDeleting
                      }
                      onClick={() =>
                        void handleSetDefault(
                          address.id,
                        )
                      }
                      className="
                        inline-flex
                        h-11
                        items-center
                        justify-center
                        gap-2
                        border-b
                        border-[var(--color-border-light)]
                        px-3
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        text-[var(--color-text)]
                        transition-colors
                        hover:bg-[var(--color-bg-subtle)]
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                        sm:border-b-0
                        sm:border-r
                      "
                    >
                      {isSettingDefault ? (
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border border-[var(--color-text)] border-t-transparent" />
                      ) : address.isDefault ? (
                        <Check
                          size={14}
                          strokeWidth={1.8}
                        />
                      ) : (
                        <Star
                          size={14}
                          strokeWidth={1.7}
                        />
                      )}

                      {address.isDefault
                        ? "Default"
                        : "Set Default"}
                    </button>

                    <button
                      type="button"
                      disabled={
                        isDeleting
                      }
                      onClick={() =>
                        void handleDelete(
                          address,
                        )
                      }
                      className="
                        inline-flex
                        h-11
                        items-center
                        justify-center
                        gap-2
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        text-[var(--color-error)]
                        transition-colors
                        hover:bg-[var(--color-rose-light)]
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                      "
                    >
                      {isDeleting ? (
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border border-[var(--color-error)] border-t-transparent" />
                      ) : (
                        <Trash2
                          size={14}
                          strokeWidth={1.7}
                        />
                      )}

                      Delete
                    </button>
                  </div>
                </article>
              );
            },
          )}
        </div>
      )}

      {/* =====================================================
          BACK TO ACCOUNT
      ===================================================== */}

      {addresses.length > 0 ? (
        <div className="border-t border-[var(--color-border-light)] px-6 py-5 sm:px-8">
          <Link
            href="/account"
            className="
              inline-flex
              items-center
              gap-2
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-[var(--color-text-secondary)]
              transition-colors
              hover:text-[var(--color-text)]
            "
          >
            Back to Account

            <ChevronRight
              size={14}
              strokeWidth={1.6}
            />
          </Link>
        </div>
      ) : null}
    </section>
  );
}