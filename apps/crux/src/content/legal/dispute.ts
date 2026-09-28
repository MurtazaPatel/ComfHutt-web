/**
 * `/dispute` — Dispute and Correction Policy.
 *
 * A correction process that is published, used and documented is the strongest
 * evidence of good faith available if a published grade is ever challenged. The
 * page therefore carries the policy in full, and the submission form sits beneath
 * it rather than replacing it.
 */

import type { LegalDoc } from "./types";
import { bullets, callout, em, link, para, rich, steps, strong } from "./types";
import { EFFECTIVE_DATE_LABEL, GRIEVANCE_EMAIL } from "./facts";

export const disputeDoc: LegalDoc = {
  title: "Dispute and Correction Policy",
  lastUpdated: EFFECTIVE_DATE_LABEL,
  summary:
    "How to tell CRUX that something published about a project or promoter is wrong, what we will look at, what we will not do, and what happens after you submit.",
  sections: [
    {
      id: "who-can-use-this",
      heading: "Who can use this",
      blocks: [
        para(
          "Anyone affected by something published on CRUX — a developer or promoter, an authorised representative, an allottee, or any person named or identifiable in the information shown.",
        ),
      ],
    },
    {
      id: "what-we-will-look-at",
      heading: "What we will look at",
      blocks: [
        bullets(
          rich("A court or tribunal record attributed to the wrong party."),
          rich(
            "A matter whose status has changed — disposed, withdrawn, settled, stayed, or decided.",
          ),
          rich("A filing, figure or document we have read or reported incorrectly."),
          rich("A factual error in project details, promoter details or dates."),
          rich("Any other statement on CRUX you say is inaccurate or incomplete."),
        ),
      ],
    },
    {
      id: "what-we-will-not-do",
      heading: "What we will not do",
      blocks: [
        para(
          "We will not remove or raise a grade because it is unwelcome. A grade is our opinion, formed from public records by a published method. We correct facts and we re-run the method; we do not negotiate outcomes, and no payment of any kind can change a grade.",
        ),
      ],
    },
    {
      id: "how-to-submit",
      heading: "How to submit",
      blocks: [
        para(
          "Use the form on this page. Tell us the project, who you are and your relationship to it, exactly what you say is wrong, and what the correct position is. Attach documents — a court order, a disposal record, a corrected filing. Give us an email address we can reply to.",
        ),
      ],
    },
    {
      id: "what-happens-next",
      heading: "What happens next",
      blocks: [
        steps(
          rich(
            strong("Acknowledgement within 2 working days"),
            ", with a reference number.",
          ),
          rich(
            strong("Review within 10 working days."),
            " We check the submission against the source record and, where relevant, re-run the grading method on corrected inputs.",
          ),
          rich(
            strong("A written decision"),
            ", stating what we changed and why, or why we did not change it.",
          ),
          rich(
            strong("While a dispute is open"),
            ', the project page shows an "Under review" indicator. The grade is not withdrawn during review, because withdrawing a grade on request would itself be a way to game the system.',
          ),
          rich(
            strong("If we were wrong, we say so."),
            " Corrections that change a grade are recorded in that project's grade history, which is public. We do not quietly edit.",
          ),
        ),
      ],
    },
    {
      id: "escalation",
      heading: "Escalation",
      blocks: [
        para(
          "If you are not satisfied, write to our Grievance Officer at ",
          link(GRIEVANCE_EMAIL, `mailto:${GRIEVANCE_EMAIL}`),
          ". Nothing in this process affects your legal rights.",
        ),
      ],
    },
    {
      id: "our-standing-rule",
      heading: "Our standing rule",
      blocks: [
        callout(
          em(
            "We publish what the record says, we show you the record, and we correct what we get wrong.",
          ),
        ),
      ],
    },
  ],
};
