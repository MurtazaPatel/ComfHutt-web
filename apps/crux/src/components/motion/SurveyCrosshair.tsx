"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";

/**
 * A surveyor's crosshair over the hero's plot grid.
 *
 * Two hairlines follow the pointer and the lattice brightens around it, the way
 * a theodolite picks one parcel out of a sheet. It listens on its parent, so it
 * can sit behind the content with pointer-events off and still track the cursor.
 *
 * The hairlines move by transform only. The lit patch is a mask whose centre is
 * a pair of CSS variables — a repaint, but of one layer and only while the
 * pointer is moving. Fine pointers only: on touch there is no cursor to follow,
 * and reduced-motion users get the static grid.
 */
const SPRING = { stiffness: 260, damping: 32, mass: 0.6 };

export default function SurveyCrosshair() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const active = useMotionValue(0);
  const sx = useSpring(x, SPRING);
  const sy = useSpring(y, SPRING);
  const opacity = useSpring(active, { stiffness: 160, damping: 26 });
  const mask = useMotionTemplate`radial-gradient(260px circle at ${sx}px ${sy}px, #000 0%, transparent 72%)`;

  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || calm.matches) return;

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      x.set(e.clientX - r.left);
      y.set(e.clientY - r.top);
      active.set(1);
    };
    const onLeave = () => active.set(0);

    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [x, y, active]);

  return (
    <motion.div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ opacity }}
    >
      {/* The lattice, re-drawn in emerald and shown only near the pointer. */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(5,150,105,0.34) 1px, transparent 1px), linear-gradient(to bottom, rgba(5,150,105,0.34) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          backgroundPosition: "center top",
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />
      {/* Hairlines */}
      <motion.div
        className="absolute inset-y-0 left-0 w-px bg-crux-green-mid/35"
        style={{ x: sx }}
      />
      <motion.div
        className="absolute inset-x-0 top-0 h-px bg-crux-green-mid/35"
        style={{ y: sy }}
      />
      {/* Station mark where they meet */}
      <motion.div className="absolute left-0 top-0" style={{ x: sx, y: sy }}>
        <span className="absolute -left-[5px] -top-[5px] block h-[10px] w-[10px] rounded-full border border-crux-green-mid bg-crux-bg-primary" />
      </motion.div>
    </motion.div>
  );
}
