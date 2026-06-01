"use client";

import { useRecentProperties } from "@/hooks/useRecentProperties";
import Link from "next/link";
import { Building2, TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react";

function gradeColor(grade: string) {
  switch (grade) {
    case "Excellent": return "text-emerald-600 bg-emerald-50";
    case "Good": return "text-blue-600 bg-blue-50";
    case "Fair": return "text-amber-600 bg-amber-50";
    case "Caution": return "text-orange-600 bg-orange-50";
    case "Risk": return "text-red-600 bg-red-50";
    default: return "text-gray-600 bg-gray-50";
  }
}

function trendIcon(score: number) {
  if (score >= 80) return <TrendingUp size={14} className="text-emerald-500" />;
  if (score >= 60) return <Minus size={14} className="text-amber-500" />;
  return <TrendingDown size={14} className="text-red-500" />;
}

export default function PropertiesPage() {
  const { properties, isLoading } = useRecentProperties();

  if (isLoading) {
    return (
      <div className="max-w-[960px] mx-auto px-6 py-10">
        <div className="mb-8 animate-pulse">
          <div className="h-8 w-48 bg-gray-100 rounded mb-2" />
          <div className="h-4 w-32 bg-gray-100 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-gray-50 border border-[#ededed] rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="max-w-[960px] mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-crux-text-primary tracking-tight">Properties</h1>
          <p className="text-sm text-crux-text-secondary mt-1">No properties scored yet</p>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-[#ededed] rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-crux-green-tint flex items-center justify-center mb-4">
            <Building2 className="w-6 h-6 text-crux-green" />
          </div>
          <h2 className="text-lg font-semibold text-crux-text-primary mb-2">No scored properties</h2>
          <p className="text-sm text-crux-text-secondary mb-6 max-w-[360px]">
            Score your first property on the dashboard to see it listed here.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-crux-green text-white rounded-xl hover:bg-crux-green-mid transition-colors"
          >
            Go to Dashboard
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[960px] mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-crux-text-primary tracking-tight">Properties</h1>
        <p className="text-sm text-crux-text-secondary mt-1">
          {properties.length} {properties.length === 1 ? "property" : "properties"} scored
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {properties.map((item) => (
          <Link
            key={item.id}
            href={`/dashboard/properties/${item.id}`}
            className="group bg-white border border-[#ededed] rounded-2xl p-5 hover:border-crux-green/30 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 size={16} className="text-crux-text-muted flex-shrink-0" />
                  <span className="text-[13px] text-crux-text-muted font-mono">{item.city}</span>
                </div>
                <h3 className="text-[15px] font-semibold text-crux-text-primary mb-2 truncate group-hover:text-crux-green transition-colors">
                  {item.address}
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${gradeColor(item.grade || "Fair")}`}>
                    {item.grade || "Pending"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="text-2xl font-bold text-crux-text-primary tabular-nums">{item.score}</span>
                {trendIcon(item.score)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}