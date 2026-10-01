"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  FileText,
  Link2,
  Eye,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  X,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ApiError, useApiFetch } from "@/lib/api";
import { formatDate } from "@/lib/format";

/** The three values `POST /crux/card/:id` accepts; anything else 400s. */
const CARD_INTENTS = ["balanced", "yield", "appreciation"] as const;

interface PropertyActionsProps {
  propertyId: string;
  onRecompute?: () => void;
  isRecomputing?: boolean;
  /** Lets a parent (e.g. a header Share button) drive the same share modal. */
  shareOpen?: boolean;
  onShareOpenChange?: (open: boolean) => void;
  /** The intent the page is displaying, passed through to the share card. */
  intent?: string | null;
  /** False while there is no grade — a card of nothing is not worth sharing. */
  canShare?: boolean;
}

interface ActionItem {
  key: string;
  label: string;
  icon: typeof MessageSquare;
  action?: () => void;
  isLoading?: boolean;
  /** Present → the row renders inert with this line underneath, instead of lying. */
  unavailableReason?: string;
  /** Renders a chevron that turns, and wires aria-expanded, for a row that opens inline. */
  expanded?: boolean;
}

interface WatchCredits {
  credits_remaining: number;
  credits_total: number;
  credits_used: number;
}

interface WatchResult {
  already_watching?: boolean;
  creditsRemaining?: number;
  message?: string;
  monitoring_status?: string;
  monitoring_note?: string;
}

