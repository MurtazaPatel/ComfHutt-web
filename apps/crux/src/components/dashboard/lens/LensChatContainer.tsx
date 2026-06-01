"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useLensSession } from "@/hooks/useLensSession";
import { MessageList } from "./MessageList";
import { PromptInputBar } from "./PromptInputBar";
import { Loader2 } from "lucide-react";

interface LensChatContainerProps {
  propertyId: string;
  propertyName?: string;
}

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
    sessionId,
  } = useLensSession(propertyId);

  const searchParams = useSearchParams();
  const initialMessageSent = useRef(false);

  useEffect(() => {
    if (!initialMessageSent.current) {
      const initialMsg = searchParams.get("initialMessage");
      if (initialMsg) {
        initialMessageSent.current = true;
        sendMessage(initialMsg);
        
        // Remove from URL so refresh doesn't trigger it again
        const url = new URL(window.location.href);
        url.searchParams.delete("initialMessage");
        window.history.replaceState({}, '', url);
      }
    }
  }, [searchParams, sendMessage]);

  if (isLoading && !messages.length) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center flex-1">
          <Loader2 className="w-6 h-6 animate-spin text-crux-green" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh)]">
      {/* Top bar */}
      <div
        className="flex items-center justify-between flex-shrink-0 px-5 py-3 border-b border-[#e5e5e5] bg-white/80 backdrop-blur-sm sticky top-0 z-10"
      >
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[14px] text-[#6e6e6e] hover:text-crux-text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <span
          className="text-[14px] font-medium text-[#0d0d0d] truncate max-w-[200px]"
          style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
        >
          {propertyName || "Property"}
        </span>

        <button
          type="button"
          onClick={createNewSession}
          className="flex items-center gap-1.5 text-[12px] text-[#6e6e6e] hover:text-crux-text-primary transition-colors px-3 py-1.5 border border-[#e5e5e5] rounded-xl"
        >
          <RefreshCw size={12} />
          New Session
        </button>
      </div>

      {/* Messages */}
      <MessageList messages={messages} activeMessage={activeMessage} isLoading={isLoading} isStreaming={isStreaming} />

      {/* Input */}
      <PromptInputBar
        onSend={sendMessage}
        onStop={abort}
        isLoading={isStreaming}
        error={error}
      />
    </div>
  );
}
