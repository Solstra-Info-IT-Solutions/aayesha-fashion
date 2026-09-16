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
      setIsScrolled(window.scrollY > 20);
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

  /* =========================================================
     HEADER
  ========================================================= */

  return (
    <header
      className={[
        "fixed",
        "inset-x-0",
        "top-0",
        "z-[var(--z-header)]",
        "w-full",
        "transition-all",
        "duration-300",

        isScrolled
          ? [
              "border-b",
              "border-[var(--color-border-light)]",
              "bg-[rgba(247,243,238,0.96)]",
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
          h-[64px]
          w-full
          max-w-[1600px]
          items-center
          px-4
          sm:h-[68px]
          sm:px-6
          md:h-[72px]
          md:px-8
          lg:h-[78px]
          lg:px-10
          xl:px-14
        "
      >
        {/* ===================================================
            MOBILE MENU
        =================================================== */}

        <div
          className="
            relative
            z-[120]
            flex
            shrink-0
            items-center
            lg:hidden
          "
        >
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

        {/* ===================================================
            DESKTOP NAVIGATION
        =================================================== */}

        <nav
          className="
            hidden
            shrink-0
            lg:block
          "
          aria-label="Primary navigation"
        >
          <DesktopNavigation />
        </nav>

        {/* ===================================================
            CENTER LOGO
        =================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            z-10
            -translate-x-1/2
            -translate-y-1/2
          "
        >
          <BrandLogo />
        </div>

        {/* ===================================================
            HEADER ACTIONS
        =================================================== */}

        <div
          className="
            relative
            z-[20]
            ml-auto
            flex
            shrink-0
            items-center
          "
        >
          <HeaderActions />
        </div>
      </div>
    </header>
  );
}