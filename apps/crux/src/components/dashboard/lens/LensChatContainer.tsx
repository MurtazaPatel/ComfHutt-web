"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useLensSession } from "@/hooks/useLensSession";
import { MessageList } from "./MessageList";
import { PromptInputBar } from "./PromptInputBar";
import { LensChatSkeleton } from "./LensChatSkeleton";

interface LensChatContainerProps {
  propertyId: string;
  propertyName?: string;
}

/**
 * Height of the chat column.
 *
 * `100vh` is wrong on mobile: it is the viewport *without* the retracted browser
 * chrome, so the column was taller than what you can see and the sticky input bar
 * sat below the fold with no way to reach it. `100dvh` tracks the visible area, and
 * shrinks again when the on-screen keyboard opens.
 *
 * The 4rem comes off because DashboardShell's <main> carries `pb-16 md:pb-0` for the
 * mobile bottom nav, which the "minimal" variant this page uses does not render.
 * Without subtracting it the page itself scrolls and takes the input bar down with it.
 */
const COLUMN_HEIGHT = "h-[calc(100dvh-4rem)] md:h-[100dvh]";

const topBarButton =
  "inline-flex items-center gap-1.5 rounded-lg text-crux-text-secondary transition-colors hover:text-crux-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 motion-reduce:transition-none";

export function LensChatContainer({ propertyId, propertyName }: LensChatContainerProps) {
  const router = useRouter();
  const {
    isLoading,
    error,
    messages,
    activeMessage,
    sendMessage,
    isStreaming,
    abort,
    createNewSession,
  } = useLensSession(propertyId);

  const searchParams = useSearchParams();
  const initialMessageSent = useRef(false);

  /**
   * A deep link may carry the first question (?initialMessage=…). Nothing in the app
   * produces that link today — PromptBox opens the chat empty on purpose — but an
   * external link still can, so the entry point stays.
   *
   * The ref is what makes this safe to depend on `sendMessage`: it is set before the
   * send, synchronously, so the re-run this effect gets when `sendMessage`'s identity
   * changes (it closes over sessionId, which the send itself sets) finds the guard
   * already closed. Stripping the param from the URL then stops a reload repeating it.
   */
  useEffect(() => {
    if (initialMessageSent.current) return;
    const initialMsg = searchParams.get("initialMessage");
    if (!initialMsg) return;

    initialMessageSent.current = true;
    sendMessage(initialMsg);

    const url = new URL(window.location.href);
    url.searchParams.delete("initialMessage");
    window.history.replaceState({}, "", url);
  }, [searchParams, sendMessage]);

  if (isLoading && !messages.length) {
    return (
      <div className={`flex flex-col ${COLUMN_HEIGHT} bg-white`}>
        {/* Top bar skeleton — same height and gutters as the real one. */}
        <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-crux-border bg-white/80 px-4 py-3 sm:px-5">
          <div className="h-4 w-16 animate-pulse rounded bg-crux-bg-secondary motion-reduce:animate-none" />
          <div className="h-4 w-32 animate-pulse rounded bg-crux-bg-secondary motion-reduce:animate-none" />
          <div className="h-7 w-[104px] animate-pulse rounded-xl bg-crux-bg-secondary motion-reduce:animate-none" />
        </div>

        <LensChatSkeleton />

        <div className="sticky bottom-0 bg-gradient-to-t from-white from-80% to-transparent px-4 pb-6 pt-4 sm:px-6">
          <div className="mx-auto h-[48px] max-w-[768px] animate-pulse rounded-2xl border border-crux-border bg-crux-bg-secondary motion-reduce:animate-none" />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${COLUMN_HEIGHT} bg-white`}>
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between gap-3 border-b border-crux-border bg-white/80 px-4 py-3 backdrop-blur-sm sm:px-5">
        <button type="button" onClick={() => router.back()} className={`${topBarButton} text-[14px]`}>
          <ArrowLeft size={16} />
          Back
        </button>

        <span className="min-w-0 truncate text-[14px] font-medium text-crux-text-primary">
          {propertyName || "Property"}
        </span>

        <button
          type="button"
          onClick={createNewSession}
          className={`${topBarButton} shrink-0 border border-crux-border px-3 py-1.5 text-[12px]`}
        >
          <RefreshCw size={12} />
          {/* The label is for a wide screen; at 360px the icon carries it. */}
          <span className="hidden sm:inline">New Session</span>
          <span className="sr-only sm:hidden">New session</span>
        </button>
      </div>

      {/* Messages */}
      <MessageList
        messages={messages}
        activeMessage={activeMessage}
        isLoading={isLoading}
        isStreaming={isStreaming}
        onAsk={sendMessage}
      />

      {/* Input */}
      <PromptInputBar onSend={sendMessage} onStop={abort} isLoading={isStreaming} error={error} />
    </div>
  );
}
