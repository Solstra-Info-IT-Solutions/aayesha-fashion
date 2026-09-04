"use client";

import { BrandLogo } from "@/components/layout/brand-logo";
import { DesktopNavigation } from "@/components/layout/desktop-navigation";
import { HeaderActions } from "@/components/layout/header-actions";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { WishlistCount } from "./wishlist-count";

const [mobileMenuOpen, setMobileMenuOpen] =
  useState(false);

export function Header() {
  return (
    <header
      className="
        sticky
        top-0
        z-50
        w-full
        border-b
        border-[var(--color-border)]
        bg-[var(--color-ivory)]
        text-[var(--color-charcoal)]
      "
    >
      <div
        className="
          relative
          mx-auto
          flex
          h-[74px]
          w-full
          max-w-[1600px]
          items-center
          justify-between
          px-5
          sm:h-[78px]
          sm:px-8
          md:h-[82px]
          md:px-10
          lg:px-14
          xl:px-20
        "
      >
        {/* =====================================================
            DESKTOP NAVIGATION
        ===================================================== */}

        <div className="hidden lg:block">
          <DesktopNavigation />
        </div>

        {/* =====================================================
            CENTER LOGO
        ===================================================== */}

        <div className="absolute left-1/2 -translate-x-1/2">
          <BrandLogo />
        </div>

        {/* =====================================================
            HEADER ACTIONS
        ===================================================== */}

        <div className="ml-auto flex items-center">
          <HeaderActions />

          <div className="lg:hidden">
            <MobileMenu
              isOpen={mobileMenuOpen}
              onClose={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      </div>
    </header>
  );
}