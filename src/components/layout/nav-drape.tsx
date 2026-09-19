"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, Search, User, X } from "lucide-react";

import { CartIconPulse, type CartIconPulseHandle } from "@/components/layout/cart-icon-pulse";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCartUiStore } from "@/store/cart-ui-store";

/*
 * Visual shell for the redesigned dark nav. Wishlist count is read from the
 * real wishlist-store (existing logic, untouched). Cart item count + the
 * icon's pulse are driven by the shared cart-ui-store, updated from
 * cart-drawer.tsx and every real add-to-bag success path.
 */

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
];

export function NavDrape() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const cartIconRef = useRef<CartIconPulseHandle>(null);
  const hasMountedPulse = useRef(false);

  const wishlistCount = useWishlistStore((state) => state.productIds.length);
  const cartCount = useCartUiStore((state) => state.count);
  const pulseTick = useCartUiStore((state) => state.pulseTick);
  const refreshCartCount = useCartUiStore((state) => state.refreshCount);

  useEffect(() => {
    void refreshCartCount();
  }, [refreshCartCount]);

  useEffect(() => {
    if (!hasMountedPulse.current) {
      hasMountedPulse.current = true;
      return;
    }

    cartIconRef.current?.pulse();
  }, [pulseTick]);

  return (
    <>
      <header className="drape-surface sticky top-0 z-40 border-b drape-hairline">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 lg:px-10">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="text-[var(--unbleached-cotton)] lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} strokeWidth={1.3} />
          </button>

          <Link
            href="/"
            className="drape-font-display text-xl italic tracking-[-0.01em] text-[var(--unbleached-cotton)]"
          >
            Aayesha
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="drape-font-body text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)] transition-colors hover:text-[var(--unbleached-cotton)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <button
              type="button"
              aria-label="Search"
              className="hidden text-[var(--unbleached-cotton)] transition-colors hover:text-[var(--sindoor-rust)] sm:block"
            >
              <Search size={19} strokeWidth={1.3} />
            </button>

            <Link
              href="/account"
              aria-label="Account"
              className="hidden text-[var(--unbleached-cotton)] transition-colors hover:text-[var(--sindoor-rust)] sm:block"
            >
              <User size={19} strokeWidth={1.3} />
            </Link>

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="drape-font-body relative text-[11px] uppercase tracking-[0.2em] text-[var(--unbleached-cotton)]"
            >
              {wishlistCount > 0 ? `Saved (${wishlistCount})` : "Saved"}
            </Link>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label="Open bag"
            >
              <CartIconPulse ref={cartIconRef} itemCount={cartCount} />
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="drape-surface fixed inset-0 z-50 flex flex-col px-6 py-6 lg:hidden">
            <div className="flex items-center justify-between">
              <span className="drape-font-display text-xl italic text-[var(--unbleached-cotton)]">
                Aayesha
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="text-[var(--unbleached-cotton)]"
              >
                <X size={22} strokeWidth={1.3} />
              </button>
            </div>

            <nav className="mt-12 flex flex-col gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="drape-font-display text-3xl text-[var(--unbleached-cotton)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
