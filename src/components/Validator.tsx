"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import MotionWrapper from "./MotionWrapper";
import BackgroundMotion from "./BackgroundMotion";

export default function Validator() {
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "fail">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("processing");
    
    // Simulate AI processing
    setTimeout(() => {
      setStatus(Math.random() > 0.3 ? "success" : "fail");
    }, 3000);
  };

  return (
    <section id="validator" className="py-20 md:py-48 relative overflow-hidden">
      <BackgroundMotion variant="vision" />
      
      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        <MotionWrapper className="text-center max-w-3xl mx-auto">
          <span className="text-base md:text-lg font-medium text-purple-400">
            Autonomous Real Estate Intelligence
          </span>
          <h2 className="text-4xl md:text-7xl font-bold tracking-tighter mt-3 md:mt-4 gradient-text">
            The AI Smart Validator.
          </h2>
          <p className="text-lg md:text-2xl text-gray-300 mt-6 md:mt-8">
            Our proprietary AI model doesn't just list properties; it audits
            them. From legal title discrepancies to market fit scoring, we ensure
            94% accuracy in validation.
          </p>
        </MotionWrapper>

        <h3 className="text-2xl md:text-3xl font-bold text-white text-center mt-16 md:mt-32 mb-8 md:mb-10">
          Try the Validator Demo
        </h3>

        <MotionWrapper
          scale={true}
          className="glass-card p-4 md:p-10"
        >
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="lg:w-1/2">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Property Input
              </h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="address" className="ai-form-label">
                    Property Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    className="ai-form-input"
                    placeholder="e.g., 123 Lodha World, Mumbai"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="asset-type" className="ai-form-label">
                    Asset Type
                  </label>
                  <div className="relative">
                    <select id="asset-type" className="ai-form-input appearance-none pr-10">
                      <option>Residential (Condo/Apartment)</option>
                      <option>Residential (Villa)</option>
                      <option>Commercial (Office)</option>
                      <option>Commercial (Retail)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="ai-form-label">Legal Documents</label>
                  <button
                    type="button"
                    className="ai-form-input text-left text-gray-400 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap hover:bg-white/10 transition-colors"
                  >
                    Tap to upload Title Deed...
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={status === "processing"}
                  className="btn btn-primary w-full mt-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                >
                  {status === "processing" && (
                     <motion.div
                        className="absolute inset-0 bg-white/20"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                     />
                  )}
                  <span className="relative z-10">{status === "processing" ? "Analyzing..." : "Run AI Analysis"}</span>
                </button>
              </form>
            </div>

            <div className="lg:w-1/2 mt-8 lg:mt-0">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Validation Score
              </h3>
              <div className="glass-card p-6 h-full min-h-[300px] flex flex-col items-center justify-center transition-all duration-300 bg-white/5 relative overflow-hidden">
                
                {/* Scanner Effect */}
                {status === "processing" && (
                    <motion.div
                        className="absolute inset-x-0 top-0 h-[2px] bg-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.5)] z-0"
                        animate={{ top: ["0%", "100%", "0%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                )}

                <AnimatePresence mode="wait">
                    {status === "idle" && (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-center text-gray-400"
                    >
                        <Activity className="w-12 h-12 mb-4 mx-auto animate-pulse-opacity" />
                        <p className="text-lg">Awaiting property data...</p>
                        <p className="text-sm">
                        Our autonomous system will check legal & market data.
                        </p>
                    </motion.div>
                    )}

                    {status === "processing" && (
                    <motion.div
                        key="processing"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-center text-gray-300 py-10"
                    >
                        <Loader2 className="w-12 h-12 mb-4 mx-auto animate-spin opacity-75" />
                        <p className="text-lg font-semibold">AI Analyzing Asset...</p>
                        <p className="text-sm">
                        Cross-referencing land registry & market comp.
                        </p>
                    </motion.div>
                    )}

                    {status === "success" && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full h-full py-2"
                    >
                        <p className="text-sm text-green-400 font-medium text-center lg:text-left uppercase tracking-wider">
                        Result: Verified & Listable
                        </p>
                        <div className="text-center my-6">
                        <p className="text-5xl md:text-6xl font-bold text-white">
                            94<span className="text-3xl md:text-4xl text-gray-400">/100</span>
                        </p>
                        <p className="text-lg md:text-xl font-semibold gradient-text">
                            ComfHutt Trust Score
                        </p>
                        </div>
                        <p className="text-sm font-medium text-white mb-3">Key Insights:</p>
                        <ul className="space-y-2 text-sm">
                        <li className="flex items-center text-green-300 bg-green-500/10 p-2 rounded-lg">
                            <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                            High-Yield Potential (CAGR {">"} 9%)
                        </li>
                        <li className="flex items-center text-green-300 bg-green-500/10 p-2 rounded-lg">
                            <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                            Clear Title (Blockchain Verified)
                        </li>
                        <li className="flex items-center text-gray-300 bg-white/5 p-2 rounded-lg">
                            <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 text-gray-500" />
                            Market Value analysis complete.
                        </li>
                        </ul>
                    </motion.div>
                    )}

                    {status === "fail" && (
                    <motion.div
                        key="fail"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full h-full py-2"
                    >
                        <p className="text-sm text-yellow-400 font-medium text-center lg:text-left uppercase tracking-wider">
                        Result: Manual Review Required
                        </p>
                        <div className="text-center my-6">
                        <p className="text-5xl md:text-6xl font-bold text-white">
                            48<span className="text-3xl md:text-4xl text-gray-400">/100</span>
                        </p>
                        <p className="text-lg md:text-xl font-semibold gradient-text">
                            ComfHutt Trust Score
                        </p>
                        </div>
                        <p className="text-sm font-medium text-white mb-3">Issues Detected:</p>
                        <ul className="space-y-2 text-sm">
                        <li className="flex items-center text-yellow-300 bg-yellow-500/10 p-2 rounded-lg">
                            <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
                            Title Deed Discrepancy
                        </li>
                        <li className="flex items-center text-yellow-300 bg-yellow-500/10 p-2 rounded-lg">
                            <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
                            Low Liquidity Score
                        </li>
                        </ul>
                    </motion.div>
                    )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}