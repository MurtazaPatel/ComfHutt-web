"use client";

import { motion } from "framer-motion";

const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[var(--comfhutt-accent)]">{children}</span>
);

export const WhyNowSection = () => {
  return (
    <section className="relative py-24 md:py-32 bg-muted/20 overflow-hidden">
      {/* Subtle ambient motion */}
      <motion.div
        aria-hidden
        className="absolute -top-48 -right-48 h-[520px] w-[520px] rounded-full bg-[var(--comfhutt-accent)]/10 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative container mx-auto max-w-5xl px-4">
        {/* Heading */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-bold font-playfair tracking-tight"
          >
            A <Highlight>shift</Highlight> already underway.
          </motion.h2>
        </div>

        {/* Core content */}
        <div className="grid md:grid-cols-2 gap-14 md:gap-20 items-start">
          {/* Investor side */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-6"
          >
            <p className="text-lg md:text-xl text-muted-foreground">
              Investor expectations around real estate are changing.
            </p>

            <p className="text-lg md:text-xl text-muted-foreground">
              Access matters more than ownership size.
            </p>

            <div className="rounded-xl bg-background/80 backdrop-blur-sm border border-border/40 p-6">
              <p className="italic text-base md:text-lg text-foreground">
                Demand is rising for <Highlight>structured</Highlight>, fractional
                models that allow participation without full-asset exposure.
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                Knight Frank, ANAROCK, industry reports
              </p>
            </div>
          </motion.div>

          {/* Developer side */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
            className="space-y-6"
          >
            <p className="text-lg md:text-xl text-muted-foreground">
              Developers are also rethinking timing.
            </p>

            <p className="text-lg md:text-xl text-muted-foreground">
            It’s not just how much <Highlight>capital</Highlight> comes in, but when.
            </p>

            <p className="text-lg md:text-xl text-muted-foreground">
              Early partners help shape <Highlight>standards</Highlight>, not just
              participate in them.
            </p>
          </motion.div>
        </div>

        {/* Closing line */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
          className="text-center mt-20"
        >
          <p className="text-xl md:text-2xl font-semibold text-foreground">
            Early <Highlight>execution</Highlight> sets the tone.
          </p>
        </motion.div>
      </div>
    </section>
  );
};