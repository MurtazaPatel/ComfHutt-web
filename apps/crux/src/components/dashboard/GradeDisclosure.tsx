"use client";

// Founder-approved "What CRUX checks / doesn't check yet" disclosure (D77), shown under every grade.
// Copy comes from the backend (GET /crux/disclosure) so it moves with the CGM spec (D60). If the fetch
// fails the component renders nothing: it must never block the grade.

import { useEffect, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { formatDate } from "@/lib/format";
import { Surface } from "@/components/dashboard/ui/Surface";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
const SEEN_KEY = "crux:grade-disclosure-seen";

interface Item { title: string; body: string }
interface Disclosure { checks: Item[]; notChecked: Item[]; sourceTemplate: string }

/** Minimal inline renderer for the **bold** and *italic* spans the approved copy uses. */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean).map((part, i) => {
    if (part.startsWith("**")) return <strong key={i} className="font-semibold text-crux-text-primary">{part.slice(2, -2)}</strong>;
    if (part.startsWith("*")) return <em key={i}>{part.slice(1, -1)}</em>;
    return part;
  });
}

function List({ heading, items }: { heading: string; items: Item[] }) {
  return (
    <div>
      <h4 className="text-[13px] font-semibold text-crux-text-primary">{heading}</h4>
      <ul className="mt-2 space-y-2">
        {items.map((it) => (
          <li key={it.title} className="text-[13px] leading-relaxed text-crux-text-secondary">
            <strong className="font-semibold text-crux-text-primary">{it.title}</strong> {inline(it.body)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function GradeDisclosure({ confidence, asOf }: { confidence: number; asOf: string | null | undefined }) {
  const [data, setData] = useState<Disclosure | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/crux/disclosure`)
      .then((r) => (r.ok ? r.json() : null))
      .then((b) => {
        if (cancelled || !b?.success || !Array.isArray(b.checks) || !Array.isArray(b.notChecked)) return;
        setData({ checks: b.checks, notChecked: b.notChecked, sourceTemplate: String(b.sourceTemplate ?? "") });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!data) return;
    try {
      if (!window.localStorage.getItem(SEEN_KEY)) {
        setOpen(true); // first grade this visitor sees
        window.localStorage.setItem(SEEN_KEY, "1");
      }
    } catch {
      /* storage unavailable: stay collapsed */
    }
  }, [data]);

  if (!data) return null;

  const date = asOf ? formatDate(asOf) : "";
  const source = data.sourceTemplate
    .replace("{date of the data}", date || "the latest filing")
    .replace("{x}", `${Math.round(confidence * 100)}%`);

  return (
    <Surface as="section">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="grade-disclosure-panel"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-3 rounded-lg text-left text-[15px] font-semibold text-crux-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2"
        >
          What CRUX checks
          <ChevronDown className={`size-4 shrink-0 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
      </h3>
      <div id="grade-disclosure-panel" hidden={!open} className="mt-4 space-y-5">
        <List heading="What this grade checks" items={data.checks} />
        <List heading="What this grade does not check yet" items={data.notChecked} />
        <p className="text-[12px] leading-relaxed text-crux-text-muted">{source}</p>
      </div>
    </Surface>
  );
}
