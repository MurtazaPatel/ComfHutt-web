"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, MessageSquare } from "lucide-react";
import type { LensMessage } from "@/hooks/useLensSession";
import { AIMessage } from "./AIMessage";
import { UserMessage } from "./UserMessage";
import { ToolResultCard } from "./ToolResultCard";
import { ThinkingIndicator } from "./ThinkingIndicator";

interface MessageListProps {
  messages: LensMessage[];
  activeMessage?: LensMessage | null;
  isLoading?: boolean;
  isStreaming?: boolean;
  /** Sends a starter question from the empty state. Omitted ⇒ no starters shown. */
  onAsk?: (question: string) => void;
}

/**
 * Questions any scored property can answer from its own report. Deliberately
 * generic: the list is rendered before Lens has said anything, so it must not
 * imply a finding (a court case, a price gap) that this property may not have.
 */
const STARTER_QUESTIONS = [
  "What does this property's CRUX Grade mean?",
  "Are there any court cases linked to this property?",
  "Is the asking price in line with the record?",
];

/** How close to the bottom still counts as "reading the latest". */
const NEAR_BOTTOM_PX = 96;

/** The tool card lines up with the message text, not the avatar gutter. */
const TOOL_INDENT = "pl-[46px] pr-4 sm:pl-[70px] sm:pr-6";

export function MessageList({ messages, activeMessage, isLoading, isStreaming, onAsk }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  /**
   * Whether to follow new output. The old effect scrolled on every change of
   * `activeMessage`, which changes on every streamed token — so a reader trying to
   * look back over a long answer was dragged to the bottom several times a second
   * and physically could not read it. Stick only while they are already at the
   * bottom; the moment they scroll away, stop following until they come back.
   */
  const stickToBottomRef = useRef(true);
  const seenCountRef = useRef(0);
  const [showJump, setShowJump] = useState(false);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const near = el.scrollHeight - el.scrollTop - el.clientHeight <= NEAR_BOTTOM_PX;
    stickToBottomRef.current = near;
    setShowJump(!near);
  }, []);

  const jumpToLatest = useCallback(() => {
    stickToBottomRef.current = true;
    setShowJump(false);
    bottomRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }, []);

  useEffect(() => {
    // Sending your own message is an explicit request to see the bottom again.
    const newest = messages[messages.length - 1];
    if (messages.length > seenCountRef.current && newest?.role === "user") {
      stickToBottomRef.current = true;
    }
    seenCountRef.current = messages.length;

    if (!stickToBottomRef.current) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Never animate token-by-token: a smooth scroll restarted on every delta never
    // arrives, and the text shears while it is being read.
    bottomRef.current?.scrollIntoView({ behavior: reduceMotion || isStreaming ? "auto" : "smooth" });
  }, [messages, activeMessage, isStreaming]);

  if (messages.length === 0 && !isLoading && !isStreaming) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-4 py-10 sm:px-6">
        <div className="w-full max-w-[520px] text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-crux-bg-accent">
            <MessageSquare size={20} className="text-crux-green" />
          </div>
          <h2 className="text-[17px] font-semibold text-crux-text-primary">Ask Lens about this property</h2>
          <p className="mx-auto mt-1 max-w-[380px] text-[14px] text-crux-text-secondary">
            Lens answers from this property&apos;s CRUX report and the records behind it.
          </p>

          {onAsk && (
            <div className="mt-6 flex flex-col gap-2">
              {STARTER_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => onAsk(q)}
                  className="rounded-xl border border-crux-border bg-white px-4 py-3 text-left text-[14px] text-crux-text-primary transition-colors hover:border-crux-green/40 hover:bg-crux-bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 motion-reduce:transition-none"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show the working state while nothing has been rendered yet — either before the
  // first token, or after a stream that delivered none.
  const showThinking = (isStreaming || isLoading) && (!activeMessage || !activeMessage.content.trim());

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-[768px] flex-col gap-6 py-6">
          {messages.map((msg, index) => {
            if (!msg) return null;
            return (
              <div key={msg.id || index}>
                {msg.role === "user" ? (
                  <UserMessage content={msg.content} />
                ) : msg.role === "assistant" ? (
                  <>
                    <AIMessage content={msg.content} />
                    {msg.toolResults?.map((tr, i) => (
                      <div key={i} className={TOOL_INDENT}>
                        <ToolResultCard result={tr} />
                      </div>
                    ))}
                  </>
                ) : null}
              </div>
            );
          })}

          {/* The answer currently streaming. Not copyable until it is complete. */}
          {activeMessage && (
            <div key={activeMessage.id}>
              <AIMessage content={activeMessage.content} canCopy={!isStreaming} />
              {activeMessage.toolResults?.map((tr, i) => (
                <div key={i} className={TOOL_INDENT}>
                  <ToolResultCard result={tr} />
                </div>
              ))}
            </div>
          )}

          {showThinking && <ThinkingIndicator />}

          <div ref={bottomRef} />
        </div>
      </div>

      {showJump && (
        <button
          type="button"
          onClick={jumpToLatest}
          className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-crux-border bg-white px-3 py-1.5 text-[12px] font-medium text-crux-text-secondary shadow-[0_4px_16px_rgb(0,0,0,0.08)] transition-colors hover:text-crux-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 motion-reduce:transition-none"
        >
          <ArrowDown size={13} />
          Jump to latest
        </button>
      )}
    </div>
  );
}
