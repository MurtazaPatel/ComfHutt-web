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
import FAQ from "@/components/FAQ";

export const metadata = {
  title: "ComfHutt | Invest in Real Estate from ₹10,000",
  description: "Fractional property tokens. Instant buying. Monthly rental income. Easy exits. SPV-backed ownership.",
  openGraph: {
    title: "ComfHutt | Fractional Real Estate Investment",
    description: "Invest in verified real estate starting at ₹10,000. Monthly rental income and easy liquidity.",
    type: "website",
    url: "https://comfhutt.com",
    // images: [{ url: '/og-image.jpg' }], // Placeholder for actual OG image
  },
};

export default function LandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "ComfHutt | Fractional Real Estate Investment Platform",
    "description": "Invest in pre-vetted real estate assets starting at ₹10,000. Secure SPV ownership, monthly rental yields, and AI-driven property scoring.",
    "url": "https://comfhutt.com",
    "isPartOf": {
      "@type": "Website",
      "name": "ComfHutt",
      "url": "https://comfhutt.com"
    },
    "about": {
      "@type": "Organization",
      "name": "ComfHutt",
      "url": "https://comfhutt.com",
      "logo": "https://comfhutt.com/brand/comfhutt-logo.svg",
      "description": "ComfHutt is a fractional real estate investment platform enabling users to invest in verified properties starting from ₹10,000.",
      "sameAs": [
        "https://twitter.com/comfhutt",
        "https://linkedin.com/company/comfhutt"
      ]
    }
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is fractional real estate investing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Fractional real estate investing allows multiple investors to pool capital and collectively own a high-value property. At ComfHutt, you can start investing with as little as ₹10,000, owning a share of the property and earning proportional rental income."
        }
      },
      {
        "@type": "Question",
        "name": "How does ComfHutt work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You browse vetted properties, purchase fractional shares, and become a legal co-owner via a Special Purpose Vehicle (SPV). ComfHutt manages the property, collects rent, and distributes your share of the income monthly. You can also sell your shares on our marketplace."
        }
      },
      {
        "@type": "Question",
        "name": "How is ComfHutt different from traditional real estate investing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Traditional real estate requires large capital, extensive paperwork, and has low liquidity. ComfHutt offers low entry costs (₹10,000), verified assets, digital management, and a secondary marketplace for easier exits (subject to market demand)."
        }
      },
      {
        "@type": "Question",
        "name": "Is ComfHutt legally compliant in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Each property is held in a private limited company or LLP (Special Purpose Vehicle). When you invest, you are purchasing shares in that SPV, giving you direct, legally enforceable ownership rights under the Companies Act, 2013."
        }
      },
      {
        "@type": "Question",
        "name": "What are the risks involved?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Real estate investments carry risks including market fluctuations, vacancy periods, and potential loss of capital. While ComfHutt uses an AI Credibility Score to vet assets, returns are not guaranteed. Investors should diversify and read all offer documents carefully."
        }
      },
      {
        "@type": "Question",
        "name": "How does rental income distribution work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Rent collected from tenants is deposited into the SPV's account. After deducting property management and maintenance fees, the net rental income is distributed to investors' bank accounts on a monthly basis."
        }
      },
      {
        "@type": "Question",
        "name": "Can investors exit their investment?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. You can list your fractional shares for sale on the ComfHutt secondary marketplace. Once a buyer is found and the transaction settles, your ownership is transferred and you receive the funds."
        }
      }
    ]
  };

  return (
    <main className="w-full bg-white text-gray-900 selection:bg-emerald-100 selection:text-emerald-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <LandingNavbar />
      <Hero />
      <TrustStrip />
      <HowItWorks />
      
      <WealthBuilder />

      <CredibilityEngine />
      <FeatureStripe />
      <OwnersSection />
      <Testimonials />
      <FAQ />
      <ContactUs />
      <Footer />
    </main>
  );
}
