import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
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
        className={`${inter.variable} antialiased bg-[#050505] text-[#f0f0f0] overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
