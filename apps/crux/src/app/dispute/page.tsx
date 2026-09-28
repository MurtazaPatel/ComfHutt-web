import type { Metadata } from "next";
import DisputeForm from "@/components/legal/DisputeForm";
import LegalDocument from "@/components/legal/LegalDocument";
import { disputeDoc } from "@/content/legal/dispute";

export const metadata: Metadata = {
  title: "Dispute a grade",
  description: disputeDoc.summary,
  alternates: { canonical: "/dispute" },
  robots: { index: true, follow: true },
};

export default function DisputePage() {
  return (
    <LegalDocument doc={disputeDoc} path="/dispute">
      <DisputeForm />
    </LegalDocument>
  );
}
