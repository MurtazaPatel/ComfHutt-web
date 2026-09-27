"use client";

import { useDashboardStats } from "@/hooks/useDashboardStats";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Surface } from "./ui/Surface";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
};

function StatCard({
  label,
  value,
  caption,
  isLoading,
}: {
  label: string;
  /** Already formatted — "—" when the API has nothing to report. */
  value: string;
  /** One line of context under the number. Carries the empty-state explanation. */
  caption?: string;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <Surface padding="tight" className="animate-pulse motion-reduce:animate-none">
        <div className="flex flex-col items-center gap-2 py-2">
          <div className="h-3 w-24 rounded-full bg-crux-bg-secondary" />
          <div className="h-9 w-14 rounded bg-crux-bg-secondary" />
          <div className="h-3 w-20 rounded-full bg-crux-bg-secondary" />
        </div>
      </Surface>
    );
  }

  return (
    <motion.div variants={itemVariants}>
      <Surface padding="tight" className="h-full">
        <div className="flex h-full flex-col items-center justify-start gap-1.5 py-2 text-center">
          <span className="text-[12px] font-medium uppercase tracking-[0.04em] text-crux-text-secondary">
            {label}
          </span>
          <span className="text-[36px] font-bold leading-none text-crux-text-primary">{value}</span>
          {caption && <span className="text-[11px] leading-snug text-crux-text-muted">{caption}</span>}
        </div>
      </Surface>
    </motion.div>
  );
}

export function QuickStats() {
  const { stats, isLoading } = useDashboardStats();
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="grid grid-cols-2 gap-4 md:grid-cols-4"
      variants={containerVariants}
      initial={reduceMotion ? false : "hidden"}
      animate="visible"
    >
      <StatCard label="Properties added" value={String(stats.propertiesCreated)} isLoading={isLoading} />
      <StatCard label="Properties graded" value={String(stats.propertiesGraded)} isLoading={isLoading} />
      {/* avgScore is null until something is actually graded. A zero here would be a
          number the engine never produced, so the card says it has nothing yet. */}
      <StatCard
        label="Average composite"
        value={stats.avgScore === null ? "—" : String(stats.avgScore)}
        caption={stats.avgScore === null ? "Nothing graded yet" : "Across graded properties"}
        isLoading={isLoading}
      />
      <StatCard
        label="Flagged"
        value={String(stats.flagged)}
        caption="Graded C or below"
        isLoading={isLoading}
      />
    </motion.div>
  );
}
