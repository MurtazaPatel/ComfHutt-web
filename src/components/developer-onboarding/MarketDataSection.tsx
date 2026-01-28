"use client";

import { motion } from "framer-motion";

const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[var(--comfhutt-accent)]">{children}</span>
);

export const MarketDataSection = () => {
  return (
    <section className="py-20 md:py-32 bg-muted/20">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="md:order-2 md:pl-8 text-center md:text-left">
            <h2 className="text-5xl md:text-5xl font-bold font-playfair tracking-tight text-balance leading-tight">
              This pattern shows up <Highlight>again</Highlight> and <Highlight>again</Highlight>.
            </h2>
          </div>
          <div className="md:order-1">
            <p className="text-lg md:text-xl text-muted-foreground text-balance">
              Across cities and project types, <Highlight>capital</Highlight> gets held up at similar stages. Not because projects aren’t <Highlight> viable</Highlight>. But because <Highlight>capital</Highlight> and <Highlight>execution timelines</Highlight> don’t always align.
            </p>
            <p className="mt-4 md:mt-6 text-lg md:text-xl text-muted-foreground text-balance">
              At the same time, interest in <Highlight>real estate</Highlight> exposure keeps <Highlight>widening</Highlight>, just not always at <Highlight>full-unit levels</Highlight>.
            </p>
          </div>
        </div>
        <div className="text-center mt-16 md:mt-24">
          <p className="text-xl md:text-2xl font-semibold text-foreground text-balance">
            This isn’t a one-off. It’s a recurring <Highlight>pattern</Highlight>.
          </p>
        </div>
      </div>
    </section>
  );
};
