"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Share2, Loader2, RefreshCw, AlertCircle, AlertTriangle, Check } from "lucide-react";
import { usePropertyScore } from "@/hooks/usePropertyScore";
import { useApiFetch } from "@/lib/api";
import { formatDateLong, formatRelative } from "@/lib/format";
import { isUngraded } from "@/lib/grade";
import { ScoreGauge } from "@/components/dashboard/ScoreGauge";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { CgmGradeSurface } from "@/components/dashboard/CgmGradeSurface";
import { PropertyActions } from "@/components/dashboard/PropertyActions";
import { PageHeading, Surface, SurfaceTitle } from "@/components/dashboard/ui/Surface";
import { ThinkingOrb, ORB_STATE } from "@/components/orb";

interface PropertyRecord {
  id: string;
  address_raw: string;
  address_normalized: string | null;
  city: string | null;
  state: string | null;
}

function gradeFromScore(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 55) return "Fair";
  if (score >= 40) return "Caution";
  return "Risk";
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;
  const apiFetch = useApiFetch();

  const { score, isLoading, error, isComputing, progressMessages, recompute } = usePropertyScore(propertyId);

  // Stamped with the id it belongs to, so a late reply for the previous property
  // can never label this one. Deriving `property` and `propertyLoading` from that
  // stamp replaces the reset-then-fetch pair of setState calls this effect used to
  // make on every id change.
  const [fetched, setFetched] = useState<{ id: string; record: PropertyRecord | null } | null>(null);
  // Owned here so the header Share button drives the one modal PropertyActions has,
  // rather than a second, dead copy of it.
  const [shareOpen, setShareOpen] = useState(false);

  // Fetch property metadata (address) separately
  useEffect(() => {
    if (!propertyId) return;
    let live = true;
    apiFetch<{ success: boolean; data?: PropertyRecord }>(`/crux/property/${propertyId}`)
      .then((res) => {
        if (live) setFetched({ id: propertyId, record: res.success && res.data ? res.data : null });
      })
      .catch(() => {
        // Non-fatal — the address falls back to the ID below.
        if (live) setFetched({ id: propertyId, record: null });
      });
    return () => {
      live = false;
    };
  }, [propertyId, apiFetch]);

  const property = fetched?.id === propertyId ? fetched.record : null;
  const propertyLoading = fetched?.id !== propertyId;

  // Show the user's original input (the project name they searched) as the title, not
  // the geocoded address (which collapses to "City, State, PIN" and loses the name).
  const rawAddress = property?.address_raw || property?.address_normalized || propertyId;
  const isFallbackAddress = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawAddress);
  const displayAddress = isFallbackAddress ? "Property Intelligence Report" : rawAddress;

  const locationLine = property?.city
    ? `${property.city}${property.state ? `, ${property.state}` : ""}`
    : null;

  const backButton = (
    <button
      type="button"
      onClick={() => router.back()}
      className="flex items-center gap-2 rounded-lg text-[14px] text-crux-text-secondary transition-colors hover:text-crux-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 motion-reduce:transition-none"
    >
      <ArrowLeft size={16} aria-hidden="true" />
      Back
    </button>
  );

  // Computing state — showing live progress. Deliberately plain: the previous
  // version shimmered the heading through a clipped gradient, which made the one
  // line explaining the wait the hardest thing on the page to read.
  if (isComputing) {
    return (
      <div className="mx-auto max-w-[960px] px-4 py-10 sm:px-6">
        <Surface className="mb-4" padding="tight">
          <h1 className="truncate text-[18px] font-semibold text-crux-text-primary">{displayAddress}</h1>
          {locationLine && <p className="mt-0.5 text-[13px] text-crux-text-secondary">{locationLine}</p>}
        </Surface>
        <Surface className="flex flex-col items-center justify-center py-20 text-center">
          {/* The orb carries the wait. `solving` is the tuned state for the grading
              engine working through its modules; it gates itself on visibility and
              holds one frame under prefers-reduced-motion. aria-hidden because the
              heading below and the aria-live step list already announce progress. */}
          <div aria-hidden className="mb-6 flex h-16 w-16 items-center justify-center">
            <ThinkingOrb state={ORB_STATE.grading} size={64} />
          </div>
          <h2 className="mb-6 text-[18px] font-semibold text-crux-text-primary">Reading the public record…</h2>

          <ol className="flex w-full max-w-[420px] flex-col gap-3 text-left" aria-live="polite">
            {progressMessages.map((msg, idx) => {
              const isLast = idx === progressMessages.length - 1;
              return (
                <li key={idx} className="flex items-start gap-3">
                  {isLast ? (
                    <Loader2
                      size={16}
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 animate-spin text-crux-green motion-reduce:animate-none"
                    />
                  ) : (
                    <Check size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-crux-green" />
                  )}
                  <p className={isLast ? "text-[14px] font-medium text-crux-text-primary" : "text-[14px] text-crux-text-secondary"}>
                    {msg}
                  </p>
                </li>
              );
            })}
            {progressMessages.length === 0 && (
              <li className="flex items-center gap-3">
                <Loader2
                  size={16}
                  aria-hidden="true"
                  className="shrink-0 animate-spin text-crux-green motion-reduce:animate-none"
                />
                <p className="text-[14px] font-medium text-crux-text-primary">Starting…</p>
              </li>
            )}
          </ol>
        </Surface>
      </div>
    );
  }

  // Loading skeleton
  if (isLoading || propertyLoading) {
    return (
      <div className="mx-auto max-w-[960px] px-4 py-10 sm:px-6">
        <div className="mb-8 flex items-center gap-3">
          <div className="size-8 animate-pulse rounded-lg bg-crux-bg-secondary motion-reduce:animate-none" />
          <div className="h-6 w-48 animate-pulse rounded bg-crux-bg-secondary motion-reduce:animate-none" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="h-64 animate-pulse rounded-2xl bg-crux-bg-secondary motion-reduce:animate-none" />
          </div>
          <div className="h-64 animate-pulse rounded-2xl bg-crux-bg-secondary motion-reduce:animate-none" />
        </div>
      </div>
    );
  }

  // Error state (no score to display). There used to be a second, byte-identical
  // copy of this block further down — unreachable, so it only ever drifted.
  if (error && !score && !isComputing) {
    return (
      <div className="mx-auto max-w-[960px] px-4 py-10 sm:px-6">
        <div className="mb-6">{backButton}</div>
        <Surface className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-red-50">
            <AlertCircle size={22} aria-hidden="true" className="text-red-500" />
          </div>
          <h1 className="mb-2 text-xl font-semibold text-crux-text-primary">Could not load property</h1>
          <p className="mb-4 text-sm text-crux-text-secondary">{error}</p>
          <button
            type="button"
            onClick={() => recompute()}
            className="rounded-xl bg-crux-green px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-crux-green-mid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            Compute Score
          </button>
        </Surface>
      </div>
    );
  }

  // Score not yet computed — show prompt to compute
  if (!score && !isLoading && !error && !isComputing) {
    return (
      <div className="mx-auto max-w-[960px] px-4 py-10 sm:px-6">
        <div className="mb-6">{backButton}</div>
        <Surface className="mb-4" padding="tight">
          <h1 className="truncate text-[18px] font-semibold text-crux-text-primary">{displayAddress}</h1>
          {locationLine && <p className="mt-0.5 text-[13px] text-crux-text-secondary">{locationLine}</p>}
        </Surface>
        <Surface className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-6 flex size-14 items-center justify-center rounded-full bg-crux-green-tint">
            <RefreshCw size={24} aria-hidden="true" className="text-crux-green" />
          </div>
          <h2 className="mb-3 text-xl font-semibold text-crux-text-primary">Not graded yet</h2>
          {/* Seven modules, not six — L, D, T, F, C, X, P. No quota or timing claim
              here: neither number is backed by anything this app can see. */}
          <p className="mb-6 max-w-[420px] text-sm text-crux-text-secondary">
            This project has not been graded yet. Run the CRUX Grade to see its letter, A+ to D, and
            the verdict for each of the seven modules.
          </p>
          <button
            type="button"
            onClick={() => recompute()}
            className="inline-flex items-center gap-2 rounded-xl bg-crux-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-crux-green-mid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            <RefreshCw size={14} aria-hidden="true" />
            Generate CRUX Grade
          </button>
        </Surface>
      </div>
    );
  }

  const scoreValue = score?.score_composite ?? 0;
  const dataSources = score?.data_sources_used ?? [];
  // A card of an ungraded, uncomputed property has nothing on it worth sending.
  const canShare = Boolean(score) && (!isUngraded(score?.grade) || score?.score_composite != null);

  // Reconstruct weights mapping
  const currentWeights: Record<string, number> = {
    cpsm_legal_authenticity: 0.20,
    cpsm_technical_compliance: 0.20,
    cpsm_infrastructure_resilience: 0.20,
    cpsm_spatial_ergonomics: 0.20,
    cpsm_market_dynamics: 0.20,
  };

  if (score && Array.isArray(score.weight_adjustments)) {
    score.weight_adjustments.forEach((adj) => {
      currentWeights[adj.category] = adj.adjusted_weight;
    });
  }

  return (
    <div className="mx-auto max-w-[960px] px-4 py-10 sm:px-6">
      <div className="mb-4">{backButton}</div>

      {/* Page heading, same block every other dashboard page uses. Share opens the
          one modal PropertyActions owns; the old Settings button is gone — there
          is no per-property setting for it to open. */}
      <PageHeading
        title={displayAddress}
        subtitle={
          <>
            {locationLine && <span className="block">{locationLine}</span>}
            <span className="block">
              {score?.created_at
                ? `Scored ${formatDateLong(score.created_at)} · Intent: ${score.intent_profile || "Balanced"}`
                : "Score pending"}
            </span>
            {/* A cached grade was computed earlier, not just now. Say which. */}
            {score?.fromCache && score.cachedAt && (
              <span className="block">Served from cache · last checked {formatRelative(score.cachedAt)}</span>
            )}
            {isFallbackAddress && (
              <span className="mt-1 block font-mono text-[11px] uppercase tracking-wider text-crux-text-muted">
                ID: {propertyId}
              </span>
            )}
            {score?.degraded && (
              <span className="mt-1 flex items-center gap-1.5 text-[12px] text-amber-700">
                <AlertTriangle size={12} aria-hidden="true" className="shrink-0" />
                Some data sources are degraded
              </span>
            )}
          </>
        }
        action={
          canShare ? (
            <button
              type="button"
              onClick={() => setShareOpen(true)}
              aria-label="Share this report"
              className="rounded-lg p-2 text-crux-text-secondary transition-colors hover:bg-crux-bg-secondary hover:text-crux-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 motion-reduce:transition-none"
            >
              <Share2 size={16} aria-hidden="true" />
            </button>
          ) : undefined
        }
      />

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Score + Breakdown */}
        <div className="space-y-6 lg:col-span-2">
          {score?.module_scores && score.module_scores.length > 0 ? (
            <CgmGradeSurface score={score} />
          ) : (
            <Surface as="section">
              <div className="flex flex-col items-start gap-6 sm:flex-row sm:gap-8">
                <ScoreGauge score={scoreValue} grade={gradeFromScore(scoreValue)} />
                <div className="min-w-0 flex-1">
                  <SurfaceTitle as="h2">Category Breakdown</SurfaceTitle>
                  {score?.score_breakdown ? (
                    <CategoryBreakdown breakdown={score.score_breakdown} weights={currentWeights} />
                  ) : (
                    <p className="text-[13px] text-crux-text-muted">No breakdown data available.</p>
                  )}
                </div>
              </div>

              {score?.confidence_score !== undefined && (
                <p className="mt-4 border-t border-crux-border pt-4 text-[12px] text-crux-text-muted">
                  Confidence: {Math.round(score.confidence_score * 100)}% · Version {score.crux_version || "1.0"}
                </p>
              )}
            </Surface>
          )}

          {/* Data Sources — only the registers the engine says it read. A hardcoded
              fallback list used to fill this in, naming sources that were never
              consulted on a page that makes adverse claims about named builders. */}
          <Surface as="section">
            <SurfaceTitle as="h3">Data Sources</SurfaceTitle>
            {dataSources.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {dataSources.map((source) => (
                  <span
                    key={source}
                    className="inline-flex items-center rounded-full bg-white px-3 py-1.5 text-[12px] font-medium text-crux-text-secondary shadow-sm ring-1 ring-black/5"
                  >
                    {source}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-crux-text-muted">
                This score did not report which sources it used.
              </p>
            )}
          </Surface>
        </div>

        {/* Right: Actions */}
        <div>
          <Surface padding="none" className="overflow-hidden">
            <div className="border-b border-black/5 px-4 py-3">
              <h3 className="text-[14px] font-semibold text-crux-text-primary">Actions</h3>
            </div>
            <PropertyActions
              propertyId={propertyId}
              onRecompute={recompute}
              shareOpen={shareOpen}
              onShareOpenChange={setShareOpen}
              intent={score?.intent_profile}
              canShare={canShare}
            />
          </Surface>
        </div>
      </div>
    </div>
  );
}
