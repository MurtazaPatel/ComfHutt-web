"use client";

const STEPS = [
  { icon: "🔍", title: "Search any address" },
  { icon: "🤖", title: "AI analyzes 20+ databases" },
  { icon: "📊", title: "Get your CRUX score" },
  { icon: "✅", title: "Make informed decisions" },
];

export function HowItWorks() {
  return (
    <div
      className="flex flex-col gap-3 bg-white border border-[#ededed] transition-shadow duration-[220ms] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
      style={{ borderRadius: "16px", padding: "24px" }}
    >
      <h3
        style={{
          fontFamily: "var(--font-inter, Inter, sans-serif)",
          fontSize: "20px",
          fontWeight: 600,
          lineHeight: 1.3,
          color: "#111827",
        }}
      >
        How CRUX Works
      </h3>

      {STEPS.map((step, idx) => (
        <div key={idx} className="flex items-center gap-3 py-[8px]">
          <span
            className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold flex-shrink-0"
            style={{
              backgroundColor: "#f5f5f5",
              color: "#6e6e6e",
              fontFamily: "var(--font-inter, Inter, sans-serif)",
            }}
          >
            {idx + 1}
          </span>
          <span
            className="text-[14px] font-normal text-crux-text-primary"
            style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
          >
            {step.title}
          </span>
        </div>
      ))}
    </div>
  );
}
