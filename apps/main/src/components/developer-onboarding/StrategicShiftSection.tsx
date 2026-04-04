"use client";

import { motion } from "framer-motion";

const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[var(--comfhutt-accent)]">{children}</span>
);

export const StrategicShiftSection = () => {
  return (
    <section className="relative py-32 bg-background overflow-hidden">
      {/* Background motion */}
      <motion.div
        aria-hidden
        className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-[var(--comfhutt-accent)]/10 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative container mx-auto max-w-4xl px-8 text-center">
        <h2 className="text-5xl font-bold font-playfair mb-10">
          Reduce <Highlight>dependence</Highlight> on traditional routes.
        </h2>

        <p className="text-lg text-muted-foreground mb-6">
          Traditional paths work well. They just don’t always align with execution timeline.
        </p>

        <p className="text-xl font-medium">
          A smarter option lets <Highlight>capital</Highlight> arrive earlier,
          without changing <Highlight>standards</Highlight> or <Highlight>execution</Highlight>.
        </p>
      </div>
    </section>
  );
};