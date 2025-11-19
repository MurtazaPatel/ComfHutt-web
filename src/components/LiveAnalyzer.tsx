"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import MotionWrapper from "./MotionWrapper";
import BackgroundMotion from "./BackgroundMotion";
import { Activity, Globe, TrendingUp, Zap } from "lucide-react";

const marketData = [
  { region: "Mumbai", growth: "+12.4%", volume: "$4.2B", sentiment: "Bullish" },
  { region: "Bangalore", growth: "+9.8%", volume: "$2.8B", sentiment: "High Demand" },
  { region: "Hyderabad", growth: "+15.1%", volume: "$1.9B", sentiment: "Emerging" },
  { region: "Delhi NCR", growth: "+7.2%", volume: "$3.5B", sentiment: "Stable" },
];

export default function LiveAnalyzer() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % marketData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="analyzer" className="py-20 md:py-32 min-h-screen relative overflow-hidden flex items-center">
      <BackgroundMotion variant="analyzer" />
      
      <div className="container mx-auto max-w-7xl px-4 relative z-10" ref={containerRef}>
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Text Content */}
          <div className="lg:w-1/2">
             <MotionWrapper direction="right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                Live Market Intelligence
              </div>
              
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-white leading-[1.1]">
                Real-Time <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  Market Analyzer
                </span>
              </h2>
              
              <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-xl">
                Our AI engine processes millions of data points—from land registry records to urban development plans—giving you predictive insights before the market reacts.
              </p>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                   <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
                     <Globe className="w-6 h-6" />
                   </div>
                   <div>
                     <h4 className="text-white font-semibold">Macro-Economic Scans</h4>
                     <p className="text-sm text-gray-400">Global capital flow monitoring</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                   <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400">
                     <Zap className="w-6 h-6" />
                   </div>
                   <div>
                     <h4 className="text-white font-semibold">Predictive ROI Modeling</h4>
                     <p className="text-sm text-gray-400">Future value projection engine</p>
                   </div>
                </div>
              </div>
             </MotionWrapper>
          </div>

          {/* Visual Interface */}
          <motion.div 
            style={{ y }}
            className="lg:w-1/2 w-full"
          >
            <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden group">
              {/* Glass reflections */}
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-cyan-500/20 blur-[80px] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-blue-600/20 blur-[80px] rounded-full pointer-events-none" />
              
              {/* Interface Header */}
              <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  <span className="text-white font-medium tracking-wide">COMFHUTT AI CORE</span>
                </div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500/50" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                  <div className="w-2 h-2 rounded-full bg-green-500/50" />
                </div>
              </div>

              {/* Dynamic Data Display */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                 {marketData.map((data, i) => (
                    <motion.div 
                      key={data.region}
                      className={`p-4 rounded-xl border transition-all duration-500 ${
                        i === activeIndex 
                          ? "bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]" 
                          : "bg-white/5 border-white/5 opacity-50"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-gray-400">{data.region}</span>
                        {i === activeIndex && <TrendingUp className="w-4 h-4 text-cyan-400" />}
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{data.growth}</div>
                      <div className="text-xs text-gray-500">Vol: {data.volume}</div>
                    </motion.div>
                 ))}
              </div>

              {/* Analysis Graph Visualization (Abstract) */}
              <div className="relative h-40 w-full bg-black/20 rounded-xl border border-white/5 overflow-hidden flex items-end px-2 pb-2 gap-1">
                 {Array.from({ length: 30 }).map((_, i) => (
                   <motion.div
                     key={i}
                     className="flex-1 bg-cyan-500/30 rounded-t-sm"
                     animate={{ 
                       height: [
                         `${20 + Math.random() * 60}%`, 
                         `${30 + Math.random() * 50}%`, 
                         `${20 + Math.random() * 60}%`
                       ] 
                     }}
                     transition={{ 
                       duration: 2 + Math.random() * 2, 
                       repeat: Infinity, 
                       ease: "easeInOut" 
                     }}
                   />
                 ))}
                 
                 {/* Scanning line */}
                 <motion.div 
                   className="absolute top-0 bottom-0 w-[2px] bg-white/50 shadow-[0_0_15px_white]"
                   animate={{ left: ["0%", "100%"] }}
                   transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                 />
              </div>
              
              <div className="mt-6 flex justify-between items-center text-xs text-gray-500 font-mono">
                 <span>LATENCY: 12ms</span>
                 <span>NODES: 8,402</span>
                 <span>STATUS: OPTIMIZED</span>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}