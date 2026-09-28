/**
 * `/terms` — Terms of Use.
 *
 * One value on this page is live rather than fixed: the coverage sentence in
 * clause 3 names how many districts CRUX actually grades, read from the same
 * counter the marketing page uses. A Terms of Use that claims broader coverage
 * than the engine delivers is the one kind of drafting error that cannot be
 * argued away, so the number is never hard-coded here.
 *
 * That is why this module exports a function where the other three export a
 * constant: the document cannot be built until the count has been fetched.
 */

import type { LegalDoc } from "./types";
import { bullets, link, para, rich, strong } from "./types";
import { formatCount } from "@/lib/landing-stats";
import {
  CIN_TEXT,
  EFFECTIVE_DATE_LABEL,
  GRIEVANCE_EMAIL,
  GRIEVANCE_OFFICER_NAME,
  REGISTERED_ADDRESS_TEXT,
  SUPPORT_EMAIL,
} from "./facts";

/**
 * The coverage phrase for clause 3, e.g. "5 districts in Gujarat".
 *
 * Zero is never printed. A zero would read as "CRUX grades nothing", which is a
 * claim; in practice it means the counter failed, which is silence.
 *
 * Unlike everywhere else on the site, a failed count here does NOT render an em
 * dash. "Coverage is currently limited to — districts" in a Terms of Use reads
 * as a document somebody forgot to finish, and this clause is one a developer's
 * counsel may well quote back. The fallback is a sentence that is true whatever
 * the counter is doing, and that still limits coverage — which is the only work
 * this clause has to do.
 */
export function formatDistricts(districtCount: number | null): string {
  const count = districtCount !== null && districtCount > 0 ? districtCount : null;
  if (count === null) return "the districts of Gujarat in which CRUX currently operates";
  return `${formatCount(count)} ${count === 1 ? "district" : "districts"} in Gujarat`;
}

export interface TermsContext {
  /** Output of `formatDistricts()` — the live coverage phrase. */
  readonly districts: string;
}

