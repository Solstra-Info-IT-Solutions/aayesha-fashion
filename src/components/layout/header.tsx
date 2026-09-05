"use client";

import { useState } from "react";

import { BrandLogo } from "@/components/layout/brand-logo";
import { DesktopNavigation } from "@/components/layout/desktop-navigation";
import { HeaderActions } from "@/components/layout/header-actions";
import { MobileMenu } from "@/components/layout/mobile-menu";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

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
            MOBILE MENU
        ===================================================== */}

        <div className="relative z-[120] lg:hidden">
          <MobileMenu
            isOpen={mobileMenuOpen}
            onOpen={() =>
              setMobileMenuOpen(true)
            }
            onClose={() =>
              setMobileMenuOpen(false)
            }
          />
        </div>

        {/* =====================================================
            DESKTOP NAVIGATION
        ===================================================== */}

        <div className="hidden lg:block">
          <DesktopNavigation />
        </div>

        {/* =====================================================
            CENTER LOGO
        ===================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            z-10
            -translate-x-1/2
          "
        >
          <BrandLogo />
        </div>

        {/* =====================================================
            HEADER ACTIONS
        ===================================================== */}

        <div className="relative z-[20] ml-auto flex items-center">
          <HeaderActions />
        </div>
      </div>
    </header>
  );
}