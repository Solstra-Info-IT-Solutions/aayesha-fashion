"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

const TYPE_SPEED_MS = 60;
const RESULT_TEXT =
  "Delivery available · Estimated 3–7 business days to this pincode.";

/**
 * Delivery pincode checker whose result types itself in character-by-
 * character (~60ms/char) instead of showing a spinner (signature detail #5).
 *
 * TODO (integration pass): swap the fake ~600ms delay + static RESULT_TEXT
 * for the real pincode/serviceability API call.
 */
export function ProductDeliveryCheckerDrape() {
  const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "done">("idle");
  const [typedText, setTypedText] = useState("");

  const typingIndexRef = useRef(0);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function checkDelivery() {
    if (!/^\d{6}$/.test(pincode)) return;

    setStatus("checking");
    setTypedText("");
    typingIndexRef.current = 0;

    // TODO (integration pass): replace with a real serviceability lookup.
    setTimeout(() => {
      setStatus("done");
    }, 500);
  }

  useEffect(() => {
    if (status !== "done") return;

    function typeNextChar() {
      typingIndexRef.current += 1;
      setTypedText(RESULT_TEXT.slice(0, typingIndexRef.current));

      if (typingIndexRef.current < RESULT_TEXT.length) {
        typingTimerRef.current = setTimeout(typeNextChar, TYPE_SPEED_MS);
      }
    }

    typeNextChar();

    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div className="w-full">
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-[var(--aged-brass)]/40 text-[var(--aged-brass)]">
          <MapPin size={15} strokeWidth={1.25} />
        </span>

        <div>
          <p className="drape-font-body text-[10px] uppercase tracking-[0.18em] text-[var(--unbleached-cotton)]">
            Check Delivery
          </p>
          <p className="mt-1 drape-font-body text-[10px] leading-5 text-[var(--text-muted)]">
            Enter your pincode to check delivery availability.
          </p>
        </div>
      </div>

      <div className="mt-4 flex w-full">
        <label htmlFor="drape-delivery-pincode" className="sr-only">
          Enter delivery pincode
        </label>

        <input
          id="drape-delivery-pincode"
          value={pincode}
          onChange={(event) =>
            setPincode(event.target.value.replace(/\D/g, "").slice(0, 6))
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") checkDelivery();
          }}
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          placeholder="Enter pincode"
          className="h-11 min-w-0 flex-1 border-b border-[var(--aged-brass)]/50 bg-transparent px-1 drape-font-body text-[12px] text-[var(--unbleached-cotton)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--sindoor-rust)]"
        />

        <button
          type="button"
          onClick={checkDelivery}
          disabled={status === "checking"}
          className="ml-3 h-11 min-w-[82px] drape-font-body text-[9px] uppercase tracking-[0.16em] text-[var(--unbleached-cotton)] transition-colors hover:text-[var(--sindoor-rust)] disabled:opacity-40"
        >
          {status === "checking" ? "…" : "Check"}
        </button>
      </div>

      {status === "done" && (
        <p
          role="status"
          aria-live="polite"
          className="mt-4 min-h-[2.5rem] drape-font-body text-[11px] leading-5 text-[var(--bottle-moss)]"
        >
          {typedText}
          <span className="animate-pulse">
            {typedText.length < RESULT_TEXT.length ? "▍" : ""}
          </span>
        </p>
      )}
    </div>
  );
}
