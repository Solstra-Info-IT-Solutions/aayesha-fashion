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
      className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-[rgba(33,31,29,0.42)] px-4 py-6 backdrop-blur-[3px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-confirm-title"
    >
      {/* Backdrop */}

      <button
        type="button"
        aria-label="Close dialog"
        onClick={onCancel}
        disabled={loading}
        className="absolute inset-0 cursor-default"
      />

      {/* Dialog */}

      <div className="relative z-10 w-full max-w-[460px] overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)]">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex items-start justify-between border-b border-[var(--color-border-light)] px-6 py-6 sm:px-7">
          <div className="flex min-w-0 items-center gap-4">
            <div
              className={
                isDelete
                  ? "flex h-11 w-11 shrink-0 items-center justify-center border border-[var(--color-error)]/25 bg-[var(--color-error)]/5 text-[var(--color-error)]"
                  : "flex h-11 w-11 shrink-0 items-center justify-center border border-[var(--color-border)] bg-[var(--color-bg-soft)] text-[var(--color-text)]"
              }
            >
              {isDelete ? (
                <Trash2
                  size={18}
                  strokeWidth={1.5}
                />
              ) : (
                <LogOut
                  size={18}
                  strokeWidth={1.5}
                />
              )}
            </div>

            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                Account
              </p>

              <h2
                id="account-confirm-title"
                className="mt-1 font-[var(--font-display)] text-3xl leading-none tracking-[-0.02em] text-[var(--color-text)]"
              >
                {isDelete
                  ? "Delete Account"
                  : "Sign Out"}
              </h2>
            </div>
          </div>

          {/* Close */}

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center text-[var(--color-text-muted)] transition duration-200 hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-text)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X
              size={16}
              strokeWidth={1.6}
            />
          </button>
        </div>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="px-6 py-7 sm:px-7">
          {isDelete ? (
            <>
              <div className="border border-[var(--color-error)]/20 bg-[var(--color-error)]/[0.035] p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    size={17}
                    strokeWidth={1.6}
                    className="mt-0.5 shrink-0 text-[var(--color-error)]"
                  />

                  <p className="text-xs leading-6 text-[var(--color-text-secondary)]">
                    This action is permanent. Your
                    profile and saved addresses will be
                    removed from active use. Existing order
                    records will be retained where required
                    for order history.
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-[var(--color-text-secondary)]">
                After deletion, you will be signed out
                automatically and your account will no
                longer be available for login.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm leading-7 text-[var(--color-text-secondary)]">
                Are you sure you want to sign out of your
                Aayesha Fashion account on this device?
              </p>

              <p className="mt-3 text-xs leading-6 text-[var(--color-text-muted)]">
                Your account, orders and saved information
                will remain safe.
              </p>
            </>
          )}
        </div>

        {/* =====================================================
            ACTIONS
        ===================================================== */}

        <div className="flex flex-col-reverse gap-3 border-t border-[var(--color-border-light)] bg-[var(--color-bg-subtle)] px-6 py-5 sm:flex-row sm:justify-end sm:px-7">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center border border-[var(--color-border)] bg-[var(--color-surface)] px-6 text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text)] transition duration-300 hover:border-[var(--color-text)] hover:bg-[var(--color-bg-soft)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={
              isDelete
                ? "inline-flex h-11 items-center justify-center gap-2 border border-[var(--color-error)] bg-[var(--color-error)] px-6 text-[9px] font-semibold uppercase tracking-[0.16em] text-white transition duration-300 hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-60"
                : "inline-flex h-11 items-center justify-center gap-2 bg-[var(--color-text)] px-6 text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-inverse)] transition duration-300 hover:bg-[var(--color-accent-dark)] disabled:cursor-not-allowed disabled:opacity-60"
            }
          >
            {loading ? (
              <>
                <Loader2
                  size={15}
                  className="animate-spin"
                  strokeWidth={1.6}
                />

                Processing...
              </>
            ) : isDelete ? (
              <>
                <Trash2
                  size={15}
                  strokeWidth={1.6}
                />

                Delete Account
              </>
            ) : (
              <>
                <LogOut
                  size={15}
                  strokeWidth={1.6}
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