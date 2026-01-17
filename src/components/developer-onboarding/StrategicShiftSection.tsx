"use client";

import { motion } from "framer-motion";

const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[var(--comfhutt-accent)]">{children}</span>
);

export const StrategicShiftSection = () => {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto max-w-4xl text-center px-4">
        <h2 className="text-4xl md:text-5xl font-bold font-playfair tracking-tight text-balance">
          Reduce dependence on traditional routes.
        </h2>
        <div className="mt-6 md:mt-8 text-lg md:text-xl text-muted-foreground space-y-4 md:space-y-6">
          <p className="text-balance">
            Traditional paths work well for most projects. But they aren’t always the most efficient or timely.
          </p>
          <p className="text-balance">
            Some developers add a better, smarter option — one that allows <Highlight>capital</Highlight> to come in earlier and more safely, without changing how the project is sold, built, or positioned.
          </p>
        </div>
        <div className="mt-12 md:mt-16">
          <p className="text-xl md:text-2xl font-semibold text-foreground text-balance">
            More flexibility. Same discipline.
          </p>
        </div>
      </div>
    </section>
  );
};
