"use client";

import { motion } from "framer-motion";
import { Database, ShieldCheck, Scale } from "lucide-react";
import MotionWrapper from "./MotionWrapper";
import BackgroundMotion from "./BackgroundMotion";

const solutions = [
  {
    icon: Database,
    title: "Fractional Tokenization",
    description: (
      <>
        Own from 0.1 sq.m. We are democratizing access with entry points as low
        as <span className="text-white font-bold">$100</span>.
      </>
    ),
  },
  {
    icon: ShieldCheck,
    title: "AI Smart Validator",
    description:
      "Advanced AI verifies property data instantly, ensuring asset integrity and compliance before it hits the chain.",
  },
  {
    icon: Scale,
    title: "Smart Contract Escrow",
    description:
      "Immutable ledgers for transparent transactions. No hidden fees, just secure, automated settlements.",
  },
];

export default function Solution() {
  return (
    <section id="solution" className="py-20 md:py-48 min-h-screen relative overflow-hidden">
      <BackgroundMotion variant="solution" />
      
      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        <MotionWrapper className="text-center max-w-4xl mx-auto">
          <span className="text-base md:text-lg font-medium text-blue-300">
            The Solution
          </span>
          <h2 className="text-4xl md:text-7xl font-bold tracking-tighter mt-3 md:mt-4 gradient-text">
            Intelligent Ownership.
          </h2>
          <p className="text-lg md:text-2xl text-gray-300 mt-6 md:mt-8">
            Fractional ownership meets autonomous intelligence.
          </p>
        </MotionWrapper>

        <div className="flex flex-col md:flex-row gap-10 md:gap-8 mt-16 md:mt-24">
          {solutions.map((solution, index) => (
            <MotionWrapper
              key={solution.title}
              delay={index * 0.2}
              viewportMargin="-50px"
              className="md:w-1/3"
            >
              <div className="p-4 md:p-6 text-center md:text-left relative group">
                 <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                <div className="relative z-10">
                    <div className="premium-icon-bg mx-auto md:mx-0 shadow-[0_0_30px_rgba(165,180,252,0.2)] group-hover:shadow-[0_0_50px_rgba(165,180,252,0.4)] transition-shadow duration-500">
                    <solution.icon className="w-8 h-8 text-[#A5B4FC]" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-semibold mb-3 text-white">
                    {solution.title}
                    </h3>
                    <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                    {solution.description}
                    </p>
                </div>
              </div>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}