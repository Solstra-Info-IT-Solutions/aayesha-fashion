"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

import type { ProductSizeChart } from "@/types/product";

interface SizeGuideProps {
  sizeChart?: ProductSizeChart;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SizeGuide({
  sizeChart,
  open = false,
  onOpenChange,
}: SizeGuideProps) {
  const controlled = typeof onOpenChange === "function";

  const close = () => {
    onOpenChange?.(false);
  };

  useEffect(() => {
    if (!open) return;

    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("keydown", escape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", escape);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!controlled) {
    return null;
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90]">
      <button
        type="button"
        aria-label="Close size guide"
        onClick={close}
        className="absolute inset-0 bg-black/40"
      />

      <aside className="absolute inset-y-0 right-0 w-full max-w-xl overflow-y-auto bg-[var(--color-ivory)] px-5 py-6 sm:px-8">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
              Ayesha sizing
            </p>

            <h2 className="mt-1 font-[var(--font-cormorant)] text-3xl">
              Size Guide
            </h2>
          </div>

          <button
            type="button"
            onClick={close}
            className="flex h-10 w-10 items-center justify-center border border-[var(--color-border)]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {sizeChart ? (
          <div className="py-7">
            <p className="text-xs text-[var(--color-text-muted)]">
              Measurements shown in {sizeChart.unit}.
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-left">
                <thead>
                  <tr className="border-y border-[var(--color-border)]">
                    <th className="px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.1em]">
                      Size
                    </th>

                    <th className="px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.1em]">
                      Bust
                    </th>

                    <th className="px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.1em]">
                      Waist
                    </th>

                    <th className="px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.1em]">
                      Hip
                    </th>

                    <th className="px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.1em]">
                      Length
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {sizeChart.measurements.map((measurement) => (
                    <tr
                      key={measurement.size}
                      className="border-b border-[var(--color-border)]"
                    >
                      <td className="px-3 py-3 text-xs font-semibold">
                        {measurement.size}
                      </td>

                      <td className="px-3 py-3 text-xs text-[var(--color-text-secondary)]">
                        {measurement.bust ?? "—"}
                      </td>

                      <td className="px-3 py-3 text-xs text-[var(--color-text-secondary)]">
                        {measurement.waist ?? "—"}
                      </td>

                      <td className="px-3 py-3 text-xs text-[var(--color-text-secondary)]">
                        {measurement.hip ?? "—"}
                      </td>

                      <td className="px-3 py-3 text-xs text-[var(--color-text-secondary)]">
                        {measurement.garmentLength ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {sizeChart.fitNote && (
              <div className="mt-7 border-l-2 border-[var(--color-rose)] pl-4">
                <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
                  {sizeChart.fitNote}
                </p>
              </div>
            )}

            <div className="mt-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.13em]">
                How to measure
              </p>

              <div className="mt-4 space-y-3 text-sm leading-6 text-[var(--color-text-secondary)]">
                <p>
                  <strong>Bust:</strong> Measure around the fullest
                  part of your bust.
                </p>

                <p>
                  <strong>Waist:</strong> Measure around your natural
                  waistline.
                </p>

                <p>
                  <strong>Hip:</strong> Measure around the fullest
                  part of your hips.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-10">
            <p className="text-sm leading-7 text-[var(--color-text-secondary)]">
              Size measurements for this product will be added
              soon.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}