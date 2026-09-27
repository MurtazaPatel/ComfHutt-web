import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains-mono",
  preload: false,
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  preload: false,
});

const SITE_URL = "https://crux.comfhutt.com";
// Metadata states only what CRUX does today: a letter grade for RERA-registered
// projects in Gujarat. The previous copy promised "any property in India" and
// "20+ live data signals" — neither is true, and both were the first thing a
// search result showed.
const SITE_TITLE = "CRUX — Grades for Gujarat's RERA-registered projects";
const SITE_DESCRIPTION =
  "CRUX grades RERA-registered projects in Gujarat A+ to D, from GujRERA filings, tribunal orders and the court record. Every grade links to the documents behind it. Free, and no signup for your first three.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — CRUX",
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "CRUX by ComfHutt",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ComfHutt Technologies",
    url: "https://comfhutt.com",
    logo: `${SITE_URL}/comfhutt-logo.svg`,
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CRUX",
    url: SITE_URL,
    // No SearchAction: it advertised a sitelinks search box at /?q=<term>, and
    // nothing on this site reads a `q` parameter. Declaring an entry point that
    // does not resolve is a false claim, just one made to a crawler.
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "CRUX",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: SITE_DESCRIPTION,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        inter.variable,
        jetbrainsMono.variable,
        instrumentSerif.variable
      )}
    >
      <head>
        <script
          type="application/ld+json"
          // Static, server-authored structured data — not user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="min-h-full flex flex-col font-sans bg-background text-foreground"
        style={{ background: 'var(--color-crux-bg-primary)' }}
      >
        <ClerkProvider>
          {children}
        </ClerkProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
