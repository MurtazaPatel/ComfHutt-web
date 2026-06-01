"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, FileText, Link2, Eye, RefreshCw, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyActionsProps {
  propertyId: string;
  onRecompute?: () => void;
  isRecomputing?: boolean;
}

interface ActionItem {
  key: string;
  label: string;
  icon: typeof MessageSquare;
  action: () => void;
  isLoading?: boolean;
}

export function PropertyActions({ propertyId, onRecompute, isRecomputing }: PropertyActionsProps) {
  const router = useRouter();
  const [showShare, setShowShare] = useState(false);

  const actions: ActionItem[] = [
    {
      key: "lens",
      label: "Lens Chat",
      icon: MessageSquare,
      action: () => router.push(`/dashboard/lens/${propertyId}`),
    },
    {
      key: "report",
      label: "Full Report",
      icon: FileText,
      action: () => router.push(`/dashboard/reports/${propertyId}`),
    },
    {
      key: "share",
      label: "Share Card",
      icon: Link2,
      action: () => setShowShare(true),
    },
    {
      key: "watch",
      label: "Watch Property",
      icon: Eye,
      action: () => {},
    },
    {
      key: "recompute",
      label: "Recompute Score",
      icon: RefreshCw,
      action: onRecompute || (() => {}),
      isLoading: isRecomputing,
    },
  ];

  return (
    <>
      <div className="flex flex-col">
        {actions.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={item.action}
            disabled={item.isLoading}
            className={cn(
              "flex items-center justify-between w-full h-12 px-4",
              "text-left text-[14px] font-medium text-crux-text-primary",
              "hover:bg-[#f5f5f5] transition-colors duration-150",
              "disabled:opacity-60 disabled:cursor-not-allowed"
            )}
            style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
          >
            <span className="flex items-center gap-3">
              <item.icon size={16} className={cn("text-crux-text-secondary", item.isLoading && "animate-spin")} strokeWidth={1.5} />
              {item.label}
            </span>
            <ChevronRight size={14} className="text-crux-text-muted" />
          </button>
        ))}
      </div>

      {showShare && <ShareModal propertyId={propertyId} onClose={() => setShowShare(false)} />}
    </>
  );
}

function ShareModal({ propertyId, onClose }: { propertyId: string; onClose: () => void }) {
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/dashboard/properties/${propertyId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white w-full max-w-[400px] mx-4 flex flex-col gap-4"
        style={{ borderRadius: "16px", padding: "24px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3
            className="text-[16px] font-semibold text-crux-text-primary"
            style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
          >
            Share Property
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-crux-text-muted hover:text-crux-text-primary transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center gap-2 p-3 bg-gray-50 border border-[#e5e5e5] rounded-xl">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 bg-transparent border-none outline-none text-[13px] text-crux-text-primary truncate"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 text-[12px] font-medium bg-crux-green text-white rounded-lg hover:bg-crux-green-mid transition-colors"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}
