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
  const controlled =
    typeof onOpenChange === "function";

  const close = () => {
    onOpenChange?.(false);
  };

  useEffect(() => {
    if (!open) return;

    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    document.addEventListener(
      "keydown",
      escape,
    );

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        escape,
      );

      document.body.style.overflow = "";
    };
  }, [open]);

  if (!controlled || !open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[var(--z-modal)]
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="size-guide-title"
    >
      {/* =====================================================
          BACKDROP
      ===================================================== */}

      <button
        type="button"
        aria-label="Close size guide"
        onClick={close}
        className="
          absolute
          inset-0
          cursor-default
          bg-[var(--color-text)]/45
          backdrop-blur-[2px]
        "
      />

      {/* =====================================================
          DRAWER
      ===================================================== */}

      <aside
        className="
          absolute
          inset-y-0
          right-0
          flex
          w-full
          max-w-xl
          flex-col
          overflow-hidden
          bg-[var(--color-surface)]
          shadow-[var(--shadow-lg)]
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <header
          className="
            flex
            shrink-0
            items-center
            justify-between
            border-b
            border-[var(--color-border)]
            px-5
            py-5
            sm:px-8
            sm:py-6
          "
        >
          <div>
            <p
              className="
                font-body
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-[var(--color-accent)]
              "
            >
              Ayesha Sizing
            </p>

            <h2
              id="size-guide-title"
              className="
                mt-1
                font-display
                text-[2rem]
                font-medium
                leading-none
                tracking-tight
                text-[var(--color-text)]
                sm:text-[2.4rem]
              "
            >
              Size Guide
            </h2>
          </div>

          <button
            type="button"
            onClick={close}
            aria-label="Close size guide"
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              border
              border-[var(--color-border)]
              bg-[var(--color-surface)]
              text-[var(--color-text)]
              transition-all
              duration-[var(--duration-base)]
              hover:border-[var(--color-text)]
              hover:bg-[var(--color-bg-soft)]
              focus-visible:outline-none
              focus-visible:ring-1
              focus-visible:ring-[var(--color-text)]
              focus-visible:ring-offset-2
            "
          >
            <X
              size={17}
              strokeWidth={1.25}
            />
          </button>
        </header>

        {/* =================================================
            SCROLLABLE CONTENT
        ================================================= */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overscroll-contain
            px-5
            sm:px-8
          "
        >
          {sizeChart ? (
            <div className="py-7 sm:py-8">
              {/* Measurement intro */}

              <div
                className="
                  flex
                  items-end
                  justify-between
                  gap-4
                "
              >
                <p
                  className="
                    font-body
                    text-[11px]
                    leading-5
                    text-[var(--color-text-secondary)]
                  "
                >
                  Measurements shown in{" "}
                  <span className="font-semibold text-[var(--color-text)]">
                    {sizeChart.unit}
                  </span>
                  .
                </p>

                <span
                  className="
                    shrink-0
                    font-body
                    text-[9px]
                    uppercase
                    tracking-[0.14em]
                    text-[var(--color-text-muted)]
                  "
                >
                  Product measurements
                </span>
              </div>

              {/* =================================================
                  SIZE TABLE
              ================================================= */}

              <div
                className="
                  mt-6
                  overflow-x-auto
                  border-y
                  border-[var(--color-border)]
                "
              >
                <table
                  className="
                    w-full
                    min-w-[520px]
                    border-collapse
                    text-left
                  "
                >
                  <thead>
                    <tr className="border-b border-[var(--color-border)]">
                      <th
                        scope="col"
                        className="
                          px-3
                          py-3.5
                          font-body
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-[0.14em]
                          text-[var(--color-text)]
                        "
                      >
                        Size
                      </th>

                      <th
                        scope="col"
                        className="
                          px-3
                          py-3.5
                          font-body
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-[0.14em]
                          text-[var(--color-text)]
                        "
                      >
                        Bust
                      </th>

                      <th
                        scope="col"
                        className="
                          px-3
                          py-3.5
                          font-body
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-[0.14em]
                          text-[var(--color-text)]
                        "
                      >
                        Waist
                      </th>

                      <th
                        scope="col"
                        className="
                          px-3
                          py-3.5
                          font-body
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-[0.14em]
                          text-[var(--color-text)]
                        "
                      >
                        Hip
                      </th>

                      <th
                        scope="col"
                        className="
                          px-3
                          py-3.5
                          font-body
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-[0.14em]
                          text-[var(--color-text)]
                        "
                      >
                        Length
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {sizeChart.measurements.map(
                      (measurement) => (
                        <tr
                          key={measurement.size}
                          className="
                            border-b
                            border-[var(--color-border-light)]
                            last:border-b-0
                          "
                        >
                          <td
                            className="
                              px-3
                              py-4
                              font-body
                              text-[11px]
                              font-semibold
                              text-[var(--color-text)]
                            "
                          >
                            {measurement.size}
                          </td>

                          <td
                            className="
                              px-3
                              py-4
                              font-body
                              text-[11px]
                              text-[var(--color-text-secondary)]
                            "
                          >
                            {measurement.bust ?? "—"}
                          </td>

                          <td
                            className="
                              px-3
                              py-4
                              font-body
                              text-[11px]
                              text-[var(--color-text-secondary)]
                            "
                          >
                            {measurement.waist ?? "—"}
                          </td>

                          <td
                            className="
                              px-3
                              py-4
                              font-body
                              text-[11px]
                              text-[var(--color-text-secondary)]
                            "
                          >
                            {measurement.hip ?? "—"}
                          </td>

                          <td
                            className="
                              px-3
                              py-4
                              font-body
                              text-[11px]
                              text-[var(--color-text-secondary)]
                            "
                          >
                            {measurement.garmentLength ?? "—"}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>

              {/* =================================================
                  FIT NOTE
              ================================================= */}

              {sizeChart.fitNote && (
                <div
                  className="
                    mt-7
                    border-l-2
                    border-[var(--color-accent)]
                    bg-[var(--color-bg-soft)]
                    px-4
                    py-4
                  "
                >
                  <p
                    className="
                      font-body
                      text-[11px]
                      leading-6
                      text-[var(--color-text-secondary)]
                    "
                  >
                    {sizeChart.fitNote}
                  </p>
                </div>
              )}

              {/* =================================================
                  HOW TO MEASURE
              ================================================= */}

              <div
                className="
                  mt-9
                  border-t
                  border-[var(--color-border)]
                  pt-7
                "
              >
                <div>
                  <p
                    className="
                      font-body
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.2em]
                      text-[var(--color-accent)]
                    "
                  >
                    Find your fit
                  </p>

                  <h3
                    className="
                      mt-1
                      font-display
                      text-[1.65rem]
                      font-medium
                      text-[var(--color-text)]
                    "
                  >
                    How to measure
                  </h3>
                </div>

                <div className="mt-5 space-y-0">
                  <div
                    className="
                      border-b
                      border-[var(--color-border-light)]
                      py-4
                    "
                  >
                    <p
                      className="
                        font-body
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        text-[var(--color-text)]
                      "
                    >
                      Bust
                    </p>

                    <p
                      className="
                        mt-1.5
                        font-body
                        text-[11px]
                        leading-6
                        text-[var(--color-text-secondary)]
                      "
                    >
                      Measure around the fullest
                      part of your bust.
                    </p>
                  </div>

                  <div
                    className="
                      border-b
                      border-[var(--color-border-light)]
                      py-4
                    "
                  >
                    <p
                      className="
                        font-body
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        text-[var(--color-text)]
                      "
                    >
                      Waist
                    </p>

                    <p
                      className="
                        mt-1.5
                        font-body
                        text-[11px]
                        leading-6
                        text-[var(--color-text-secondary)]
                      "
                    >
                      Measure around your natural
                      waistline.
                    </p>
                  </div>

                  <div className="py-4">
                    <p
                      className="
                        font-body
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        text-[var(--color-text)]
                      "
                    >
                      Hip
                    </p>

                    <p
                      className="
                        mt-1.5
                        font-body
                        text-[11px]
                        leading-6
                        text-[var(--color-text-secondary)]
                      "
                    >
                      Measure around the fullest
                      part of your hips.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="
                py-12
                sm:py-16
              "
            >
              <p
                className="
                  font-display
                  text-2xl
                  text-[var(--color-text)]
                "
              >
                Size information coming soon.
              </p>

              <p
                className="
                  mt-3
                  max-w-md
                  font-body
                  text-[11px]
                  leading-6
                  text-[var(--color-text-secondary)]
                "
              >
                Size measurements for this
                product will be added soon.
              </p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}