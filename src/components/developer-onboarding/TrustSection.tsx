"use client";

import { motion } from "framer-motion";

const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[var(--comfhutt-accent)]">{children}</span>
);

export const TrustSection = () => {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto max-w-4xl text-center px-4">
        <h2 className="text-4xl md:text-5xl font-bold font-playfair tracking-tight text-balance leading-tight">
          Safer and reliable in every way that matters.
        </h2>
        <div className="mt-6 md:mt-8 text-base md:text-xl text-muted-foreground space-y-4 md:space-y-6">
          <p className="text-balance">
            The <Highlight>structure</Highlight> is designed to be straightforward, familiar, and dependable.
          </p>
          <p className="text-balance">
            Nothing experimental. Nothing unclear. Everything moves at your pace, with the full <Highlight>structure</Highlight> visible upfront — so you and your legal and finance teams can review it comfortably before any decision is made.
          </p>
          <p className="text-balance">
            The project continues exactly as it is — this simply adds a safer, more reliable way for <Highlight>capital</Highlight> to come in.
          </p>
        </div>
        <div className="mt-12 md:mt-16">
          <p className="text-xl md:text-2xl font-semibold text-foreground text-balance">
            Built for confidence, not shortcuts.
          </p>
        </div>
      </div>
    </section>
  );
};
