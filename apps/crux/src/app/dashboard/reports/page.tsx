"use client";

import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import { useRecentProperties } from "@/hooks/useRecentProperties";
import { gradeBand } from "@/lib/grade";
import { formatDate } from "@/lib/format";
import { PageHeading, Surface } from "@/components/dashboard/ui/Surface";
import { ListEmptyState, ListSkeleton } from "@/components/dashboard/ListStates";

/**
 * Reports index.
 *
 * This list and the Properties list are the same rows from the same hook — there
 * is no separate "reports" record. Rather than invent a distinction, the page says
 * what it is (one report per property searched) and differs only in destination:
 * each row opens that property's report view, where Properties opens the property
 * itself. See the note in the handover about collapsing the two.
 */
export default function ReportsIndexPage() {
  const { properties, isLoading } = useRecentProperties(20);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[960px] px-4 py-10 sm:px-6">
        <ListSkeleton layout="rows" rows={3} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[960px] px-4 py-10 sm:px-6">
      <PageHeading
        title="Reports"
        subtitle="One report per property you have searched."
        action={
          properties.length > 0 ? (
            <Link
              href="/dashboard/properties"
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[13px] font-medium text-crux-text-secondary transition-colors hover:text-crux-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green motion-reduce:transition-none"
            >
              Open as properties
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          ) : undefined
        }
      />

      {properties.length === 0 ? (
        <ListEmptyState
          icon={FileText}
          title="No reports yet"
          body="Score a property and its CRUX report will appear here."
          action={{ href: "/dashboard", label: "Go to Dashboard" }}
        />
      ) : (
        <div className="space-y-3">
          {properties.map((property) => {
            const band = gradeBand(property.grade);
            return (
              <Surface
                key={property.id}
                as="article"
                padding="none"
                interactive
                className="focus-within:ring-2 focus-within:ring-crux-green"
              >
                <Link
                  href={`/dashboard/reports/${property.id}`}
                  className="group flex items-center gap-4 rounded-2xl p-5 focus-visible:outline-none"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-crux-bg-accent">
                    <FileText size={18} className="text-crux-green" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-3">
                      <h3 className="truncate text-[15px] font-semibold text-crux-text-primary transition-colors group-hover:text-crux-green motion-reduce:transition-none">
                        {property.address || "Address not recorded"}
                      </h3>
                      <span
                        className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium ${band.chipClass}`}
                      >
                        {band.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-crux-text-muted">
                      {property.city && <span>{property.city}</span>}
                      <span>{formatDate(property.scoredAt)}</span>
                      {/* Only a score the API actually returned is shown. */}
                      {property.score !== null && (
                        <span className="font-semibold tabular-nums text-crux-text-primary">
                          {property.score}/100
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight
                    size={16}
                    className="shrink-0 text-crux-text-muted transition-colors group-hover:text-crux-green motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </Link>
              </Surface>
            );
          })}
        </div>
      )}
    </div>
  );
}
