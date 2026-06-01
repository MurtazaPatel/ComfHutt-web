"use client";

import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import { useRecentProperties } from "@/hooks/useRecentProperties";

function gradeColor(grade: string) {
  switch (grade) {
    case "Excellent": return "text-emerald-600 bg-emerald-50 border-emerald-100";
    case "Good": return "text-blue-600 bg-blue-50 border-blue-100";
    case "Fair": return "text-amber-600 bg-amber-50 border-amber-100";
    case "Caution": return "text-orange-600 bg-orange-50 border-orange-100";
    case "Risk": return "text-red-600 bg-red-50 border-red-100";
    default: return "text-gray-600 bg-gray-50 border-gray-100";
  }
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function ReportsIndexPage() {
  const { properties, isLoading } = useRecentProperties(20);

  if (isLoading) {
    return (
      <div className="max-w-[960px] mx-auto px-6 py-10">
        <div className="mb-8 animate-pulse">
          <div className="h-8 w-32 bg-gray-100 rounded mb-2" />
          <div className="h-4 w-48 bg-gray-100 rounded" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-50 border border-[#ededed] rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[960px] mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-crux-text-primary tracking-tight">Reports</h1>
        <p className="text-sm text-crux-text-secondary mt-1">
          Generated property intelligence reports
        </p>
      </div>

      {properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-[#ededed] rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-crux-green-tint flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-crux-green" />
          </div>
          <h2 className="text-lg font-semibold text-crux-text-primary mb-2">No reports yet</h2>
          <p className="text-sm text-crux-text-secondary mb-4 max-w-[360px]">
            Generate your first CRUX report by scoring a property
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-crux-green text-white rounded-xl hover:bg-crux-green-mid transition-colors"
          >
            Go to Dashboard
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {properties.map((property) => (
            <Link
              key={property.id}
              href={`/dashboard/properties/${property.id}`}
              className="flex items-center gap-4 bg-white border border-[#ededed] rounded-2xl p-5 hover:border-crux-green/30 hover:shadow-sm transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <FileText size={18} className="text-blue-500" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-[15px] font-semibold text-crux-text-primary truncate group-hover:text-crux-green transition-colors">
                    {property.address || "Unknown address"}
                  </h3>
                  {property.grade && (
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border flex-shrink-0 ${gradeColor(property.grade)}`}>
                      {property.grade}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-[12px] text-crux-text-muted">
                  {property.city && <span>{property.city}</span>}
                  <span>{formatDate(property.scoredAt)}</span>
                  <span className="font-semibold text-crux-text-primary">
                    Score: {property.score}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <ArrowRight size={16} className="text-crux-text-muted group-hover:text-crux-green transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}