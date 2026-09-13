"use client";

import { useState } from "react";
import {
  Check,
  MapPin,
} from "lucide-react";

export function ProductDeliveryChecker() {
  const [pincode, setPincode] =
    useState("");

  const [checked, setChecked] =
    useState(false);

  const checkDelivery = () => {
    if (!/^\d{6}$/.test(pincode)) {
      setChecked(false);
      return;
    }

    setChecked(true);
  };

  return (
    <section
      aria-labelledby="delivery-check-title"
      className="
        w-full
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          flex
          items-start
          gap-3
        "
      >
        <span
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            border
            border-[var(--color-border)]
            bg-[var(--color-bg-soft)]
            text-[var(--color-text)]
          "
        >
          <MapPin
            size={15}
            strokeWidth={1.25}
          />
        </span>

        <div>
          <p
            id="delivery-check-title"
            className="
              font-body
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-[var(--color-text)]
            "
          >
            Check Delivery
          </p>

          <p
            className="
              mt-1
              font-body
              text-[10px]
              leading-5
              text-[var(--color-text-muted)]
            "
          >
            Enter your pincode to check
            delivery availability.
          </p>
        </div>
      </div>

      {/* =====================================================
          PINCODE INPUT
      ===================================================== */}

      <div
        className="
          mt-4
          flex
          w-full
        "
      >
        <label
          htmlFor="delivery-pincode"
          className="sr-only"
        >
          Enter delivery pincode
        </label>

        <input
          id="delivery-pincode"
          value={pincode}
          onChange={(event) =>
            setPincode(
              event.target.value
                .replace(/\D/g, "")
                .slice(0, 6),
            )
          }
          onKeyDown={(event) => {
            if (
              event.key ===
              "Enter"
            ) {
              checkDelivery();
            }
          }}
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          placeholder="Enter pincode"
          aria-describedby="delivery-pincode-hint"
          className="
            h-12
            min-w-0
            flex-1
            border
            border-r-0
            border-[var(--color-border-dark)]
            bg-transparent
            px-4
            font-body
            text-[12px]
            text-[var(--color-text)]
            outline-none
            transition-colors
            duration-[var(--duration-base)]
            placeholder:text-[var(--color-text-muted)]
            focus:border-[var(--color-text)]
            focus:bg-[var(--color-surface-soft)]
          "
        />

        <button
          type="button"
          onClick={checkDelivery}
          className="
            h-12
            min-w-[82px]
            bg-[var(--color-text)]
            px-5
            font-body
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.16em]
            text-[var(--color-text-inverse)]
            transition-all
            duration-[var(--duration-base)]
            ease-[var(--ease-luxury)]
            hover:bg-[var(--color-accent-dark)]
            focus-visible:outline-none
            focus-visible:ring-1
            focus-visible:ring-[var(--color-text)]
            focus-visible:ring-offset-2
          "
        >
          Check
        </button>
      </div>

      <p
        id="delivery-pincode-hint"
        className="
          mt-2
          font-body
          text-[9px]
          text-[var(--color-text-muted)]
        "
      >
        6-digit Indian pincode
      </p>

      {/* =====================================================
          DELIVERY RESULT
      ===================================================== */}

      {checked && (
        <div
          className="
            mt-5
            border
            border-[var(--color-border-light)]
            bg-[var(--color-bg-soft)]
            p-4
          "
          role="status"
          aria-live="polite"
        >
          <div
            className="
              flex
              items-start
              gap-3
            "
          >
            <span
              className="
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                border
                border-[var(--color-success)]
                text-[var(--color-success)]
              "
            >
              <Check
                size={14}
                strokeWidth={1.5}
              />
            </span>

            <div>
              <p
                className="
                  font-body
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.1em]
                  text-[var(--color-text)]
                "
              >
                Delivery available
              </p>

              <p
                className="
                  mt-1.5
                  font-body
                  text-[10px]
                  leading-5
                  text-[var(--color-text-secondary)]
                "
              >
                Estimated delivery within
                3–7 business days.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}