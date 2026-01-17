"use client";

import { motion } from "framer-motion";

const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[var(--comfhutt-accent)]">{children}</span>
);

export const WhyNowSection = () => {
  return (
    <section className="py-20 md:py-32 bg-muted/20">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-playfair tracking-tight text-balance leading-tight">A shift already underway.</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          <div>
            <p className="text-lg md:text-xl text-muted-foreground text-balance">
              Investor behavior around real estate is changing. More participants want access, but not always through full ownership.
            </p>
            <blockquote className="mt-6 md:mt-8 border-l-4 border-primary pl-4 md:pl-6 italic text-lg md:text-xl text-foreground text-balance">
              Market reports indicate a growing demand for <Highlight>structured</Highlight> and fractional ownership models across residential and commercial real estate, as investors look for smaller-ticket participation without full-asset exposure.
            </blockquote>
            <p className="mt-3 md:mt-4 text-xs md:text-sm text-muted-foreground">
              Sources: Knight Frank, ANAROCK, industry real estate market reports
            </p>
          </div>
          <div>
            <p className="text-lg md:text-xl text-muted-foreground text-balance">
              At the same time, developers are becoming more deliberate about how and when <Highlight>capital</Highlight> enters their projects.
            </p>
            <p className="mt-4 md:mt-6 text-lg md:text-xl text-muted-foreground text-balance">
              As these <Highlight>structures</Highlight> mature, early developer partners help shape standards, terms, and expectations.
            </p>
          </div>
        </div>
        <div className="text-center mt-16 md:mt-24">
          <p className="text-xl md:text-2xl font-semibold text-foreground text-balance">
            Early <Highlight>execution</Highlight> sets standards.
          </p>
        </div>
      </div>
    </section>
  );
};
