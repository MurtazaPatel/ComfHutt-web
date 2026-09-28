import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import { privacyDoc } from "@/content/legal/privacy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: privacyDoc.summary,
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return <LegalDocument doc={privacyDoc} path="/privacy" />;
}
