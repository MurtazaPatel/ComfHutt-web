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

interface HistoryResponse {
  success: boolean;
  data?: {
    session_id: string;
    messages: Array<{ role: "user" | "assistant"; content: string; created_at: string }>;
    count: number;
  };
}

const SESSION_TTL_MS = 2 * 60 * 60 * 1000;
const MAX_MESSAGES = 30;

/**
 * Session id survives a reload. Without this, remounting the page always minted a
 * fresh session, so an answer already saved against the previous session became
 * unreachable from the UI — the "Lens didn't display the message" report. Scoped
 * per property, sessionStorage (not local) so it dies with the tab, and always
 * revalidated against the server, which returns 410 once the 2h TTL lapses.
 */
const storageKey = (propertyId: string) => `crux_lens_session_${propertyId}`;

function readStoredSession(propertyId: string): string | null {
  try {
    return sessionStorage.getItem(storageKey(propertyId));
  } catch {
    return null; // private mode / storage disabled — degrade to a fresh session
  }
}

function writeStoredSession(propertyId: string, sessionId: string | null) {
  try {
    if (sessionId) sessionStorage.setItem(storageKey(propertyId), sessionId);
    else sessionStorage.removeItem(storageKey(propertyId));
  } catch {
    /* non-fatal — the chat still works, it just won't survive a reload */
  }
}

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

  /**
   * Pull the persisted transcript for a session and render it.
   *
   * This is the recovery path that did not exist. GET /crux/lens/:id/history has
   * always been implemented server-side and had ZERO callers, so the reply was
   * written to the database and then never shown: if the SSE stream dropped (an
   * idle proxy closing a long Lens call), or the tab reloaded, the answer was
   * simply gone from the user's point of view.
   *
   * Returns true if it rendered anything, so callers can tell "recovered" from
   * "genuinely nothing there".
   */
  const loadHistory = useCallback(async (id: string): Promise<boolean> => {
    try {
      const resp = await apiFetch<HistoryResponse>(`/crux/lens/${id}/history`);
      const rows = resp.data?.messages ?? [];
      const restored: LensMessage[] = rows
        // Drop blank assistant placeholders; a failed reply must not render as an
        // empty bubble. The server now deletes these, but old rows may remain.
        .filter((m) => m.role === "user" || m.content.trim().length > 0)
        .map((m, i) => ({
          id: `hist-${id}-${i}`,
          role: m.role,
          content: m.content,
          timestamp: m.created_at,
        }));

      if (restored.length === 0) return false;
      setMessages(restored.slice(-MAX_MESSAGES));
      return true;
    } catch {
      // 410 SESSION_EXPIRED / 404 are normal, not errors worth showing the user.
      return false;
    }
  }, [apiFetch]);

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
        writeStoredSession(propertyId, data.data.session_id);
      }
      setMessages([]);
    } catch (err) {
      setSessionId(null);
      setMessages([]);
      writeStoredSession(propertyId, null);
      setError(err instanceof Error ? err.message : "Failed to create research session");
    } finally {
      setIsLoading(false);
    }
  }, [propertyId, resetStream, apiFetch]);

  useEffect(() => {
    // Reset in-memory state when the property changes, then try to RESTORE that
    // property's existing session and its saved transcript. Previously this only
    // reset — so every mount showed an empty chat regardless of what was stored.
    let cancelled = false;

    setSessionId(null);
    setMessages([]);
    setError(null);
    currentAssistantRef.current = null;
    syncActiveMessage();
    resetStream();

    const stored = readStoredSession(propertyId);
    if (!stored) return;
    // Wait for Clerk. Calling history before the token exists returns 401, which
    // loadHistory reports as "nothing there" — and we would then throw away a
    // perfectly good session id over a transient auth race.
    if (!isLoaded) return;

    (async () => {
      const recovered = await loadHistory(stored);
      if (cancelled) return;
      if (recovered) {
        // Server still recognises the session (history would have thrown otherwise).
        setSessionId(stored);
        sessionRef.current = { id: stored, createdAt: Date.now() };
      } else {
        // Expired, empty, or gone — forget it and let the next message open a new one.
        writeStoredSession(propertyId, null);
      }
    })();

    return () => { cancelled = true; };
  }, [propertyId, resetStream, loadHistory, isLoaded]);

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
  // Set when a stream finishes without having rendered any assistant text, so the
  // recovery effect below knows to go and fetch what was actually saved.
  const streamEndedEmptyRef = useRef(false);

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
        // An error frame also carries done:true, and this `continue` skips the
        // done branch below — so mark for recovery here too. The server persists
        // whatever text arrived before the failure, and a partial answer the user
        // already saw must not vanish just because the stream ended badly.
        if (!currentAssistantRef.current?.content.trim()) {
          streamEndedEmptyRef.current = true;
        }
        continue;
      }

      if (sseChunk.done) {
        if (currentAssistantRef.current && currentAssistantRef.current.content.trim()) {
          const finalMsg = currentAssistantRef.current;
          setMessages((prev) => [...prev, finalMsg].slice(-MAX_MESSAGES));
        } else {
          // The stream ended having delivered no text. The server may still have
          // persisted a complete answer — that is exactly the failure that made a
          // real reply invisible for 8.5 minutes in prod. Ask the database instead
          // of silently showing nothing.
          streamEndedEmptyRef.current = true;
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

  /**
   * Recovery: when a stream stops without having shown anything, reconcile against
   * the persisted transcript.
   *
   * A Lens reply can legitimately run for minutes, and an idle proxy can close the
   * connection while the server keeps working and saves a perfectly good answer.
   * Before this, that answer was written to crux_lens_messages and never rendered —
   * the user saw a dead chat and retyped the question. Now the client asks the
   * server what it actually has.
   */
  useEffect(() => {
    if (isStreaming) return;
    if (!streamEndedEmptyRef.current) return;
    if (!sessionId) return;

    streamEndedEmptyRef.current = false;
    let cancelled = false;

    (async () => {
      const recovered = await loadHistory(sessionId);
      if (!cancelled && !recovered) {
        setError((prev) => prev ?? "Lens didn't return an answer. Please try again.");
      }
    })();

    return () => { cancelled = true; };
  }, [isStreaming, sessionId, loadHistory]);

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
            writeStoredSession(propertyId, activeSessionId);
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
