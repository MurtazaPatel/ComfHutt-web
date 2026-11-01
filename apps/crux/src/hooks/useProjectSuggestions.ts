"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

export interface ProjectSuggestion {
  entity_id: number;
  project_name: string;
  reg_no: string | null;
  promoter_name: string | null;
  locality: string | null;
  district: string | null;
  lat: number | null;
  lng: number | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
const DEBOUNCE_MS = 250;
const MIN_CHARS = 2;

/**
 * RERA project autocomplete for a free-text search box.
 *
 * Debounced, aborts stale requests, and fails silent: an error or an empty
 * list simply shows nothing. `markPicked(name)` stops the box from re-opening
 * for the text a pick just wrote into the input.
 */
export function useProjectSuggestions(query: string) {
  const [items, setItems] = useState<ProjectSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const pickedRef = useRef<string | null>(null);
  const listId = useId();

  useEffect(() => {
    const q = query.trim();
    if (q.length < MIN_CHARS || q === pickedRef.current) {
      setItems([]);
      setOpen(false);
      setActiveIndex(-1);
      return;
    }
    pickedRef.current = null;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `${API_URL}/crux/projects/search?q=${encodeURIComponent(q)}&mode=suggest`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error(String(res.status));
        const body = (await res.json()) as { success?: boolean; data?: ProjectSuggestion[] };
        const rows = body.success && Array.isArray(body.data) ? body.data.slice(0, 8) : [];
        setItems(rows);
        setOpen(rows.length > 0);
        setActiveIndex(-1);
      } catch {
        if (controller.signal.aborted) return;
        setItems([]);
        setOpen(false);
      }
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const close = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  const markPicked = useCallback((name: string) => {
    pickedRef.current = name.trim();
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  /** Returns true when the key was consumed (caller should not submit). */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, onPick: (s: ProjectSuggestion) => void): boolean => {
      if (!open || items.length === 0) return false;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % items.length);
        return true;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i <= 0 ? items.length - 1 : i - 1));
        return true;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return true;
      }
      if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        onPick(items[activeIndex]);
        return true;
      }
      return false;
    },
    [open, items, activeIndex, close],
  );

  const optionId = (i: number) => `${listId}-opt-${i}`;

  /** ARIA props for the input element. */
  const comboboxProps = {
    role: "combobox" as const,
    "aria-autocomplete": "list" as const,
    "aria-expanded": open,
    "aria-controls": listId,
    "aria-activedescendant": open && activeIndex >= 0 ? optionId(activeIndex) : undefined,
    autoComplete: "off",
  };

  return { items, open, activeIndex, setActiveIndex, listId, optionId, comboboxProps, handleKeyDown, close, markPicked };
}
