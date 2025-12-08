import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

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
  title: "ComfHutt - Fractional Real Estate. Intelligent Ownership.",
  description: "ComfHutt is building the world's first self-evolving property network. Fractional ownership meets autonomous intelligence.",
  keywords: ["ComfHutt", "real estate", "fractional ownership", "proptech", "investing", "blockchain", "AI"],
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
        {children}
      </body>
    </html>
  );
}