export function termsDoc({ districts }: TermsContext): LegalDoc {
  return {
    title: "Terms of Use",
    lastUpdated: EFFECTIVE_DATE_LABEL,
    summary:
      "The terms on which ComfHutt Technologies Private Limited provides CRUX: who may use it, what a subscription includes, how to cancel, and the limits of what a CRUX Grade is.",
    sections: [
      {
        id: "who-we-are",
        heading: "1. Who we are, and what these terms cover",
        blocks: [
          para(
            "This website and the CRUX service are operated by ",
            strong("ComfHutt Technologies Private Limited"),
            ", a company incorporated under the Companies Act, 2013, CIN ",
            CIN_TEXT,
            ", with its registered office at ",
            REGISTERED_ADDRESS_TEXT,
            ' ("ComfHutt", "we", "us").',
          ),
          para(
            "By using CRUX you agree to these Terms, our ",
            link("Privacy Policy", "/privacy"),
            " and our ",
            link("Disclaimer", "/disclaimer"),
            ". If you do not agree, do not use the service.",
          ),
        ],
      },
      {
        id: "eligibility",
        heading: "2. Eligibility",
        blocks: [
          para(
            "CRUX is for users aged 18 and over who are competent to contract under the Indian Contract Act, 1872. Do not use CRUX if you are under 18. We do not knowingly collect personal data from children; if we learn that we have, we will delete it.",
          ),
        ],
      },
      {
        id: "what-we-provide",
        heading: "3. What we provide",
        blocks: [
          para(
            "CRUX produces opinion-based credibility grades for real estate projects registered with the Gujarat Real Estate Regulatory Authority, together with supporting analysis and an AI assistant that explains published grades.",
          ),
          para(
            `Coverage is currently limited to ${districts}. We do not grade every project, and we do not promise to grade any particular project.`,
          ),
          para(
            strong("The nature and limits of a CRUX Grade are set out in the "),
            link("Disclaimer", "/disclaimer"),
            strong(", which forms part of these Terms."),
            " In particular, CRUX is not investment advice, not a credit rating, not a valuation, not a title search and not a legal opinion.",
          ),
        ],
      },
      {
        id: "your-account",
        heading: "4. Your account",
        blocks: [
          para(
            "Some features require an account. You are responsible for the accuracy of the information you give us, for keeping your credentials secure, and for activity under your account. Tell us promptly at ",
            link(SUPPORT_EMAIL, `mailto:${SUPPORT_EMAIL}`),
            " if you believe your account has been compromised.",
          ),
        ],
      },
      {
        id: "acceptable-use",
        heading: "5. Acceptable use",
        blocks: [
          para(
            "You may use CRUX for your own property research, or — where you hold a Professional subscription — in the course of advising your own clients.",
          ),
          para("You must not:"),
          bullets(
            rich(
              "scrape, crawl, harvest or bulk-extract content from CRUX by automated means, or attempt to reconstruct our database;",
            ),
            rich(
              "resell, sublicense, redistribute or publicly republish CRUX Grades, reports or analysis except as expressly permitted by your subscription;",
            ),
            rich(
              "represent a CRUX Grade as a credit rating, a valuation, a certification, a legal opinion or a statement of fact;",
            ),
            rich(
              "misrepresent a grade, alter it, strip it of its date, its confidence indicator or its evidence links, or present it in a way that changes its meaning;",
            ),
            rich(
              "use CRUX to harass, defame or threaten any person, or to build a competing grading product;",
            ),
            rich(
              "interfere with the operation or security of the service, or attempt to access data you are not authorised to access.",
            ),
          ),
          para("We may suspend or terminate access for breach of this clause."),
        ],
      },
      {
        id: "intellectual-property",
        heading: "6. Our intellectual property, and yours",
        blocks: [
          para(
            "The CRUX Grading Mechanism, the grades, the analysis, the cohort comparisons, the software and the CRUX and ComfHutt marks are our property or licensed to us. Underlying public records remain the property of their respective sources; our rights subsist in our selection, arrangement, resolution and analysis of them.",
          ),
          para(
            "We grant you a limited, non-exclusive, non-transferable, revocable licence to access and use CRUX for the purposes in clause 5. Nothing else is granted.",
          ),
          para(
            "Where you submit content to us — for example a document in a dispute, or a quoted price — you grant us a licence to use it for the purpose for which you submitted it, and you confirm you are entitled to provide it.",
          ),
        ],
      },
      {
        id: "billing",
        heading: "7. Paid plans, billing, cancellation and refunds",
        blocks: [
          bullets(
            rich(
              "Prices are shown on our pricing page and are in Indian Rupees, inclusive or exclusive of applicable taxes as stated there.",
            ),
            rich(
              strong("Booking Report"),
              " is a one-time purchase of a specific report for a specific project.",
            ),
            rich(
              strong("Professional"),
              " plans are subscriptions billed monthly or annually in advance.",
            ),
            rich(
              strong("Cancellation is simple and immediate."),
              " You may cancel a subscription at any time from your account settings, in no more than two steps, without contacting us, without answering retention questions and without being offered an alternative price as a condition of cancelling. On cancellation your plan continues to the end of the period you have paid for, and then stops. We do not auto-renew a cancelled plan.",
            ),
            rich(
              strong("Refunds."),
              " A Booking Report is delivered immediately and is not refundable once generated, except where it was not delivered, was materially defective, or was charged in error. Subscription fees for the current period are not refundable except where required by law or where we have failed to provide the service. Where a refund is due, we process it to the original payment method within seven working days of approving it.",
            ),
            rich(
              strong("Changes to price."),
              " We will give at least 30 days' notice before a price change affecting an existing subscription, and you may cancel before it takes effect.",
            ),
            rich(
              strong("No dark patterns."),
              " We do not use false urgency, confirm-shaming, basket sneaking, drip pricing, forced action or subscription traps as described in the Guidelines for Prevention and Regulation of Dark Patterns, 2023. If you believe any part of our interface does, tell our Grievance Officer and we will fix it.",
            ),
          ),
        ],
      },
      {
        id: "availability",
        heading: "8. Availability",
        blocks: [
          para(
            'CRUX is provided on an "as is" and "as available" basis. We do not warrant uninterrupted or error-free operation. We may modify, suspend or discontinue features, and we may change grades as data changes.',
          ),
        ],
      },
      {
        id: "limitation-of-liability",
        heading: "9. Limitation of liability",
        blocks: [
          para("To the fullest extent permitted by law:"),
          bullets(
            rich("we exclude all implied warranties;"),
            rich(
              "we are not liable for indirect, incidental, special or consequential loss, or for loss of profit, revenue, opportunity, goodwill or data;",
            ),
            rich(
              "our total aggregate liability arising out of or in connection with the service is limited to the greater of (a) the amounts you paid us in the twelve months preceding the claim, and (b) ₹10,000.",
            ),
          ),
          para(
            "Nothing in these Terms excludes liability that cannot lawfully be excluded, including under the Consumer Protection Act, 2019.",
          ),
        ],
      },
      {
        id: "indemnity",
        heading: "10. Indemnity",
        blocks: [
          para(
            "You will indemnify us against claims, losses and costs arising from your breach of these Terms, your misuse of CRUX content, or your republication or misrepresentation of a CRUX Grade.",
          ),
        ],
      },
      {
        id: "third-party-sites",
        heading: "11. Third-party sites",
        blocks: [
          para(
            "CRUX may link to third-party sites and services. We do not control them and are not responsible for their content, and a link is not an endorsement. Where we direct you to a listing platform at your request, we may receive a fee; that fee is the same regardless of the grade of the project concerned, and no third party has any influence over any grade.",
          ),
        ],
      },
      {
        id: "grievance-redressal",
        heading: "12. Complaints and grievance redressal",
        blocks: [
          para(
            "Our Grievance Officer is ",
            strong(GRIEVANCE_OFFICER_NAME),
            ", reachable at ",
            link(GRIEVANCE_EMAIL, `mailto:${GRIEVANCE_EMAIL}`),
            ", ",
            REGISTERED_ADDRESS_TEXT,
            ". We acknowledge complaints within 48 hours and aim to resolve them within 30 days, and in any event within the periods required by law.",
          ),
        ],
      },
      {
        id: "governing-law",
        heading: "13. Governing law and jurisdiction",
        blocks: [
          para(
            "These Terms are governed by the laws of India. Subject to clause 12, the courts at Rajkot, Gujarat have exclusive jurisdiction.",
          ),
        ],
      },
      {
        id: "changes",
        heading: "14. Changes",
        blocks: [
          para(
            'We may update these Terms. We will post the updated version with a new "last updated" date, and where changes are material we will give notice in the product or by email. Continued use after the effective date means you accept the change.',
          ),
        ],
      },
    ],
  };
}
