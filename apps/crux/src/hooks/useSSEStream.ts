"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

export interface SSEDelta {
  delta?: string;
  done?: boolean;
  module_result?: {
    type: "score" | "report" | "research" | "verification" | "cast" | "yield";
    data: Record<string, unknown>;
  };
  error?: string;
}

export function useSSEStream() {
  const { getToken } = useAuth();
  const [chunks, setChunks] = useState<SSEDelta[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const start = useCallback(
    async (url: string, body: Record<string, unknown>) => {
      setIsStreaming(true);
      setError(null);
      setChunks([]);

      // A second start while one is still in flight used to orphan the first: its
      // reader loop went on appending to the `chunks` array this call had just
      // cleared, interleaving two answers. One stream at a time.
      abortRef.current?.abort();

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const token = await getToken();
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

        const response = await fetch(`${apiUrl}${url}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "text/event-stream",
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        if (!response.ok) {
          let errMsg = `SSE error ${response.status}`;
          try {
            const errBody = await response.json();
            errMsg = errBody.error?.message || errMsg;
          } catch {}
          throw new Error(errMsg);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          const newChunks: SSEDelta[] = [];

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith(":")) continue;

            if (trimmed.startsWith("data: ")) {
              // Do NOT .trim() the payload. Deltas are raw model tokens and a token
              // that is only whitespace (" ", "\n") is meaningful — trimming it away
              // runs words together in the rendered answer.
              const data = trimmed.slice(6);
              if (data.trim() === "[DONE]") {
                newChunks.push({ done: true });
                continue;
              }
              try {
                const parsed = JSON.parse(data) as SSEDelta;
                newChunks.push(parsed);
              } catch {
                // Unparseable frame: keep it as a literal token, but never push an
                // empty one — an empty delta is falsy downstream and just churns
                // renders for nothing.
                if (data.length > 0) newChunks.push({ delta: data });
              }
            } else if (trimmed.startsWith("event: ")) {
              // Event type line — handled by the SSE parser
              continue;
            } else if (trimmed.startsWith("id: ")) {
              // ID line — skip
              continue;
            }
          }

          if (newChunks.length > 0) {
            setChunks((prev) => [...prev, ...newChunks]);
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Stream connection failed");
      } finally {
        setIsStreaming(false);
      }
    },
    [getToken]
  );

  const abort = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
  }, []);

  const reset = useCallback(() => {
    abort();
    setChunks([]);
    setError(null);
  }, [abort]);

  /**
   * Nothing cancelled the request when the chat unmounted. Leaving the Lens page
   * mid-answer left the POST open — the server kept generating and the reader loop
   * kept calling setState on a component that no longer existed. Unmount only: the
   * controller is read from the ref at teardown, so this can never abort a stream
   * belonging to a live conversation.
   */
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      abortRef.current = null;
    };
  }, []);

  return { chunks, isStreaming, error, start, abort, reset };
}
