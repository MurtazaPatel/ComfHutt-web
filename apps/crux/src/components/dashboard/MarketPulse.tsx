"use client";

interface CityTrend {
  city: string;
  change: number;
}

const PLACEHOLDER_DATA: CityTrend[] = [
  { city: "Ahmedabad", change: 3.2 },
  { city: "Bangalore", change: 2.8 },
  { city: "Gurgaon", change: 0.1 },
  { city: "Mumbai", change: -1.4 },
  { city: "Pune", change: 1.9 },
  { city: "Hyderabad", change: 0.3 },
];

function TrendIndicator({ change }: { change: number }) {
  if (change > 0.5) {
    return (
      <span className="inline-flex items-center gap-1 text-[#22C55E] font-medium text-sm">
        ↑ {change.toFixed(1)}%
      </span>
    );
  }
  if (change < -0.5) {
    return (
      <span className="inline-flex items-center gap-1 text-[#EF4444] font-medium text-sm">
        ↓ {Math.abs(change).toFixed(1)}%
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[#9CA3AF] font-medium text-sm">
      → {change.toFixed(1)}%
    </span>
  );
}

export function MarketPulse() {
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
        Market Pulse
      </h3>

      <div className="flex flex-col gap-[10px]">
        {PLACEHOLDER_DATA.map((item) => (
          <div key={item.city} className="flex items-center justify-between">
            <span
              className="text-[14px] font-normal text-crux-text-primary"
              style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
            >
              {item.city}
            </span>
            <div className="flex items-center gap-2">
              <TrendIndicator change={item.change} />
              <span className="w-[6px] h-[6px] rounded-full bg-[#E5E7EB] flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>

      <p
        className="text-[11px] text-crux-text-muted mt-1"
        style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
      >
        NHB RESIDEX indicators
      </p>
    </div>
  );
}
