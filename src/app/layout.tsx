import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/shell/SiteFooter";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { SkipLink } from "@/components/shell/SkipLink";
import { siteConfig } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.canonicalUrl),
  title: {
    default: "Harry — Developer & Writer",
    template: "%s — Harry"
  },
  description: siteConfig.description,
  applicationName: "Harry",
  authors: [{ name: siteConfig.displayName, url: siteConfig.canonicalUrl }],
  creator: siteConfig.displayName,
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/rss.xml"
    }
  },
  openGraph: {
    type: "website",
    url: siteConfig.canonicalUrl,
    title: "Harry — Developer & Writer",
    description: siteConfig.description,
    siteName: "Harry",
    images: [{ url: "/brand/og-default.png", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Harry — Developer & Writer",
    description: siteConfig.description,
    images: ["/brand/og-default.png"]
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" }
    ],
    apple: "/apple-touch-icon.png"
  },
  manifest: "/manifest.webmanifest"
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#11111b",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SkipLink />
        <SiteHeader />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
