"use client";
import React from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
};

const CardShell = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    variants={fadeUp}
    className={cn(
      "relative h-full rounded-2xl border backdrop-blur-xl",
      "bg-card/40 border-border",
      className
    )}
  >
    {children}
  </motion.div>
);

const ComparisonSection = () => {
  return (
    <section className="relative py-28 bg-background overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_60%)]" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="max-w-3xl mx-auto text-center mb-20"
        >
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            simple comparison
          </p>
          <h2 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight">
            Why invest in Fractional Real Estate
            
            when you have stocks and mutual funds?
          </h2>
          <p className="mt-6 text-muted-foreground text-lg">
            One grows fast but shakes a lot.
            The other grows slowly but stays solid.
          </p>
        </motion.div>

        {/* Comparison Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10"
        >
          {/* Stocks Side */}
          <CardShell className="group">
            <div className="p-8 sm:p-10">
              <span className="inline-block mb-6 rounded-full border px-4 py-1 text-sm tracking-wide text-muted-foreground">
                stocks & mutual funds
              </span>

              <h3 className="text-2xl font-semibold mb-4">
                Fast, flexible, stressful
              </h3>

              <p className="text-muted-foreground mb-8 leading-relaxed">
                You can buy and sell anytime.
                That’s both the benefit and the problem.
              </p>

              <div className="space-y-4">
                {[
                  "Prices go up and down every day",
                  "News, tweets, and fear move the market",
                  "Easy to sell when panic hits",
                  "Returns depend heavily on timing and emotions",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 text-muted-foreground"
                  >
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </CardShell>

          {/* Real Estate Side */}
          <CardShell className="border-[#38986C]/40 bg-card/60">
  <div className="p-8 sm:p-10">
    <span className="inline-block mb-6 rounded-full border border-[#38986C]/40 px-4 py-1 text-sm tracking-wide text-[#38986C]">
      fractional real estate
    </span>

    <h3 className="text-2xl font-semibold mb-4 text-[#38986C]">
      Slow, steady, reliable
    </h3>

    <p className="text-muted-foreground mb-8 leading-relaxed">
      Money is tied to a real property.
      That’s why it behaves calmly.
    </p>

    <div className="space-y-4">
      {[
        "Backed by an actual physical property",
        "Earns rent while value grows",
        "Prices don’t change every day",
        "Encourages holding instead of panic selling",
      ].map((item, i) => (
        <div key={i} className="flex items-start gap-3">
          <span className="mt-0.5 text-[#38986C]">✓</span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  </div>

  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-[#38986C]/30" />
</CardShell>
        </motion.div>

        {/* Closing Statement */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-24 max-w-3xl mx-auto text-center"
        >
         <div className="rounded-2xl bg-card/50 backdrop-blur border border-[#38986C]/30 text-center p-6">
  <p className="text-xl sm:text-2xl font-medium leading-snug">
    Liquidity feels powerful.
    <br />
    Discipline is what compounds wealth.
  </p>
</div>

          <p className="mt-8 text-muted-foreground text-base leading-relaxed">
            Fractional real estate is not here to replace stocks.
            It’s here to stop your portfolio from behaving emotionally.
          </p>

          <p className="mt-4 font-semibold">
            Smart portfolios use both.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonSection;