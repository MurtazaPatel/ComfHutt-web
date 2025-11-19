"use client";

import { motion } from "framer-motion";
import { Lock, EyeOff, Clock } from "lucide-react";
import MotionWrapper from "./MotionWrapper";
import BackgroundMotion from "./BackgroundMotion";

const features = [
  {
    icon: Lock,
    title: "Access Barriers",
    description:
      "High entry points exclude everyday investors from significant wealth opportunities.",
  },
  {
    icon: EyeOff,
    title: "Transparency",
    description:
      "Hidden fees and intermediaries create distrust, eroding investor confidence.",
  },
  {
    icon: Clock,
    title: "Inefficiency",
    description:
      "Slow processes, manual settlements, and liquidity delays hinder growth.",
  },
];

export default function Problem() {
  return (
    <section id="problem" className="py-20 md:py-48 min-h-[50vh] flex items-center relative overflow-hidden">
      <BackgroundMotion variant="problem" />
      
      <div className="container mx-auto max-w-5xl px-4 text-center relative z-10">
        <MotionWrapper className="mb-12 md:mb-20">
          <span className="text-base md:text-lg font-medium text-blue-300">
            The Challenge
          </span>
          <h2 className="text-4xl md:text-7xl font-bold tracking-tighter mt-3 md:mt-4 gradient-text leading-tight">
            Real Estate's Core Challenges.
          </h2>
          <p className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto mt-6 md:mt-8">
            The traditional market is rigid and exclusionary. We are here to fix
            the broken foundation.
          </p>
        </MotionWrapper>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <MotionWrapper
              key={feature.title}
              delay={index * 0.15}
              viewportMargin="-50px"
              className="h-full"
            >
              <div className="glass-card p-6 md:p-8 group h-full hover:bg-white/10 transition-colors duration-500">
                <div className="text-blue-300 mb-6 flex justify-center bg-blue-500/10 w-16 h-16 rounded-full items-center mx-auto group-hover:scale-110 transition-transform duration-500 border border-blue-500/20">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}