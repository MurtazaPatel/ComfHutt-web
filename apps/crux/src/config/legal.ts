/**
 * Company and contact facts used across the legal pages.
 *
 * Everything the legal pages need that is not live data lives here, so a
 * non-developer can correct it without touching JSX, and so there is exactly one
 * place to check before publishing.
 *
 * The Corporate Identity Number and the registered office address cannot be
 * derived from this codebase — they come off the certificate of incorporation —
 * so they are supplied here by hand. `scripts/legal-token-guard.mjs` refuses to
 * let either go back to null, because publishing a Terms of Use that names no
 * company and a Privacy Policy that gives a data subject nowhere to write is
 * worse than publishing nothing: the Terms are what stand behind every adverse
 * grade. Run `pnpm legal:check` before publishing a change to this file.
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

  // Both off the certificate of incorporation / MCA record. Supplied 28 September
  // 2026. If either is ever corrected, correct it HERE — every legal page reads
  // these two strings from this object, so they cannot drift apart.
  cin: "U68100GJ2026PTC172130",
  registeredAddress:
    "301, Babji Hieghts, Beside Gayatri Dairy, Krushnanagar Main Road, " +
    "Near Gandhi Society, Madhapar Circle, Rajkot, Gujarat 360006",

  grievanceOfficerName: "Murtaza Patel",
  // Live and monitored, confirmed 28 September 2026. It has to stay that way:
  // the Privacy Policy commits to answering a data-subject request sent here
  // within 90 days, and the Terms commit to acknowledging a complaint in 48
  // hours. The dispute form posts nowhere — it opens a mail to this address — so
  // if this mailbox stops being read, the correction process stops existing.
  grievanceEmail: "grievance@comfhutt.com",
  // Live — already used by the main ComfHutt site.
  supportEmail: "support@comfhutt.com",

  effectiveDate: "2026-09-28",
  effectiveDateLabel: "28 September 2026",

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
