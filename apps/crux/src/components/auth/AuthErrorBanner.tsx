"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthErrorBannerProps {
  message: string;
  variant: "error" | "success";
  className?: string;
}

export default function AuthErrorBanner({
  message,
  variant,
  className,
}: AuthErrorBannerProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      <motion.div
        key={message}
        initial={reduceMotion ? false : { opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "flex items-start gap-2.5 px-4 py-3 rounded-[var(--radius-control)] border text-[13px] leading-[1.5]",
          variant === "error"
            ? "bg-crux-danger-tint border-crux-danger-line text-crux-danger-dark"
            : "bg-[var(--color-crux-green-tint)] border-[color-mix(in_srgb,var(--color-crux-green)_28%,transparent)] text-[var(--color-crux-green-dark)]",
          className,
        )}
        role="alert"
      >
        {variant === "error" ? (
          <AlertCircle className="w-4 h-4 mt-px flex-shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 mt-px flex-shrink-0" />
        )}
        <p className="min-w-0 break-words">{message}</p>
      </motion.div>
    </AnimatePresence>
  );
}
