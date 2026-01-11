"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Wallet, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { motion, useSpring, useTransform, animate, useMotionValue } from "framer-motion";
import { redirectToChoices } from "@/utils/navigation";

// Helper component for animated numbers
const AnimatedNumber = ({ value }: { value: number }) => {
    const motionValue = useMotionValue(value);
    const rounded = useTransform(motionValue, (latest) => Math.round(latest));
    
    useEffect(() => {
        const controls = animate(motionValue, value, { duration: 0.3, ease: "easeOut" });
        return controls.stop;
    }, [value, motionValue]);

    return (
        <motion.span>
            {useTransform(rounded, (latest) => latest.toLocaleString())}
        </motion.span>
    );
};

export default function WealthBuilder() {
  const [investment, setInvestment] = useState(20000);
  const router = useRouter();
  
  // Constants for calculation
  const YIELD_PERCENTAGE = 8.5; // 8.5% annual return
  
  // Calculate monthly rent based on investment
  const monthlyRent = Math.round((investment * (YIELD_PERCENTAGE / 100)) / 12);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvestment(Number(e.target.value));
  };

  // Calculate percentage for smoother positioning
  const sliderPercentage = ((investment - 5000) / (500000 - 5000)) * 100;

  return (
    <section className="py-12 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Content & Interaction */}
          <div className="order-2 lg:order-1 flex flex-col items-start w-full">
            
            {/* Badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 mb-6">
              <span className="text-xs font-bold tracking-wider text-emerald-800 uppercase">
                Wealth Builder
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.15] mb-4 md:mb-6">
              Don't just buy property.{" "}
              <span className="text-emerald-600 block md:inline">Buy passive income.</span>
            </h2>

            {/* Body Copy */}
            <p className="text-base md:text-lg text-gray-500 mb-8 md:mb-10 max-w-md leading-relaxed">
              Experience the security of property ownership with the flexibility of a stock.
              Our SPV-backed model ensures your assets are protected while generating consistent monthly returns.
            </p>

            {/* Interactive Calculator */}
            <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6 mb-8 transition-all duration-300 hover:shadow-md mx-auto lg:mx-0">
              <div className="flex justify-between items-end mb-4">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  I want to invest
                </label>
                <span className="text-xl md:text-2xl font-bold text-gray-900 flex items-center overflow-hidden">
                  ₹<AnimatedNumber value={investment} />
                </span>
              </div>

              {/* Slider */}
              <div className="relative w-full mb-8">
                <div className="relative w-full h-2 bg-gray-100 rounded-full">
                  {/* Progress Bar */}
                  <div
                    className="absolute left-0 top-0 h-full bg-emerald-500 rounded-full"
                    style={{ width: `${sliderPercentage}%` }}
                  />
                  
                  {/* Slider Input */}
                  <input
                    type="range"
                    min="5000"
                    max="500000"
                    step="1000"
                    value={investment}
                    onChange={handleSliderChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 touch-none"
                    style={{ margin: 0 }}
                  />
                  
                  {/* Custom Thumb/Handle */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-5 w-5 bg-emerald-600 rounded-full shadow-lg pointer-events-none"
                    style={{
                      left: `calc(${sliderPercentage}% - 10px)`,
                    }}
                  />
                </div>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Est. Yearly Return</p>
                  <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50">
                    <span className="text-sm font-bold text-emerald-700">+{YIELD_PERCENTAGE}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-1">Projected Monthly Rent</p>
                  <p className="text-lg md:text-xl font-bold text-emerald-600 flex justify-end items-center">
                    ₹<AnimatedNumber value={monthlyRent} />
                  </p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
              <button
                onClick={() => redirectToChoices(router)}
                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full shadow-lg shadow-emerald-200 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                Start Investing
              </button>
              <a
                href="#faq"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group flex items-center text-gray-600 font-medium hover:text-emerald-600 transition-colors justify-center sm:justify-start py-2"
              >
                Learn More
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Right Column: Visuals & Overlay */}
          <div className="order-1 lg:order-2 relative px-4 md:px-0">
             <div className="relative rounded-[24px] overflow-hidden shadow-2xl shadow-gray-200/50 aspect-[4/3] group">
                {/* Image Placeholder - In a real app, use next/image with a real source */}
                <div className="absolute inset-0 bg-gray-200">
                    <img
                        src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000&auto=format&fit=crop"
                        alt="Modern Apartment with Greenery"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                </div>
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                {/* Floating Badge: Live Asset */}
                <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm flex items-center space-x-2 z-10">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-bold text-gray-800 tracking-wide">LIVE ASSET</span>
                </div>

                {/* Floating Notification Toast */}
                <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 max-w-[240px] md:max-w-[280px] w-full z-10">
                    <div className="bg-white/95 backdrop-blur-md p-3 md:p-4 rounded-2xl shadow-xl border border-white/50 transform transition-all duration-500 hover:translate-y-[-4px]">
                        <div className="flex items-start space-x-3">
                            <div className="p-2 bg-emerald-100 rounded-full text-emerald-600">
                                <Wallet className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] md:text-xs font-semibold text-gray-500 mb-0.5 uppercase tracking-wider">Wallet Update</p>
                                <div className="flex justify-between items-baseline">
                                    <p className="text-sm font-medium text-gray-900">Rent Paid</p>
                                    <span className="text-sm font-bold text-emerald-600 flex items-center">
                                      +₹<AnimatedNumber value={monthlyRent} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
             </div>

             {/* Decorative Background Blob */}
             <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-50/50 rounded-full blur-3xl opacity-60 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}