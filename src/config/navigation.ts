export type NavigationItem = {
  label: string;
  href: string;
};

export const mainNavigation: NavigationItem[] = [
  {
    label: "New Arrivals",
    href: "/shop?sort=newest",
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
    href: "/shop?sort=best-selling",
  },
];

export const mobileNavigation: NavigationItem[] = [
  ...mainNavigation,
  {
    label: "Wishlist",
    href: "/wishlist",
  },
  {
    label: "My Account",
    href: "/account",
  },
];