"use client";

import { motion } from "framer-motion";
import { useSectionInView } from "@/hooks/useSectionInView";
import { useCountUp } from "@/hooks/useCountUp";

const STATS = [
  { value: 12847, label: "properties scored", format: (n: number) => n.toLocaleString("en-IN") },
  { value: 43, label: "Indian cities covered", format: (n: number) => String(n) },
  { value: 23, label: "live data signals", format: (n: number) => String(n) },
];

function StatItem({
  value,
  label,
  format,
  inView,
  delay,
}: {
  value: number;
  label: string;
  format: (n: number) => string;
  inView: boolean;
  delay: number;
}) {
  const count = useCountUp(value, 1800, inView);

  return (
    <motion.div
      className="text-center flex-1"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      <span className="block text-5xl sm:text-[64px] font-extrabold text-crux-text-primary tracking-tight">
        {format(count)}
      </span>
      <span className="block mt-2 text-sm text-crux-text-secondary">
        {label}
      </span>
    </motion.div>
  );
}

export default function TrustOrigin() {
  const { ref, isInView } = useSectionInView(0.2);

  return (
    <section ref={ref} className="py-20 md:py-32 bg-[#F9FAFB] px-4">
      <div className="mx-auto max-w-[1100px]">
        {/* Stats row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-10 sm:gap-0 max-w-[900px] mx-auto">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-10 sm:gap-0">
              {i > 0 && (
                <div className="hidden sm:block w-px h-16 bg-crux-border mx-10" />
              )}
              <StatItem
                value={stat.value}
                label={stat.label}
                format={stat.format}
                inView={isInView}
                delay={i * 0.15}
              />
            </div>
          ))}
        </div>

        {/* Origin text */}
        <motion.div
          className="text-center mt-16 space-y-2"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          <p className="text-xl font-medium text-crux-text-secondary">
            Built in India. For Indian real estate.
          </p>
          <p className="text-[17px] text-crux-text-muted leading-[1.7]">
            By people who believe data should replace gut feeling.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 opacity-50">
            <img
              src="/comfhutt-logo.svg"
              alt="ComfHutt"
              className="h-4 w-auto"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
