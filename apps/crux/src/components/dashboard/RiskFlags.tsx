"use client";

import { FindingsList } from "./FindingsList";

/**
 * The report's adverse findings about this property, rendered verbatim.
 *
 * This component used to render three hardcoded sentences — a RERA expiry, a
 * neighbouring litigation, a micro-market vacancy rate — for every property, on a
 * product that names real builders. None of them was a finding about anything.
 *
 * The real source is `risk_flags` on `GET /crux/report/:property_id`: up to five
 * plain strings written by the report agent, with **no severity field**. There is
 * therefore no severity marker here; the old `▲` triangle graded each line as
 * high/medium/low from data that does not exist.
 *
 * An empty array is a genuine, publishable result on this product, so it is stated
 * rather than hidden.
 */
export function RiskFlags({
  flags,
  emptyLabel = "No risk flags recorded for this property.",
}: {
  flags: readonly string[] | null | undefined;
  emptyLabel?: string;
}) {
  return <FindingsList items={flags} tone="risk" emptyLabel={emptyLabel} />;
}
