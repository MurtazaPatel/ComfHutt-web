"use client";

import { motion } from "framer-motion";

interface WelcomeHeaderProps {
  userName?: string | null;
  isLoading?: boolean;
}

export function WelcomeHeader({ userName, isLoading = false }: WelcomeHeaderProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <div className="h-[34px] w-[200px] bg-[var(--color-crux-bg-secondary)] rounded animate-pulse" />
        <div className="h-[29px] w-[320px] bg-[var(--color-crux-border)] opacity-50 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h2
        className="mb-2 text-[28px] font-bold text-foreground tracking-tight leading-tight"
      >
        Welcome{userName ? `, ${userName}` : ""}
      </h2>
      <p
        className="text-[18px] text-muted-foreground font-medium"
      >
        Find intelligence on any property in India.
      </p>
    </motion.div>
  );
}
