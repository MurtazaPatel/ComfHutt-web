"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Lock, ArrowRight, AlertCircle, Check } from "lucide-react";
import { track } from "@vercel/analytics";
import { useAuth } from "@clerk/nextjs";
import { usePropertyScore } from "@/hooks/usePropertyScore";
import { apiFetch } from "@/lib/api";
import { formatDateLong } from "@/lib/format";
import { ScoreGauge } from "@/components/dashboard/ScoreGauge";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { CgmGradeSurface } from "@/components/dashboard/CgmGradeSurface";
import { Surface, SurfaceTitle } from "@/components/dashboard/ui/Surface";
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

function MiniHeader() {
  return (
    <div className="border-b border-black/5 bg-white">
      <div className="mx-auto flex h-16 max-w-[960px] items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="rounded text-[18px] font-bold tracking-[-0.03em] text-crux-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2"
        >
          CRUX
        </Link>
        <Link
          href="/signup"
          onClick={() => track("signup_from_anon_score_page")}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-crux-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-crux-green-mid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 motion-reduce:transition-none"
        >
          Sign up free
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

export default function AnonymousScorePage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.propertyId as string;
  const { isLoaded, isSignedIn } = useAuth();

  const { score, isLoading, error, isComputing, progressMessages, quotaExceeded } =
    usePropertyScore(propertyId);

  const [property, setProperty] = useState<PropertyRecord | null>(null);

  // Signed-in visitors get the full dashboard experience instead.
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace(`/dashboard/properties/${propertyId}`);
    }
  }, [isLoaded, isSignedIn, propertyId, router]);

  useEffect(() => {
    if (!propertyId) return;
    apiFetch<{ success: boolean; data?: PropertyRecord }>(`/crux/property/${propertyId}`, { skipAuth: true })
      .then((res) => {
        if (res.success && res.data) setProperty(res.data);
      })
      .catch(() => {
        // Non-fatal — address falls back to a generic label below
      });
  }, [propertyId]);

  useEffect(() => {
    if (quotaExceeded) {
      track("anonymous_quota_hit", { reportCount: quotaExceeded.reportCount });
    }
  }, [quotaExceeded]);

  // Show the user's original input (the project name they searched) as the title, not
  // the geocoded address (which collapses to "City, State, PIN" and loses the name).
  const rawAddress = property?.address_raw || property?.address_normalized || propertyId;
  const isFallbackAddress = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawAddress);
  const displayAddress = isFallbackAddress ? "Property Intelligence Report" : rawAddress;
  const locationLine = property?.city
    ? `${property.city}${property.state ? `, ${property.state}` : ""}`
    : null;

  if (!isLoaded || (isLoaded && isSignedIn)) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white">
        <Loader2
          size={24}
          aria-label="Loading"
          className="animate-spin text-crux-green motion-reduce:animate-none"
        />
      </div>
    );
  }

  // Quota exceeded — the signup wall
  if (quotaExceeded) {
    return (
      <div className="min-h-dvh bg-white">
        <MiniHeader />
        <div className="mx-auto max-w-[600px] px-4 py-24 text-center sm:px-6">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-crux-green-tint">
            <Lock size={26} aria-hidden="true" className="text-crux-green" />
          </div>
          <h1 className="mb-3 text-2xl font-bold text-crux-text-primary">
            You&rsquo;ve used your {quotaExceeded.maxReports} free grades
          </h1>
          <p className="mx-auto mb-8 max-w-[420px] text-sm text-crux-text-secondary">
            Create a free account to keep scoring — unlimited properties, full CRUX Lens access,
            and your report history saved.
          </p>
          <Link
            href="/signup"
            onClick={() => track("signup_after_quota")}
            className="inline-flex items-center gap-2 rounded-full bg-crux-green px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-crux-green-mid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            Create free account
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    );
  }

  // Computing state — live progress
  if (isComputing) {
    return (
      <div className="min-h-dvh bg-white">
        <MiniHeader />
        <div className="mx-auto max-w-[960px] px-4 py-10 sm:px-6">
          <Surface className="mb-4" padding="tight">
            <h1 className="truncate text-[18px] font-semibold text-crux-text-primary">{displayAddress}</h1>
            {locationLine && <p className="mt-0.5 text-[13px] text-crux-text-secondary">{locationLine}</p>}
          </Surface>
          <Surface className="flex flex-col items-center justify-center py-20 text-center">
            {/* Same orb as the signed-in grading page, so an anonymous visitor and
                an account holder watch the same thing happen. aria-hidden: the
                heading and the aria-live step list already announce progress. */}
            <div aria-hidden className="mb-6 flex h-16 w-16 items-center justify-center">
              <ThinkingOrb state={ORB_STATE.grading} size={64} />
            </div>
            <h2 className="mb-6 text-[18px] font-semibold text-crux-text-primary">Reading the public record…</h2>
            <ol className="flex w-full max-w-[420px] flex-col gap-3 text-left" aria-live="polite">
              {progressMessages.length > 0 ? (
                progressMessages.map((msg, idx) => {
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
                      <p className="text-[14px] text-crux-text-secondary">{msg}</p>
                    </li>
                  );
                })
              ) : (
                <li className="flex items-center gap-3">
                  <Loader2
                    size={16}
                    aria-hidden="true"
                    className="shrink-0 animate-spin text-crux-green motion-reduce:animate-none"
                  />
                  <p className="text-[14px] text-crux-text-secondary">Starting…</p>
                </li>
              )}
            </ol>
          </Surface>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-white">
        <MiniHeader />
        <div className="mx-auto max-w-[960px] px-4 py-10 sm:px-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="h-64 animate-pulse rounded-2xl bg-crux-bg-secondary motion-reduce:animate-none" />
            </div>
            <div className="h-64 animate-pulse rounded-2xl bg-crux-bg-secondary motion-reduce:animate-none" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !score) {
    return (
      <div className="min-h-dvh bg-white">
        <MiniHeader />
        <div className="mx-auto max-w-[960px] px-4 py-20 text-center sm:px-6">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-red-50">
            <AlertCircle size={22} aria-hidden="true" className="text-red-500" />
          </div>
          <h1 className="mb-2 text-xl font-semibold text-crux-text-primary">Could not load this score</h1>
          <p className="text-sm text-crux-text-secondary">{error || "Please try again."}</p>
        </div>
      </div>
    );
  }

  const scoreValue = score.score_composite ?? 0;
  const dataSources = score.data_sources_used ?? [];
  const currentWeights: Record<string, number> = {
    cpsm_legal_authenticity: 0.2,
    cpsm_technical_compliance: 0.2,
    cpsm_infrastructure_resilience: 0.2,
    cpsm_spatial_ergonomics: 0.2,
    cpsm_market_dynamics: 0.2,
  };
  if (Array.isArray(score.weight_adjustments)) {
    score.weight_adjustments.forEach((adj) => {
      currentWeights[adj.category] = adj.adjusted_weight;
    });
  }

  return (
    <div className="min-h-dvh bg-white">
      <MiniHeader />
      <div className="mx-auto max-w-[960px] px-4 py-10 sm:px-6">
        <Surface className="mb-6" as="section">
          <h1 className="mb-1 text-[22px] font-semibold leading-tight tracking-tight text-crux-text-primary sm:text-[24px]">
            {displayAddress}
          </h1>
          {locationLine && <p className="mb-1 text-[13px] text-crux-text-muted">{locationLine}</p>}
          <p className="text-[13px] text-crux-text-secondary">
            {score.created_at ? `Scored ${formatDateLong(score.created_at)}` : "Score pending"}
          </p>
        </Surface>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* CGM-1.0 grade surface when this row was produced by the CGM engine;
                otherwise the legacy CPSM gauge + 5-pillar breakdown (same flag). */}
            {score.module_scores && score.module_scores.length > 0 ? (
              <CgmGradeSurface score={score} />
            ) : (
              <Surface as="section">
                <div className="flex flex-col items-start gap-6 sm:flex-row sm:gap-8">
                  <ScoreGauge score={scoreValue} grade={gradeFromScore(scoreValue)} />
                  <div className="min-w-0 flex-1">
                    <SurfaceTitle as="h2">Category Breakdown</SurfaceTitle>
                    {score.score_breakdown ? (
                      <CategoryBreakdown breakdown={score.score_breakdown} weights={currentWeights} />
                    ) : (
                      <p className="text-[13px] text-crux-text-muted">No breakdown data available.</p>
                    )}
                  </div>
                </div>
              </Surface>
            )}

            {/* Only the registers this score says it read. No hardcoded fallback:
                naming a source the engine never consulted is a claim CRUX cannot
                stand behind, least of all on a link anyone can forward. */}
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

          {/* Upsell — promises only what a free account actually gets today. */}
          <div>
            <Surface className="bg-crux-bg-accent ring-crux-green/20" padding="tight">
              <h3 className="mb-2 text-[14px] font-semibold text-crux-text-primary">Want more?</h3>
              <p className="mb-4 text-[13px] text-crux-text-secondary">
                Create a free account to ask CRUX Lens about this property, read the full report, and keep your
                scored properties in one place.
              </p>
              <Link
                href="/signup"
                onClick={() => track("signup_from_anon_score_page")}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-crux-green px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-crux-green-mid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                Sign up free
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </Surface>
          </div>
        </div>
      </div>
    </div>
  );
}
