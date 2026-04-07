"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Building2,
  Scale,
  BarChart3,
  Wrench,
  ShieldAlert,
} from "lucide-react";
import { useSectionInView } from "@/hooks/useSectionInView";
import { useCountUp } from "@/hooks/useCountUp";

const CATEGORIES = [
  {
    Icon: MapPin,
    name: "Location Intelligence",
    weight: 30,
    description: "Satellite imagery, AQI, connectivity, infrastructure",
  },
  {
    Icon: Building2,
    name: "Developer Reliability",
    weight: 20,
    description: "Track record, NPA status, delivery history",
  },
  {
    Icon: Scale,
    name: "Legal & Compliance",
    weight: 20,
    description: "Court records, title clarity, RERA status",
  },
  {
    Icon: BarChart3,
    name: "Market Valuation",
    weight: 15,
    description: "Comparable sales, circle rates, NHB RESIDEX",
  },
  {
    Icon: Wrench,
    name: "Structural & Physical",
    weight: 10,
    description: "Build quality, age, maintenance status",
  },
  {
    Icon: ShieldAlert,
    name: "Risk Composite",
    weight: 5,
    description: "Environmental, political, liquidity risk factors",
  },
];

function ScoreRing({ score, inView }: { score: number; inView: boolean }) {
  const displayScore = useCountUp(score, 1500, inView);
  const r = 88;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (circumference * (inView ? score : 0)) / 100;

  return (
    <div className="relative w-44 h-44 shrink-0">
      <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="60%" stopColor="#16A34A" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>
        </defs>
        {/* Track ring */}
        <circle
          cx="100"
          cy="100"
          r={r}
          stroke="#F3F4F6"
          strokeWidth="10"
          fill="none"
        />
        {/* Score arc */}
        <motion.circle
          cx="100"
          cy="100"
          r={r}
          stroke="url(#scoreGrad)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-[52px] font-extrabold text-[#111827] leading-none"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {displayScore}
        </span>
        <span className="text-[11px] font-semibold text-[#9CA3AF] mt-1.5 uppercase tracking-widest">
          CRUX Score
        </span>
      </div>
    </div>
  );
}

function CategoryCard({
  Icon,
  name,
  weight,
  description,
  inView,
  delay,
}: (typeof CATEGORIES)[number] & { inView: boolean; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="group bg-white rounded-xl border border-[#E5E7EB] p-6 flex flex-col gap-3
                 hover:shadow-md hover:border-[#22C55E4D] transition-all duration-200 cursor-default"
    >
      <div className="flex items-center gap-2.5">
        <Icon size={20} className="text-[#22C55E]" strokeWidth={1.75} />
        <span className="text-[14px] font-semibold text-[#111827]">{name}</span>
      </div>

      <div
        className="text-[36px] font-bold text-[#22C55E] leading-none"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {weight}%
      </div>

      <p className="text-[13px] text-[#6B7280] leading-snug flex-1">
        {description}
      </p>

      {/* Weight bar */}
      <div className="h-[3px] w-full bg-[#F3F4F6] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-[#22C55E]"
          style={{ opacity: Math.max(0.35, weight / 100 + 0.35) }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${weight}%` } : { width: 0 }}
          transition={{ duration: 0.8, delay: delay + 0.1, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

export default function ScoreBreakdown() {
  const { ref, isInView } = useSectionInView(0.1);

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="py-24 md:py-32 bg-white px-4"
    >
      <div className="mx-auto max-w-[1100px]">
        {/* Section header */}
        <div className="text-center mb-14">
          <motion.div
            className="inline-flex items-center gap-3 mb-4"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4 }}
          >
            <div className="w-6 h-px bg-[#22C55E]" />
            <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#22C55E]">
              THE ENGINE
            </p>
            <div className="w-6 h-px bg-[#22C55E]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[28px] md:text-[44px] font-bold text-[#111827] tracking-tight leading-tight"
          >
            One score. Six dimensions. 20+ signals.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-[17px] text-[#6B7280] max-w-2xl mx-auto leading-relaxed"
          >
            Every property gets a composite credibility score built from six
            independent data categories. No single source can game it.
          </motion.p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* ── Score hero card (full width) ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-3 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm
                       p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 md:gap-12"
          >
            <ScoreRing score={94} inView={isInView} />

            {/* Vertical divider — desktop only */}
            <div className="hidden md:block w-px self-stretch bg-[#F3F4F6]" />

            <div className="flex-1 text-center md:text-left">
              <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#22C55E] mb-2">
                Composite Credibility Index
              </p>
              <h3 className="text-[20px] md:text-[22px] font-bold text-[#111827] leading-snug mb-3">
                A single score that can&apos;t be gamed.
              </h3>
              <p className="text-[15px] text-[#6B7280] leading-relaxed max-w-md mx-auto md:mx-0">
                Six independent data pipelines, each weighted by predictive
                accuracy against 12 months of closed deal data. The final score
                is a calibrated composite — not a simple average.
              </p>
            </div>

            {/* Stat column — desktop only */}
            <div className="hidden md:flex flex-col gap-6 shrink-0 pr-2">
              {[
                { value: "20+", label: "Verified signals" },
                { value: "6", label: "Data categories" },
                { value: "< 90s", label: "Per report" },
              ].map(({ value, label }) => (
                <div key={label} className="text-right">
                  <div
                    className="text-[28px] font-extrabold text-[#111827] leading-none"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {value}
                  </div>
                  <div className="text-[12px] text-[#9CA3AF] mt-1">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Six category cards (3 × 2) ── */}
          {CATEGORIES.map((cat, i) => (
            <CategoryCard
              key={cat.name}
              {...cat}
              inView={isInView}
              delay={0.25 + i * 0.07}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
