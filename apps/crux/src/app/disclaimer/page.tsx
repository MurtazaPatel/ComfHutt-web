import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import { disclaimerDoc } from "@/content/legal/disclaimer";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: disclaimerDoc.summary,
  alternates: { canonical: "/disclaimer" },
  robots: { index: true, follow: true },
};

export default function DisclaimerPage() {
  return <LegalDocument doc={disclaimerDoc} path="/disclaimer" />;
}
