"use client";

import { useEffect, useRef } from "react";
import type { LensMessage } from "@/hooks/useLensSession";
import { AIMessage } from "./AIMessage";
import { UserMessage } from "./UserMessage";
import { ToolResultCard } from "./ToolResultCard";

interface MessageListProps {
  messages: LensMessage[];
  activeMessage?: LensMessage | null;
  isLoading?: boolean;
  isStreaming?: boolean;
}

export function MessageList({ messages, activeMessage, isLoading, isStreaming }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeMessage, isStreaming]);

  if (messages.length === 0 && !isLoading && !isStreaming) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p
          className="text-[15px] text-crux-text-muted"
          style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
        >
          Ask anything about this property to get started.
        </p>
      </div>
    );
  }

  // Determine if we should show the "Thinking..." UI
  // We show it if we are streaming/loading and there is NO active content yet,
  // OR just to show the initial spark of AI thinking
  const showThinking = (isStreaming || isLoading) && (!activeMessage || !activeMessage.content.trim());

  return (
    <div
      className="flex flex-col py-6 gap-6 max-w-[768px] mx-auto w-full flex-1 overflow-y-auto"
      style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
    >
      {messages.map((msg) => (
        <div key={msg.id}>
          {msg.role === "user" ? (
            <UserMessage content={msg.content} />
          ) : msg.role === "assistant" ? (
            <>
              <AIMessage content={msg.content} />
              {msg.toolResults?.map((tr, i) => (
                <div key={i} className="pl-[46px]">
                  <ToolResultCard result={tr} />
                </div>
              ))}
            </>
          ) : null}
        </div>
      ))}

      {/* Render active streaming message if available */}
      {activeMessage && (
        <div key={activeMessage.id}>
          <AIMessage content={activeMessage.content} />
          {activeMessage.toolResults?.map((tr, i) => (
            <div key={i} className="pl-[46px]">
              <ToolResultCard result={tr} />
            </div>
          ))}
        </div>
      )}

      {/* Thinking UI */}
      {showThinking && (
        <div className="flex items-start gap-4">
          <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center flex-shrink-0 bg-crux-green-tint">
            <span className="text-[14px] text-crux-green">✦</span>
          </div>
          <div className="flex flex-col mt-1">
            <div className="relative overflow-hidden inline-block">
              <span className="text-[15px] font-medium text-crux-text-primary animate-pulse bg-gradient-to-r from-gray-900 via-gray-500 to-gray-900 bg-clip-text text-transparent">
                Thinking...
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" style={{ backgroundSize: "200% 100%" }} />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
