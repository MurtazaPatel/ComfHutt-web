"use client";
import React from "react";
import { StickyScroll } from "../ui/sticky-scroll-reveal";
import { motion } from "framer-motion";

const UnitSelectionVisual = () => (
  <div className="flex items-center justify-center w-full h-full bg-slate-50">
    <svg width="200" height="200" viewBox="0 0 200 200" className="opacity-80">
      <rect x="40" y="40" width="120" height="120" stroke="#94a3b8" strokeWidth="2" fill="none" rx="4" />
      <motion.rect 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        x="60" y="60" width="80" height="80" fill="#e2e8f0" 
      />
      <path d="M40 80 H160 M80 40 V160" stroke="#e2e8f0" strokeWidth="1" />
    </svg>
  </div>
);

const OwnershipStructuringVisual = () => (
  <div className="flex items-center justify-center w-full h-full bg-slate-50">
    <div className="grid grid-cols-4 gap-2 p-8">
      {[...Array(16)].map((_, i: number) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05, duration: 0.5 }}
          className="w-8 h-8 bg-blue-100 border border-blue-200 rounded-sm"
        />
      ))}
    </div>
  </div>
);

const WiderParticipationVisual = () => (
  <div className="flex items-center justify-center w-full h-full bg-slate-50 overflow-hidden">
     <div className="grid grid-cols-6 gap-3">
      {[...Array(24)].map((_, i: number) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ delay: i * 0.03, duration: 0.5 }}
          className="w-3 h-3 bg-indigo-400 rounded-full"
        />
      ))}
    </div>
  </div>
);

const CapitalFlowVisual = () => (
  <div className="flex items-center justify-center w-full h-full bg-slate-50 relative">
    <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center z-10 border border-emerald-200">
           <div className="w-16 h-16 bg-emerald-200 rounded-full" />
        </div>
    </div>
    {[0, 90, 180, 270].map((rotation: number, i: number) => (
      <motion.div
        key={i}
        className="absolute w-full h-full flex items-center justify-center pointer-events-none"
        style={{ rotate: rotation }}
      >
         <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 40, opacity: 1 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-16 h-0.5 bg-emerald-400" 
         />
      </motion.div>
    ))}
  </div>
);

const BrandPresenceVisual = () => (
  <div className="flex items-center justify-center w-full h-full bg-slate-50">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        <div className="w-32 h-32 bg-slate-900 rounded-lg shadow-xl flex items-center justify-center">
            <div className="w-16 h-16 border-2 border-slate-700 rounded-full" />
        </div>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-2 bg-black/10 blur-md rounded-full" />
      </motion.div>
  </div>
);

const content = [
  {
    title: "Unit Selection",
    description:
      "A specific unit or property is identified for participation. We focus on high-potential assets that fit our rigorous selection criteria.",
    content: <UnitSelectionVisual />,
  },
  {
    title: "Ownership Structuring",
    description:
      "Ownership is structured so it can be divided into smaller, clearly defined parts. This modular approach allows for flexibility and precision.",
    content: <OwnershipStructuringVisual />,
  },
  {
    title: "Wider Participation",
    description:
      "These parts are made available to a wider pool of investors through ComfHutt. Democratizing access to premium real estate opportunities.",
    content: <WiderParticipationVisual />,
  },
  {
    title: "Capital Flow",
    description:
      "As participation increases, capital flows in earlier — while the project continues as planned. Securing funding at critical stages.",
    content: <CapitalFlowVisual />,
  },
  {
    title: "Brand Presence",
    description:
      "The added visibility also strengthens the project’s brand presence and reach. Creating a lasting impact in the market.",
    content: <BrandPresenceVisual />,
  },
];

export const HowItWorksSection = () => {
  return (
    <section className="py-20 md:py-24 bg-background overflow-hidden relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16 relative">
          <h2 className="text-4xl md:text-5xl font-bold font-playfair tracking-tight text-foreground mb-4">
            How it works, the ComfHutt way.
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            A controlled walkthrough of how capital structure quietly changes execution.
          </p>
        </div>

        <StickyScroll content={content} />
      </div>
    </section>
  );
};


