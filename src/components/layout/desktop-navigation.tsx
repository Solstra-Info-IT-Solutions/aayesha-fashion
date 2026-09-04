import Link from "next/link";

const navigation = [
  {
    label: "New Arrivals",
    href: "/collections/new-arrivals",
  },
  {
    label: "Shop",
    href: "/shop",
  },
  {
    label: "Collections",
    href: "/collections",
  },
  {
    label: "Best Sellers",
    href: "/collections/best-sellers",
  },
];

export function DesktopNavigation() {
  return (
    <nav
      aria-label="Primary navigation"
      className="flex items-center gap-8 xl:gap-9"
    >
      {navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.18em]
            text-[var(--color-charcoal)]
            transition-colors
            duration-300
            hover:text-[var(--color-rose-dark)]
            lg:text-[9.5px]
            xl:text-[10px]
          "
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}