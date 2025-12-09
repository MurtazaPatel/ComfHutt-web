"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ShieldCheck, TrendingUp, Bed, MapPin, Building2 } from "lucide-react";
import { Property } from "@/lib/mock-data";

// --- ScoreWheel (Copied from HeroCard for parity) ---
const ScoreWheel = ({ score }: { score: number }) => {
  return (
    <div className="flex flex-col items-center mt-1 group/score relative">
      <div className="relative w-14 h-14 flex items-center justify-center">
        {/* Background Ring */}
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="28"
            cy="28"
            r="24"
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="4"
          />
          {/* Animated Progress Ring */}
          <motion.circle
            cx="28"
            cy="28"
            r="24"
            fill="none"
            stroke="#10B981"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="150.8"
            strokeDashoffset="150.8"
            animate={{ strokeDashoffset: 150.8 - (150.8 * score) / 100 }}
            transition={{ duration: 0.9, ease: [0.33, 1, 0.68, 1] }} // easeOutCubic approx
          />
        </svg>
        
        {/* Score Value */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-gray-900">{score}</span>
        </div>
      </div>
      <span className="text-[10px] font-bold text-gray-400 mt-1">Score</span>
      
      {/* Tooltip added to match requirements */}
      <div className="absolute right-0 bottom-full mb-2 w-48 bg-gray-900 text-white text-[10px] p-2 rounded-lg opacity-0 group-hover/score:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
         ComfHutt Credibility Score — based on developer, legal, market signals; updated every 30 days.
      </div>
    </div>
  );
};

interface PropertyCardProps {
  property: Property;
  onView: (property: Property) => void;
}

export default function PropertyCard({ property, onView }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const isSoldOut = property.tokens_sold >= property.tokens_total;
  const isHot = !isSoldOut && (property.tokens_total - property.tokens_sold) / property.tokens_total < 0.25;
  const liquidityPercent = Math.min(100, (property.tokens_sold / property.tokens_total) * 100);

  // Active state for autoplay
  const isActive = (isHovered || isFocused) && !shouldReduceMotion && property.photos.length > 1;

  // Auto-slide logic
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % property.photos.length);
      }, 2500);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      // Reset after delay if not active
      const resetTimer = setTimeout(() => {
        if (!isActive) setCurrentImageIndex(0);
      }, 500);
      return () => clearTimeout(resetTimer);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, property.photos.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onView(property);
    }
  };

  return (
    <motion.div
      className="group relative w-full bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      tabIndex={0}
      role="article"
      aria-label={`Property card for ${property.title} in ${property.locality}`}
      onKeyDown={handleKeyDown}
      onClick={() => onView(property)}
      layoutId={`card-${property.id}`}
    >
      {/* Image Carousel Section */}
      <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-gray-100">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={property.photos[currentImageIndex]}
            alt={`${property.title} view ${currentImageIndex + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0.8, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0.8, x: -20 }}
            transition={{ duration: 0.4, ease: [0.2, 0.9, 0.3, 1] }}
          />
        </AnimatePresence>
        
        {/* Overlays */}
        <div className="absolute top-3 left-3 flex gap-2">
          {property.spv_backed && (
             <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold text-gray-900 shadow-sm flex items-center gap-1">
               <ShieldCheck className="w-3 h-3 text-emerald-600" /> SPV
             </div>
          )}
          {isHot && (
            <div className="bg-orange-500/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold text-white shadow-sm flex items-center gap-1">
               🔥 Hot
            </div>
          )}
        </div>

        {/* Carousel Indicators */}
        {property.photos.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {property.photos.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-4 bg-white' : 'w-1 bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content Section - Layout matching HeroCard */}
      <div className="p-4 flex flex-row relative bg-white flex-grow">
        
        {/* LEFT COLUMN (Text Stack) */}
        <div className="flex-1 flex flex-col justify-between pr-2">
           
           {/* Top Info */}
           <div>
             <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-1">{property.title}</h3>
             </div>
             <div className="flex items-center text-gray-500 text-xs mb-3">
               <MapPin className="w-3 h-3 mr-1" />
               {property.locality}, {property.city}
             </div>
           </div>

           {/* Stats */}
           <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-2">
              <div>
                <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Yield</p>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-emerald-600">{property.projected_yield_percent}%</span>
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Min Token</p>
                <p className="text-sm font-bold text-gray-900">₹{property.min_token_price_inr.toLocaleString()}</p>
              </div>
           </div>

           {/* Liquidity & Actions (Moved here to fit column) */}
           <div className="mt-auto space-y-3 pt-2">
             <div className="w-full">
               <div className="flex justify-between text-[10px] font-medium text-gray-500 mb-1">
                 <span>{isSoldOut ? 'Sold Out' : `${Math.round(liquidityPercent)}% Funded`}</span>
               </div>
               <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                 <div 
                   className={`h-full rounded-full ${isSoldOut ? 'bg-gray-400' : 'bg-emerald-500'}`} 
                   style={{ width: `${liquidityPercent}%` }}
                 />
               </div>
             </div>

             <div className="flex gap-2">
                <button
                   onClick={(e) => { e.stopPropagation(); onView(property); }}
                   className="flex-1 py-1.5 rounded-lg bg-gray-50 text-gray-900 text-[10px] font-bold hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  View
                </button>
                <button
                   onClick={(e) => { e.stopPropagation(); }}
                   disabled={isSoldOut}
                   className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-colors shadow-sm ${
                     isSoldOut 
                     ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                     : 'bg-black text-white hover:bg-gray-800'
                   }`}
                >
                  {isSoldOut ? 'Sold Out' : 'Invest'}
                </button>
             </div>
           </div>

        </div>

        {/* RIGHT COLUMN (Score + Trend placeholder) */}
        <div className="w-[70px] flex flex-col items-end justify-start relative pl-1 border-l border-dashed border-gray-100">
           {/* Exact ScoreWheel usage */}
           <ScoreWheel score={property.credibility_score} />
           
           {/* Optional: Add TrendLine if we had trend data, keeping placeholder for now or omit */}
           {/* For now just the score as requested */}
        </div>
      </div>
    </motion.div>
  );
}