"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type VariantType = 
  | "hero" 
  | "problem" 
  | "solution" 
  | "workflow" 
  | "advantages" 
  | "vision" 
  | "analyzer"
  | "revenue";

interface BackgroundMotionProps {
  variant: VariantType;
  className?: string;
}

export default function BackgroundMotion({ variant, className }: BackgroundMotionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <div 
      ref={containerRef} 
      className={cn("absolute inset-0 z-0 overflow-hidden pointer-events-none select-none", className)}
    >
      {variant === "hero" && <HeroBackground scrollY={scrollYProgress} />}
      {variant === "problem" && <ProblemBackground scrollY={scrollYProgress} />}
      {variant === "solution" && <SolutionBackground scrollY={scrollYProgress} />}
      {variant === "workflow" && <WorkflowBackground scrollY={scrollYProgress} />}
      {variant === "advantages" && <AdvantagesBackground scrollY={scrollYProgress} />}
      {variant === "vision" && <VisionBackground scrollY={scrollYProgress} />}
      {variant === "analyzer" && <AnalyzerBackground scrollY={scrollYProgress} />}
      {variant === "revenue" && <RevenueBackground scrollY={scrollYProgress} />}
      
      {/* Global Grain/Noise Overlay for texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
    </div>
  );
}

// --- Sub-components for each variant ---

function HeroBackground({ scrollY }: { scrollY: MotionValue<number> }) {
  const y1 = useTransform(scrollY, [0, 1], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1], [0, -150]);
  const opacity = useTransform(scrollY, [0, 0.5], [1, 0]);

  return (
    <>
      {/* Soft parallax gradients */}
      <motion.div 
        style={{ y: y1, opacity }}
        className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-blue-900/10 blur-[100px] rounded-full" 
      />
      <motion.div 
        style={{ y: y2, opacity }}
        className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-indigo-900/10 blur-[120px] rounded-full" 
      />
      
      {/* Floating fractional blocks */}
      <div className="absolute inset-0 opacity-20">
        <FloatingBlock className="top-[20%] left-[10%] w-24 h-24 border border-white/10" delay={0} />
        <FloatingBlock className="top-[60%] right-[15%] w-32 h-32 border border-white/5" delay={2} />
        <FloatingBlock className="top-[30%] right-[25%] w-16 h-16 border border-white/10" delay={1} />
      </div>

      {/* Architectural wireframes */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.05]">
        <pattern id="hero-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" className="text-white" strokeWidth="0.5"/>
        </pattern>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>
    </>
  );
}

function ProblemBackground({ scrollY }: { scrollY: MotionValue<number> }) {
  // Darker blueprint grids fading in/out
  const opacity = useTransform(scrollY, [0.2, 0.5, 0.8], [0, 1, 0]);
  
  return (
    <motion.div style={{ opacity }} className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-80" />
      <div className="absolute inset-0" 
           style={{ 
             backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
             backgroundSize: '50px 50px'
           }} 
      />
      {/* Distorted lines representing inefficiency */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <motion.path 
          d="M0,100 Q400,150 800,100 T1600,100" 
          fill="none" 
          stroke="white" 
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
      </svg>
    </motion.div>
  );
}

function SolutionBackground({ scrollY }: { scrollY: MotionValue<number> }) {
  // Shapes aligning themselves
  return (
    <>
      <div className="absolute inset-0 opacity-10">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-64 h-64 border border-blue-500/30 rounded-full"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
         <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 border border-indigo-500/20 rounded-full"
          animate={{ scale: [1.1, 1, 1.1], rotate: [0, -45, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>
      {/* Data organization grid */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
        <div className="grid grid-cols-6 gap-4 w-full max-w-4xl">
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div 
              key={i}
              className="aspect-square border border-white"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function WorkflowBackground({ scrollY }: { scrollY: MotionValue<number> }) {
  // Flowing lines
  return (
    <div className="absolute inset-0">
       <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.2)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
          </linearGradient>
        </defs>
        
        {/* Path sequence */}
        <motion.path
          d="M-100,300 C400,100 800,500 1600,300"
          fill="none"
          stroke="url(#flow-gradient)"
          strokeWidth="2"
          strokeDasharray="10 10"
          animate={{ strokeDashoffset: [0, -100] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </div>
  );
}

function AdvantagesBackground({ scrollY }: { scrollY: MotionValue<number> }) {
  return (
    <div className="absolute inset-0">
      {/* Pulsing micro-tokens */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
          style={{
            top: `${20 + (i * 13) % 60}%`,
            left: `${10 + (i * 17) % 80}%`,
          }}
          animate={{
            scale: [1, 2, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + (i % 2),
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}

function VisionBackground({ scrollY }: { scrollY: MotionValue<number> }) {
  // Morphing wireframe mesh
  return (
    <div className="absolute inset-0 opacity-10">
       <svg className="w-full h-full">
        <pattern id="vision-hex" x="0" y="0" width="50" height="43.3" patternUnits="userSpaceOnUse">
             <path d="M25 0L50 12.5V37.5L25 50L0 37.5V12.5L25 0Z" fill="none" stroke="white" strokeWidth="0.5"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#vision-hex)" />
      </svg>
    </div>
  );
}

function AnalyzerBackground({ scrollY }: { scrollY: MotionValue<number> }) {
  // Abstract AI mesh + flowing data lines
  return (
    <div className="absolute inset-0">
      {/* Tech grid */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{ 
            backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(64, 224, 208, .3) 25%, rgba(64, 224, 208, .3) 26%, transparent 27%, transparent 74%, rgba(64, 224, 208, .3) 75%, rgba(64, 224, 208, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(64, 224, 208, .3) 25%, rgba(64, 224, 208, .3) 26%, transparent 27%, transparent 74%, rgba(64, 224, 208, .3) 75%, rgba(64, 224, 208, .3) 76%, transparent 77%, transparent)',
            backgroundSize: '50px 50px'
        }}
      />
      
      {/* Orbiting micro-nodes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-20 pointer-events-none">
        <motion.div 
            className="absolute inset-0 border border-cyan-500/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_cyan]" />
        </motion.div>
         <motion.div 
            className="absolute inset-[50px] border border-blue-500/20 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
             <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_blue]" />
        </motion.div>
      </div>
    </div>
  );
}

function RevenueBackground({ scrollY }: { scrollY: MotionValue<number> }) {
  return (
    <div className="absolute inset-0 opacity-10">
      {/* Chart-like background lines */}
       <svg className="w-full h-full" preserveAspectRatio="none">
         <motion.path 
            d="M0,800 L200,700 L400,750 L600,600 L800,500 L1000,550 L1200,300 L1400,200 L1600,100"
            fill="none"
            stroke="white"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 2 }}
         />
       </svg>
    </div>
  );
}

// Helper component for floating blocks
function FloatingBlock({ className, delay }: { className?: string, delay: number }) {
  return (
    <motion.div
      className={cn("absolute bg-white/5 backdrop-blur-sm", className)}
      animate={{
        y: [0, -20, 0],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
    />
  );
}