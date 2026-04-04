"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Building,
  ClipboardList,
  Users,
  TrendingUp,
  Award,
} from "lucide-react";
import ShinyText from "@/components/ShinyText";

const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[var(--comfhutt-accent)]">{children}</span>
);

const steps = [
  {
    icon: <Building size={28} className="text-foreground/70" />,
    title: "Unit Selection",
    description:
      "A specific unit or property is identified for participation.",
  },
  {
    icon: <ClipboardList size={28} className="text-foreground/70" />,
    title: "Ownership Structuring",
    description:
      "Ownership is structured so it can be divided into smaller, clearly defined parts.",
  },
  {
    icon: <Users size={28} className="text-foreground/70" />,
    title: "Wider Participation",
    description:
      "These parts are made available to a wider pool of investors through ComfHutt.",
  },
  {
    icon: <TrendingUp size={28} className="text-foreground/70" />,
    title: "Capital Flow",
    description:
      "As participation increases, capital flows in earlier — while the project continues as planned.",
  },
  {
    icon: <Award size={28} className="text-foreground/70" />,
    title: "Brand Presence",
    description:
      "The added visibility also strengthens the project’s brand presence and reach.",
  },
];

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-5xl md:text-[56px] font-bold tracking-tight text-foreground mb-6"
          >
            How it works, the{" "}
            <ShinyText
              text="COMFHUTT"
              disabled={false}
              speed={3}
              className="text-[var(--comfhutt-accent)]"
            />{" "}
            way.
          </motion.h2>
          <div className="h-px w-24 bg-foreground/20 mx-auto mt-8" />
        </div>

        {/* Vertical Steps */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-9 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

          <div className="flex flex-col gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
                className="relative flex items-start gap-6"
              >
                {/* Icon and Marker */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-18 h-18 rounded-full bg-background border border-foreground/20 flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>

                {/* Text Content */}
                <div className="mt-1.5">
                  <h3 className="text-xl md:text-2xl font-semibold mb-2 text-foreground tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
