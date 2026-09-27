"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";
import { ReportViewer } from "@/components/dashboard/ReportViewer";

export default function ReportPage() {
  const { propertyId } = useParams<{ propertyId: string }>();

  return (
    <div className="mx-auto max-w-[960px] px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center justify-between gap-4 print:hidden">
        {/* A real link rather than router.back(): the label promises the property,
            and history may not hold it (the report is linkable on its own). */}
        <Link
          href={`/dashboard/properties/${propertyId}`}
          className="flex items-center gap-2 rounded-lg px-1 py-1 text-[14px] text-crux-text-secondary transition-colors hover:text-crux-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green motion-reduce:transition-none"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to property
        </Link>
        {/* Share is gone rather than dead: there is no share link on this route's data.
            Print is the browser's own, which is also how a PDF gets made. */}
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[13px] text-crux-text-secondary transition-colors hover:text-crux-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green motion-reduce:transition-none"
        >
          <Printer size={14} aria-hidden="true" />
          Print
        </button>
      </div>

      <ReportViewer propertyId={propertyId} />
    </div>
  );
}