export function PropertyActions({
  propertyId,
  onRecompute,
  isRecomputing,
  shareOpen,
  onShareOpenChange,
  intent,
  canShare = true,
}: PropertyActionsProps) {
  const router = useRouter();
  const apiFetch = useApiFetch();
  const [ownShareOpen, setOwnShareOpen] = useState(false);

  // Controlled when a parent passes `shareOpen`, self-managed otherwise, so the
  // header Share button and this list open one modal rather than two.
  const isShareOpen = shareOpen ?? ownShareOpen;
  const setShareOpen = useCallback(
    (open: boolean) => {
      setOwnShareOpen(open);
      onShareOpenChange?.(open);
    },
    [onShareOpenChange],
  );

  // ── Watch ───────────────────────────────────────────────────────────────────
  // Registering a watch spends one of a small number of real credits, so the row
  // opens a confirm step rather than spending on the first click.
  const [watchStep, setWatchStep] = useState<"idle" | "confirm" | "saving" | "done">("idle");
  const [credits, setCredits] = useState<WatchCredits | null>(null);
  const [watchResult, setWatchResult] = useState<WatchResult | null>(null);
  const [watchError, setWatchError] = useState<string | null>(null);

  const openWatchConfirm = useCallback(() => {
    setWatchError(null);
    setWatchStep((step) => (step === "confirm" ? "idle" : "confirm"));
    if (credits) return;
    // Best effort: the confirm is still honest without the count, it just can't
    // say how many are left.
    apiFetch<{ success: boolean; data?: WatchCredits }>("/crux/watch/credits")
      .then((res) => {
        if (res.success && res.data) setCredits(res.data);
      })
      .catch(() => {
        setCredits(null);
      });
  }, [apiFetch, credits]);

  const confirmWatch = useCallback(async () => {
    setWatchStep("saving");
    setWatchError(null);
    try {
      const res = await apiFetch<{ success: boolean; data?: WatchResult }>(
        `/crux/watch/${propertyId}`,
        { method: "POST" },
      );
      const result = res.data ?? {};
      setWatchResult(result);
      const remaining = result.creditsRemaining;
      if (typeof remaining === "number") {
        setCredits((prev) =>
          prev ? { ...prev, credits_remaining: remaining, credits_used: prev.credits_total - remaining } : prev,
        );
      }
      setWatchStep("done");
    } catch (err) {
      // The credit guard answers 429 / WATCH_CREDITS_EXHAUSTED; its message already
      // says what to do, so it is shown rather than reworded.
      setWatchError(err instanceof ApiError ? err.message : "Could not register the watch. Try again.");
      setWatchStep("confirm");
    }
  }, [apiFetch, propertyId]);

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
      action: canShare ? () => setShareOpen(true) : undefined,
      ...(canShare ? {} : { unavailableReason: "There is no grade on this property to share yet." }),
    },
    {
      key: "watch",
      label: watchStep === "done" ? "Watching This Property" : "Watch Property",
      icon: Eye,
      action: watchStep === "done" ? undefined : openWatchConfirm,
      isLoading: watchStep === "saving",
      expanded: watchStep === "confirm",
      ...(watchStep === "done" ? { unavailableReason: "Already registered on this property." } : {}),
    },
    {
      key: "recompute",
      label: "Recompute Score",
      icon: RefreshCw,
      action: onRecompute,
      isLoading: isRecomputing,
      ...(onRecompute ? {} : { unavailableReason: "Recompute is unavailable on this view." }),
    },
  ];

  return (
    <>
      <div className="flex flex-col">
        {actions.map((item) => {
          const disabled = Boolean(item.isLoading || item.unavailableReason);
          return (
            <div key={item.key}>
              <button
                type="button"
                onClick={item.action}
                disabled={disabled}
                aria-expanded={item.expanded === undefined ? undefined : item.expanded}
                aria-describedby={item.unavailableReason ? `action-reason-${item.key}` : undefined}
                className={cn(
                  "flex w-full items-center justify-between gap-3 px-4 py-3 min-h-12",
                  "text-left text-[14px] font-medium tracking-tight text-crux-text-primary",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-crux-green",
                  disabled
                    ? "cursor-not-allowed"
                    : "transition-colors duration-200 hover:bg-crux-bg-secondary active:bg-crux-bg-secondary motion-reduce:transition-none",
                )}
              >
                <span className="flex min-w-0 flex-col">
                  <span className={cn("flex items-center gap-3", item.unavailableReason && "text-crux-text-muted")}>
                    <item.icon
                      size={16}
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className={cn(
                        "shrink-0 text-crux-text-secondary",
                        item.unavailableReason && "text-crux-text-muted",
                        item.isLoading && "animate-spin motion-reduce:animate-none",
                      )}
                    />
                    {item.label}
                  </span>
                  {item.unavailableReason && (
                    <span id={`action-reason-${item.key}`} className="mt-0.5 pl-7 text-[11px] text-crux-text-muted">
                      {item.unavailableReason}
                    </span>
                  )}
                </span>
                {item.expanded !== undefined ? (
                  <ChevronDown
                    size={14}
                    aria-hidden="true"
                    className={cn(
                      "shrink-0 text-crux-text-muted transition-transform duration-200 motion-reduce:transition-none",
                      item.expanded && "rotate-180",
                    )}
                  />
                ) : (
                  !item.unavailableReason && (
                    <ChevronRight size={14} aria-hidden="true" className="shrink-0 text-crux-text-muted" />
                  )
                )}
              </button>

              {/* Watch confirm / outcome, inline under its own row. */}
              {item.key === "watch" && watchStep === "confirm" && (
                <div className="border-y border-crux-border bg-crux-bg-secondary px-4 py-3">
                  <p className="text-[12px] leading-relaxed text-crux-text-secondary">
                    Registering a watch spends one Watch credit.
                    {credits
                      ? ` You have ${credits.credits_remaining} of ${credits.credits_total} left.`
                      : ""}
                  </p>
                  {watchError && (
                    <p className="mt-1.5 flex items-start gap-1 text-[12px] text-amber-700">
                      <AlertCircle size={12} aria-hidden="true" className="mt-0.5 shrink-0" />
                      {watchError}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={confirmWatch}
                      className="rounded-lg bg-crux-green px-3 py-1.5 text-[12px] font-medium text-crux-ink transition-colors hover:bg-[#34D399] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 motion-reduce:transition-none"
                    >
                      Use 1 credit
                    </button>
                    <button
                      type="button"
                      onClick={() => setWatchStep("idle")}
                      className="rounded-lg px-3 py-1.5 text-[12px] font-medium text-crux-text-secondary transition-colors hover:text-crux-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 motion-reduce:transition-none"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {item.key === "watch" && watchStep === "done" && (
                <div className="border-y border-crux-border bg-crux-green-tint px-4 py-3" aria-live="polite">
                  <p className="flex items-start gap-1.5 text-[12px] font-medium text-crux-green-dark">
                    <Check size={12} aria-hidden="true" className="mt-0.5 shrink-0" />
                    {watchResult?.message ?? "Watch registered."}
                  </p>
                  {/* The backend says alerts are not live yet. Saying so beats letting
                      the reader expect an email tomorrow. */}
                  {watchResult?.monitoring_note && (
                    <p className="mt-1 pl-[18px] text-[11px] leading-relaxed text-crux-text-secondary">
                      {watchResult.monitoring_note}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isShareOpen && (
        <ShareModal propertyId={propertyId} intent={intent} onClose={() => setShareOpen(false)} />
      )}
    </>
  );
}

type CopyState = "idle" | "copied" | "failed";

interface CardResult {
  share_url?: string;
  share_token?: string;
  expires_at?: string;
}

function ShareModal({
  propertyId,
  intent,
  onClose,
}: {
  propertyId: string;
  intent?: string | null;
  onClose: () => void;
}) {
  const apiFetch = useApiFetch();
  const [card, setCard] = useState<CardResult | null>(null);
  const [mintError, setMintError] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const inputRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Mint a real share card. The modal used to copy this page's own dashboard URL,
  // which requires the recipient to sign in AND own the property — so the link
  // never worked for the person it was sent to.
  useEffect(() => {
    let live = true;
    const safeIntent = CARD_INTENTS.includes((intent ?? "") as (typeof CARD_INTENTS)[number])
      ? (intent as string)
      : "balanced";
    apiFetch<{ success: boolean; data?: CardResult }>(
      `/crux/card/${propertyId}?intent=${encodeURIComponent(safeIntent)}`,
      { method: "POST" },
    )
      .then((res) => {
        if (!live) return;
        if (res.success && res.data?.share_url) setCard(res.data);
        else setMintError("The share link could not be created. Try again in a moment.");
      })
      .catch((err) => {
        if (!live) return;
        setMintError(err instanceof ApiError ? err.message : "The share link could not be created.");
      });
    return () => {
      live = false;
    };
  }, [apiFetch, propertyId, intent]);

  // Focus starts on Close (there is nothing else yet) and moves to the link the
  // moment it exists; the opener gets focus back on unmount.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => previouslyFocused?.focus?.();
  }, []);

  useEffect(() => {
    if (!card?.share_url) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [card?.share_url]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      // Contain Tab within the dialog — without this, focus walks the page behind it.
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input, a[href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [onClose]);

  const handleCopy = async () => {
    const url = card?.share_url;
    if (!url) return;
    // navigator.clipboard is undefined on insecure origins, so select the text
    // and tell the reader to copy it rather than silently doing nothing.
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(url);
      setCopyState("copied");
    } catch {
      inputRef.current?.focus();
      inputRef.current?.select();
      setCopyState("failed");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overscroll-contain bg-black/20 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
        className="flex max-h-[90dvh] w-full max-w-[400px] flex-col gap-4 overflow-y-auto overscroll-contain rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <h3 id="share-modal-title" className="text-[16px] font-semibold text-crux-text-primary">
            Share Property
          </h3>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close share dialog"
            className="rounded-lg p-1 text-crux-text-muted transition-colors hover:text-crux-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green motion-reduce:transition-none"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {!card && !mintError && (
          <p className="flex items-center gap-2 text-[13px] text-crux-text-secondary" aria-live="polite">
            <Loader2
              size={14}
              aria-hidden="true"
              className="shrink-0 animate-spin text-crux-green motion-reduce:animate-none"
            />
            Creating a public link…
          </p>
        )}

        {mintError && (
          <p className="flex items-start gap-1.5 text-[13px] text-amber-700" aria-live="polite">
            <AlertCircle size={14} aria-hidden="true" className="mt-0.5 shrink-0" />
            {mintError}
          </p>
        )}

        {card?.share_url && (
          <>
            <div className="flex items-center gap-2 rounded-xl border border-crux-border bg-crux-bg-secondary p-3 focus-within:border-crux-green focus-within:ring-2 focus-within:ring-crux-green/20">
              <input
                ref={inputRef}
                type="text"
                readOnly
                aria-label="Shareable link"
                value={card.share_url}
                onFocus={(e) => e.currentTarget.select()}
                className="min-w-0 flex-1 truncate border-none bg-transparent text-[13px] text-crux-text-primary outline-none"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-crux-green px-3 py-1.5 text-[12px] font-medium text-crux-ink transition-colors hover:bg-[#34D399] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                {copyState === "copied" && <Check size={12} aria-hidden="true" />}
                {copyState === "copied" ? "Copied" : "Copy"}
              </button>
            </div>

            <p className="text-[12px] text-crux-text-secondary">
              Anyone with this link can read the report — no account needed.
              {/* A 90-day expiry the sharer never saw is a broken promise later. */}
              {card.expires_at ? ` It works until ${formatDate(card.expires_at)}.` : ""}
            </p>
          </>
        )}

        {/* aria-live so the outcome reaches a screen reader, not just the eye. */}
        <p aria-live="polite" className="min-h-[16px] text-[12px]">
          {copyState === "copied" && <span className="text-crux-green-dark">Link copied to your clipboard.</span>}
          {copyState === "failed" && (
            <span className="inline-flex items-start gap-1 text-amber-700">
              <AlertCircle size={12} aria-hidden="true" className="mt-0.5 shrink-0" />
              Couldn&rsquo;t copy automatically. The link is selected — copy it manually.
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
