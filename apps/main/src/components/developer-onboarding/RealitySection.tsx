"use client";

import { motion } from "framer-motion";

const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[var(--comfhutt-accent)]">{children}</span>
);

export const RealitySection = () => {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="md:pr-8 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold font-playfair tracking-tight text-balance">
              <Highlight>Capital</Highlight> <Highlight>timing</Highlight> shapes <Highlight>execution</Highlight>.
            </h2>
          </div>
          <div>
            <p className="text-lg md:text-xl text-muted-foreground text-balance">
              Even well-located projects face <Highlight>timing</Highlight> gaps. <Highlight>Capital</Highlight> often arrives later than <Highlight>execution</Highlight> needs it.
            </p>
            <p className="mt-4 md:mt-6 text-lg md:text-xl text-muted-foreground text-balance">
              As phases progress, pressure builds quietly. Not because demand is weak, but because <Highlight>timing</Highlight> is tight.
            </p>
          </div>
        </div>
        <div className="text-center mt-16 md:mt-24">
          <p className="text-xl md:text-2xl font-semibold text-foreground text-balance">
            This is part of building at <Highlight>scale</Highlight>.
          </p>
        </div>
      </div>
    </section>
  );
};
