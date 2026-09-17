"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";

type LoginRequiredPopupProps = {
  open: boolean;
  onClose: () => void;
};

export function LoginRequiredPopup({
  open,
  onClose,
}: LoginRequiredPopupProps) {
  const router = useRouter();

  if (!open) {
    return null;
  }

  const handleLogin = () => {
    onClose();
    router.push("/login");
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-[rgba(33,31,29,0.45)]
        px-4
        backdrop-blur-[3px]
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-required-title"
      onClick={onClose}
    >
      <div
        className="
          relative
          w-full
          max-w-[420px]
          border
          border-[var(--color-border)]
          bg-[var(--color-bg)]
          px-6
          py-7
          shadow-[var(--shadow-lg)]
          sm:px-8
          sm:py-8
        "
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="
            absolute
            right-4
            top-4
            flex
            h-8
            w-8
            items-center
            justify-center
            text-[var(--color-text-muted)]
            transition-colors
            hover:text-[var(--color-text)]
          "
        >
          <X size={17} strokeWidth={1.5} />
        </button>

        <div className="pr-8">
          <p
            className="
              font-body
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-[var(--color-accent)]
            "
          >
            Aayesha Fashion
          </p>

          <h2
            id="login-required-title"
            className="
              mt-2
              font-display
              text-[24px]
              font-medium
              leading-tight
              text-[var(--color-text)]
            "
          >
            Login Required
          </h2>

          <p
            className="
              mt-3
              font-body
              text-[12px]
              leading-6
              text-[var(--color-text-secondary)]
            "
          >
            Please login to your account to add products
            to your bag.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={handleLogin}
            className="
              flex
              w-full
              items-center
              justify-center
              border
              border-[var(--color-text)]
              bg-[var(--color-text)]
              px-4
              py-3
              font-body
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-[var(--color-text-inverse)]
              transition-all
              duration-[var(--duration-base)]
              hover:border-[var(--color-accent)]
              hover:bg-[var(--color-accent)]
            "
          >
            Login
          </button>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              w-full
              items-center
              justify-center
              border
              border-[var(--color-border)]
              bg-transparent
              px-4
              py-3
              font-body
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-[var(--color-text)]
              transition-colors
              hover:border-[var(--color-text)]
            "
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}