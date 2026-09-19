import type { Metadata } from "next";
import { SiteJsonLd } from "@/components/seo/site-json-ld";

import {
  Fraunces,
  Inter,
  Plus_Jakarta_Sans,
} from "next/font/google";

import "./globals.css";

import { Toaster } from "react-hot-toast";

import { siteConfig } from "@/config/site";

import { AuthProvider } from "@/components/auth/auth-provider";

/*
 * Variable names kept as --font-manrope / --font-cormorant so the rest
 * of the codebase (button.tsx, product-content-renderer.tsx, globals.css)
 * does not need to change — only the underlying typefaces are swapped
 * to the redesign spec (Fraunces serif / Inter sans).
 */
const manrope = Inter({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Fraunces({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  weight: [
    "400",
    "500",
    "600",
    "700",
  ],
});

/*
 * 2026 relaunch tokens (see globals.css --font-fraunces / --font-warm-sans).
 * "General Sans" is a Fontshare font, not available via next/font/google —
 * Plus Jakarta Sans is used as the closest warm-grotesque substitute per
 * the design bible's explicit fallback instruction. Inter stays in the
 * stack's final fallback position via the CSS var default.
 */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  weight: [
    "300",
    "400",
    "500",
    "600",
  ],
  axes: ["opsz", "SOFT", "WONK"],
});

const warmSans = Plus_Jakarta_Sans({
  variable: "--font-warm-sans",
  subsets: ["latin"],
  display: "swap",
  weight: [
    "400",
    "500",
    "600",
    "700",
  ],
});

/* =========================================================
   SEO
========================================================= */

const siteTitle =
  "Aayesha Fashion | Elegant Indian Fashion Online";

const siteDescription =
  "Discover Aayesha Fashion's curated collection of elegant Indian fashion, festive wear, ethnic silhouettes and contemporary styles designed for modern women.";

const siteKeywords = [
  "Aayesha Fashion",
  "Aayesha Fashion India",
  "Aayesha Fashion online",
  "Indian fashion",
  "women's fashion",
  "women's ethnic wear",
  "ethnic wear for women",
  "festive wear women",
  "Indian ethnic clothing",
  "contemporary Indian fashion",
  "anarkali",
  "kurta set",
  "suit set",
  "lehenga",
  "saree",
  "women's dresses",
  "online fashion shopping",
  "Indian clothing online",
];

export const metadata: Metadata = {
  /* =======================================================
     BASIC
  ======================================================= */

  metadataBase: new URL(
    siteConfig.url,
  ),

  title: {
    default: siteTitle,
    template: `%s | ${siteConfig.name}`,
  },

  description:
    siteDescription,

  keywords: siteKeywords,

  applicationName:
    siteConfig.name,

  generator: "Next.js",

  referrer:
    "origin-when-cross-origin",

  creator:
    siteConfig.name,

  publisher:
    siteConfig.name,

  authors: [
    {
      name: siteConfig.name,
    },
  ],

  category: "fashion",

  classification:
    "Luxury Indian Fashion Ecommerce",

  /* =======================================================
     CANONICAL
  ======================================================= */

  alternates: {
    canonical: siteConfig.url,
    languages: {
      "en-IN": siteConfig.url,
    },
  },

  /* =======================================================
     ROBOTS
  ======================================================= */

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },

  /* =======================================================
     OPEN GRAPH
  ======================================================= */

  openGraph: {
    type: "website",

    locale: siteConfig.locale,

    url: siteConfig.url,

    siteName:
      siteConfig.name,

    title: siteTitle,

    description:
      siteDescription,

    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Aayesha Fashion — Elegant Indian Fashion",
        type: "image/jpeg",
      },
    ],
  },

  /* =======================================================
     TWITTER / X
  ======================================================= */

  twitter: {
    card: "summary_large_image",

    title: siteTitle,

    description:
      siteDescription,

    images: [
      "/images/og-image.jpg",
    ],
  },

  /* =======================================================
     ICONS
  ======================================================= */

  icons: {
    icon: [
      {
        url: "/favicon.ico",
      },
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],

    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  /* =======================================================
     MANIFEST
  ======================================================= */

  manifest:
    "/site.webmanifest",

  /* =======================================================
     FORMAT DETECTION
  ======================================================= */

  formatDetection: {
    telephone: true,
    email: true,
    address: false,
  },

  /* =======================================================
     OTHER
  ======================================================= */

  other: {
    "theme-color":
      "#fcfbf9",

    "color-scheme":
      "light",
  },
};

/* =========================================================
   ROOT LAYOUT
========================================================= */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className={`${manrope.variable} ${cormorant.variable} ${fraunces.variable} ${warmSans.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 2200,

            style: {
              background: "#2b2521",

              color: "#fbf6ef",

              borderRadius: "0",

              borderLeft: "2px solid #b8924a",

              fontSize: "12px",

              fontWeight: "600",

              boxShadow: "0 20px 40px -15px rgba(43,37,33,0.25)",
            },

            success: {
              iconTheme: {
                primary: "#6b7f5e",
                secondary: "#fbf6ef",
              },
            },

            error: {
              iconTheme: {
                primary: "#a23e3e",
                secondary: "#fbf6ef",
              },
            },
          }}
        />
      </body>
    </html>
  );
}