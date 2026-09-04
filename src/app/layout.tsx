import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Manrope,
} from "next/font/google";

import "./globals.css";
import { Toaster } from "react-hot-toast";

import { siteConfig } from "@/config/site";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },

  description: siteConfig.description,

  metadataBase: new URL(siteConfig.url),

  keywords: [
    "Aayesha Fashion",
    "Luxury Fashion",
    "Women's Fashion",
    "Indian Fashion",
    "Online Shopping",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${manrope.variable} ${cormorant.variable} antialiased`}
      >
        {children}

         <Toaster
          position="top-right"
          toastOptions={{
            duration: 2200,
            style: {
              background: "#1b1d1d",
              color: "#ffffff",
              borderRadius: "0",
              fontSize: "12px",
              fontWeight: "600",
            },
          }}
        />
      </body>
    </html>
  );
}