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
  title: "ComfHutt",
  description:
    "ComfHutt is building the world's first self-evolving property network. Fractional ownership meets autonomous intelligence.",
  metadataBase: new URL("https://comfhutt.com"),
  keywords: [
    "ComfHutt",
    "real estate",
    "fractional ownership",
    "proptech",
    "investing",
    "blockchain",
    "AI",
  ],
  openGraph: {
    title: "ComfHutt",
    description:
      "ComfHutt is building the world's first self-evolving property network. Fractional ownership meets autonomous intelligence.",
    url: "https://comfhutt.com",
    siteName: "ComfHutt",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ComfHutt - Self-evolving property network",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ComfHutt",
    description:
      "ComfHutt is building the world's first self-evolving property network. Fractional ownership meets autonomous intelligence.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/brand/comfhutt-icon.svg",
    apple: "/brand/comfhutt-icon.svg",
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
        className={`${inter.variable} ${playfair.variable} antialiased bg-zinc-50 text-slate-900 overflow-x-hidden`}
      >
        <Analytics />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
