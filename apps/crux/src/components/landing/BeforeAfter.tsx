"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { useSectionInView } from "@/hooks/useSectionInView";

const BEFORE_ITEMS = [
  "Broker\u2019s word of mouth",
  "Newspaper classifieds",
  "Gut feeling & family advice",
  "Zero exit strategy",
  "Hope as a plan",
];

const AFTER_ITEMS = [
  "20+ verified data signals",
  "AI-powered property analysis",
  "Live credibility monitoring",
  "Structured exit via Liquidity Mesh",
  "Data as the foundation",
];

export default function BeforeAfter() {
  const { ref, isInView } = useSectionInView(0.15);

  return (
    <section ref={ref} className="py-20 md:py-32 bg-white px-4">
      <div className="mx-auto max-w-[1100px]">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-crux-green" />
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-crux-green">
              THE SHIFT
            </p>
          </div>
          <h2 className="text-[28px] md:text-[44px] font-bold text-crux-text-primary tracking-[-0.02em]">
            From gut feeling to ground truth.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Before */}
          <motion.div
            className="rounded-2xl border border-crux-border bg-white p-8"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-sm font-medium text-crux-text-muted mb-6">
              How India invests today
            </h3>
            <ul className="space-y-4">
              {BEFORE_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <X
                    size={16}
                    className="text-gray-300 mt-0.5 shrink-0"
                  />
                  <span className="text-sm text-crux-text-secondary">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* After */}
          <motion.div
            className="rounded-2xl border border-crux-green/30 bg-crux-bg-accent p-8"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-sm font-medium text-crux-green mb-6">
              With CRUX
            </h3>
            <ul className="space-y-4">
              {AFTER_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check
                    size={16}
                    className="text-crux-green mt-0.5 shrink-0"
                  />
                  <span className="text-sm text-crux-text-primary">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
