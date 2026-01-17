"use client";

import { motion } from "framer-motion";

import { DollarSign, Zap, TrendingUp, Shield, Eye } from "lucide-react";

const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[var(--comfhutt-accent)]">{children}</span>
);

export const DeveloperBenefitsSection = () => {
  const benefits = [
    {
      icon: <DollarSign className="h-8 w-8 text-primary" />,
      text: <><Highlight>Capital</Highlight> can come in earlier, without waiting for full-unit buyers.</>,
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      text: "Pricing discipline stays intact. No forced discounting.",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      text: <><Highlight>Execution</Highlight> momentum improves as <Highlight>capital</Highlight> <Highlight>timing</Highlight> smooths out.</>,
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      text: "Dependence on any single route reduces.",
    },
    {
      icon: <Eye className="h-8 w-8 text-primary" />,
      text: "Projects gain additional visibility without repositioning.",
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-4xl md:text-5xl font-bold font-playfair tracking-tight text-balance leading-tight">Here’s how ComfHutt partners benefit.</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-10">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center flex flex-col items-center">
              <div className="flex justify-center items-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-muted/50 mx-auto">
                {benefit.icon}
              </div>
              <p className="mt-5 sm:mt-6 text-base sm:text-lg text-muted-foreground text-balance max-w-xs mx-auto">{benefit.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
