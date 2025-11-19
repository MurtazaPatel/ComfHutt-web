"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import BackgroundMotion from "./BackgroundMotion";

const words = ["Intelligent Ownership.", "Accessible.", "Liquid.", "Transparent."];

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typeSpeed = isDeleting ? 100 : 200;
    const timeout = setTimeout(() => {
      const fullWord = words[currentWordIndex];
      
      if (!isDeleting) {
        setCurrentText(fullWord.substring(0, currentText.length + 1));
        if (currentText === fullWord) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setCurrentText(fullWord.substring(0, currentText.length - 1));
        if (currentText === "") {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex]);

  return (
    <section id="hero" className="min-h-[100svh] flex items-center justify-center text-center relative overflow-hidden pt-24 md:pt-16">
      <BackgroundMotion variant="hero" />
      
      {/* Parallax Content Container */}
      <motion.div
        style={{ y, opacity }}
        className="container mx-auto px-4 relative z-10"
      >
        <div className="space-y-2">
          <motion.h1
            className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter leading-[1.1] gradient-text"
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: [0.215, 0.610, 0.355, 1] }}
          >
            Fractional Real Estate.
            <br />
            <div className="mt-2 sm:mt-0 inline-block">
              <span className="gradient-text-dynamic min-h-[1.1em] inline-block">
                {currentText}
              </span>
              <span className="inline-block w-[3px] h-[1.1em] bg-[#C7D2FE] ml-2 animate-blink-caret align-middle" />
            </div>
          </motion.h1>
          
          <motion.h2
            className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mt-6 md:mt-8 px-2"
            initial={{ opacity: 0, y: 30, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          >
            Building the world's first self-evolving property network. <br className="hidden md:block" />
            Accessible. Transparent. Autonomous.
          </motion.h2>

          <motion.div
            className="mt-10 md:mt-12 flex flex-col sm:flex-row justify-center gap-4 sm:space-x-4 px-8 sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <Link href="#solution" className="btn btn-primary text-base md:text-lg w-full sm:w-auto">
              Explore Platform
            </Link>
            <Link href="#problem" className="btn btn-secondary text-base md:text-lg w-full sm:w-auto">
              Why ComfHutt?
            </Link>
          </motion.div>
        </div>

        <motion.div
            className="mt-16 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
        >
            <Link href="/revenue-model" className="group flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all hover:scale-105">
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Explore our Revenue Model</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { delay: 1.5, duration: 1 },
          y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
        }}
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </section>
  );
}