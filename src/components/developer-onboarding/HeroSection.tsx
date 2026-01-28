"use client";

import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Particles } from "@/components/ui/particles";
import { ArrowRight } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.215, 0.61, 0.355, 1],
    },
  },
};

export const HeroSection = () => {
  return (
    <section className="relative w-full h-screen min-h-[640px] md:min-h-[820px] overflow-hidden flex items-center justify-center">
      {/* ===== BASE BACKGROUND ===== */}
      <div className="absolute inset-0 bg-background z-[-30]" />

      {/* ===== SOFT CONTRAST OVERLAY ===== */}
      <div className="absolute inset-0 bg-black/5 z-[-25]" />

      {/* ===== PARTICLE LAYER ===== */}
      <Particles
        className="absolute inset-0 z-[-20]"
        quantity={100}
        staticity={25}
        ease={60}
        size={1.2}
        color="#2A2A28"
        vx={0}
        vy={0}
      />

      {/* ===== CONTENT ===== */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
        <motion.div
          className="text-center flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="
              text-4xl sm:text-5xl md:text-7xl
              font-bold font-playfair tracking-tighter
              text-foreground text-balance
              leading-[1.15] md:leading-[1.1]
              max-w-4xl
            "
          >
            When{" "}
            <span className="text-[var(--comfhutt-accent)]">capital</span>{" "}
            slows a project, but not{" "}
            <span className="text-[var(--comfhutt-accent)]">demand.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={itemVariants}
            className="
              mt-10
              text-lg sm:text-xl md:text-2xl
              text-muted-foreground
              max-w-3xl
              text-balance
            "
          >
            A simple ownership structure helps developers raise capital earlier,
            without changing pricing or brand.
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={itemVariants}
            className="
              mt-14 sm:mt-16
              flex flex-col sm:flex-row
              items-center justify-center
              gap-5
            "
          >
            <Button
              size="lg"
              className="
                text-base sm:text-lg
                px-7 py-5 sm:px-9 sm:py-6
                bg-primary hover:bg-primary/90
                text-primary-foreground
                transition-transform duration-300 ease-in-out
                hover:scale-105
                group
              "
            >
              See how this works
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>

            <p className="text-sm sm:text-base text-muted-foreground">
              Pilot-only. For serious developers.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};