"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useApiFetch } from "@/lib/api";
import { useSSEStream } from "./useSSEStream";
import { useAuth } from "@clerk/nextjs";

export interface LensMessage {
  id: string;
  role: "user" | "assistant" | "tool";
  content: string;
  toolResults?: LensModuleResult[];
  timestamp: string;
}

export interface LensModuleResult {
  type: "score" | "report" | "research" | "verification" | "cast" | "yield";
  data: Record<string, unknown>;
}

interface SessionResponse {
  success: boolean;
  data?: {
    session_id: string;
    property_id: string;
    expires_at: string;
    created_at: string;
  };
}

interface SseChunk {
  delta?: string;
  done?: boolean;
  module_result?: LensModuleResult;
  error?: string;
}

const SESSION_TTL_MS = 2 * 60 * 60 * 1000;
const MAX_MESSAGES = 30;

export function useLensSession(propertyId: string) {
  const { chunks, isStreaming, error: streamError, start: startStream, abort: abortStream, reset: resetStream } = useSSEStream();
  const apiFetch = useApiFetch();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<LensMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isLoaded } = useAuth();
  const sessionRef = useRef<{ id: string; createdAt: number } | null>(null);
  const [activeMessage, setActiveMessage] = useState<LensMessage | null>(null);
  const currentAssistantRef = useRef<LensMessage | null>(null);

  // Sync ref to state for UI updates
  const syncActiveMessage = () => {
    setActiveMessage(currentAssistantRef.current ? { ...currentAssistantRef.current } : null);
  };

  const createNewSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    resetStream();
    currentAssistantRef.current = null;
    syncActiveMessage();
    try {
      const data = await apiFetch<SessionResponse>("/crux/lens/session", {
        method: "POST",
        body: JSON.stringify({ property_id: propertyId }),
      });
      if (data.success && data.data) {
        setSessionId(data.data.session_id);
        sessionRef.current = { id: data.data.session_id, createdAt: Date.now() };
      }
      setMessages([]);
    } catch (err) {
      setSessionId(null);
      setMessages([]);
      setError(err instanceof Error ? err.message : "Failed to create research session");
    } finally {
      setIsLoading(false);
    }
  }, [propertyId, resetStream]);

  useEffect(() => {
    // Reset session when propertyId changes
    setSessionId(null);
    setMessages([]);
    setError(null);
    currentAssistantRef.current = null;
    syncActiveMessage();
    resetStream();
  }, [propertyId, resetStream]);

  // Auto-expire
  useEffect(() => {
    if (!sessionRef.current) return;
    const interval = setInterval(() => {
      if (Date.now() - sessionRef.current!.createdAt > SESSION_TTL_MS) {
        createNewSession();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [sessionId, createNewSession]);

  const processedChunksRef = useRef(0);

  // Process SSE chunks into messages
  useEffect(() => {
    if (chunks.length === 0) {
      processedChunksRef.current = 0;
      return;
    }

    let hasUpdates = false;

    for (let i = processedChunksRef.current; i < chunks.length; i++) {
      const chunk = chunks[i];
      const sseChunk = chunk as unknown as SseChunk;
      hasUpdates = true;

      if (sseChunk.error) {
        setError(sseChunk.error);
        continue;
      }

      if (sseChunk.done) {
        if (currentAssistantRef.current && currentAssistantRef.current.content.trim()) {
          const finalMsg = currentAssistantRef.current;
          setMessages((prev) => [...prev, finalMsg].slice(-MAX_MESSAGES));
        }
        currentAssistantRef.current = null;
        continue;
      }

      if (sseChunk.delta) {
        if (!currentAssistantRef.current) {
          currentAssistantRef.current = {
            id: `msg-${Date.now()}`,
            role: "assistant",
            content: "",
            timestamp: new Date().toISOString(),
          };
        }
        currentAssistantRef.current.content += sseChunk.delta;
      }

      if (sseChunk.module_result) {
        if (!currentAssistantRef.current) {
          currentAssistantRef.current = {
            id: `msg-${Date.now()}`,
            role: "assistant",
            content: "",
            timestamp: new Date().toISOString(),
          };
        }
        if (!currentAssistantRef.current.toolResults) {
          currentAssistantRef.current.toolResults = [];
        }
        currentAssistantRef.current.toolResults.push(sseChunk.module_result);
      }
    }
    
    processedChunksRef.current = chunks.length;

    if (hasUpdates) {
      syncActiveMessage();
    }
  }, [chunks]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (isStreaming) return;

      let activeSessionId = sessionId;

      // Lazy session creation on first message
      if (!activeSessionId) {
        setIsLoading(true);
        setError(null);
        try {
          const data = await apiFetch<SessionResponse>("/crux/lens/session", {
            method: "POST",
            body: JSON.stringify({ property_id: propertyId }),
          });
          if (data.success && data.data) {
            activeSessionId = data.data.session_id;
            setSessionId(activeSessionId);
            sessionRef.current = { id: activeSessionId, createdAt: Date.now() };
          } else {
            throw new Error("Failed to create session");
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to create research session");
          setIsLoading(false);
          return;
        }
        setIsLoading(false);
      }

      const userMsg: LensMessage = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg].slice(-MAX_MESSAGES));
      setError(null);
      currentAssistantRef.current = null;
      syncActiveMessage();

      try {
        await startStream(`/crux/lens/${activeSessionId}/message`, {
          message: text,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send message");
      }
    },
    [sessionId, isStreaming, startStream, propertyId, apiFetch]
  );

  return {
    sessionId,
    isLoading,
    error: error || streamError,
    messages,
    activeMessage,
    sendMessage,
    isStreaming,
    abort: abortStream,
    createNewSession,
  };
}
