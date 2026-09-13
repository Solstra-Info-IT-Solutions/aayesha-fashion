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
    <section
      aria-label="Shopping assurances"
      className="
        grid
        grid-cols-2
        border-y
        border-[var(--color-border)]
      "
    >
      {trustItems.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className={[
              "group flex gap-3 py-5",
              "transition-colors duration-[var(--duration-base)]",
              "hover:bg-[var(--color-bg-soft)]",
              index % 2 === 0
                ? "border-r border-[var(--color-border)] pr-4 sm:pr-5"
                : "pl-4 sm:pl-5",
              index < 2
                ? "border-b border-[var(--color-border)]"
                : "",
            ].join(" ")}
          >
            {/* Icon */}
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
                bg-[var(--color-surface)]
                text-[var(--color-accent)]
                transition-all
                duration-[var(--duration-base)]
                ease-[var(--ease-luxury)]
                group-hover:border-[var(--color-accent-soft)]
                group-hover:bg-[var(--color-surface-soft)]
              "
            >
              <Icon
                size={15}
                strokeWidth={1.25}
              />
            </span>

            {/* Content */}
            <div className="min-w-0">
              <p
                className="
                  font-body
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-[var(--color-text)]
                "
              >
                {item.title}
              </p>

              <p
                className="
                  mt-1.5
                  font-body
                  text-[10px]
                  leading-[1.7]
                  text-[var(--color-text-muted)]
                "
              >
                {item.text}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}