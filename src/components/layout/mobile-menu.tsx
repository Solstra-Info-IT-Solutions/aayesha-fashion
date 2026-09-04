"use client";

import Link from "next/link";
import { useEffect } from "react";

import {
  Heart,
  Search,
  UserRound,
  X,
} from "lucide-react";

import {
  mainNavigation,
} from "@/config/navigation";
import { siteConfig } from "@/config/site";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({
  isOpen,
  onClose,
}: MobileMenuProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-[100] xl:hidden ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className={`absolute inset-0 bg-[rgba(27,29,29,0.45)] transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        className={`relative flex h-full w-full max-w-md flex-col bg-[var(--color-ivory)] px-6 pb-8 pt-6 shadow-2xl transition-transform duration-500 sm:px-8 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-5">
          <div>
            <p className="font-display text-2xl text-[var(--color-charcoal)]">
              Ayesha
            </p>

            <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.35em] text-[var(--color-text-secondary)]">
              Fashion
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center border border-[var(--color-border)] transition-colors hover:bg-[var(--color-charcoal)] hover:text-white"
            aria-label="Close menu"
          >
            <X
              size={20}
              strokeWidth={1.7}
            />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="mt-8">
          <ul className="space-y-1">
            {mainNavigation.map((item, index) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="group flex items-center justify-between py-4 text-xl font-medium text-[var(--color-charcoal)]"
                >
                  <span>{item.label}</span>

                  <span className="text-xs text-[var(--color-text-muted)]">
                    0{index + 1}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Secondary Navigation */}
        <div className="mt-8 border-t border-[var(--color-border)] pt-6">
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/search"
              onClick={onClose}
              className="flex items-center gap-3 border border-[var(--color-border)] p-4 text-sm font-medium"
            >
              <Search
                size={17}
                strokeWidth={1.7}
              />

              Search
            </Link>

            <Link
              href="/account"
              onClick={onClose}
              className="flex items-center gap-3 border border-[var(--color-border)] p-4 text-sm font-medium"
            >
              <UserRound
                size={17}
                strokeWidth={1.7}
              />

              Account
            </Link>

            <Link
              href="/wishlist"
              onClick={onClose}
              className="flex items-center gap-3 border border-[var(--color-border)] p-4 text-sm font-medium"
            >
              <Heart
                size={17}
                strokeWidth={1.7}
              />

              Wishlist
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-auto border-t border-[var(--color-border)] pt-6">
          <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
            {siteConfig.description}
          </p>
        </div>
      </aside>
    </div>
  );
}