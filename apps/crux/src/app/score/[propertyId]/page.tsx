"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, RefreshCw, Lock, ArrowRight } from "lucide-react";
import { track } from "@vercel/analytics";
import { useAuth } from "@clerk/nextjs";
import { usePropertyScore } from "@/hooks/usePropertyScore";
import { apiFetch } from "@/lib/api";
import { ScoreGauge } from "@/components/dashboard/ScoreGauge";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { CgmGradeSurface } from "@/components/dashboard/CgmGradeSurface";

const DATA_SOURCES = ["MCA21", "eCourts", "RERA", "NHB RESIDEX", "NASA VIIRS"];

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

function percentileFromScore(score: number): number {
  return Math.max(1, 100 - score);
}

function MiniHeader() {
  return (
    <div className="border-b border-black/5 bg-white">
      <div className="max-w-[960px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-[18px] font-bold tracking-[-0.03em] text-crux-text-primary">
          CRUX
        </Link>
        <Link
          href="/signup"
          onClick={() => track("signup_from_anon_score_page")}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-crux-green text-white rounded-full hover:bg-crux-green-mid transition-colors"
        >
          Sign up free
          <ArrowRight size={14} />
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

  if (!isLoaded || (isLoaded && isSignedIn)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-6 h-6 animate-spin text-crux-green" />
      </div>
    );
  }

  // Quota exceeded — the signup wall
  if (quotaExceeded) {
    return (
      <div className="min-h-screen bg-white">
        <MiniHeader />
        <div className="max-w-[600px] mx-auto px-6 py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-crux-green-tint flex items-center justify-center mx-auto mb-6">
            <Lock className="w-7 h-7 text-crux-green" />
          </div>
          <h1 className="text-2xl font-bold text-crux-text-primary mb-3">
            You&rsquo;ve used your {quotaExceeded.maxReports} free scores
          </h1>
          <p className="text-sm text-crux-text-secondary mb-8 max-w-[420px] mx-auto">
            Create a free account to keep scoring — unlimited properties, full CRUX Lens access,
            and your report history saved.
          </p>
          <Link
            href="/signup"
            onClick={() => track("signup_after_quota")}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-crux-green text-white rounded-full hover:bg-crux-green-mid transition-colors"
          >
            Create free account
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  // Computing state — live progress
  if (isComputing) {
    return (
      <div className="min-h-screen bg-white">
        <MiniHeader />
        <div className="max-w-[960px] mx-auto px-6 py-10">
          <div className="mb-4 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5 rounded-2xl p-5">
            <h1 className="text-[18px] font-semibold text-crux-text-primary truncate">{displayAddress}</h1>
            {property?.city && (
              <p className="text-[13px] text-crux-text-secondary mt-0.5">
                {property.city}{property.state ? `, ${property.state}` : ""}
              </p>
            )}
          </div>
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5 rounded-2xl">
            <div className="w-16 h-16 rounded-full bg-crux-green-tint flex items-center justify-center mb-6">
              <Loader2 className="w-8 h-8 text-crux-green animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-crux-text-primary mb-6">
              CRUX AI is analyzing this property...
            </h2>
            <div className="flex flex-col gap-3 w-full max-w-[420px] text-left">
              {progressMessages.length > 0 ? (
                progressMessages.map((msg, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Loader2 size={16} className="text-crux-green animate-spin mt-0.5 flex-shrink-0" />
                    <p className="text-[14px] text-gray-700">{msg}</p>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-3">
                  <Loader2 size={16} className="text-crux-green animate-spin flex-shrink-0" />
                  <p className="text-[14px] text-gray-700">Initializing...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <MiniHeader />
        <div className="max-w-[960px] mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="h-64 bg-gray-50 rounded-2xl animate-pulse" />
            </div>
            <div className="h-64 bg-gray-50 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !score) {
    return (
      <div className="min-h-screen bg-white">
        <MiniHeader />
        <div className="max-w-[960px] mx-auto px-6 py-20 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-6 h-6 text-red-400" />
          </div>
          <h1 className="text-xl font-semibold text-crux-text-primary mb-2">Could not load this score</h1>
          <p className="text-sm text-crux-text-secondary mb-4">{error || "Please try again."}</p>
        </div>
      </div>
    );
  }

  const scoreValue = score.score_composite ?? 0;
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
    <div className="min-h-screen bg-white">
      <MiniHeader />
      <div className="max-w-[960px] mx-auto px-6 py-10">
        <div
          className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5 mb-6"
          style={{ borderRadius: "16px", padding: "24px" }}
        >
          <h1 className="text-[24px] font-semibold text-gray-900 mb-1 leading-tight tracking-tight">
            {displayAddress}
          </h1>
          {property?.city && (
            <p className="text-[13px] text-crux-text-muted mb-1">
              {property.city}{property.state ? `, ${property.state}` : ""}
            </p>
          )}
          <p className="text-[13px] text-crux-text-secondary">
            {score.created_at
              ? `Scored ${new Date(score.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}`
              : "Score pending"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* CGM-1.0 grade surface when this row was produced by the CGM engine;
                otherwise the legacy CPSM gauge + 5-pillar breakdown (same flag). */}
            {score.module_scores && score.module_scores.length > 0 ? (
              <CgmGradeSurface score={score} />
            ) : (
              <div
                className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5"
                style={{ borderRadius: "16px", padding: "24px" }}
              >
                <div className="flex flex-col sm:flex-row items-start gap-8">
                  <ScoreGauge score={scoreValue} grade={gradeFromScore(scoreValue)} percentile={percentileFromScore(scoreValue)} />
                  <div className="flex-1 min-w-0">
                    <h2 className="text-[16px] font-semibold text-crux-text-primary mb-4">Category Breakdown</h2>
                    {score.score_breakdown ? (
                      <CategoryBreakdown breakdown={score.score_breakdown} weights={currentWeights} />
                    ) : (
                      <p className="text-[13px] text-crux-text-muted">No breakdown data available.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div
              className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5"
              style={{ borderRadius: "16px", padding: "24px" }}
            >
              <h3 className="text-[14px] font-semibold text-crux-text-primary mb-3">Data Sources</h3>
              <div className="flex flex-wrap gap-2">
                {(score.data_sources_used ?? DATA_SOURCES).map((source) => (
                  <span
                    key={source}
                    className="inline-flex items-center px-3 py-1.5 text-[12px] font-medium text-gray-600 bg-white shadow-sm ring-1 ring-black/5 rounded-full"
                  >
                    {source}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Upsell — Watch/Lens/Cast/Yield live behind a free account */}
          <div>
            <div
              className="bg-crux-bg-accent shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-crux-green/20"
              style={{ borderRadius: "16px", padding: "20px" }}
            >
              <h3 className="text-[14px] font-semibold text-crux-text-primary mb-2">Want more?</h3>
              <p className="text-[13px] text-crux-text-secondary mb-4">
                Create a free account to unlock CRUX Lens, Cast, Yield, and Watch on this property.
              </p>
              <Link
                href="/signup"
                onClick={() => track("signup_from_anon_score_page")}
                className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-semibold bg-crux-green text-white rounded-xl hover:bg-crux-green-mid transition-colors"
              >
                Sign up free
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
