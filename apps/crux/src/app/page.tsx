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
  // Prices are a local constant now rather than a server fetch. The backend's
  // plans endpoint still serves the retired tiers until its own fix ships, and
  // rendering whatever it returned would put that copy back on the page.
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
