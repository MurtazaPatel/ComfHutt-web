"use client";

import React from "react";
import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    text: "Fractional investing made it possible for me to own Grade A commercial real estate without the massive capital requirement.",
    author: "Arjun K.",
    role: "Investor",
  },
  {
    text: "Listing our inventory on ComfHutt accelerated our sales cycle significantly. The transparency is unmatched.",
    author: "Ravi S.",
    role: "Property Owner",
  },
  {
    text: "The Credibility Score gave me the confidence I needed. I knew exactly what I was getting into before investing.",
    author: "Sneha P.",
    role: "Investor",
  },
  {
    text: "Finally, a platform that understands the need for liquidity in real estate assets. A game changer.",
    author: "Vikram M.",
    role: "Investor",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-6 mb-12">
        <h2 className="text-3xl font-bold text-center text-gray-900">What our community says</h2>
      </div>

      <div className="relative w-full overflow-hidden">
        {/* Infinite Scroll Container */}
        <motion.div
          className="flex space-x-6 w-max"
          animate={{ x: [0, -1000] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear",
            },
          }}
        >
          {/* Double list for seamless loop */}
          {[...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS].map((item, index) => (
            <div
              key={index}
              className="w-[280px] sm:w-[300px] md:w-[400px] bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between flex-shrink-0 hover:shadow-md transition-shadow duration-300"
            >
              <p className="text-sm md:text-base text-gray-600 mb-6 italic leading-relaxed">"{item.text}"</p>
              <div>
                <p className="font-bold text-gray-900">{item.author}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">{item.role}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}