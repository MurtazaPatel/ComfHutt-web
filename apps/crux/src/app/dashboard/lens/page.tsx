"use client";

import Link from "next/link";
import { MessageSquare, Clock, ArrowRight } from "lucide-react";
import { useRecentProperties } from "@/hooks/useRecentProperties";
import { PromptBox } from "@/components/dashboard/PromptBox";
import { PageHeading, Surface } from "@/components/dashboard/ui/Surface";
import { gradeBand } from "@/lib/grade";
import { formatRelative } from "@/lib/format";

const rowFocus =
  "rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2";

export default function LensIndexPage() {
  const { properties, isLoading } = useRecentProperties(20);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[960px] px-4 py-10 sm:px-6">
        <div className="mb-8 animate-pulse motion-reduce:animate-none">
          <div className="mb-2 h-8 w-24 rounded bg-crux-bg-secondary" />
          <div className="h-4 w-48 rounded bg-crux-bg-secondary" />
        </div>
        {/* Mirrors a real row — 40px mark, two text lines — so nothing jumps on load. */}
        <div className="space-y-3" aria-hidden="true">
          {[1, 2, 3].map((i) => (
            <Surface key={i} padding="tight" className="flex items-center gap-3 sm:gap-4">
              <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-crux-bg-secondary motion-reduce:animate-none" />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="h-4 w-1/2 animate-pulse rounded bg-crux-bg-secondary motion-reduce:animate-none" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-crux-bg-secondary motion-reduce:animate-none" />
              </div>
            </Surface>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[960px] px-4 py-10 sm:px-6">
      <PageHeading title="Lens" subtitle="AI-powered property research conversations" />

      <div className="mb-12">
        <PromptBox actionType="lens" />
      </div>

      {properties.length === 0 ? (
        <Surface className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-crux-bg-accent">
            <MessageSquare className="h-6 w-6 text-crux-green" />
          </div>
          <h2 className="mb-2 text-lg font-semibold text-crux-text-primary">No research sessions yet</h2>
          <p className="mb-4 max-w-[360px] text-sm text-crux-text-secondary">
            Score a property to start asking questions about it
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-crux-green px-4 py-2 text-sm font-medium text-crux-ink transition-colors hover:bg-crux-green-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            Go to Dashboard
            <ArrowRight size={14} />
          </Link>
        </Surface>
      ) : (
        <div className="space-y-3">
          {properties.map((property) => {
            // The engine owns the grade; we only present it. A property with no score
            // yet says so — it does not render as a zero, which is what "Score: 0" on
            // every row used to be.
            const band = property.grade ? gradeBand(property.grade) : null;

            return (
              <Link key={property.id} href={`/dashboard/lens/${property.propertyId}`} className={`group block ${rowFocus}`}>
                <Surface padding="tight" interactive className="flex items-center gap-3 sm:gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-crux-bg-accent">
                    <MessageSquare size={18} className="text-crux-green" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[15px] font-semibold text-crux-text-primary transition-colors group-hover:text-crux-green motion-reduce:transition-none">
                      {property.address || "Unknown address"}
                    </h3>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-crux-text-secondary">
                      {property.city && <span className="truncate">{property.city}</span>}
                      {property.city && <span aria-hidden="true">·</span>}
                      {property.score === null ? (
                        <span>Not scored yet</span>
                      ) : (
                        <span>Score {property.score}</span>
                      )}
                      {band && (
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-[1px] text-[11px] font-semibold ${band.chipClass}`}
                        >
                          {band.label}
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <Clock size={14} className="text-crux-text-muted" aria-hidden="true" />
                    <span className="text-[12px] text-crux-text-muted">{formatRelative(property.scoredAt)}</span>
                  </div>
                </Surface>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
