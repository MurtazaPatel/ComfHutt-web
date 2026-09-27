"use client";

import Link from "next/link";
import { Building2, MapPin } from "lucide-react";
import { useRecentProperties } from "@/hooks/useRecentProperties";
import { gradeBand } from "@/lib/grade";
import { formatRelative } from "@/lib/format";
import { PageHeading, Surface } from "@/components/dashboard/ui/Surface";
import { ListEmptyState, ListSkeleton, ScoreValue } from "@/components/dashboard/ListStates";

export default function PropertiesPage() {
  const { properties, isLoading } = useRecentProperties();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[960px] px-4 py-10 sm:px-6">
        <ListSkeleton layout="grid" rows={4} />
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="mx-auto max-w-[960px] px-4 py-10 sm:px-6">
        <PageHeading title="Properties" subtitle="No properties scored yet" />
        <ListEmptyState
          icon={Building2}
          title="No scored properties"
          body="Score your first property on the dashboard to see it listed here."
          action={{ href: "/dashboard", label: "Go to Dashboard" }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[960px] px-4 py-10 sm:px-6">
      <PageHeading
        title="Properties"
        subtitle={`${properties.length} ${properties.length === 1 ? "property" : "properties"} searched`}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {properties.map((item) => {
          // The engine owns the grade; `gradeBand` only decides how it looks. An
          // absent grade resolves to NR rather than being guessed from the score.
          const band = gradeBand(item.grade);
          return (
            <Surface
              key={item.id}
              as="article"
              padding="none"
              interactive
              className="focus-within:ring-2 focus-within:ring-crux-green"
            >
              <Link
                href={`/dashboard/properties/${item.id}`}
                className="group flex h-full items-start justify-between gap-4 rounded-2xl p-5 focus-visible:outline-none"
              >
                <div className="min-w-0 flex-1">
                  {item.city && (
                    <div className="mb-2 flex items-center gap-1.5 text-[13px] text-crux-text-muted">
                      <MapPin size={14} className="shrink-0" aria-hidden="true" />
                      {/* A city is prose, not an identifier — it was set in `font-mono`. */}
                      <span className="truncate">{item.city}</span>
                    </div>
                  )}
                  <h3 className="mb-2 truncate text-[15px] font-semibold text-crux-text-primary transition-colors group-hover:text-crux-green motion-reduce:transition-none">
                    {item.address || "Address not recorded"}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${band.chipClass}`}
                    >
                      {band.label}
                    </span>
                    <span className="text-[12px] text-crux-text-muted">
                      {formatRelative(item.scoredAt)}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <ScoreValue score={item.score} />
                </div>
              </Link>
            </Surface>
          );
        })}
      </div>
    </div>
  );
}
