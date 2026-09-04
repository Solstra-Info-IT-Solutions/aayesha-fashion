import { Truck } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-[var(--color-charcoal)] text-white">
      <div className="container-premium flex min-h-10 items-center justify-center gap-2 py-2 text-center">
        <Truck
          size={14}
          strokeWidth={1.8}
          aria-hidden="true"
        />

        <p className="text-[10px] font-medium uppercase tracking-[0.16em] sm:text-xs">
          Complimentary shipping on orders above ₹2,999
        </p>
      </div>
    </div>
  );
}