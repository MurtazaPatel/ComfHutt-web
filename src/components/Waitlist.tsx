"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Sparkles, Loader2 } from "lucide-react";
import MotionWrapper from "./MotionWrapper";
import Link from "next/link";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus("loading");
    
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      // Reset form after a delay if needed
      // setTimeout(() => setStatus("idle"), 3000);
    }, 1500);
  };

  return (
    <section id="waitlist" className="py-24 md:py-32 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto max-w-5xl px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Content Side */}
          <MotionWrapper className="lg:pr-12 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-medium text-yellow-100/80 tracking-wide uppercase">Early Access</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
              Join the <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Inner Circle.
              </span>
            </h2>
            
            <p className="text-xl text-gray-400 font-light leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
              Be the first to experience ComfHutt's autonomous investment platform. Limited spots available for beta release.
            </p>

            <Link href="/revenue-model" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-400 transition-colors duration-300 group">
              Interested in how ComfHutt makes money? 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </MotionWrapper>

          {/* Form Side */}
          <MotionWrapper delay={0.2}>
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
              {/* Success State Overlay */}
              <AnimatePresence>
                {status === "success" && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md z-20 flex flex-col items-center justify-center text-center p-6"
                  >
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", delay: 0.1 }}
                      className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-500/30"
                    >
                      <Check className="w-8 h-8 text-white" strokeWidth={3} />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2">You're on the list!</h3>
                    <p className="text-gray-400">We'll be in touch shortly with your exclusive invite.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-400 ml-1">Full Name <span className="text-gray-600 font-normal">(Optional)</span></label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-400 ml-1">Email Address <span className="text-red-400">*</span></label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="reason" className="text-sm font-medium text-gray-400 ml-1">Why are you interested? <span className="text-gray-600 font-normal">(Optional)</span></label>
                  <textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={2}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none transition-all resize-none"
                    placeholder="I want to diversify my portfolio..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      Join Waitlist <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </MotionWrapper>
        </div>
      </div>
    </section>
  );
}