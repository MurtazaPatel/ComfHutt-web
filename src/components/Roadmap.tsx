"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import MotionWrapper from "./MotionWrapper";

const stages = [
  {
    stage: "Stage 1 (Year 1-2)",
    title: "Core Platform & Transaction Economics",
    description:
      "Foundation built on transaction fees (1-2%), tokenization fees for developers, and smart escrow services.",
    active: true,
  },
  {
    stage: "Stage 2 (Year 3-4)",
    title: "Growth Layer & Wallet Services",
    description:
      "Expansion via recurring B2B developer subscriptions and float revenue from our native wallet ecosystem.",
    active: false,
  },
  {
    stage: "Stage 3 (Year 5+)",
    title: "AI-Powered Ecosystem",
    description:
      "Licensing our AI Validator SaaS to other PropTech platforms and offering premium predictive analytics.",
    active: false,
  },
];

export default function Roadmap() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="roadmap" className="py-20 md:py-48">
      <div className="container mx-auto max-w-5xl px-4">
        <MotionWrapper className="text-center max-w-3xl mx-auto">
          <span className="text-base md:text-lg font-medium text-blue-300">
            Revenue Model
          </span>
          <h2 className="text-4xl md:text-7xl font-bold tracking-tighter mt-3 md:mt-4 gradient-text">
            Three-Stage Growth.
          </h2>
          <p className="text-lg md:text-2xl text-gray-300 mt-6 md:mt-8">
            We are building a complete ecosystem, from transaction economics to
            a full-scale AI SaaS.
          </p>
        </MotionWrapper>

        <div className="mt-16 md:mt-20 max-w-3xl mx-auto relative" ref={containerRef}>
          {/* Animated Timeline Line */}
          <div className="absolute left-[7px] md:left-[11px] top-2 bottom-0 w-[2px] h-full bg-white/10 origin-top">
             <motion.div
                style={{ height: lineHeight }}
                className="w-full bg-blue-400 origin-top"
             />
          </div>

          {stages.map((item, index) => (
            <MotionWrapper
              key={item.stage}
              direction="left"
              delay={index * 0.2}
              viewportMargin="-100px"
              className="relative pl-8 md:pl-12 pb-16 last:pb-0"
            >
              <div
                className={`absolute -left-[1px] md:left-[3px] top-2 w-4 h-4 rounded-full border-2 border-[#050505] z-10 transition-colors duration-500 ${
                  item.active
                    ? "bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.5)]"
                    : "bg-white/20"
                }`}
              />
              <span
                className={`text-sm font-semibold uppercase tracking-wider ${
                  item.active ? "text-blue-300" : "text-gray-500"
                }`}
              >
                {item.stage}
              </span>
              <h3 className={`text-xl md:text-3xl font-semibold mt-2 transition-colors duration-300 ${item.active ? 'text-white' : 'text-gray-300'}`}>
                {item.title}
              </h3>
              <p className="text-gray-400 text-base md:text-lg mt-3 leading-relaxed">
                {item.description}
              </p>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}