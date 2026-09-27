"use client";

import { motion, useReducedMotion } from "framer-motion";

interface WelcomeHeaderProps {
  userName?: string | null;
  isLoading?: boolean;
}

/**
 * Type sizes are pinned here, with explicit leading, so the skeleton below can
 * reserve exactly the height the real text takes: 28px × 1.25 = 35px for the
 * heading, 18px × 1.5 = 27px for the line under it. The old skeleton guessed
 * 34px and 29px, so the page jumped as the profile resolved.
 */
const TITLE_CLASS = "text-[28px] font-bold leading-[1.25] tracking-tight text-crux-text-primary";
const SUBTITLE_CLASS = "text-[18px] font-medium leading-[1.5] text-crux-text-secondary";

export function WelcomeHeader({ userName, isLoading = false }: WelcomeHeaderProps) {
  const reduceMotion = useReducedMotion();

  if (isLoading) {
    return (
      <div aria-hidden="true">
        <div className="mb-2 h-[35px] w-[200px] max-w-full animate-pulse rounded bg-crux-bg-secondary motion-reduce:animate-none" />
        <div className="h-[27px] w-[320px] max-w-full animate-pulse rounded bg-crux-bg-secondary motion-reduce:animate-none" />
      </div>
    );
  }

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h1 className={`mb-2 ${TITLE_CLASS}`}>Welcome{userName ? `, ${userName}` : ""}</h1>
      <p className={SUBTITLE_CLASS}>Find intelligence on any property in Gujarat.</p>
    </motion.div>
  );
}
