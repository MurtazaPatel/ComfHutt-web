"use client";
import React, { useRef, useState, useEffect } from "react";
import { useMotionValueEvent, useScroll, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string | React.ReactNode;
    content?: React.ReactNode;
  }[];
  contentClassName?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    container: ref,
  });

  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const index = Math.min(
      cardLength - 1,
      Math.floor(latest * cardLength)
    );
    setActiveCard(index);
  });

  return (
    <motion.div
      ref={ref}
      className="
        relative
        h-auto lg:h-[40rem]
        lg:overflow-y-auto
        flex
        flex-col lg:flex-row
        justify-center
        lg:space-x-8
        px-6
        scrollbar-hide
      "
    >
      {/* LEFT COLUMN */}
      <div className="relative flex-1">
        <div className="max-w-2xl mx-auto lg:mx-0">
          {content.map((item, index) => (
            <div key={item.title} className="my-12 lg:my-24 border-b lg:border-none pb-12 lg:pb-0 last:border-none last:pb-0">
              <motion.h3
                animate={{ opacity: activeCard === index || isMobile ? 1 : 0.35 }}
                className="text-2xl font-bold font-playfair text-foreground"
              >
                {item.title}
              </motion.h3>

              <motion.div
                animate={{ opacity: activeCard === index || isMobile ? 1 : 0.35 }}
                className="mt-6 text-muted-foreground max-w-md leading-relaxed"
              >
                {item.description}
              </motion.div>

              {/* MOBILE VISUAL: Rendered inline */}
              <div className="mt-8 block lg:hidden rounded-lg overflow-hidden border border-border/50 bg-white shadow-sm">
                 <div className="aspect-[4/3] w-full">
                    {item.content}
                 </div>
              </div>

               {/* Mobile Connector - Animated Line */}
               {index < content.length - 1 && (
                  <div className="lg:hidden flex justify-center mt-12 mb-4">
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      whileInView={{ height: 40, opacity: 1 }}
                      viewport={{ once: true, margin: "-20%" }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="w-px bg-gradient-to-b from-border/0 via-border to-border/0"
                    />
                  </div>
               )}
            </div>
          ))}

          {/* Spacer to guarantee last step activation on desktop */}
          <div className="hidden lg:block lg:h-[50vh]" />
        </div>
      </div>

      {/* RIGHT STICKY VISUAL - Desktop only */}
      <div
        className={cn(
          "hidden lg:block sticky top-24 h-80 w-[26rem] rounded-xl bg-white border-2 border-border shadow-md overflow-hidden lg:-ml-8",
          contentClassName
        )}
      >
        {content[activeCard]?.content}
      </div>
    </motion.div>
  );
};

