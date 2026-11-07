/**
 * D59 fact-sheet page data. `GET /crux/fact-sheets/:entityId` on the backend is gated (flag or
 * preview token) and answers 404 for everything else — so a 404 here means "no page", never an error.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
const SITE_URL = "https://crux.comfhutt.com";

export interface FactSheet {
  entity_id: number;
  text: string;
  as_of: string | null;
  project_name: string | null;
  reg_no: string | null;
  /** null when the project has no CRUX score; then nothing about grades is shown. */
  grade: string | null;
  property_id?: string | null;
  score_composite?: number | null;
}

export async function fetchFactSheet(entityId: string, preview?: string): Promise<FactSheet | null> {
  if (!/^[1-9]\d{0,12}$/.test(entityId)) return null;
  const qs = preview ? `?preview=${encodeURIComponent(preview)}` : "";
  try {
    const res = await fetch(`${API_URL}/crux/fact-sheets/${entityId}${qs}`, { cache: "no-store" });
    if (!res.ok) return null;
    const body = (await res.json()) as { success?: boolean; data?: FactSheet };
    return body.success && body.data?.text ? body.data : null;
  } catch {
    return null;
  }
}

/** Splits the stored text into paragraphs and the trailing "Source: …" line, kept verbatim. */
export function splitSheet(text: string): { paragraphs: string[]; source: string | null } {
  const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const last = lines[lines.length - 1];
  const source = last && /^Source:/i.test(last) ? last : null;
  return { paragraphs: source ? lines.slice(0, -1) : lines, source };
}

/** The page URL carried in the error report; never includes the preview token. */
export function factSheetUrl(entityId: number | string): string {
  return `${SITE_URL}/projects/${entityId}/facts`;
}

export function reportErrorHref(sheet: Pick<FactSheet, "entity_id" | "project_name" | "reg_no">): string {
  const subject = `Fact sheet error: ${sheet.project_name ?? `Project ${sheet.entity_id}`} (${sheet.reg_no ?? "no reg no"})`;
  const body = `Page: ${factSheetUrl(sheet.entity_id)}`;
  return `mailto:murtaza@comfhutt.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
