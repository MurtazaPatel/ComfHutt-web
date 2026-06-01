"use client";

import { useEffect, useRef } from "react";
import type { LensMessage } from "@/hooks/useLensSession";
import { AIMessage } from "./AIMessage";
import { UserMessage } from "./UserMessage";
import { ToolResultCard } from "./ToolResultCard";

interface MessageListProps {
  messages: LensMessage[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0 && !isLoading) {
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
      <div ref={bottomRef} />
    </div>
  );
}
