"use client";

interface PositiveSignal {
  id: string;
  message: string;
}

const PLACEHOLDER_SIGNALS: PositiveSignal[] = [
  { id: "1", message: "Developer has completed 14 projects" },
  { id: "2", message: "Metro station under construction (500m)" },
  { id: "3", message: "23% YoY appreciation in this micro-market" },
];

export function PositiveSignals() {
  return (
    <div className="flex flex-col gap-2">
      {PLACEHOLDER_SIGNALS.map((signal) => (
        <div
          key={signal.id}
          className="flex items-start gap-2 py-1"
        >
          <span className="text-crux-green flex-shrink-0">✓</span>
          <span
            className="text-[14px] text-crux-text-primary leading-relaxed"
            style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
          >
            {signal.message}
          </span>
        </div>
      ))}
    </div>
  );
}
