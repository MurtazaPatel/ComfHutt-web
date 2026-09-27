"use client";

import { Search } from "lucide-react";
import { useRecentProperties } from "@/hooks/useRecentProperties";
import { PropertyCard, PropertyCardSkeleton } from "./PropertyCard";
import { Surface, SurfaceTitle } from "./ui/Surface";

/**
 * The row scrolls horizontally, so it is focusable and labelled: a keyboard user
 * can tab to it and pan with the arrow keys. The vertical padding keeps each
 * card's focus ring inside the scroll box instead of clipped by `overflow-x`.
 */
const SCROLLER_CLASS =
  "flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 py-2 -mx-1 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 rounded-2xl";

export function RecentProperties() {
  const { properties, isLoading } = useRecentProperties();

  return (
    <section>
      <SurfaceTitle as="h2">Recent research</SurfaceTitle>

      {isLoading ? (
        <div className={SCROLLER_CLASS} aria-busy="true" aria-label="Loading recent research">
          <PropertyCardSkeleton />
          <PropertyCardSkeleton />
          <PropertyCardSkeleton />
        </div>
      ) : properties.length === 0 ? (
        <Surface className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-crux-green-tint">
            <Search size={22} strokeWidth={1.5} aria-hidden="true" className="text-crux-green" />
          </span>
          <div>
            <p className="mb-1 text-[15px] font-medium text-crux-text-primary">
              Grade your first property
            </p>
            <p className="text-[13px] text-crux-text-secondary">
              Enter a project name or address in Gujarat above to start.
            </p>
          </div>
        </Surface>
      ) : (
        <div className={SCROLLER_CLASS} tabIndex={0} role="group" aria-label="Recent research">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </section>
  );
}
