import dynamic from "next/dynamic";
import HeroSection from "@/components/landing/HeroSection";

// Below-fold sections — lazy-loaded to reduce initial bundle
const ScoreBreakdown   = dynamic(() => import("@/components/landing/ScoreBreakdown"));
const ProductFamily    = dynamic(() => import("@/components/landing/ProductFamily"));
const BeforeAfter      = dynamic(() => import("@/components/landing/BeforeAfter"));
const StakesAndHorizon = dynamic(() => import("@/components/sections/StakesAndHorizon"));
const PricingSection   = dynamic(() => import("@/components/landing/PricingSection"));
const TrustOrigin      = dynamic(() => import("@/components/landing/TrustOrigin"));
const FooterCTA        = dynamic(() => import("@/components/landing/FooterCTA"));

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <HeroSection />
        <ScoreBreakdown />
        <ProductFamily />
        <BeforeAfter />
        <StakesAndHorizon />
        <PricingSection />
        <TrustOrigin />
      </main>
      <FooterCTA />
    </>
  );
}
