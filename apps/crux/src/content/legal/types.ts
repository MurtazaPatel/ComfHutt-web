/**
 * The shape of a CRUX legal page.
 *
 * The four legal pages are data, not JSX. The text lives in
 * `src/content/legal/*.ts` and is rendered by a single component
 * (`src/components/legal/LegalDocument.tsx`), so the wording can be corrected —
 * by counsel, or by whoever is holding the pen that week — without touching a
 * component, and so a diff on a legal page shows the words that changed and
 * nothing else.
 *
 * The block set is deliberately small. It covers exactly what the four documents
 * contain: paragraphs, bulleted and numbered lists, one table, and a callout for
 * the two or three paragraphs that carry the whole page's weight. Anything a
 * document needs that is not here should be added here, typed, rather than
 * smuggled in as markup.
 */

/** A run of text. `link` is the only node that is interactive. */
export type Inline =
  | { readonly kind: "text"; readonly text: string }
  | { readonly kind: "strong"; readonly text: string }
  | { readonly kind: "em"; readonly text: string }
  | { readonly kind: "link"; readonly text: string; readonly href: string };

/** A sequence of inline runs — one paragraph, one list item, or one table cell. */
export type Rich = readonly Inline[];

export type LegalBlock =
  | { readonly kind: "paragraph"; readonly content: Rich }
  /** A paragraph that is set apart. Used for the sentences that, if a reader
   *  reads one thing on the page, should be the one thing. */
  | { readonly kind: "callout"; readonly content: Rich }
  | { readonly kind: "list"; readonly ordered: boolean; readonly items: readonly Rich[] }
  | {
      readonly kind: "table";
      readonly caption: string;
      readonly columns: readonly string[];
      readonly rows: readonly (readonly Rich[])[];
    };

export interface LegalSection {
  /** Slug used as the heading anchor, so a clause can be linked to directly. */
  readonly id: string;
  readonly heading: string;
  readonly blocks: readonly LegalBlock[];
}

export interface LegalDoc {
  readonly title: string;
  /** Rendered after "Last updated:". A label, not an ISO date. */
  readonly lastUpdated: string;
  /** Short line for the page description / social card. */
  readonly summary: string;
  /** Text that precedes the first numbered clause. */
  readonly intro?: readonly LegalBlock[];
  readonly sections: readonly LegalSection[];
}

// ── Authoring helpers ───────────────────────────────────────────────────────
// A bare string is the common case, so every helper takes strings or inline
// nodes interchangeably: para("Plain text."), or
// para("Text with ", strong("emphasis"), ".").

type Part = string | Inline;

const toInline = (part: Part): Inline =>
  typeof part === "string" ? { kind: "text", text: part } : part;

/** One run of mixed text — a paragraph, a list item, or a table cell. */
export function rich(...parts: Part[]): Rich {
  return parts.map(toInline);
}

export const strong = (text: string): Inline => ({ kind: "strong", text });
export const em = (text: string): Inline => ({ kind: "em", text });
export const link = (text: string, href: string): Inline => ({ kind: "link", text, href });

export const para = (...parts: Part[]): LegalBlock => ({
  kind: "paragraph",
  content: rich(...parts),
});

export const callout = (...parts: Part[]): LegalBlock => ({
  kind: "callout",
  content: rich(...parts),
});

export const bullets = (...items: Rich[]): LegalBlock => ({
  kind: "list",
  ordered: false,
  items,
});

export const steps = (...items: Rich[]): LegalBlock => ({
  kind: "list",
  ordered: true,
  items,
});

export const table = (
  caption: string,
  columns: readonly string[],
  rows: readonly (readonly Rich[])[],
): LegalBlock => ({ kind: "table", caption, columns, rows });
