"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";

export function useSectionInView(threshold: number = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  return { ref, isInView };
}
