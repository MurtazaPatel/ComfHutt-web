"use client";

import { useRecentProperties } from "@/hooks/useRecentProperties";
import { PropertyCard, PropertyCardSkeleton } from "./PropertyCard";

export function RecentProperties() {
  const { properties, isLoading } = useRecentProperties();

  return (
    <section>
      <h2
        style={{
          fontFamily: "var(--font-inter, Inter, sans-serif)",
          fontSize: "28px",
          fontWeight: 600,
          lineHeight: 1.2,
          letterSpacing: "-0.005em",
          color: "#111827",
        }}
        className="mb-4"
      >
        Recent Research
      </h2>

      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-2 scroll-snap-x-mandatory" style={{ scrollbarWidth: "none" }}>
          <PropertyCardSkeleton />
          <PropertyCardSkeleton />
          <PropertyCardSkeleton />
        </div>
      ) : properties.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center gap-4 bg-white border border-[#ededed] py-12 px-6 text-center"
          style={{ borderRadius: "16px" }}
        >
          <div className="w-12 h-12 rounded-full bg-crux-green-tint flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round">
              <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <div>
            <p className="text-[15px] font-medium text-crux-text-primary mb-1">
              Score your first property
            </p>
            <p className="text-[13px] text-crux-text-secondary">
              Enter an address above to start analyzing.
            </p>
          </div>
        </div>
      ) : (
        <div
          className="flex gap-4 overflow-x-auto pb-2 scroll-snap-x-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </section>
  );
}
