"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronRight,
  LogOut,
  MapPin,
  ShoppingBag,
  Trash2,
  User,
  UserCog,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import { useAuthStore } from "@/store/auth-store";
import { deleteCustomerAccount } from "@/lib/customer-api";

import { AccountConfirmDialog } from "@/components/account/account-confirm-dialog";

type AccountPopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

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

export function AccountPopup({
  isOpen,
  onClose,
}: AccountPopupProps) {
  const router = useRouter();
  const pathname = usePathname();

  const user = useAuthStore(
    (state) => state.user,
  );

  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );

  const logout = useAuthStore(
    (state) => state.logout,
  );

  const [confirmType, setConfirmType] = useState<
    "delete" | "logout" | null
  >(null);

  const [isProcessing, setIsProcessing] =
    useState(false);

  if (!isOpen || !user) {
    return null;
  }

  const initials =
    user.name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) =>
        part.charAt(0).toUpperCase(),
      )
      .join("") || "A";

  const closeConfirmDialog = () => {
    if (isProcessing) {
      return;
    }

    setConfirmType(null);
  };

  const handleLogoutConfirm = async () => {
    if (isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      await logout();

      toast.success(
        "You have been signed out.",
      );

      setConfirmType(null);
      onClose();

      router.push("/");
      router.refresh();
    } catch {
      toast.error(
        "Unable to sign out. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (isProcessing) {
      return;
    }

    if (!accessToken) {
      toast.error(
        "Your session has expired. Please sign in again.",
      );

      setConfirmType(null);
      onClose();

      router.push("/login");
      return;
    }

    setIsProcessing(true);

    try {
      await deleteCustomerAccount(
        accessToken,
      );

      /*
       * The delete API has already invalidated
       * the account. Clear the frontend session.
       */
      try {
        await logout();
      } catch {
        /*
         * Ignore logout failure here because
         * account deletion has already succeeded.
         */
      }

      toast.success(
        "Your account has been deleted.",
      );

      setConfirmType(null);
      onClose();

      router.push(
        "/?accountDeleted=1",
      );

      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to delete your account.";

      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* =====================================================
          ACCOUNT POPUP
      ===================================================== */}

      <div className="absolute right-0 top-[calc(100%+14px)] z-[100] w-[360px] max-w-[calc(100vw-32px)]">
        <div className="overflow-hidden border border-[#d8d1ca] bg-[#fcfbf9] shadow-[0_20px_55px_rgba(23,23,23,0.14)]">
          {/* =================================================
              PROFILE HEADER
          ================================================= */}

          <div className="relative border-b border-[#e7e2dd] bg-white px-5 py-5">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close account menu"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center text-[#969696] transition-colors hover:bg-[#f5f1ec] hover:text-[#171717]"
            >
              <X
                size={16}
                strokeWidth={1.7}
              />
            </button>

            <div className="flex items-center gap-4 pr-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#efa7ae] bg-[#f9e4e6] font-[var(--font-display)] text-lg text-[#171717]">
                {initials}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#171717]">
                  {user.name}
                </p>

                <p className="mt-1 truncate text-xs text-[#6f706f]">
                  {user.email}
                </p>
              </div>
            </div>

            <Link
              href="/account"
              onClick={onClose}
              className="mt-5 flex items-center justify-between border border-[#e7e2dd] bg-[#fcfbf9] px-4 py-3 transition-colors hover:border-[#d8d1ca] hover:bg-[#f5f1ec]"
            >
              <span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#969696]">
                  Account
                </span>

                <span className="mt-1 block text-xs text-[#292c2c]">
                  View your account
                </span>
              </span>

              <ChevronRight
                size={15}
                strokeWidth={1.7}
                className="text-[#6f706f]"
              />
            </Link>
          </div>

          {/* =================================================
              ACCOUNT NAVIGATION
          ================================================= */}

          <div className="border-b border-[#e7e2dd] bg-white px-2 py-2">
            {accountLinks.map((item) => {
              const Icon = item.icon;

              const isActive =
                item.href === "/account"
                  ? pathname === "/account"
                  : pathname.startsWith(
                      item.href,
                    );

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={
                    isActive
                      ? "group flex items-center gap-3 bg-[#f9e4e6] px-3 py-3 transition-colors"
                      : "group flex items-center gap-3 px-3 py-3 transition-colors hover:bg-[#fcfbf9]"
                  }
                >
                  <span
                    className={
                      isActive
                        ? "flex h-9 w-9 shrink-0 items-center justify-center border border-[#efa7ae] bg-white text-[#171717]"
                        : "flex h-9 w-9 shrink-0 items-center justify-center border border-[#e7e2dd] bg-[#fcfbf9] text-[#6f706f]"
                    }
                  >
                    <Icon
                      size={15}
                      strokeWidth={1.7}
                    />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={
                        isActive
                          ? "block text-xs font-semibold text-[#171717]"
                          : "block text-xs font-semibold text-[#292c2c]"
                      }
                    >
                      {item.label}
                    </span>

                    <span className="mt-0.5 block text-[10px] leading-4 text-[#969696]">
                      {item.description}
                    </span>
                  </span>

                  <ChevronRight
                    size={14}
                    strokeWidth={1.7}
                    className={
                      isActive
                        ? "shrink-0 text-[#171717]"
                        : "shrink-0 text-[#b0aaa4]"
                    }
                  />
                </Link>
              );
            })}
          </div>

          {/* =================================================
              ACCOUNT ACTIONS
          ================================================= */}

          <div className="bg-[#fcfbf9] p-2">
            {/* DELETE ACCOUNT */}

            <button
              type="button"
              onClick={() =>
                setConfirmType("delete")
              }
              disabled={isProcessing}
              className="flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-[#f9e4e6] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#ead4d6] bg-white text-[#7f4a50]">
                <Trash2
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <span className="flex-1">
                <span className="block text-xs font-semibold text-[#7f4a50]">
                  Delete Account
                </span>

                <span className="mt-0.5 block text-[10px] text-[#969696]">
                  Permanently remove your account
                </span>
              </span>
            </button>

            {/* SIGN OUT */}

            <button
              type="button"
              onClick={() =>
                setConfirmType("logout")
              }
              disabled={isProcessing}
              className="mt-1 flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-[#f5f1ec] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#e7e2dd] bg-white text-[#6f706f]">
                <LogOut
                  size={15}
                  strokeWidth={1.7}
                />
              </span>

              <span className="flex-1">
                <span className="block text-xs font-semibold text-[#292c2c]">
                  Sign Out
                </span>

                <span className="mt-0.5 block text-[10px] text-[#969696]">
                  Sign out from this device
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          CONFIRMATION DIALOG
      ===================================================== */}

      <AccountConfirmDialog
        open={confirmType !== null}
        type={
          confirmType === "delete"
            ? "delete"
            : "logout"
        }
        loading={isProcessing}
        onCancel={
          closeConfirmDialog
        }
        onConfirm={() => {
          if (
            confirmType ===
            "delete"
          ) {
            void handleDeleteConfirm();
            return;
          }

          if (
            confirmType ===
            "logout"
          ) {
            void handleLogoutConfirm();
          }
        }}
      />
    </>
  );
}