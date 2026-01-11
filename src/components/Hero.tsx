"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import HeroCard from "./HeroCard";
import { VARIANTS } from "@/utils/animationUtils";
import { redirectToEarlyAccess } from "@/utils/navigation";

export default function Hero() {
  const router = useRouter();
  
  return (
    <section className="relative w-full min-h-screen pt-24 pb-16 md:pt-32 md:pb-20 px-6 flex items-center justify-center overflow-hidden bg-white">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-50/50 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center relative z-10">
        <motion.div
          className="flex flex-col items-start text-left"
          initial="hidden"
          animate="visible"
          variants={VARIANTS.staggerContainer}
        >
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-6"
            variants={VARIANTS.slideUp}
          >
            Fractional Real Estate Investing starting at <span className="text-emerald-600">₹10,000.</span>
          </motion.h1>

          <motion.p
            className="text-xl lg:text-2xl text-gray-500 mb-8 max-w-lg leading-relaxed"
            variants={VARIANTS.slideUp}
          >
            Buy fractional shares of high-yield properties in India. Monthly rental income. Legal ownership via SPV.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            variants={VARIANTS.slideUp}
          >
            <button
              onClick={() => redirectToEarlyAccess(router)}
              className="px-8 py-4 bg-black text-white text-lg font-semibold rounded-full hover:bg-gray-800 transition-all transform hover:scale-105 active:scale-95 shadow-lg text-center"
            >
              JOIN EARLY ACCESS
            </button>
            <button
              onClick={() => redirectToEarlyAccess(router)}
              className="px-8 py-4 bg-gray-100 text-gray-900 text-lg font-medium rounded-full hover:bg-gray-200 transition-all text-center"
            >
              Learn More
            </button>
          </motion.div>
        </motion.div>

        <div className="flex justify-center lg:justify-center items-center h-full w-full">
          <HeroCard />
        </div>
      </div>
    </section>
  );
}
