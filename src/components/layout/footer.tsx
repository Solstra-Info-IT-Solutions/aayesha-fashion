import Link from "next/link";
import {
  ArrowUpRight,
  Instagram,
  Facebook,
  MessageCircle,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import { Container } from "@/components/shared/container";

/* ============================================================
   FOOTER NAVIGATION
============================================================ */

const footerNavigation = {
  shop: [
    {
      label: "New Arrivals",
      href: "/collections/new-arrivals",
    },
    {
      label: "Best Sellers",
      href: "/collections/best-sellers",
    },
    {
      label: "Shop All",
      href: "/shop",
    },
  ],

  collections: [
    {
      label: "Festive",
      href: "/collections/festive",
    },
    {
      label: "Ethnic",
      href: "/collections/ethnic",
    },
    {
      label: "Contemporary",
      href: "/collections/contemporary",
    },
  ],

  information: [
    {
      label: "Our Story",
      href: "/our-story",
    },
    {
      label: "Contact Us",
      href: "/contact",
    },
    {
      label: "Shipping & Delivery",
      href: "/shipping",
    },
    {
      label: "Returns & Exchange",
      href: "/returns",
    },
  ],
} as const;

/* ============================================================
   LEGAL
============================================================ */

const legalLinks = [
  {
    label: "Privacy Policy",
    href: "/privacy-policy",
  },
  {
    label: "Terms & Conditions",
    href: "/terms",
  },
  {
    label: "Shipping Policy",
    href: "/shipping-policy",
  },
  {
    label: "Refund Policy",
    href: "/refund-policy",
  },
] as const;

/* ============================================================
   SOCIAL LINKS
============================================================ */

const socialLinks = [
  siteConfig.social.instagram
    ? {
        label: "Instagram",
        href: siteConfig.social.instagram,
        icon: Instagram,
      }
    : null,

  siteConfig.social.facebook
    ? {
        label: "Facebook",
        href: siteConfig.social.facebook,
        icon: Facebook,
      }
    : null,

  siteConfig.social.whatsapp
    ? {
        label: "WhatsApp",
        href: siteConfig.social.whatsapp,
        icon: MessageCircle,
      }
    : null,
].filter(
  (
    social
  ): social is NonNullable<typeof social> =>
    social !== null
);

/* ============================================================
   FOOTER
============================================================ */

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-charcoal)] text-white">
      <Container>
        <div className="py-16 sm:py-20 lg:py-24">
          {/* =====================================================
              MAIN FOOTER
          ===================================================== */}

          <div className="border-t border-white/15 pt-7 sm:pt-8">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              {/* =================================================
                  BRAND
              ================================================= */}

              <div className="lg:col-span-5">
                <Link
                  href="/"
                  aria-label={`${siteConfig.name} home`}
                  className="inline-flex flex-col"
                >
                  <span className="font-display text-[3.4rem] font-medium leading-none tracking-[-0.03em] sm:text-[3.8rem]">
                    {siteConfig.name
                      .split(" ")[0]}
                  </span>

                  <span className="mt-2 text-[8px] font-medium uppercase tracking-[0.42em] text-white/45">
                    Fashion
                  </span>
                </Link>

                <p className="mt-7 max-w-[420px] text-[15px] leading-8 text-white/58 sm:text-[16px] sm:leading-8">
                  {siteConfig.description}
                </p>

                {/* =================================================
                    SOCIAL
                ================================================= */}

                {socialLinks.length > 0 && (
                  <div className="mt-8 flex items-center gap-2.5">
                    {socialLinks.map((social) => {
                      const Icon = social.icon;

                      return (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={
                            social.label
                          }
                          className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            border
                            border-white/15
                            text-white/65
                            transition-all
                            duration-300
                            hover:border-[var(--color-rose)]
                            hover:bg-[var(--color-rose)]
                            hover:text-[var(--color-charcoal)]
                          "
                        >
                          <Icon
                            size={17}
                            strokeWidth={1.3}
                          />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* =================================================
                  NAVIGATION
              ================================================= */}

              <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7 lg:gap-12">
                <FooterColumn
                  title="Shop"
                  links={footerNavigation.shop}
                />

                <FooterColumn
                  title="Collections"
                  links={
                    footerNavigation.collections
                  }
                />

                <FooterColumn
                  title="Information"
                  links={
                    footerNavigation.information
                  }
                />
              </div>
            </div>
          </div>

          {/* =====================================================
              CUSTOMER CARE
          ===================================================== */}

          <div className="mt-14 grid border-y border-white/15 sm:grid-cols-2">
            {/* EMAIL */}

            {siteConfig.contact.email && (
              <div className="border-b border-white/15 py-7 sm:border-b-0 sm:border-r sm:pr-10">
                <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white/40">
                  Customer Care
                </p>

                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="mt-3 inline-flex items-center gap-2 text-[14px] text-white/78 transition-colors duration-300 hover:text-[var(--color-rose-light)]"
                >
                  {siteConfig.contact.email}

                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.3}
                  />
                </a>
              </div>
            )}

            {/* WHATSAPP / PHONE */}

            <div
              className={`py-7 ${
                siteConfig.contact.email
                  ? "sm:pl-10"
                  : "sm:col-span-2"
              }`}
            >
              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white/40">
                WhatsApp
              </p>

              {siteConfig.social.whatsapp ? (
                <a
                  href={
                    siteConfig.social.whatsapp
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-[14px] text-white/78 transition-colors duration-300 hover:text-[var(--color-rose-light)]"
                >
                  Chat with us

                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.3}
                  />
                </a>
              ) : siteConfig.contact.phone ? (
                <a
                  href={`tel:+${siteConfig.contact.phone}`}
                  className="mt-3 inline-flex items-center gap-2 text-[14px] text-white/78 transition-colors duration-300 hover:text-[var(--color-rose-light)]"
                >
                  +{siteConfig.contact.phone}

                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.3}
                  />
                </a>
              ) : null}
            </div>
          </div>

          {/* =====================================================
              NEWSLETTER LINK
          ===================================================== */}

          <div className="mt-11 flex flex-col justify-between gap-6 border-b border-white/15 pb-9 sm:flex-row sm:items-end">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[var(--color-rose-light)]">
                Stay in the know
              </p>

              <p className="mt-3 font-display text-[1.9rem] leading-none text-white sm:text-[2.2rem]">
                Discover the next Ayesha edit.
              </p>
            </div>

            <Link
              href="#newsletter"
              className="
                group
                inline-flex
                items-center
                gap-3
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-white/65
                transition-colors
                duration-300
                hover:text-white
              "
            >
              Join the newsletter

              <ArrowUpRight
                size={15}
                strokeWidth={1.3}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>

          {/* =====================================================
              LEGAL
          ===================================================== */}

          <div className="pt-8">
            <div className="flex flex-col gap-6 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-white/35">
                © {currentYear}{" "}
                {siteConfig.name}. All rights reserved.
              </p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {legalLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="transition-colors duration-300 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

/* ============================================================
   FOOTER COLUMN
============================================================ */

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly {
    label: string;
    href: string;
  }[];
}) {
  return (
    <div>
      <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white/40">
        {title}
      </p>

      <nav className="mt-6 flex flex-col gap-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="
              text-[13px]
              leading-5
              text-white/68
              transition-colors
              duration-300
              hover:text-white
              sm:text-[14px]
            "
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}