"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden bg-background py-16 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left Column: Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                Unlock the True Value of Your Property
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Transform your real estate into a high-yield fractional asset.
                Zero upfront costs, complete legal protection, and guaranteed
                transparency.
              </p>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: TrendingUp,
                  text: "Maximize Owner Profits",
                  desc: "Earn more than traditional rentals.",
                },
                {
                  icon: Clock,
                  text: "Reduced Workload",
                  desc: "We handle management & tenants.",
                },
                {
                  icon: CheckCircle2,
                  text: "Zero Upfront Cost",
                  desc: "List your property for free.",
                },
                {
                  icon: ShieldCheck,
                  text: "Legal Protection",
                  desc: "Full SPV compliance & security.",
                },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.text}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" className="w-full sm:w-auto" onClick={() => document.getElementById('onboarding-form')?.scrollIntoView({ behavior: 'smooth' })}>
                Start Earning Now
              </Button>
            </div>
          </motion.div>

          {/* Right Column: Visual/Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mx-auto w-full max-w-[500px] lg:max-w-none"
          >
            <div className="relative rounded-2xl border bg-card p-6 shadow-2xl">
              <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
              
              <div className="relative space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Projected Annual Yield
                    </p>
                    <h3 className="text-3xl font-bold text-primary">12-15%</h3>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Traditional Rental</span>
                    <span className="font-medium">3-4% Yield</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div className="h-2 w-1/4 rounded-full bg-muted-foreground/30" />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-primary">ComfHutt Model</span>
                    <span className="font-bold text-primary">12-15% Yield</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "85%" }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                      className="h-2 rounded-full bg-primary" 
                    />
                  </div>
                </div>

                <div className="pt-4 grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-secondary/50 p-3 text-center">
                        <p className="text-xs text-muted-foreground">Occupancy Rate</p>
                        <p className="font-bold text-lg">90%+</p>
                    </div>
                     <div className="rounded-lg bg-secondary/50 p-3 text-center">
                        <p className="text-xs text-muted-foreground">Management Fee</p>
                        <p className="font-bold text-lg">Low</p>
                    </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;