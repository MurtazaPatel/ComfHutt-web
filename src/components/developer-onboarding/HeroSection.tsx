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
    <section className="relative w-full h-screen min-h-[600px] md:min-h-[800px] overflow-hidden flex items-center justify-center">
      
      {/* ===== BASE BACKGROUND ===== */}
      <div className="absolute inset-0 bg-background z-[-30]" />

      {/* ===== SOFT CONTRAST OVERLAY (CRITICAL) ===== */}
      <div className="absolute inset-0 bg-black/5 z-[-25]" />

      {/* ===== PARTICLE LAYER ===== */}
      <Particles
        className="absolute inset-0 z-[-20]"
        quantity={100}
        staticity={25}
        ease={60}
        size={1.2}
        color="#2A2A28" // dark charcoal → visible on light bg
        vx={0}
        vy={0}
      />

      {/* ===== CONTENT ===== */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter text-foreground font-playfair text-balance leading-tight md:leading-tight"
            variants={itemVariants}
          >
            When{" "}
            <span className="text-[var(--comfhutt-accent)]">
              capital
            </span>{" "}
            slows a project, but not demand.
          </motion.h1>

          <motion.p
            className="mt-6 text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance"
            variants={itemVariants}
          >
            A simple ownership structure helps developers raise capital earlier,
            without changing pricing or brand.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-10 sm:mt-14 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="text-base sm:text-lg px-6 py-5 sm:px-8 sm:py-6 bg-primary hover:bg-primary/90 text-primary-foreground transition-transform duration-300 ease-in-out hover:scale-105 group"
            >
              See how this works
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>

            <p className="text-sm sm:text-base text-muted-foreground mt-2 sm:mt-0">
              Pilot-only. For serious developers.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};