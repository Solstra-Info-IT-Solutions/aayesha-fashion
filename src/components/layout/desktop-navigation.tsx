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
        gap-5
        xl:gap-7
      "
    >
      {navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="
            group
            relative
            whitespace-nowrap
            py-2
            font-body
            text-[10px]
            font-medium
            uppercase
            tracking-[0.16em]
            text-current
            transition-colors
            duration-300
            hover:text-[var(--color-accent)]
            xl:text-[10.5px]
          "
        >
          <span>
            {item.label}
          </span>

          <span
            aria-hidden="true"
            className="
              absolute
              bottom-0
              left-0
              h-px
              w-full
              origin-right
              scale-x-0
              bg-current
              transition-transform
              duration-300
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