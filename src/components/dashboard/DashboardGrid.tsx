"use client";

import { motion } from "framer-motion";
import { ShieldCheck, BarChart3, Coins, Activity } from "lucide-react";

export const DashboardGrid = () => {
  const cards = [
    {
      title: "Smart Validator",
      description: "AI property scoring & risk assessment.",
      icon: ShieldCheck,
      status: "Live Demo",
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "border-purple-400/20",
      action: "Run Analysis",
    },
    {
      title: "Fractional Ownership",
      description: "Own premium real estate from 0.1 sq.m.",
      icon: Coins,
      status: "Coming Soon",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20",
      action: "Join Waitlist",
    },
    {
      title: "Market Insights",
      description: "Predictive analytics for high-yield zones.",
      icon: BarChart3,
      status: "Beta Access",
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20",
      action: "View Trends",
    },
    {
      title: "Portfolio Monitor",
      description: "Real-time value tracking & trust scores.",
      icon: Activity,
      status: "Simulation",
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      border: "border-amber-400/20",
      action: "Start Demo",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`group relative overflow-hidden rounded-xl border ${card.border} bg-white/5 p-6 hover:bg-white/10 transition-all duration-300`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-lg ${card.bg}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full bg-white/5 border border-white/10 ${card.color}`}>
              {card.status}
            </span>
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
            {card.title}
          </h3>
          <p className="text-white/60 text-sm mb-6">
            {card.description}
          </p>

          <button className="w-full py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/90 text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 group/btn">
            {card.action}
            <span className="group-hover/btn:translate-x-0.5 transition-transform">→</span>
          </button>
          
          {/* Gradient Hover Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-all duration-1000 pointer-events-none" />
        </motion.div>
      ))}
    </div>
  );
};