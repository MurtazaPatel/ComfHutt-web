"use client";

import {
  Building2,
  Scale,
  Radio,
  Shield,
  FileSearch,
  BarChart3,
  Home,
  MapPin,
  Satellite,
  Wind,
} from "lucide-react";

const SOURCES = [
  { label: "NASA VIIRS", Icon: Satellite },
  { label: "CPCB AQI", Icon: Wind },
  { label: "NHB RESIDEX", Icon: BarChart3 },
  { label: "MCA21", Icon: Shield },
  { label: "eCourts", Icon: Scale },
  { label: "TRAI", Icon: Radio },
  { label: "CPWD", Icon: Building2 },
  { label: "State IGR", Icon: FileSearch },
  { label: "99acres", Icon: Home },
  { label: "MagicBricks", Icon: MapPin },
];

function SourceItem({ label, Icon }: (typeof SOURCES)[number]) {
  return (
    <span className="inline-flex items-center gap-2 shrink-0">
      <Icon size={14} className="text-[#9CA3AF]" strokeWidth={1.5} />
      <span
        className="text-[12px] text-[#6B7280] tracking-wide"
        style={{ fontFamily: "var(--font-mono, monospace)" }}
      >
        {label}
      </span>
    </span>
  );
}

function Dot() {
  return (
    <span className="shrink-0 text-[#D1D5DB] text-[10px] select-none px-1">
      ·
    </span>
  );
}

export default function TrustBar() {
  // Duplicate for seamless loop
  const track = [...SOURCES, ...SOURCES];

  return (
    <section className="bg-[#F9FAFB] py-8 border-y border-[#E5E7EB] overflow-hidden">
      <p className="text-center text-[11px] uppercase tracking-widest text-[#9CA3AF] mb-6 font-medium px-4">
        Powered by verified government &amp; institutional data
      </p>

      <div className="relative">
        {/* Fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#F9FAFB] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#F9FAFB] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex items-center whitespace-nowrap">
          {track.map((source, i) => (
            <span key={i} className="inline-flex items-center">
              <SourceItem {...source} />
              <Dot />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
