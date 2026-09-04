"use client";

import { useState } from "react";

import { Menu } from "lucide-react";

import { BrandLogo } from "@/components/layout/brand-logo";
import { DesktopNavigation } from "@/components/layout/desktop-navigation";
import { HeaderActions } from "@/components/layout/header-actions";
import { MobileMenu } from "@/components/layout/mobile-menu";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const handleSearchClick = () => {
    // Search system will be connected later.
    console.log("Open search");
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[rgba(252,251,249,0.94)] backdrop-blur-xl">
        <div className="container-premium">
          <div className="grid min-h-[76px] grid-cols-[1fr_auto_1fr] items-center xl:min-h-[88px]">
            {/* Left */}
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex h-11 w-11 items-center justify-center xl:hidden"
                aria-label="Open navigation"
              >
                <Menu
                  size={22}
                  strokeWidth={1.6}
                />
              </button>

              <DesktopNavigation />
            </div>

            {/* Center Brand */}
            <BrandLogo />

            {/* Right */}
            <div className="flex justify-end">
              <HeaderActions
                onSearchClick={handleSearchClick}
              />
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}