"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="relative py-28 md:py-40 bg-background overflow-hidden">
      {/* Ambient closing field */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.06),transparent_60%)]"
        animate={{ backgroundPositionY: ["0%", "-20%", "0%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative container mx-auto max-w-6xl px-6">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          {/* Left: Narrative close */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="text-sm uppercase tracking-wide text-muted-foreground mb-6">
              Next step
            </p>

            <h2 className="text-4xl md:text-5xl font-bold font-playfair tracking-tight leading-tight">
              Explore what early
              <br />
              alignment looks like.
            </h2>

            <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-xl">
              If this structure aligns with how you think about capital, timing,
              and execution, the next step is a focused conversation.
            </p>

            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-xl">
              Not a pitch. Not a commitment. Just clarity on whether a pilot makes
              sense.
            </p>
          </motion.div>

          {/* Right: Decision actions */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
            className="flex flex-col gap-6"
          >
            <Button
              size="lg"
              className="group w-full text-lg px-8 py-7 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 flex items-center justify-between"
            >
              Discuss a pilot property
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full text-lg px-8 py-7 transition-all duration-300 hover:border-foreground/40"
            >
              Join developer early access
            </Button>

            <p className="text-sm text-muted-foreground pt-4">
              Early partners help define standards, not follow them.
            </p>
          </motion.div>
        </div>

        {/* Closing brand note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="text-center mt-28"
        >
          <p className="text-base md:text-lg text-muted-foreground">
            Building long-term real estate infrastructure.
          </p>
        </motion.div>
      </div>
    </section>
  );
};