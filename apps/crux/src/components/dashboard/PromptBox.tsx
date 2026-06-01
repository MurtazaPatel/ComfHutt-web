"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApiFetch } from "@/lib/api";
import { useRecentProperties } from "@/hooks/useRecentProperties";
import { ExampleSearches } from "./ExampleSearches";

interface PropertyResponse {
  success: boolean;
  data?: {
    id: string;
    address_raw: string;
    address_normalized: string;
    city: string;
    state: string;
    geocode_lat: number;
    geocode_lng: number;
    pin_code: string;
    property_type: string | null;
    approx_size_sqft: number | null;
    developer_name: string | null;
  };
}

export function PromptBox({ actionType = "score" }: { actionType?: "score" | "lens" }) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addProperty } = useRecentProperties();
  const apiFetch = useApiFetch();

  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      textareaRef.current?.focus();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAddress(e.target.value);
    if (error) setError(null);
    adjustHeight();
  };

  const handleSubmit = async () => {
    const trimmed = address.trim();
    if (trimmed.length < 10) {
      setError("Address too short. Include area, city for best results.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const resp = await apiFetch<PropertyResponse>("/crux/property", {
        method: "POST",
        body: JSON.stringify({ address: trimmed }),
      });

      if (!resp.success || !resp.data) {
        throw new Error("Failed to create property record");
      }

      const property = resp.data;

      addProperty({
        id: property.id,
        propertyId: property.id,
        address: property.address_raw,
        city: property.city || "",
        score: 0,
        scoredAt: new Date().toISOString(),
      });

      if (actionType === "lens") {
        router.push(`/dashboard/lens/${property.id}?initialMessage=${encodeURIComponent(trimmed)}`);
      } else {
        router.push(`/dashboard/properties/${property.id}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      if (msg.includes("geocode") || msg.includes("find") || msg.includes("not found")) {
        setError("Could not find this address. Try a more specific one.");
      } else if (msg.includes("rate") || msg.includes("429")) {
        setError("Too many requests. Try again in a few minutes.");
      } else {
        setError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleExampleSelect = (text: string) => {
    setAddress(text);
    setError(null);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.value = text;
        adjustHeight();
      }
      // Auto-submit with example text
      const trimmed = text.trim();
      if (trimmed.length >= 10) {
        handleSubmit();
      }
    }, 100);
  };

  return (
    <div className="w-full max-w-[720px] mx-auto">
      <div
        className={cn(
          "relative border bg-white transition-all duration-[220ms]",
          isFocused
            ? "border-crux-green shadow-[0_0_0_3px_rgba(34,197,94,0.12)]"
            : "border-[#e5e5e5] hover:shadow-[0_4px_16px_rgba(13,13,13,0.06)]"
        )}
        style={{ borderRadius: "16px" }}
      >
        {/* Main input area */}
        <div className="px-5 pt-4 pb-3">
          <div className="flex items-start gap-3">
            <MapPin
              size={16}
              className="mt-[5px] flex-shrink-0 text-crux-text-muted"
              strokeWidth={1.5}
            />
            <textarea
              ref={textareaRef}
              value={address}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Enter any address in India..."
              disabled={isSubmitting}
              rows={1}
              className={cn(
                "flex-1 border-none outline-none resize-none bg-transparent",
                "text-[16px] leading-[1.65] font-normal",
                "text-crux-text-primary placeholder:text-crux-text-muted",
                "disabled:opacity-50"
              )}
              style={{
                fontFamily: "var(--font-inter, Inter, sans-serif)",
                minHeight: "24px",
                maxHeight: "200px",
              }}
            />
          </div>
          <p className="text-[13px] text-[#9b9b9b] mt-1 ml-[28px]">
            {actionType === "lens" 
              ? "Ask a question about any property in India to start a chat..." 
              : "Paste a 99acres link or type an address for instant scoring"}
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-[#e5e5e5]" />

        {/* Bottom row: examples + submit */}
        <div className="px-5 py-3 flex items-center justify-between flex-wrap gap-2">
          <ExampleSearches onSelect={handleExampleSelect} />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || address.trim().length < 10}
            className={cn(
              "inline-flex items-center gap-2 px-[18px] py-[10px]",
              "rounded-[12px] text-sm font-medium",
              "transition-colors duration-150",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              address.trim().length >= 10
                ? "bg-crux-green text-white hover:bg-crux-green-mid"
                : "bg-gray-200 text-gray-400"
            )}
            style={{ whiteSpace: "nowrap" }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                {actionType === "lens" ? "Starting Chat..." : "Analyzing..."}
              </>
            ) : (
              <>
                {actionType === "lens" ? "Chat" : "Analyze"}
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="mt-2 ml-1 text-[13px] text-red-500 leading-relaxed">
          {error}
        </p>
      )}
    </div>
  );
}
