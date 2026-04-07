"use client";

import { motion } from "framer-motion";
import { useSectionInView } from "@/hooks/useSectionInView";

const PRODUCTS = [
  {
    name: "Score",
    tagline:
      "0\u2013100 credibility index. Displayed before price \u2014 always.",
    icon: ScoreIcon,
  },
  {
    name: "Lens",
    tagline: "Ask anything about any property. AI-powered research assistant.",
    icon: LensIcon,
  },
  {
    name: "Cast",
    tagline:
      "Fair value & appreciation forecast. Three institutional-grade methods.",
    icon: CastIcon,
  },
  {
    name: "Yield",
    tagline:
      "Rental income projection. Know your returns before you commit.",
    icon: YieldIcon,
  },
  {
    name: "Watch",
    tagline: "24/7 monitoring. Score changes trigger instant alerts.",
    icon: WatchIcon,
  },
];

function ScoreIcon({ inView }: { inView: boolean }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
      <motion.circle
        cx="24"
        cy="24"
        r="18"
        stroke="#22C55E"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
      <motion.path
        d="M17 24 L22 29 L31 20"
        stroke="#22C55E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      />
    </svg>
  );
}

function LensIcon({ inView }: { inView: boolean }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
      <motion.circle
        cx="22"
        cy="22"
        r="12"
        stroke="#22C55E"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
      <motion.line
        x1="31"
        y1="31"
        x2="40"
        y2="40"
        stroke="#22C55E"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
      />
      {/* AI sparkle dots */}
      {[
        [18, 18],
        [26, 18],
        [22, 26],
      ].map(([cx, cy], i) => (
        <motion.circle
          key={i}
          cx={cx}
          cy={cy}
          r="1.5"
          fill="#22C55E"
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 1 + i * 0.15 }}
        />
      ))}
    </svg>
  );
}

function CastIcon({ inView }: { inView: boolean }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
      <motion.path
        d="M8 36 L16 28 L24 32 L32 18 L40 12"
        stroke="#22C55E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
      {/* Projection dots */}
      {[
        [34, 16],
        [37, 14],
        [40, 12],
      ].map(([cx, cy], i) => (
        <motion.circle
          key={i}
          cx={cx}
          cy={cy}
          r="2"
          fill="#22C55E"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: [0, 1, 0.5] } : {}}
          transition={{ delay: 1 + i * 0.2, duration: 0.6 }}
        />
      ))}
    </svg>
  );
}

function YieldIcon({ inView }: { inView: boolean }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
      {[0, 1, 2, 3].map((i) => (
        <motion.rect
          key={i}
          x="10"
          y={12 + i * 9}
          width={10 + (3 - i) * 6}
          height="6"
          rx="3"
          stroke="#22C55E"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
        />
      ))}
    </svg>
  );
}

function WatchIcon({ inView }: { inView: boolean }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
      {/* Eye outline */}
      <motion.path
        d="M6 24 C6 24 14 12 24 12 C34 12 42 24 42 24 C42 24 34 36 24 36 C14 36 6 24 6 24 Z"
        stroke="#22C55E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
      {/* Pupil */}
      <motion.circle
        cx="24"
        cy="24"
        r="5"
        stroke="#22C55E"
        strokeWidth="1.5"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.6 }}
      />
      {/* Pulse line through eye */}
      <motion.path
        d="M6 24 L18 24 L20 20 L22 28 L24 18 L26 30 L28 22 L30 24 L42 24"
        stroke="#22C55E"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={0.5}
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 1.5, delay: 1 }}
      />
    </svg>
  );
}

export default function ProductFamily() {
  const { ref, isInView } = useSectionInView(0.1);

  return (
    <section
      id="features"
      ref={ref}
      className="py-20 md:py-32 bg-[#F9FAFB] px-4"
    >
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
              CRUX PRODUCTS
            </p>
          </div>
          <h2 className="text-[28px] md:text-[44px] font-bold text-[#111827] tracking-[-0.02em]">
            One engine. Five dimensions of intelligence.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((product, i) => {
            const Icon = product.icon;
            return (
              <motion.div
                key={product.name}
                className="bg-white rounded-2xl p-8 border border-crux-border hover:border-crux-green/30 hover:shadow-md transition-all duration-300"
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -2 }}
              >
                <div className="mb-5">
                  <Icon inView={isInView} />
                </div>
                <h3 className="text-lg font-bold text-crux-text-primary mb-2">
                  {product.name}
                </h3>
                <p className="text-[15px] text-[#6B7280] leading-relaxed">
                  {product.tagline}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
