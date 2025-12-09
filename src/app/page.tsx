import React from "react";
import LandingNavbar from "@/components/LandingNavbar";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import HowItWorks from "@/components/HowItWorks";
import FeatureStripe from "@/components/FeatureStripe";
import WealthBuilder from "@/components/WealthBuilder";
import CredibilityEngine from "@/components/CredibilityEngine";
import OwnersSection from "@/components/OwnersSection";
import Testimonials from "@/components/Testimonials";
import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";

export const metadata = {
  title: "ComfHutt | Invest in Real Estate from ₹5,000",
  description: "Fractional property tokens. Instant buying. Monthly rental income. Easy exits. SPV-backed ownership.",
  openGraph: {
    title: "ComfHutt | Fractional Real Estate Investment",
    description: "Invest in verified real estate starting at ₹5,000. Monthly rental income and easy liquidity.",
    type: "website",
    url: "https://comfhutt.com",
    // images: [{ url: '/og-image.jpg' }], // Placeholder for actual OG image
  },
};

export default function LandingPage() {
  return (
    <main className="w-full bg-white text-gray-900 selection:bg-emerald-100 selection:text-emerald-900">
      <LandingNavbar />
      <Hero />
      <TrustStrip />
      <HowItWorks />
      
      <WealthBuilder />

      <CredibilityEngine />
      <FeatureStripe />
      <OwnersSection />
      <Testimonials />
      <ContactUs />
      <Footer />
    </main>
  );
}
