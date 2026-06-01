"use client";

interface RiskFlag {
  id: string;
  severity: "high" | "medium" | "low";
  message: string;
}

const PLACEHOLDER_RISKS: RiskFlag[] = [
  { id: "1", severity: "high", message: "RERA registration expires in 45 days" },
  { id: "2", severity: "medium", message: "Adjacent property has pending litigation" },
  { id: "3", severity: "low", message: "12% vacancy rate in this micro-market" },
];

function SeverityTriangle({ severity }: { severity: RiskFlag["severity"] }) {
  const color = severity === "high" ? "#EF4444" : severity === "medium" ? "#F59E0B" : "#9CA3AF";
  return (
    <span className="flex-shrink-0" style={{ color }}>
      ▲
    </span>
  );
}

export function RiskFlags() {
  return (
    <div className="flex flex-col gap-2">
      {PLACEHOLDER_RISKS.map((risk) => (
        <div
          key={risk.id}
          className="flex items-start gap-2 py-1"
        >
          <SeverityTriangle severity={risk.severity} />
          <span
            className="text-[14px] text-crux-text-primary leading-relaxed"
            style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
          >
            {risk.message}
          </span>
        </div>
      ))}
    </div>
  );
}
