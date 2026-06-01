"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { PropertySummary } from "@/hooks/useRecentProperties";

interface PropertyCardProps {
  property: PropertySummary;
}

/** A circular mini score gauge rendered as an SVG ring */
function MiniScoreGauge({ score }: { score: number }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score < 30 ? "#EF4444" : score <= 55 ? "#F59E0B" : "#22C55E";

  return (
    <div className="relative w-[56px] h-[56px] flex-shrink-0">
      <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="3"
        />
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-[15px] font-semibold text-[#0d0d0d]"
        style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
      >
        {score}
      </span>
    </div>
  );
}

export function PropertyCard({ property }: PropertyCardProps) {
  const formattedDate = new Date(property.scoredAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/dashboard/properties/${property.id}`}
      className={cn(
        "flex flex-col gap-3 bg-white border border-[#ededed] min-w-[280px] max-w-[320px] flex-shrink-0",
        "cursor-pointer transition-all duration-[220ms]",
        "hover:shadow-[0_4px_16px_rgba(13,13,13,0.06)] hover:border-[#e5e5e5]"
      )}
      style={{ borderRadius: "16px", padding: "24px" }}
    >
      <div>
        <p
          className="text-[14px] font-medium text-[#0d0d0d] leading-snug"
          style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
        >
          {property.address}
        </p>
        <p
          className="text-[12px] font-normal text-[#6e6e6e] mt-0.5"
          style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
        >
          {property.city}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <MiniScoreGauge score={property.score} />
        <div>
          <span
            className="inline-flex items-center px-[10px] py-[4px] text-[12px] font-medium rounded-full"
            style={{
              backgroundColor: "#F0FDF4",
              color: "#16A34A",
              borderRadius: "9999px",
            }}
          >
            Top {100 - property.score}% in area
          </span>
        </div>
      </div>

      <p
        className="text-[11px] text-[#9b9b9b]"
        style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
      >
        Scored {formattedDate}
      </p>
    </Link>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div
      className="flex flex-col gap-3 bg-white border border-[#ededed] min-w-[280px] max-w-[320px] flex-shrink-0 animate-pulse"
      style={{ borderRadius: "16px", padding: "24px" }}
    >
      <div className="h-5 w-3/4 bg-gray-100 rounded" />
      <div className="h-4 w-1/2 bg-gray-50 rounded" />
      <div className="flex items-center gap-3">
        <div className="w-[56px] h-[56px] rounded-full bg-gray-100" />
        <div className="h-5 w-20 bg-gray-50 rounded-full" />
      </div>
      <div className="h-3 w-24 bg-gray-50 rounded" />
    </div>
  );
}
