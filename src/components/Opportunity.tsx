"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import MotionWrapper from "./MotionWrapper";
import BackgroundMotion from "./BackgroundMotion";

export default function Opportunity() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section
      id="opportunity"
      className="py-20 md:py-64 min-h-[60vh] flex items-center relative overflow-hidden"
      ref={ref}
    >
      <BackgroundMotion variant="advantages" />

      <div className="container mx-auto max-w-5xl px-4 text-center relative z-10">
        <MotionWrapper scale={true} duration={0.8} viewportMargin="-100px">
          <span className="text-base md:text-lg font-medium text-blue-300">
            The Opportunity
          </span>
          <h2 className="text-5xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter mt-3 md:mt-4 gradient-text">
            $1 Trillion.
          </h2>
          <p className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto mt-6 md:mt-8">
            That is the potential of the Indian real estate market by 2030,
            growing at 9% CAGR.
          </p>
          <p className="text-lg md:text-2xl text-white font-medium max-w-3xl mx-auto mt-6 md:mt-8">
            Fueled by digital-native demand for crypto-backed assets.
          </p>
        </MotionWrapper>
      </div>
    </section>
  );
}