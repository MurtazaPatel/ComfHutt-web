"use client";

import { motion, AnimatePresence } from "framer-motion";
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
  return (
    <AnimatePresence>
      <motion.div
        key={message}
        initial={{ opacity: 0, y: -8, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -8, height: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={cn(
          "flex items-center gap-2 px-4 py-3 rounded-xl border text-[13px]",
          variant === "error"
            ? "bg-red-50 border-red-200 text-red-600"
            : "bg-crux-green-tint border-crux-green/20 text-crux-green-dark",
          className,
        )}
        role="alert"
      >
        {variant === "error" ? (
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
        )}
        <p>{message}</p>
      </motion.div>
    </AnimatePresence>
  );
}