"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef, ReactNode } from "react";

interface MotionWrapperProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  viewportMargin?: any; // Typed broadly for Framer Motion compatibility
  direction?: "up" | "down" | "left" | "right" | "none";
  scale?: boolean;
}

export default function MotionWrapper({
  children,
  className = "",
  delay = 0,
  duration = 0.6,
  viewportMargin = "-50px",
  direction = "up",
  scale = false,
}: MotionWrapperProps) {
  const ref = useRef(null);
  
  const getInitialPosition = () => {
    switch (direction) {
      case "up": return { y: 30 };
      case "down": return { y: -30 };
      case "left": return { x: 30 };
      case "right": return { x: -30 };
      case "none": return {};
      default: return { y: 30 };
    }
  };

  const variants: Variants = {
    hidden: {
      opacity: 0,
      ...getInitialPosition(),
      scale: scale ? 0.95 : 1,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration,
        delay,
        ease: [0.215, 0.61, 0.355, 1],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: viewportMargin }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}