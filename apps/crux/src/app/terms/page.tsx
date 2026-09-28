import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import { formatDistricts, termsDoc } from "@/content/legal/terms";
import { getLandingStats } from "@/lib/landing-stats";

/**
 * Revalidated hourly, in step with the landing page: clause 3 names how many
 * districts CRUX grades, and that counter comes from the same endpoint.
 */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms on which ComfHutt Technologies Private Limited provides CRUX: who may use it, what a subscription includes, how to cancel, and the limits of what a CRUX Grade is.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

export default async function TermsPage() {
  // A failed counter renders an em dash, never a zero — the coverage sentence in
  // clause 3 is a promise about the product, and "0 districts" is a false one.
  const { districtCount } = await getLandingStats();

  return (
    <LegalDocument doc={termsDoc({ districts: formatDistricts(districtCount) })} path="/terms" />
  );
}
