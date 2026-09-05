"use client";

import { useCallback, useEffect, useState } from "react";
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
  deleteAddress,
  getAddresses,
  setDefaultAddress,
} from "@/lib/address-api";
import type { Address } from "@/types/address";

export function SavedAddresses() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );
  const isInitialized = useAuthStore(
    (state) => state.isInitialized,
  );

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [defaultId, setDefaultId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const loadAddresses = useCallback(async () => {
    if (!accessToken) {
      setAddresses([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await getAddresses(accessToken);
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
  }, [accessToken]);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    if (!isAuthenticated || !accessToken) {
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

  const handleSetDefault = async (addressId: string) => {
    if (!accessToken || defaultId) {
      return;
    }

    setDefaultId(addressId);
    setErrorMessage("");

    try {
      const updatedAddress = await setDefaultAddress(
        accessToken,
        addressId,
      );

      setAddresses((current) =>
        current.map((address) => ({
          ...address,
          isDefault: address.id === updatedAddress.id,
        })),
      );

      toast.success("Default address updated.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to update the default address.";

      setErrorMessage(message);
      toast.error(message);
    } finally {
      setDefaultId(null);
    }
  };

  const handleDelete = async (address: Address) => {
    if (!accessToken || deletingId) {
      return;
    }

    const confirmed = window.confirm(
      `Delete the saved address for ${address.name}?`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(address.id);
    setErrorMessage("");

    try {
      await deleteAddress(accessToken, address.id);

      const nextAddresses = addresses.filter(
        (item) => item.id !== address.id,
      );

      setAddresses(nextAddresses);

      toast.success("Address deleted successfully.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to delete the address.";

      setErrorMessage(message);
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  if (!isInitialized || isLoading) {
    return (
      <section className="border border-[#e7e2dd] bg-white">
        <div className="border-b border-[#e7e2dd] px-6 py-6 sm:px-8">
          <div className="h-7 w-52 animate-pulse bg-[#f5f1ec]" />
          <div className="mt-3 h-4 w-80 max-w-full animate-pulse bg-[#f5f1ec]" />
        </div>

        <div className="grid gap-5 p-6 sm:p-8 lg:grid-cols-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-64 animate-pulse border border-[#e7e2dd] bg-[#fcfbf9]"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!isAuthenticated || !accessToken) {
    return (
      <section className="border border-[#e7e2dd] bg-white px-6 py-16 text-center sm:px-8">
        <MapPin
          size={28}
          strokeWidth={1.5}
          className="mx-auto text-[#6f706f]"
        />

        <h1 className="mt-5 font-[var(--font-display)] text-3xl text-[#171717]">
          Saved Addresses
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6f706f]">
          Sign in to save and manage your delivery addresses.
        </p>

        <Link
          href="/login?callbackUrl=/account/addresses"
          className="mt-7 inline-flex h-11 items-center justify-center border border-[#171717] bg-[#171717] px-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:bg-[#292c2c]"
        >
          Sign In
        </Link>
      </section>
    );
  }

  return (
    <section className="border border-[#e7e2dd] bg-white">
      <div className="flex flex-col gap-5 border-b border-[#e7e2dd] px-6 py-6 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#969696]">
            Delivery
          </p>

          <h1 className="mt-2 font-[var(--font-display)] text-3xl leading-none text-[#171717] sm:text-4xl">
            Saved Addresses
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#6f706f]">
            Manage the addresses you use for your Aayesha Fashion
            orders.
          </p>
        </div>

        <Link
          href="/account/addresses/new"
          className="inline-flex h-11 w-fit shrink-0 items-center justify-center gap-2 border border-[#171717] bg-[#171717] px-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:bg-[#292c2c]"
        >
          <Plus size={15} strokeWidth={1.8} />
          Add New Address
        </Link>
      </div>

      {errorMessage ? (
        <div className="border-b border-[#e7e2dd] bg-[#fcfbf9] px-6 py-4 sm:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#7f4a50]">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={() => void loadAddresses()}
              className="inline-flex h-9 items-center justify-center border border-[#d8d1ca] bg-white px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#171717] transition-colors hover:border-[#171717]"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : null}

      {addresses.length === 0 ? (
        <div className="px-6 py-20 text-center sm:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#e7e2dd] bg-[#fcfbf9]">
            <MapPin
              size={24}
              strokeWidth={1.5}
              className="text-[#6f706f]"
            />
          </div>

          <h2 className="mt-6 font-[var(--font-display)] text-3xl text-[#171717]">
            No saved addresses
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6f706f]">
            Add your preferred delivery address to make checkout
            faster and easier.
          </p>

          <Link
            href="/account/addresses/new"
            className="mt-7 inline-flex h-11 items-center justify-center gap-2 border border-[#171717] bg-[#171717] px-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:bg-[#292c2c]"
          >
            <Plus size={15} strokeWidth={1.8} />
            Add Address
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 p-6 sm:p-8 lg:grid-cols-2">
          {addresses.map((address) => {
            const isDeleting = deletingId === address.id;
            const isSettingDefault = defaultId === address.id;

            return (
              <article
                key={address.id}
                className="group border border-[#e7e2dd] bg-[#fcfbf9] transition-colors duration-200 hover:border-[#d8d1ca]"
              >
                <div className="flex items-start justify-between gap-5 border-b border-[#e7e2dd] px-5 py-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-sm font-semibold text-[#171717]">
                        {address.name}
                      </h2>

                      {address.isDefault ? (
                        <span className="inline-flex items-center gap-1 border border-[#efa7ae]/50 bg-[#f9e4e6] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#171717]">
                          <Star
                            size={10}
                            fill="currentColor"
                            strokeWidth={1.5}
                          />
                          Default
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-1 text-xs text-[#6f706f]">
                      +91 {address.phone}
                    </p>
                  </div>

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#e7e2dd] bg-white text-[#6f706f]">
                    <MapPin size={15} strokeWidth={1.6} />
                  </span>
                </div>

                <div className="px-5 py-5">
                  <address className="not-italic text-sm leading-6 text-[#4d4f4f]">
                    <span className="block">
                      {address.addressLine}
                    </span>

                    <span className="block">
                      {address.city}, {address.state}
                    </span>

                    <span className="block font-medium text-[#171717]">
                      {address.pincode}
                    </span>

                    {address.landmark ? (
                      <span className="mt-2 block text-xs text-[#6f706f]">
                        Landmark: {address.landmark}
                      </span>
                    ) : null}
                  </address>
                </div>

                <div className="grid border-t border-[#e7e2dd] sm:grid-cols-3">
                  <Link
                    href={`/account/addresses/edit?id=${encodeURIComponent(address.id)}`}
                    className="inline-flex h-12 items-center justify-center gap-2 border-b border-[#e7e2dd] text-[10px] font-semibold uppercase tracking-[0.12em] text-[#171717] transition-colors hover:bg-[#f5f1ec] sm:border-b-0 sm:border-r"
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
                      Boolean(defaultId) ||
                      isDeleting
                    }
                    onClick={() =>
                      void handleSetDefault(address.id)
                    }
                    className="inline-flex h-12 items-center justify-center gap-2 border-b border-[#e7e2dd] px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#171717] transition-colors hover:bg-[#f5f1ec] disabled:cursor-not-allowed disabled:opacity-40 sm:border-b-0 sm:border-r"
                  >
                    {isSettingDefault ? (
                      <span className="h-3.5 w-3.5 animate-spin border border-[#171717] border-t-transparent rounded-full" />
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
                    disabled={isDeleting}
                    onClick={() => void handleDelete(address)}
                    className="inline-flex h-12 items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7f4a50] transition-colors hover:bg-[#f9e4e6] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isDeleting ? (
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border border-[#7f4a50] border-t-transparent" />
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
          })}
        </div>
      )}

      {addresses.length > 0 ? (
        <div className="border-t border-[#e7e2dd] px-6 py-5 sm:px-8">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6f706f] transition-colors hover:text-[#171717]"
          >
            Back to Account
            <ChevronRight size={14} strokeWidth={1.6} />
          </Link>
        </div>
      ) : null}
    </section>
  );
}