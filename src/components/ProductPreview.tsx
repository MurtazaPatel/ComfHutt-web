"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, ShieldCheck, Coins, Activity, Zap } from "lucide-react";
import MotionWrapper from "./MotionWrapper";

const features = [
  {
    id: "validator",
    title: "AI Smart Validator",
    icon: ShieldCheck,
    description: "Autonomous due diligence on every property.",
    color: "from-emerald-400 to-teal-500",
    ui: (
      <div className="space-y-3 w-full">
        <div className="flex items-center justify-between text-xs text-gray-400 uppercase tracking-wider font-medium">
          <span>Risk Assessment</span>
          <span className="text-emerald-400">Passed (98/100)</span>
        </div>
        <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "98%" }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="bg-white/5 p-3 rounded-lg">
            <div className="text-xs text-gray-500">Title Search</div>
            <div className="text-sm text-white font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified
            </div>
          </div>
          <div className="bg-white/5 p-3 rounded-lg">
            <div className="text-xs text-gray-500">Legal Compliance</div>
            <div className="text-sm text-white font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified
            </div>
          </div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg flex items-start gap-2">
          <Zap className="w-4 h-4 text-emerald-400 mt-0.5" />
          <p className="text-xs text-emerald-200 leading-relaxed">
            AI verified zero litigation history over the last 30 years. Asset is clean for tokenization.
          </p>
        </div>
      </div>
    )
  },
  {
    id: "analyzer",
    title: "Market Analyzer",
    icon: BarChart3,
    description: "Real-time predictive yield modeling.",
    color: "from-blue-400 to-indigo-500",
    ui: (
      <div className="space-y-4 w-full">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs text-gray-400 uppercase">Projected APY</div>
            <div className="text-2xl font-bold text-white">12.4%</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400 uppercase">Growth</div>
            <div className="text-sm font-medium text-green-400 flex items-center justify-end gap-1">
              +2.1% <Activity className="w-3 h-3" />
            </div>
          </div>
        </div>
        
        <div className="h-24 flex items-end gap-1 justify-between px-1">
           {[40, 65, 50, 80, 60, 90, 75, 100].map((h, i) => (
             <motion.div 
               key={i}
               initial={{ height: 0 }}
               animate={{ height: `${h}%` }}
               transition={{ duration: 0.8, delay: i * 0.1 }}
               className={`w-full rounded-t-sm bg-gradient-to-t ${i === 7 ? 'from-blue-400 to-indigo-400 opacity-100' : 'from-blue-500/20 to-blue-400/10 opacity-50'}`}
             />
           ))}
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
           <div className="bg-white/5 rounded p-2">
             <div className="text-[10px] text-gray-500">1Y</div>
             <div className="text-xs font-medium text-white">9.2%</div>
           </div>
           <div className="bg-white/5 rounded p-2 ring-1 ring-blue-500/50">
             <div className="text-[10px] text-blue-300">3Y</div>
             <div className="text-xs font-medium text-white">28.5%</div>
           </div>
           <div className="bg-white/5 rounded p-2">
             <div className="text-[10px] text-gray-500">5Y</div>
             <div className="text-xs font-medium text-white">52.1%</div>
           </div>
        </div>
      </div>
    )
  },
  {
    id: "tokenization",
    title: "Fractional Tokenization",
    icon: Coins,
    description: "Invest in premium real estate from ₹500.",
    color: "from-purple-400 to-pink-500",
    ui: (
      <div className="space-y-4 w-full">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
               <Coins className="w-4 h-4 text-purple-400" />
             </div>
             <div>
                <div className="text-sm font-medium text-white">Token #8492</div>
                <div className="text-[10px] text-gray-400">Lodha World One</div>
             </div>
           </div>
           <div className="text-right">
              <div className="text-sm font-medium text-white">₹5,000</div>
              <div className="text-[10px] text-gray-400">0.002% Ownership</div>
           </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Availability</span>
            <span>84% Sold</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "84%" }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="h-full bg-gradient-to-r from-purple-400 to-pink-500"
            />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-3 flex items-center justify-between">
           <div className="text-xs">
             <span className="block text-gray-400">Monthly Rental</span>
             <span className="text-white font-medium">₹42.50 / token</span>
           </div>
           <button className="bg-white text-black text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
             Auto-Invest
           </button>
        </div>
      </div>
    )
  }
];

export default function ProductPreview() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950/5 to-black pointer-events-none" />
      
      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        <MotionWrapper className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-blue-300 mb-6 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Coming Soon
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            Product Preview
          </h2>
          <p className="text-xl text-gray-400 font-light">
            A smarter way to invest in real estate, powered by <span className="text-white font-medium">autonomous intelligence</span>.
          </p>
        </MotionWrapper>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left: Navigation */}
          <div className="lg:col-span-4 space-y-2">
            {features.map((feature, index) => (
              <motion.button
                key={feature.id}
                onClick={() => setActiveTab(index)}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`w-full text-left p-6 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                  activeTab === index 
                    ? "bg-white/10 shadow-lg border border-white/10" 
                    : "hover:bg-white/5 border border-transparent hover:border-white/5"
                }`}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${
                  activeTab === index ? "bg-blue-500 opacity-100" : "opacity-0"
                }`} />
                
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${feature.color} bg-opacity-10`}>
                    <feature.icon className={`w-6 h-6 text-white`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-lg transition-colors ${
                      activeTab === index ? "text-white" : "text-gray-400 group-hover:text-white"
                    }`}>
                      {feature.title}
                    </h3>
                    {activeTab === index && (
                       <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-sm text-gray-400 mt-1"
                       >
                         {feature.description}
                       </motion.p>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Right: Visual Preview */}
          <div className="lg:col-span-8">
            <div className="relative h-[500px] w-full bg-gray-900/40 rounded-3xl border border-white/10 backdrop-blur-xl overflow-hidden flex items-center justify-center p-8 shadow-2xl">
               {/* Decor */}
               <div className="absolute top-0 right-0 p-6 opacity-20">
                 <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-500" />
                   <div className="w-3 h-3 rounded-full bg-yellow-500" />
                   <div className="w-3 h-3 rounded-full bg-green-500" />
                 </div>
               </div>

               <AnimatePresence mode="wait">
                 <motion.div
                   key={activeTab}
                   initial={{ opacity: 0, scale: 0.95, y: 20, filter: "blur(10px)" }}
                   animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                   exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                   transition={{ duration: 0.4, ease: "easeOut" }}
                   className="w-full max-w-md bg-black/40 border border-white/10 rounded-2xl p-6 shadow-2xl relative"
                 >
                   {/* Glossy reflection effect */}
                   <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl pointer-events-none" />
                   
                   {/* Card Header */}
                   <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${features[activeTab].color}`}>
                        {(() => {
                          const Icon = features[activeTab].icon;
                          return <Icon className="w-5 h-5 text-white" />;
                        })()}
                      </div>
                      <div className="text-sm font-medium text-white tracking-wide">
                        {features[activeTab].title}
                      </div>
                   </div>

                   {/* Card Content */}
                   {features[activeTab].ui}

                 </motion.div>
               </AnimatePresence>
            </div>
            
            {/* Floating Elements for Depth */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"
            />
            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}