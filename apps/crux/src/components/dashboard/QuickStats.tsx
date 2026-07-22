"use client";

import { useDashboardStats } from "@/hooks/useDashboardStats";
import { motion, Variants } from "framer-motion";

interface StatItem {
  label: string;
  value: string | number;
}

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

function StatCard({ label, value, isLoading }: { label: string; value: string | number; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div
        className="flex flex-col items-center gap-2 px-6 py-6 bg-[var(--color-crux-bg-primary)] border border-[var(--color-crux-border)] animate-pulse rounded-2xl"
      >
        <div className="h-3 w-16 bg-[var(--color-crux-bg-secondary)] rounded-full" />
        <div className="h-10 w-14 bg-[var(--color-crux-bg-secondary)] rounded" />
      </div>
    );
  }

  return (
    <motion.div
      variants={itemVariants}
      className="flex flex-col items-center justify-center gap-2 bg-white border border-border shadow-sm transition-all duration-300 hover:shadow-[var(--shadow-premium-md)] hover:border-[var(--color-crux-green)] hover:-translate-y-1 relative overflow-hidden group cursor-default"
      style={{ borderRadius: "16px", padding: "24px" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-crux-green-tint)] opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" />
      <span
        className="text-[12px] font-medium text-muted-foreground uppercase tracking-[0.04em] relative z-10"
      >
        {label}
      </span>
      <span
        className="text-[40px] font-bold text-foreground leading-none relative z-10 transition-colors group-hover:text-[var(--color-crux-green-dark)]"
      >
        {value}
      </span>
    </motion.div>
  );
}

export function QuickStats() {
  const { stats, isLoading } = useDashboardStats();

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <StatCard label="Properties Analyzed" value={stats.propertiesAnalyzed} isLoading={isLoading} />
      <StatCard label="Avg Score" value={stats.avgScore} isLoading={isLoading} />
      <StatCard label="Risk Alerts" value={stats.riskAlerts} isLoading={isLoading} />
      <StatCard label="Reports Gen'd" value={stats.reportsGenerated} isLoading={isLoading} />
    </motion.div>
  );
}
