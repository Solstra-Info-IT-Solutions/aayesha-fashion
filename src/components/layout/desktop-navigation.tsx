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
      className="
        flex
        items-center
        gap-7
        xl:gap-9
      "
    >
      {navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="
            group
            relative
            py-3
            font-body
            text-[10px]
            font-medium
            uppercase
            tracking-[0.18em]
            text-[var(--color-text)]
            transition-colors
            duration-[var(--duration-base)]
            hover:text-[var(--color-accent)]
            xl:text-[10.5px]
          "
        >
          <span>
            {item.label}
          </span>

          {/* -----------------------------------------------
              LUXURY HOVER UNDERLINE
          ----------------------------------------------- */}

          <span
            aria-hidden="true"
            className="
              absolute
              bottom-[3px]
              left-0
              h-px
              w-full
              origin-right
              scale-x-0
              bg-current
              transition-transform
              duration-[var(--duration-base)]
              ease-[var(--ease-luxury)]
              group-hover:origin-left
              group-hover:scale-x-100
            "
          />
        </Link>
      ))}
    </nav>
  );
}