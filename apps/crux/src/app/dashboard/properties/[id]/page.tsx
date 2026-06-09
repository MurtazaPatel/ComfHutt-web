"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Share2, Settings, Loader2, RefreshCw } from "lucide-react";
import { usePropertyScore } from "@/hooks/usePropertyScore";
import { useApiFetch } from "@/lib/api";
import { ScoreGauge } from "@/components/dashboard/ScoreGauge";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { PropertyActions } from "@/components/dashboard/PropertyActions";

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

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;
  const apiFetch = useApiFetch();

  const { score, isLoading, error, isComputing, progressMessages, recompute } = usePropertyScore(propertyId);

  const [property, setProperty] = useState<PropertyRecord | null>(null);
  const [propertyLoading, setPropertyLoading] = useState(true);

  // Fetch property metadata (address) separately
  useEffect(() => {
    if (!propertyId) return;
    setProperty(null);
    setPropertyLoading(true);
    apiFetch<{ success: boolean; data?: PropertyRecord }>(`/crux/property/${propertyId}`)
      .then((res) => {
        if (res.success && res.data) setProperty(res.data);
      })
      .catch(() => {
        // Non-fatal — property address will fall back to ID if not available
      })
      .finally(() => setPropertyLoading(false));
  }, [propertyId]);

  const rawAddress = property?.address_normalized || property?.address_raw || propertyId;
  const isFallbackAddress = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawAddress);
  const displayAddress = isFallbackAddress ? "Property Intelligence Report" : rawAddress;

  // Computing state — showing live progress
  if (isComputing) {
    return (
      <div className="max-w-[960px] mx-auto px-6 py-10">
        <div className="mb-4 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5 rounded-2xl p-5">
          <h1 className="text-[18px] font-semibold text-crux-text-primary truncate">
            {displayAddress}
          </h1>
          {property?.city && (
            <p className="text-[13px] text-crux-text-secondary mt-0.5">{property.city}{property.state ? `, ${property.state}` : ""}</p>
          )}
        </div>
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5 rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" style={{ backgroundSize: "200% 100%" }} />
          
          <div className="w-16 h-16 rounded-full bg-crux-green-tint flex items-center justify-center mb-6 relative z-10">
            <Loader2 className="w-8 h-8 text-crux-green animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-crux-text-primary mb-6 relative z-10 animate-pulse bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 bg-clip-text text-transparent">
            CRUX AI is analyzing this property...
          </h2>
          
          <div className="flex flex-col gap-3 w-full max-w-[420px] text-left relative z-10">
            {progressMessages.map((msg, idx) => {
              const isLast = idx === progressMessages.length - 1;
              return (
                <div key={idx} className={`flex items-start gap-3 transition-opacity duration-300 ${isLast ? 'opacity-100' : 'opacity-50'}`}>
                  {isLast ? (
                    <Loader2 size={16} className="text-crux-green animate-spin mt-0.5 flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-crux-green/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-crux-green" />
                    </div>
                  )}
                  <p className={`text-[14px] ${isLast ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>{msg}</p>
                </div>
              );
            })}
            {progressMessages.length === 0 && (
              <div className="flex items-center gap-3">
                <Loader2 size={16} className="text-crux-green animate-spin flex-shrink-0" />
                <p className="text-[14px] text-gray-800 font-medium">Initializing...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Loading skeleton
  if (isLoading || propertyLoading) {
    return (
      <div className="max-w-[960px] mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-8 w-8 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-6 w-48 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="h-64 bg-gray-50 rounded-2xl animate-pulse" />
          </div>
          <div className="h-64 bg-gray-50 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  // Error state (no score to display)
  if (error && !score && !isComputing) {
    return (
      <div className="max-w-[960px] mx-auto px-6 py-10">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[14px] text-crux-text-secondary hover:text-crux-text-primary mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5 rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-crux-text-primary mb-2">
            Could not load property
          </h1>
          <p className="text-sm text-crux-text-secondary mb-4">{error}</p>
          <button
            type="button"
            onClick={() => recompute()}
            className="px-4 py-2 text-sm font-medium bg-crux-green text-white rounded-xl hover:bg-crux-green-mid transition-colors"
          >
            Compute Score
          </button>
        </div>
      </div>
    );
  }

  // Score not yet computed — show prompt to compute
  if (!score && !isLoading && !error && !isComputing) {
    return (
      <div className="max-w-[960px] mx-auto px-6 py-10">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[14px] text-crux-text-secondary hover:text-crux-text-primary mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <div className="mb-4 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5 rounded-2xl p-5">
          <h1 className="text-[18px] font-semibold text-crux-text-primary truncate">
            {displayAddress}
          </h1>
          {property?.city && (
            <p className="text-[13px] text-crux-text-secondary mt-0.5">{property.city}{property.state ? `, ${property.state}` : ""}</p>
          )}
        </div>
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5 rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-crux-green-tint flex items-center justify-center mb-6">
            <RefreshCw className="w-6 h-6 text-crux-green" />
          </div>
          <h2 className="text-xl font-semibold text-crux-text-primary mb-3">
            Property Created
          </h2>
          <p className="text-sm text-crux-text-secondary mb-2 max-w-[420px]">
            This property hasn&apos;t been scored yet. Generate a CRUX score
            to see the breakdown across 6 categories.
          </p>
          <p className="text-[12px] text-crux-text-muted mb-6">
            Free tier: 2 scores/month. Takes 5-10 seconds.
          </p>
          <button
            type="button"
            onClick={() => recompute()}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-crux-green text-white rounded-xl hover:bg-crux-green-mid transition-colors"
          >
            <RefreshCw size={14} />
            Generate CRUX Score
          </button>
        </div>
      </div>
    );
  }

  // Error state (no score to display)
  if (error && !score) {
    return (
      <div className="max-w-[960px] mx-auto px-6 py-10">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[14px] text-crux-text-secondary hover:text-crux-text-primary mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5 rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-crux-text-primary mb-2">
            Could not load property
          </h1>
          <p className="text-sm text-crux-text-secondary mb-4">{error}</p>
          <button
            type="button"
            onClick={() => recompute()}
            className="px-4 py-2 text-sm font-medium bg-crux-green text-white rounded-xl hover:bg-crux-green-mid transition-colors"
          >
            Compute Score
          </button>
        </div>
      </div>
    );
  }

  const scoreValue = score?.score_composite ?? 0;
  
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
    <div className="max-w-[960px] mx-auto px-6 py-10">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[14px] text-crux-text-secondary hover:text-crux-text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 text-crux-text-secondary hover:text-crux-text-primary hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Share"
          >
            <Share2 size={16} />
          </button>
          <button
            type="button"
            className="p-2 text-crux-text-secondary hover:text-crux-text-primary hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Settings"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Property header */}
      <div
        className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5 mb-6"
        style={{ borderRadius: "16px", padding: "24px" }}
      >
          <h1
          className="text-[24px] font-semibold text-gray-900 mb-1 leading-tight tracking-tight"
          style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
        >
          {displayAddress}
        </h1>
        {isFallbackAddress && (
          <p className="text-[11px] font-mono text-gray-400 mb-2 uppercase tracking-wider">ID: {propertyId}</p>
        )}
        {property?.city && (
          <p
            className="text-[13px] text-crux-text-muted mb-1"
            style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
          >
            {property.city}{property.state ? `, ${property.state}` : ""}
          </p>
        )}
        <p
          className="text-[13px] text-crux-text-secondary"
          style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
        >
          {score?.created_at
            ? `Scored ${new Date(score.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })} · Intent: ${score.intent_profile || "Balanced"}`
            : "Score pending"}
        </p>
        {score?.degraded && (
          <p className="text-[12px] text-amber-500 mt-1">⚠ Some data sources are degraded</p>
        )}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Score + Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <div
            className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5"
            style={{ borderRadius: "16px", padding: "24px" }}
          >
            <div className="flex flex-col sm:flex-row items-start gap-8">
              <ScoreGauge
                score={scoreValue}
                grade={gradeFromScore(scoreValue)}
                percentile={percentileFromScore(scoreValue)}
              />
              <div className="flex-1 min-w-0">
                <h2
                  className="text-[16px] font-semibold text-crux-text-primary mb-4"
                  style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
                >
                  Category Breakdown
                </h2>
                {score?.score_breakdown ? (
                  <CategoryBreakdown
                    breakdown={score.score_breakdown}
                    weights={currentWeights}
                  />
                ) : (
                  <p className="text-[13px] text-crux-text-muted">No breakdown data available.</p>
                )}
              </div>
            </div>

            {score?.confidence_score !== undefined && (
              <p className="text-[12px] text-crux-text-muted mt-4 pt-4 border-t border-[#ededed]">
                Confidence: {Math.round(score.confidence_score * 100)}% ·
                Version {score.crux_version || "1.0"}
              </p>
            )}
          </div>

          {/* Data Sources */}
          <div
            className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5"
            style={{ borderRadius: "16px", padding: "24px" }}
          >
            <h3
              className="text-[14px] font-semibold text-crux-text-primary mb-3"
              style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
            >
              Data Sources
            </h3>
            <div className="flex flex-wrap gap-2">
              {(score?.data_sources_used ?? DATA_SOURCES).map((source) => (
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

        {/* Right: Actions */}
        <div>
          <div
            className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5"
            style={{ borderRadius: "16px", overflow: "hidden" }}
          >
            <div
              className="px-4 py-3 border-b border-black/5"
              style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
            >
              <h3 className="text-[14px] font-semibold text-crux-text-primary">Actions</h3>
            </div>
            <PropertyActions
              propertyId={propertyId}
              onRecompute={recompute}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
