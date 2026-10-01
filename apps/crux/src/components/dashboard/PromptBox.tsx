"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
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

/**
 * Shortest query worth sending to the backend.
 *
 * The old gate was 10 characters with the reason "include area, city" — which
 * rejected real Gujarat project names a user would reasonably type ("Vesu",
 * "Iscon"). Three characters is the only thing we can defend locally: it filters
 * a stray keystroke and nothing else. Whether an address resolves is the
 * geocoder's call, and its "could not find this" is a better error than ours.
 */
const MIN_QUERY_LENGTH = 3;

export function PromptBox({ actionType = "score" }: { actionType?: "score" | "lens" }) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addProperty } = useRecentProperties();
  const apiFetch = useApiFetch();
  const reduceMotion = useReducedMotion();

  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    // Focus after the entrance animation so the caret doesn't ride the transform.
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

  /**
   * Submit takes the query as an argument rather than reading state.
   *
   * It used to close over `address`, so an example chip — which set state and then
   * called submit from a setTimeout — sent whatever had been typed before it.
   * Passing the text in removes the race entirely.
   */
  const submitQuery = async (raw: string) => {
    const trimmed = raw.trim();
    if (trimmed.length < MIN_QUERY_LENGTH) {
      setError("Type at least a few characters — a project name or an address.");
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
        // A property that was just created has no score. Sending 0 made every
        // fresh card render a zero gauge as though the engine had graded it badly.
        score: null,
        scoredAt: new Date().toISOString(),
      });

      if (actionType === "lens") {
        // Lens mode means "find this project, then open a chat on it". The field
        // holds a project or address, never the question — forwarding it as
        // `initialMessage` used to send the geocoded text back as the user's first
        // message. The user asks their question inside the chat.
        router.push(`/dashboard/lens/${property.id}`);
      } else {
        router.push(`/dashboard/properties/${property.id}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      if (msg.includes("geocode") || msg.includes("find") || msg.includes("not found")) {
        setError("Could not find this project or address in Gujarat. Try adding the area and city.");
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
      submitQuery(address);
    }
  };

  const handleExampleSelect = (text: string) => {
    setAddress(text);
    setError(null);
    submitQuery(text);
  };

  const canSubmit = address.trim().length >= MIN_QUERY_LENGTH;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      className="w-full max-w-[720px] mx-auto"
    >
      <div
        className={cn(
          "relative rounded-2xl border bg-white transition-[border-color,box-shadow] duration-[400ms] motion-reduce:transition-none",
          isFocused
            ? "border-crux-green-mid shadow-[var(--shadow-premium-glow)]"
            : "border-crux-border shadow-[var(--shadow-premium-md)] hover:shadow-[var(--shadow-premium-lg)]",
        )}
      >
        {/* Main input area */}
        <div className="px-4 pt-4 pb-3 sm:px-5">
          <div className="flex items-start gap-3">
            <MapPin
              size={16}
              aria-hidden="true"
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
              aria-label={
                actionType === "lens"
                  ? "Project name or address to open in Lens"
                  : "Project name or address to grade"
              }
              placeholder="Project name or address in Gujarat…"
              disabled={isSubmitting}
              rows={1}
              className={cn(
                "min-h-6 max-h-[200px] flex-1 resize-none border-none bg-transparent outline-none",
                "text-[16px] leading-[1.65] font-normal",
                "text-crux-text-primary placeholder:text-crux-text-muted",
                "disabled:opacity-50",
              )}
            />
          </div>
          <p className="mt-1 ml-[28px] text-[13px] text-crux-text-secondary">
            {actionType === "lens"
              ? "Name the project or address first — then ask your questions in the chat."
              : "Ahmedabad, Surat, Vadodara, Rajkot, Gandhinagar and the rest of Gujarat."}
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-crux-border" />

        {/* Bottom row: examples + submit */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-5">
          <ExampleSearches onSelect={handleExampleSelect} />

          <button
            type="button"
            onClick={() => submitQuery(address)}
            disabled={isSubmitting || !canSubmit}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 whitespace-nowrap px-[18px] py-[10px]",
              "rounded-xl text-sm font-semibold",
              "transition-[background-color,box-shadow,transform] duration-300 motion-reduce:transition-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              canSubmit
                ? "bg-crux-green text-crux-ink hover:bg-[#34D399] hover:shadow-[var(--shadow-premium-glow)] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
                : "bg-crux-bg-secondary text-crux-text-secondary",
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
                {actionType === "lens" ? "Opening chat…" : "Grading…"}
              </>
            ) : (
              <>
                {actionType === "lens" ? "Open chat" : "Grade it"}
                <ArrowRight size={14} aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p role="alert" className="mt-2 ml-1 text-[13px] font-medium leading-relaxed text-red-600">
          {error}
        </p>
      )}
    </motion.div>
  );
}
