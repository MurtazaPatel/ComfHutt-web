"use client";

import Link from "next/link";
import { MessageSquare, Clock, ArrowRight } from "lucide-react";
import { useRecentProperties } from "@/hooks/useRecentProperties";
import { PromptBox } from "@/components/dashboard/PromptBox";

function formatRelative(dateStr: string): string {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  } catch {
    return dateStr;
  }
}

export default function LensIndexPage() {
  const { properties, isLoading } = useRecentProperties(20);

  if (isLoading) {
    return (
      <div className="max-w-[960px] mx-auto px-6 py-10">
        <div className="mb-8 animate-pulse">
          <div className="h-8 w-24 bg-gray-100 rounded mb-2" />
          <div className="h-4 w-48 bg-gray-100 rounded" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-50 border border-[#ededed] rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[960px] mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-crux-text-primary tracking-tight">Lens</h1>
        <p className="text-sm text-crux-text-secondary mt-1">
          AI-powered property research conversations
        </p>
      </div>

      <div className="mb-12">
        <PromptBox actionType="lens" />
      </div>

      {properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-[#ededed] rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-crux-green-tint flex items-center justify-center mb-4">
            <MessageSquare className="w-6 h-6 text-crux-green" />
          </div>
          <h2 className="text-lg font-semibold text-crux-text-primary mb-2">No research sessions yet</h2>
          <p className="text-sm text-crux-text-secondary mb-4 max-w-[360px]">
            Score a property to start asking questions about it
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-crux-green text-white rounded-xl hover:bg-crux-green-mid transition-colors"
          >
            Go to Dashboard
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {properties.map((property) => (
            <Link
              key={property.id}
              href={`/dashboard/lens/${property.propertyId}`}
              className="flex items-center gap-4 bg-white border border-[#ededed] rounded-2xl p-5 hover:border-crux-green/30 hover:shadow-sm transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-crux-green-tint flex items-center justify-center flex-shrink-0">
                <MessageSquare size={18} className="text-crux-green" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[15px] font-semibold text-crux-text-primary truncate group-hover:text-crux-green transition-colors">
                  {property.address || "Unknown address"}
                </h3>
                <p className="text-[13px] text-crux-text-secondary truncate mt-0.5">
                  {property.city ? `${property.city} · ` : ""}Score: {property.score}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Clock size={14} className="text-crux-text-muted" />
                <span className="text-[12px] text-crux-text-muted">
                  {formatRelative(property.scoredAt)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}