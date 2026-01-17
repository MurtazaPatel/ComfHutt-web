"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import { ArrowRight } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-20 md:py-32 bg-muted/20">
      <div className="container mx-auto max-w-3xl text-center px-4">
        <h2 className="text-4xl md:text-5xl font-bold font-playfair tracking-tight text-balance leading-tight">
          Interested in exploring this further?
        </h2>
        <div className="mt-6 md:mt-8 text-base md:text-xl text-muted-foreground space-y-4 md:space-y-6">
          <p className="text-balance">
            If this approach feels relevant to your current or upcoming projects, we’re opening a limited early-access window for developers.
          </p>
          <p className="text-balance">
            This is simply a conversation — to understand fit, timing, and whether a pilot makes sense.
          </p>
        </div>
        <div className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="w-full sm:w-auto text-base md:text-lg px-6 py-5 md:px-8 md:py-6 bg-primary hover:bg-primary/90 text-primary-foreground transition-transform duration-300 ease-in-out hover:scale-105 group"
          >
            Discuss a pilot property
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto text-base md:text-lg px-6 py-5 md:px-8 md:py-6 transition-transform duration-300 ease-in-out hover:scale-105"
          >
            Join developer early access
          </Button>
        </div>
        <p className="mt-4 md:mt-6 text-sm md:text-base text-muted-foreground text-balance">
          No obligations. No pressure. Just clarity.
        </p>
      </div>
    </section>
  );
};
