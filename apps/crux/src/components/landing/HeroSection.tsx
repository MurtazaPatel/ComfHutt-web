"use client";

import { motion } from "framer-motion";
import ChatInput from "@/components/ChatInput";

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" as const, delay },
  };
}

function GradientMesh() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <div className="hero-orb-1" />
      <div className="hero-orb-2" />
    </div>
  );
}

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 bg-white"
    >
      <GradientMesh />

      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center">
        <motion.h1
          {...fadeUp(0.1)}
          className="text-[32px] sm:text-[44px] lg:text-[56px] font-extrabold text-[#111827] leading-[1.05] tracking-tight"
        >
          What&rsquo;s the real score of your property?
        </motion.h1>

        <motion.p
          {...fadeUp(0.3)}
          className="mt-6 text-[18px] text-[#6B7280] max-w-2xl mx-auto leading-relaxed"
        >
          CRUX analyses 20+ live data signals — legal, spatial, financial — so
          you never invest blind.
        </motion.p>

        <motion.div {...fadeUp(0.5)} className="mt-10 w-full max-w-xl">
          <ChatInput variant="default" size="large" />
        </motion.div>

        <motion.p
          {...fadeUp(0.7)}
          className="mt-4 text-[13px] text-[#9CA3AF]"
        >
          Free. No signup required. Score any property in India.
        </motion.p>
      </div>
    </section>
  );
}
