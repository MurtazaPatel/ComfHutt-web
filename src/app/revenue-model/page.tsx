"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import MotionWrapper from "@/components/MotionWrapper";
import BackgroundMotion from "@/components/BackgroundMotion";

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

export default function RevenueModelPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <Navbar />
      
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 relative min-h-screen">
        <BackgroundMotion variant="revenue" />
        
        <div className="container mx-auto max-w-5xl px-4 relative z-10">
          <MotionWrapper className="text-center max-w-4xl mx-auto mb-20">
            <span className="text-base md:text-lg font-medium text-blue-300">
              ComfHutt Economics
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mt-4 mb-6 gradient-text">
              Revenue Model.
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We are building a sustainable, high-growth ecosystem, scaling from transaction economics to a full-scale AI SaaS platform.
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
                className="relative pl-8 md:pl-12 pb-24 last:pb-0 group"
              >
                <div
                  className={`absolute -left-[1px] md:left-[3px] top-2 w-4 h-4 rounded-full border-2 border-[#050505] z-10 transition-all duration-500 ${
                    item.active
                      ? "bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.5)] scale-125"
                      : "bg-white/20 group-hover:bg-blue-400/50"
                  }`}
                />
                <span
                  className={`text-sm font-semibold uppercase tracking-wider block mb-2 ${
                    item.active ? "text-blue-300" : "text-gray-500 group-hover:text-gray-400 transition-colors"
                  }`}
                >
                  {item.stage}
                </span>
                <h3 className={`text-2xl md:text-4xl font-semibold transition-colors duration-300 ${item.active ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                  {item.title}
                </h3>
                <p className="text-gray-400 text-lg md:text-xl mt-4 leading-relaxed max-w-2xl">
                  {item.description}
                </p>
                
                {/* Premium decorative card effect */}
                <div className="absolute inset-0 -z-10 bg-white/[0.02] border border-white/[0.05] rounded-2xl -m-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </MotionWrapper>
            ))}
          </div>
          
          <div className="mt-32 text-center">
            <p className="text-gray-500 text-sm uppercase tracking-widest mb-4">Projected Growth</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-medium">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               Targeting $50M ARR by Year 4
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}