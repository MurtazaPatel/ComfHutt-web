"use client";

import { scoreColor } from "@/lib/grade";

interface ScoreGaugeProps {
  score: number;
  grade?: string;
  size?: "default" | "small";
}

/**
 * The legacy CPSM composite dial: a 0–100 number and, optionally, the grade the
 * engine attached to it.
 *
 * It used to also render an "area percentile" pill from a caller-supplied
 * percentile. Every caller derived that percentile as `100 - score`, which is not
 * a percentile of anything — CRUX had no area cohort to rank against. The prop is
 * gone rather than made optional so no future caller can reintroduce the claim;
 * a real cohort rank belongs on the CGM surface, which reads it from the API.
 */
export function ScoreGauge({ score, grade, size = "default" }: ScoreGaugeProps) {
  const dims = size === "default" ? 120 : 96;
  const radius = size === "default" ? 54 : 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(score, 100) / 100) * circumference;

  const color = scoreColor(score);
  const textSize = size === "default" ? "40px" : "32px";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative shrink-0" style={{ width: dims, height: dims }}>
        <svg width={dims} height={dims} viewBox={`0 0 ${dims} ${dims}`} className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={dims / 2}
            cy={dims / 2}
            r={radius}
            fill="none"
            stroke="var(--color-crux-bg-secondary)"
            strokeWidth="4"
          />
          {/* Subtle Glow Filter */}
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Progress ring. The sweep is decorative, so reduced-motion drops it. */}
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
            className="transition-[stroke-dashoffset] duration-[800ms] ease-out motion-reduce:transition-none"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-bold text-crux-text-primary leading-none tracking-tighter"
            style={{ fontSize: textSize }}
          >
            {score}
          </span>
          <span className="text-[12px] text-crux-text-secondary mt-0.5">/100</span>
        </div>
      </div>

      {grade && (
        <span className="text-[14px] font-semibold text-crux-text-primary tracking-tight">{grade}</span>
      )}
    </div>
  );
}
