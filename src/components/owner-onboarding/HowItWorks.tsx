"use client";

import React from "react";
import { motion } from "framer-motion";
import { ClipboardList, Building2, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    icon: ClipboardList,
    title: "1. List Your Property",
    description: "Submit basic details and documents. Our team verifies your asset within 48 hours.",
  },
  {
    icon: Building2,
    title: "2. SPV Setup & Compliance",
    description: "We structure your property into a Special Purpose Vehicle (SPV) for fractionalization.",
  },
  {
    icon: Wallet,
    title: "3. Start Earning",
    description: "Investors fund the SPV. You receive liquidity and start earning management-free returns.",
  },
];

const HowItWorks = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            How It Works
          </h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            A seamless path from property owner to fractional asset manager.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <Card className="relative overflow-hidden h-full border-none shadow-md hover:shadow-xl transition-shadow duration-300">
                <CardContent className="flex flex-col items-center text-center p-6 space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
                    <step.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
                {/* Connecting Line (Desktop Only) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-[2px] bg-muted-foreground/30 -translate-y-1/2 z-10" />
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;