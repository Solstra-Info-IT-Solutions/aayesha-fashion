"use client";

import { useEffect, useState } from "react";

import { BrandLogo } from "@/components/layout/brand-logo";
import { DesktopNavigation } from "@/components/layout/desktop-navigation";
import { HeaderActions } from "@/components/layout/header-actions";
import { MobileMenu } from "@/components/layout/mobile-menu";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [isScrolled, setIsScrolled] =
    useState(false);

  /* =========================================================
     SCROLL STATE
  ========================================================= */

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 24);
    }

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true },
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, []);

  return (
    <header
      className={[
        "fixed",
        "top-0",
        "z-[var(--z-header)]",
        "w-full",
        "transition-all",
        "duration-[400ms]",
        "ease-[cubic-bezier(0.22,1,0.36,1)]",

        isScrolled
          ? [
              "border-b",
              "border-[var(--color-border-light)]",
              "bg-[rgba(247,243,238,0.94)]",
              "text-[var(--color-text)]",
              "backdrop-blur-md",
            ].join(" ")
          : [
              "border-b",
              "border-transparent",
              "bg-transparent",
              "text-white",
            ].join(" "),
      ].join(" ")}
    >
      <div
        className="
          relative
          mx-auto
          flex
          h-[72px]
          w-full
          max-w-[1600px]
          items-center
          px-5
          sm:h-[76px]
          sm:px-8
          md:h-[80px]
          md:px-10
          lg:h-[84px]
          lg:px-12
          xl:px-16
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

        <div
          className="
            relative
            z-[20]
            ml-auto
            flex
            items-center
          "
        >
          <HeaderActions />
        </div>
      </div>
    </header>
  );
}