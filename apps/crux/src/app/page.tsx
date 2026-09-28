import dynamic from "next/dynamic";
import HeroSection from "@/components/landing/HeroSection";
import { getLandingStats } from "@/lib/landing-stats";

// Below-fold sections — lazy-loaded to reduce initial bundle.
const ProblemSection = dynamic(() => import("@/components/landing/ProblemSection"));
const HowItWorks     = dynamic(() => import("@/components/landing/HowItWorks"));
const SevenChecks    = dynamic(() => import("@/components/landing/SevenChecks"));
const PricingSection = dynamic(() => import("@/components/landing/PricingSection"));
const InvestTeaser   = dynamic(() => import("@/components/landing/InvestTeaser"));
const FooterCTA      = dynamic(() => import("@/components/landing/FooterCTA"));

/**
 * Revalidated hourly. The counters move slowly and the marketing page should not
 * be a load source on the scoring database; an hour is also what the endpoint's
 * own s-maxage advertises, so the two agree.
 */
export const revalidate = 3600;

/**
 * Six sections, down from seven.
 *
 * Gone: ScoreBreakdown (printed a six-category weight table the engine does not
 * use, and a predictive-accuracy claim for a calibration never run), ProductFamily
 * (CRUX Cast and CRUX Yield are not built; their endpoints answer 501), BeforeAfter
 * and StakesAndHorizon (the "18 years saving" / "1 in 3 end up in a legal dispute"
 * pair, neither sourced), and TrustOrigin (three principles, folded into the
 * sections that demonstrate them).
 *
 * Added: the problem in two numbers, and a proof strip that lives inside the hero
 * rather than as a section of its own. The brief's overriding structural rule is
 * that this page ends up shorter and calmer than it started, so "agents research,
 * rules rate" and the scoreboard promise are a block inside a neighbouring section
 * rather than two more full-height sections.
 */
export default async function Home() {
  // One round trip, server-side. Every failure degrades to null, and each section
  // renders an em dash rather than a zero — a zero is a claim, null is silence.
  const stats = await getLandingStats();

  return (
    <>
      <main className="flex-1">
        <HeroSection districtCount={stats.districtCount} />
        <ProblemSection />
        <HowItWorks />
        <SevenChecks />
        <PricingSection />
        <InvestTeaser />
      </main>
      <FooterCTA
        methodologyVersion={stats.methodologyVersion}
        methodologyHash={stats.methodologyHash}
      />
    </>
  );
}
