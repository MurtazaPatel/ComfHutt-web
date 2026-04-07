import Header from "@/components/Header";
import HeroSection from "@/components/landing/HeroSection";
import TrustBar from "@/components/landing/TrustBar";
import ScoreBreakdown from "@/components/landing/ScoreBreakdown";
import ProductFamily from "@/components/landing/ProductFamily";
import BeforeAfter from "@/components/landing/BeforeAfter";
import LiveDemo from "@/components/landing/LiveDemo";
import PricingSection from "@/components/landing/PricingSection";
import TrustOrigin from "@/components/landing/TrustOrigin";
import FooterCTA from "@/components/landing/FooterCTA";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSection />
        <TrustBar />
        <ScoreBreakdown />
        <ProductFamily />
        <BeforeAfter />
        <LiveDemo />
        <PricingSection />
        <TrustOrigin />
      </main>
      <FooterCTA />
    </>
  );
}
