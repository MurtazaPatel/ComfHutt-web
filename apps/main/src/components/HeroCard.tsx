"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CardSwap, { Card } from "./CardSwap";

// --- Types ---
interface PropertyData {
  id: number;
  image: string;
  title: string;
  location: string;
  price: string;
  yieldVal: string;
  score: number;
  positiveTrend: boolean;
  tags: string[];
}

// --- Data ---
const PROPERTIES: PropertyData[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    title: "Koramangala Tech Park",
    location: "Bangalore, Karnataka",
    price: "₹10,000",
    yieldVal: "8.2%",
    score: 84,
    positiveTrend: true,
    tags: ["Instant Buy", "AI-Scored"],
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
    title: "Indiranagar Office Hub",
    location: "Bangalore, Karnataka",
    price: "₹15,000",
    yieldVal: "9.1%",
    score: 89,
    positiveTrend: true,
    tags: ["High Yield", "AI-Scored"],
  },
  {
    id: 3,
    image: "https://www.adanirealty.com/-/media/project/realty/residential/mumbai/9pbr/carousel-images/outdoor/outdoor-2-desktop.ashx",
    title: "LinkBay Residences",
    location: "Mumbai, Maharashtra",
    price: "₹12,500",
    yieldVal: "7.8%",
    score: 76,
    positiveTrend: false,
    tags: ["Growth", "AI-Scored"],
  },
];

// --- Micro-Components ---
const ScoreWheel = ({ score }: { score: number }) => {
  return (
    <div className="flex flex-col items-center mt-1">
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
    </div>
  );
};

const TrendLine = ({ positive }: { positive: boolean }) => {
  return (
    <div className="relative w-[70px] h-[22px] mb-1">
      <motion.svg
        width="70"
        height="22"
        viewBox="0 0 70 22"
        fill="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <path
          d={positive 
            ? "M1 18 C 15 18, 25 8, 35 12 C 45 16, 55 4, 69 2" // Green Up
            : "M1 4 C 15 4, 25 14, 35 10 C 45 6, 55 18, 69 20" // Red Down
          }
          stroke={positive ? "#10B981" : "#EF4444"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    </div>
  );
};

// --- Main Component ---
export default function HeroCard() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch on initial render with 3D transforms

  return (
    <div className="w-full h-[600px] flex items-center justify-center relative pointer-events-auto">
      <CardSwap
         width={360}
         height={520}
         cardDistance={40} // Adjust for visual stacking
         verticalDistance={40}
         delay={4500}
         easing="elastic" // As per spec default, or adjust based on preference
         pauseOnHover={true}
         skewAmount={0} // Disable skew for cleaner look if desired, or keep default
      >
        {PROPERTIES.map((property) => (
          <Card 
            key={property.id} 
            customClass="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col cursor-pointer hover:shadow-xl transition-shadow border-none"
          >
            {/* TOP SECTION – 60% HEIGHT */}
            <div className="h-[60%] relative w-full bg-gray-100">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-full object-cover rounded-t-3xl"
                loading="lazy"
              />
              {/* Minimal location badge */}
              <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-semibold text-gray-800 shadow-sm">
                {property.location.split(',')[0]}
              </div>
            </div>

            {/* BOTTOM SECTION – 40% HEIGHT */}
            <div className="h-[40%] p-5 flex flex-row relative bg-white">
              
              {/* LEFT COLUMN (Text Stack) */}
              <div className="flex-1 flex flex-col justify-between pr-2">
                
                {/* Header */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">
                    {property.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 font-medium">
                    {property.location}
                  </p>
                </div>

                {/* Stat Grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 my-1">
                  <div>
                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wide">Min Ticket</p>
                    <p className="text-sm font-bold text-gray-900">{property.price}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wide">Yield</p>
                    <p className="text-sm font-bold text-emerald-600">{property.yieldVal}</p>
                  </div>
                </div>

                {/* Microcopy */}
                <div className="text-[10px] text-gray-400 font-medium">
                  Continuously evaluated • SPV-backed
                </div>

                {/* Tag Chips */}
                <div className="flex gap-2">
                  {property.tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className={`px-2 py-1 rounded text-[10px] font-semibold ${
                        tag === 'AI-Scored' 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* RIGHT COLUMN (Vertical Stack: Score + Trend) */}
              <div className="w-[80px] flex flex-col items-end justify-between relative">
                <ScoreWheel score={property.score} />
                <TrendLine positive={property.positiveTrend} />
              </div>
            </div>
          </Card>
        ))}
      </CardSwap>
    </div>
  );
}