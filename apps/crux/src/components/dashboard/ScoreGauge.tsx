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
            stroke="#E5E7EB"
            strokeWidth="4"
          />
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
            style={{
              transition: "stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-semibold text-[#0d0d0d] leading-none"
            style={{
              fontSize: textSize,
              fontFamily: "var(--font-inter, Inter, sans-serif)",
              fontWeight: 600,
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
          className="text-[14px] font-medium text-crux-text-primary"
          style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
        >
          {grade}
        </span>
      )}

      {percentile !== undefined && (
        <span
          className="inline-flex items-center px-[10px] py-[4px] text-[12px] font-medium rounded-full"
          style={{
            backgroundColor: "#F0FDF4",
            color: "#16A34A",
            borderRadius: "9999px",
          }}
        >
          Top {percentile}% in area
        </span>
      )}
    </div>
  );
}
