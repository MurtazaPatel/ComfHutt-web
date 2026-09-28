/**
 * The company facts, in the exact form the legal pages print them.
 *
 * `src/config/legal.ts` owns the values. This file owns nothing but the wording
 * of the two placeholders, and it exists so that the CIN and the registered
 * address read identically whether they appear inside a sentence (Terms clause 1)
 * or in the contact line at the foot of the Disclaimer.
 *
 * Neither placeholder is ever filled in with a guess. A Terms of Use naming a
 * plausible-looking CIN that belongs to nobody is worse than one that visibly
 * says the number is still missing, and `scripts/legal-token-guard.mjs` fails a
 * production build while either is null.
 */

import { LEGAL, companyLine } from "@/config/legal";

/** The CIN, or the same visible placeholder `companyLine()` prints. */
export const CIN_TEXT = LEGAL.cin ?? "[to be completed before publication]";

/** The registered office address, or its visible placeholder. */
export const REGISTERED_ADDRESS_TEXT =
  LEGAL.registeredAddress ?? "[registered address to be completed before publication]";

/** Name · CIN · registered office · support address, as one line. */
export const COMPANY_LINE = companyLine();

export const COMPANY_NAME = LEGAL.companyName;
export const GRIEVANCE_OFFICER_NAME = LEGAL.grievanceOfficerName;
export const GRIEVANCE_EMAIL = LEGAL.grievanceEmail;
export const SUPPORT_EMAIL = LEGAL.supportEmail;
export const EFFECTIVE_DATE_LABEL = LEGAL.effectiveDateLabel;
