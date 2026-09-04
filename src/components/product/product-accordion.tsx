"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface ProductAccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function ProductAccordion({
  title,
  children,
  defaultOpen = false,
}: ProductAccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[var(--color-border)] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-6 py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.15em]">
          {title}
        </span>

        <ChevronDown
          size={17}
          className={[
            "shrink-0 transition-transform duration-200",
            open ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>

      {open && (
        <div className="pb-6">
          {children}
        </div>
      )}
    </div>
  );
}