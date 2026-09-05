"use client";

import {
  AlertTriangle,
  Loader2,
  LogOut,
  Trash2,
  X,
} from "lucide-react";

type AccountConfirmDialogProps = {
  open: boolean;
  type: "delete" | "logout";
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function AccountConfirmDialog({
  open,
  type,
  loading = false,
  onCancel,
  onConfirm,
}: AccountConfirmDialogProps) {
  if (!open) {
    return null;
  }

  const isDelete = type === "delete";

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-[#171717]/35 px-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-confirm-title"
    >
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onCancel}
        disabled={loading}
        className="absolute inset-0 cursor-default"
      />

      <div className="relative z-10 w-full max-w-[440px] overflow-hidden border border-[#d8d1ca] bg-[#fcfbf9] shadow-[0_25px_80px_rgba(23,23,23,0.22)]">
        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-[#e7e2dd] bg-white px-6 py-5">
          <div className="flex items-center gap-4">
            <div
              className={
                isDelete
                  ? "flex h-11 w-11 items-center justify-center border border-[#d98791] bg-[#f9e4e6] text-[#7f4a50]"
                  : "flex h-11 w-11 items-center justify-center border border-[#d8d1ca] bg-[#f5f1ec] text-[#171717]"
              }
            >
              {isDelete ? (
                <Trash2
                  size={18}
                  strokeWidth={1.6}
                />
              ) : (
                <LogOut
                  size={18}
                  strokeWidth={1.6}
                />
              )}
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#969696]">
                Account
              </p>

              <h2
                id="account-confirm-title"
                className="mt-1 font-[var(--font-display)] text-2xl text-[#171717]"
              >
                {isDelete
                  ? "Delete Account"
                  : "Sign Out"}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center text-[#969696] transition-colors hover:bg-[#f5f1ec] hover:text-[#171717] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X
              size={16}
              strokeWidth={1.7}
            />
          </button>
        </div>

        {/* CONTENT */}

        <div className="px-6 py-6">
          {isDelete ? (
            <>
              <div className="flex items-start gap-3 border border-[#ead4d6] bg-[#fff8f8] p-4">
                <AlertTriangle
                  size={17}
                  strokeWidth={1.7}
                  className="mt-0.5 shrink-0 text-[#9a545c]"
                />

                <p className="text-sm leading-6 text-[#6f4a4f]">
                  This action is permanent. Your profile
                  and saved addresses will be removed from
                  active use. Existing order records will be
                  retained where required for order history.
                </p>
              </div>

              <p className="mt-5 text-sm leading-6 text-[#6f706f]">
                After deletion, you will be signed out
                automatically and your account will no
                longer be available for login.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm leading-6 text-[#4d4f4f]">
                Are you sure you want to sign out of your
                Aayesha Fashion account on this device?
              </p>

              <p className="mt-3 text-xs leading-5 text-[#969696]">
                Your account, orders and saved information
                will remain safe.
              </p>
            </>
          )}
        </div>

        {/* ACTIONS */}

        <div className="flex flex-col-reverse gap-3 border-t border-[#e7e2dd] bg-[#fcfbf9] px-6 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center border border-[#d8d1ca] bg-white px-6 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#171717] transition-colors hover:border-[#171717] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={
              isDelete
                ? "inline-flex h-11 items-center justify-center gap-2 border border-[#9a545c] bg-[#7f4a50] px-6 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#6d4046] disabled:cursor-not-allowed disabled:opacity-60"
                : "inline-flex h-11 items-center justify-center gap-2 border border-[#171717] bg-[#171717] px-6 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#292c2c] disabled:cursor-not-allowed disabled:opacity-60"
            }
          >
            {loading ? (
              <>
                <Loader2
                  size={15}
                  className="animate-spin"
                  strokeWidth={1.7}
                />

                Processing...
              </>
            ) : isDelete ? (
              <>
                <Trash2
                  size={15}
                  strokeWidth={1.7}
                />

                Delete Account
              </>
            ) : (
              <>
                <LogOut
                  size={15}
                  strokeWidth={1.7}
                />

                Sign Out
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}