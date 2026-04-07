"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSectionInView } from "@/hooks/useSectionInView";
import { useCountUp } from "@/hooks/useCountUp";

const TABS = [
  {
    label: "Location",
    params: [
      { name: "Air Quality Index", value: "Good (42)", pct: 85 },
      { name: "Night Light Intensity", value: "High", pct: 92 },
      { name: "Nearest Metro", value: "1.2 km", pct: 78 },
      { name: "School Density (2km)", value: "14 schools", pct: 88 },
    ],
  },
  {
    label: "Developer",
    params: [
      { name: "MCA21 Active Status", value: "Active", pct: 95 },
      { name: "Projects Delivered", value: "23/25", pct: 92 },
      { name: "RERA Compliance", value: "100%", pct: 100 },
      { name: "Litigation History", value: "Clean", pct: 90 },
    ],
  },
  {
    label: "Legal",
    params: [
      { name: "Title Clarity", value: "Clear", pct: 96 },
      { name: "Encumbrance Check", value: "None", pct: 100 },
      { name: "Pending Litigations", value: "0", pct: 100 },
      { name: "RERA Registration", value: "Valid", pct: 95 },
    ],
  },
  {
    label: "Market",
    params: [
      { name: "NHB RESIDEX Trend", value: "+8.2% YoY", pct: 82 },
      { name: "Comparable Sales", value: "\u20b97,200/sqft", pct: 75 },
      { name: "Days on Market", value: "34 days", pct: 70 },
    ],
  },
  {
    label: "Structure",
    params: [
      { name: "Building Age", value: "2 years", pct: 95 },
      { name: "Construction Grade", value: "A", pct: 90 },
      { name: "Carpet vs Super", value: "72%", pct: 72 },
    ],
  },
];

function DemoScoreRing({ inView }: { inView: boolean }) {
  const score = useCountUp(91, 1500, inView);
  const circumference = 2 * Math.PI * 50;
  const offset = circumference - (circumference * (inView ? 91 : 0)) / 100;

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle
          cx="60"
          cy="60"
          r="50"
          stroke="#E5E7EB"
          strokeWidth="6"
          fill="none"
        />
        <motion.circle
          cx="60"
          cy="60"
          r="50"
          stroke="url(#demoGreen)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        />
        <defs>
          <linearGradient id="demoGreen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-crux-text-primary font-mono">
          {score}
        </span>
      </div>
    </div>
  );
}

export default function LiveDemo() {
  const { ref, isInView } = useSectionInView(0.1);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section ref={ref} className="py-20 md:py-32 bg-[#F9FAFB] px-4">
      <div className="mx-auto max-w-[1100px]">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-crux-green" />
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-crux-green">
              SEE IT LIVE
            </p>
          </div>
          <h2 className="text-[28px] md:text-[44px] font-bold text-crux-text-primary tracking-[-0.02em]">
            CRUX in action.
          </h2>
        </motion.div>

        <motion.div
          className="max-w-2xl mx-auto bg-white border border-crux-border rounded-2xl shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Property header */}
          <div className="px-6 sm:px-8 pt-8 pb-6 text-center">
            <p className="text-base font-medium text-crux-text-primary mb-6">
              3BHK &middot; Bodakdev, Ahmedabad &middot; 1,850 sq ft
            </p>
            <DemoScoreRing inView={isInView} />
            <p className="mt-3 text-sm font-medium text-crux-text-muted">
              CRUX Score
            </p>
          </div>

          {/* Tabs */}
          <div className="px-6 sm:px-8">
            <div className="flex gap-1 overflow-x-auto pb-px border-b border-crux-border">
              {TABS.map((tab, i) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(i)}
                  className={`px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-colors rounded-t-lg cursor-pointer ${
                    activeTab === i
                      ? "text-crux-green border-b-2 border-crux-green bg-crux-green/5"
                      : "text-crux-text-muted hover:text-crux-text-primary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="px-6 sm:px-8 py-6 space-y-4">
            {TABS[activeTab].params.map((param) => (
              <div key={param.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-crux-text-secondary">{param.name}</span>
                  <span className="text-sm font-mono font-medium text-crux-text-primary">
                    {param.value}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-crux-green"
                    initial={{ width: 0 }}
                    animate={{ width: `${param.pct}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    key={`${activeTab}-${param.name}`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 sm:px-8 pb-6 pt-2">
            <p className="text-xs text-crux-text-muted text-center">
              Powered by 23 live data signals &middot; Last updated 2 hours ago
            </p>
          </div>
        </motion.div>

        {/* CTA below card */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <a
            href="#hero"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-green text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Score your property
            <span aria-hidden="true">&rarr;</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
