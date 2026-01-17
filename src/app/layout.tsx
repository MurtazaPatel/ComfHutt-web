import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "@/components/Providers";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ComfHutt | Fractional Real Estate Investment Platform",
    template: "%s | ComfHutt"
  },
  description:
    "ComfHutt is a fractional real estate investment platform in India. Invest in verified properties starting from ₹10,000. SPV-backed ownership with monthly rental income.",
  metadataBase: new URL("https://comfhutt.com"),
  keywords: [
    "ComfHutt",
    "fractional real estate",
    "property investment India",
    "fractional ownership",
    "real estate tokenization",
    "commercial real estate investing",
    "passive income real estate"
  ],
  openGraph: {
    title: "ComfHutt | Fractional Real Estate Investment Platform",
    description:
      "Invest in pre-vetted real estate assets starting at ₹10,000. Secure SPV ownership, monthly rental yields, and AI-driven property scoring.",
    url: "https://comfhutt.com",
    siteName: "ComfHutt",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://comfhutt.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "ComfHutt - Fractional Real Estate Investment Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ComfHutt | Fractional Real Estate Investment Platform",
    description:
      "Invest in verified real estate assets from ₹10,000. Secure SPV ownership and monthly rental income.",
    images: ["https://comfhutt.com/og-image.png"],
    creator: "@comfhutt", 
  },
  icons: {
    icon: "/brand/comfhutt-icon.svg",
    apple: "/brand/comfhutt-icon.svg",
  },
  alternates: {
    canonical: 'https://comfhutt.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        <Analytics />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
