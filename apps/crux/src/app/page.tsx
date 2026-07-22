import dynamic from "next/dynamic";
import HeroSection from "@/components/landing/HeroSection";
import { fetchPlans } from "@/lib/pricing";

// Below-fold sections — lazy-loaded to reduce initial bundle
const ScoreBreakdown   = dynamic(() => import("@/components/landing/ScoreBreakdown"));
const ProductFamily    = dynamic(() => import("@/components/landing/ProductFamily"));
const BeforeAfter      = dynamic(() => import("@/components/landing/BeforeAfter"));
const StakesAndHorizon = dynamic(() => import("@/components/sections/StakesAndHorizon"));
const PricingSection   = dynamic(() => import("@/components/landing/PricingSection"));
const TrustOrigin      = dynamic(() => import("@/components/landing/TrustOrigin"));
const FooterCTA        = dynamic(() => import("@/components/landing/FooterCTA"));

export default async function Home() {
  // Fetched server-side so the real price is present at first paint —
  // never derived from client-side loading/animation state.
  const { plans, paymentsConfigured } = await fetchPlans();

  return (
    <>
      <main className="flex-1">
        <HeroSection />
        <ScoreBreakdown />
        <ProductFamily />
        <BeforeAfter />
        <StakesAndHorizon />
        <PricingSection plans={plans} paymentsConfigured={paymentsConfigured} />
        <TrustOrigin />
      </main>
      <FooterCTA />
    </>
  );
}
