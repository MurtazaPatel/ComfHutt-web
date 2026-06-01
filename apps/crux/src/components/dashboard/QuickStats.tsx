"use client";

import { useDashboardStats } from "@/hooks/useDashboardStats";
import { cn } from "@/lib/utils";

interface StatItem {
  label: string;
  value: string | number;
}

function StatCard({ label, value, isLoading }: { label: string; value: string | number; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div
        className="flex flex-col items-center gap-2 px-6 py-6 bg-white border border-[#ededed] animate-pulse"
        style={{ borderRadius: "16px" }}
      >
        <div className="h-3 w-16 bg-gray-100 rounded-full" />
        <div className="h-10 w-14 bg-gray-50 rounded" />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center gap-2 bg-white border border-[#ededed] transition-shadow duration-[220ms] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
      style={{ borderRadius: "16px", padding: "24px" }}
    >
      <span
        className="text-[12px] font-medium text-[#6e6e6e] uppercase tracking-[0.04em]"
        style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
      >
        {label}
      </span>
      <span
        className="text-[40px] font-semibold text-[#0d0d0d] leading-none"
        style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
      >
        {value}
      </span>
    </div>
  );
}

export function QuickStats() {
  const { stats, isLoading } = useDashboardStats();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard label="Properties Analyzed" value={stats.propertiesAnalyzed} isLoading={isLoading} />
      <StatCard label="Avg Score" value={stats.avgScore} isLoading={isLoading} />
      <StatCard label="Risk Alerts" value={stats.riskAlerts} isLoading={isLoading} />
      <StatCard label="Reports Gen'd" value={stats.reportsGenerated} isLoading={isLoading} />
    </div>
  );
}
