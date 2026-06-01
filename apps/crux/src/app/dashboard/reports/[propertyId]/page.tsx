"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Printer, Share2 } from "lucide-react";
import { ReportViewer } from "@/components/dashboard/ReportViewer";

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.propertyId as string;

  return (
    <div className="max-w-[960px] mx-auto px-6 py-10">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[14px] text-crux-text-secondary hover:text-crux-text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Property
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-1.5 text-[13px] text-crux-text-secondary hover:text-crux-text-primary transition-colors"
          >
            <Printer size={14} />
            Print
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 text-[13px] text-crux-text-secondary hover:text-crux-text-primary transition-colors"
          >
            <Share2 size={14} />
            Share
          </button>
        </div>
      </div>

      <ReportViewer propertyId={propertyId} />
    </div>
  );
}
