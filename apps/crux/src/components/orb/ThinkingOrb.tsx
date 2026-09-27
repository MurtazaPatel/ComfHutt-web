"use client";

// React port of RareFormLabs/thinking-orbs (MIT — see ./LICENSE-thinking-orbs).
//
// Upstream ships a Vue component over a framework-independent canvas engine. The
// engine under ./engine is vendored verbatim (one documented tint hook in core.ts);
// this file replaces only the Vue wrapper and its two composables, preserving the
// original behaviour: DPR-aware sizing, rAF loop, IntersectionObserver + tab-
// visibility gating so an off-screen or backgrounded orb costs nothing, and a
// single static frame under prefers-reduced-motion.
//
// Load it through ./index.ts (next/dynamic) so the engine stays out of the
// first-load bundle — nothing here is needed until something is actually thinking.

import { useEffect, useRef } from "react";
import { setInk } from "./engine/core";
import { MODE_DRAWS } from "./engine/registry";
import { resolvePreset } from "./presets";
import type { OrbSize, OrbState } from "./orb-types";

/** CRUX brand green (--color-crux-green) as the orb's ink. */
const CRUX_INK: readonly [number, number, number] = [16, 185, 129];

const LABELS: Record<OrbState, string> = {
  working: "Working",
  searching: "Searching",
  solving: "Solving",
  listening: "Listening",
  composing: "Composing",
  shaping: "Shaping",
};

export interface ThinkingOrbProps {
  /** Which tuned animation to show. @default "working" */
  state?: OrbState;
  /** Tuned size preset in CSS px — 64 or 20 are the only tunings that ship. @default 64 */
  size?: OrbSize;
  /** Speed multiplier on top of the preset's baked speed. @default 1 */
  speed?: number;
  /** Freeze on the current frame. @default false */
  paused?: boolean;
  /** Tint the dots with the brand green instead of upstream grayscale. @default true */
  tinted?: boolean;
  /**
   * Announced to screen readers. Defaults to the state name; pass the real status
   * ("Reading court records") when the surface knows something more specific.
   */
  label?: string;
  className?: string;
}

export default function ThinkingOrb({
  state = "working",
  size = 64,
  speed = 1,
  paused = false,
  tinted = true,
  label,
  className,
}: ThinkingOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(2, (typeof devicePixelRatio !== "undefined" && devicePixelRatio) || 1);
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { mode, speed: baseSpeed, opts } = resolvePreset(state, size);
    const draw = MODE_DRAWS[mode];
    const effSpeed = baseSpeed * speed;

    const frame = (tSec: number) => {
      // Re-asserted per frame: the tint is module state shared by every mounted orb,
      // so a neighbour with a different `tinted` must not leak into this one.
      setInk(tinted ? CRUX_INK : null);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      // The dashboard is a light surface throughout, so the orb always inks dark-on-light.
      draw(ctx, size, tSec, false, opts);
    };

    const reduced =
      typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      // One representative frame — a formed shape, not an empty first tick.
      frame(0.6);
      return;
    }

    let raf = 0;
    let running = false;
    const loop = () => {
      frame((performance.now() / 1000) * effSpeed);
      if (running) raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || paused) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    frame((performance.now() / 1000) * effSpeed);

    let visible = true;
    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible && document.visibilityState !== "hidden") start();
            else stop();
          })
        : null;

    io?.observe(canvas);

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") stop();
      else if (visible) start();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    if (!io) start();

    return () => {
      stop();
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [state, size, speed, paused, tinted]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={label ?? LABELS[state]}
      className={className}
      style={{ width: size, height: size, display: "block" }}
    />
  );
}
