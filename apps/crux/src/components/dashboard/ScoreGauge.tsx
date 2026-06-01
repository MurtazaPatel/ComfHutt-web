"use client";

import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
  grade?: string;
  percentile?: number;
  size?: "default" | "small";
}

export function ScoreGauge({ score, grade, percentile, size = "default" }: ScoreGaugeProps) {
  const dims = size === "default" ? 120 : 96;
  const radius = size === "default" ? 54 : 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(score, 100) / 100) * circumference;

  const color =
    score < 30 ? "#EF4444" : score <= 55 ? "#F59E0B" : "#22C55E";

  const textSize = size === "default" ? "40px" : "32px";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: dims, height: dims }}>
        <svg
          width={dims}
          height={dims}
          viewBox={`0 0 ${dims} ${dims}`}
          className="-rotate-90"
        >
          {/* Background ring */}
          <circle
            cx={dims / 2}
            cy={dims / 2}
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="4"
          />
          {/* Subtle Glow Filter */}
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Progress ring */}
          <circle
            cx={dims / 2}
            cy={dims / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            filter="url(#glow)"
            style={{
              transition: "stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-bold text-gray-900 leading-none tracking-tighter"
            style={{
              fontSize: textSize,
              fontFamily: "var(--font-inter, Inter, sans-serif)",
            }}
          >
            {score}
          </span>
          <span
            className="text-[12px] text-[#6e6e6e] mt-0.5"
            style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
          >
            /100
          </span>
        </div>
      </div>

      {grade && (
        <span
          className="text-[14px] font-semibold text-gray-900 tracking-tight"
          style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
        >
          {grade}
        </span>
      )}

      {percentile !== undefined && (
        <span
          className="inline-flex items-center px-[10px] py-[4px] text-[12px] font-semibold tracking-wide rounded-full"
          style={{
            backgroundColor: "rgba(34, 197, 94, 0.1)",
            color: "#15803d",
            borderRadius: "9999px",
            boxShadow: "inset 0 0 0 1px rgba(34, 197, 94, 0.2)",
          }}
        >
          Top {percentile}% in area
        </span>
      )}
    </div>
  );
}
