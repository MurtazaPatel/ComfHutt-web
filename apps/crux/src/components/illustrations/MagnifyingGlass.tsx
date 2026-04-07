"use client";

import { useEffect, useRef } from "react";

interface MagnifyingGlassProps {
  className?: string;
  animated?: boolean;
}

export default function MagnifyingGlass({
  className = "",
  animated = true,
}: MagnifyingGlassProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!animated || !svgRef.current) return;

    const paths = svgRef.current.querySelectorAll("path");

    // Calculate stroke length for each path
    paths.forEach((path) => {
      const length = path.getTotalLength?.() || 0;
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
    });

    // Trigger animation on mount
    const timer = setTimeout(() => {
      paths.forEach((path) => {
        path.style.transition = "stroke-dashoffset 2s ease-out";
        path.style.strokeDashoffset = "0";
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [animated]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className}`}
    >
      {/* Magnifying glass circle */}
      <circle
        cx="70"
        cy="70"
        r="55"
        stroke="#22C55E"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Magnifying glass handle */}
      <path
        d="M 105 105 L 160 160"
        stroke="#22C55E"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Building outline (simple) */}
      <g opacity="0.7">
        {/* Building main shape */}
        <rect
          x="50"
          y="45"
          width="40"
          height="50"
          stroke="#22C55E"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Windows grid (3x3) */}
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => (
            <rect
              key={`window-${row}-${col}`}
              x={55 + col * 8}
              y={50 + row * 11}
              width="5"
              height="5"
              stroke="#22C55E"
              strokeWidth="1"
              fill="none"
              opacity="0.6"
            />
          ))
        )}

        {/* Roof triangle */}
        <path
          d="M 50 45 L 70 35 L 90 45"
          stroke="#22C55E"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Scan lines / data visualization */}
      <g opacity="0.5">
        <line x1="40" y1="60" x2="100" y2="60" stroke="#22C55E" strokeWidth="1" />
        <line x1="35" y1="75" x2="95" y2="75" stroke="#22C55E" strokeWidth="1" />
        <line x1="45" y1="90" x2="105" y2="90" stroke="#22C55E" strokeWidth="1" />
      </g>
    </svg>
  );
}
