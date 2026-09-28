/**
 * Company and contact facts used across the legal pages.
 *
 * Everything the legal pages need that is not live data lives here, so a
 * non-developer can correct it without touching JSX, and so there is exactly one
 * place to check before publishing.
 *
 * Two values are `null` because they are facts about the company that cannot be
 * derived from this codebase: the Corporate Identity Number and the registered
 * office address as recorded on the MCA register. They must be filled in from the
 * certificate of incorporation. `scripts/legal-token-guard.mjs` fails the build
 * while either is null, because publishing a Terms of Use that names no company
 * and a Privacy Policy that gives a data subject nowhere to write is worse than
 * publishing nothing — the Terms are what stand behind every adverse grade.
 */

export interface LegalFacts {
  companyName: string;
  /** Corporate Identity Number from the certificate of incorporation. */
  cin: string | null;
  /** Full registered office address as on the MCA record. */
  registeredAddress: string | null;
  grievanceOfficerName: string;
  grievanceEmail: string;
  supportEmail: string;
  /** The date these pages were published, ISO. */
  effectiveDate: string;
  effectiveDateLabel: string;
  /** Courts named in the governing-law clause. */
  jurisdiction: string;
}

export const LEGAL: LegalFacts = {
  companyName: "ComfHutt Technologies Private Limited",

  // ── Fill these in before publishing ────────────────────────────────────────
  // Both come off the certificate of incorporation / MCA record. The build guard
  // fails while they are null.
  cin: null,
  registeredAddress: null,
  // ───────────────────────────────────────────────────────────────────────────

  grievanceOfficerName: "Murtaza Patel",
  // The grievance mailbox must exist and be monitored before these pages ship:
  // the Privacy Policy commits to answering a data-subject request sent here
  // within 90 days, and the Terms commit to acknowledging a complaint in 48 hours.
  grievanceEmail: "grievance@comfhutt.com",
  // Live — already used by the main ComfHutt site.
  supportEmail: "support@comfhutt.com",

  effectiveDate: "2026-09-27",
  effectiveDateLabel: "27 September 2026",

  jurisdiction: "Rajkot, Gujarat",
};

/** True when every fact needed to publish is present. */
export function legalFactsComplete(facts: LegalFacts = LEGAL): boolean {
  return Boolean(facts.cin && facts.registeredAddress);
}

/**
 * The company line that appears at the foot of each legal page.
 *
 * Renders an explicit, visible placeholder rather than silently omitting a
 * missing fact — an incomplete legal page should look incomplete.
 */
export function companyLine(facts: LegalFacts = LEGAL): string {
  const parts = [
    facts.companyName,
    facts.cin ? `CIN ${facts.cin}` : "CIN [to be completed before publication]",
    facts.registeredAddress ?? "[registered address to be completed before publication]",
    facts.supportEmail,
  ];
  return parts.join(" · ");
}
