import {
  ShieldCheck,
  Sparkles,
  Truck,
  RotateCcw,
} from "lucide-react";

const trustItems = [
  {
    icon: Truck,
    title: "Reliable Delivery",
    text: "Secure delivery across India",
  },
  {
    icon: RotateCcw,
    title: "Easy Exchange",
    text: "Simple support for eligible orders",
  },
  {
    icon: ShieldCheck,
    title: "Secure Shopping",
    text: "Protected checkout experience",
  },
  {
    icon: Sparkles,
    title: "Curated Quality",
    text: "Thoughtfully selected designs",
  },
];

export function ProductTrustBadges() {
  return (
    <section className="grid grid-cols-2 border-y border-[var(--color-border)]">
      {trustItems.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className={[
              "flex gap-3 py-5",
              index % 2 === 0
                ? "border-r border-[var(--color-border)] pr-5"
                : "pl-5",
              index < 2
                ? "border-b border-[var(--color-border)]"
                : "",
            ].join(" ")}
          >
            <Icon
              size={17}
              strokeWidth={1.4}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.11em]">
                {item.title}
              </p>

              <p className="mt-1 text-[11px] leading-5 text-[var(--color-text-muted)]">
                {item.text}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}