/**
 * `/disclaimer` — what a CRUX Grade is, and what it is not.
 *
 * This is the page that stands between a published C grade and a defamation
 * notice, which is why it is rendered in full rather than as a collapsed summary.
 * The wording is the counsel draft, unedited. If the engine's coverage, sources
 * or method change, this file changes in the same commit — a disclaimer that
 * describes a product more broadly than it delivers protects nobody.
 */

import type { LegalDoc } from "./types";
import { bullets, callout, link, para, rich, strong } from "./types";
import { COMPANY_LINE, EFFECTIVE_DATE_LABEL } from "./facts";

export const disclaimerDoc: LegalDoc = {
  title: "Disclaimer",
  lastUpdated: EFFECTIVE_DATE_LABEL,
  summary:
    "A CRUX Grade is an opinion formed from public records. What that means, what it is not, where the information comes from, and what to do if you believe a grade is wrong.",
  sections: [
    {
      id: "what-a-crux-grade-is",
      heading: "1. What a CRUX Grade is",
      blocks: [
        para(
          "A CRUX Grade is an ",
          strong("opinion"),
          ". It is produced by applying a published set of rules — the CRUX Grading Mechanism — to information obtained from public records, principally filings made by developers themselves with the Gujarat Real Estate Regulatory Authority and records published by Indian courts and tribunals.",
        ),
        para(
          "A CRUX Grade is a statement of our opinion about the information available to us on the date shown. It is not a statement of fact about any project, promoter, developer or person, and it must not be read as one.",
        ),
      ],
    },
    {
      id: "what-a-crux-grade-is-not",
      heading: "2. What a CRUX Grade is not",
      blocks: [
        para("A CRUX Grade is ", strong("not"), ":"),
        bullets(
          rich(
            strong("Not investment advice."),
            " CRUX does not advise any person to buy, sell, hold or avoid any property, security or financial product. Nothing on this site is a personal recommendation, and nothing on it takes account of your circumstances, objectives or financial situation. ComfHutt Technologies Private Limited is not registered with the Securities and Exchange Board of India as an Investment Adviser under the SEBI (Investment Advisers) Regulations, 2013, or as a Research Analyst under the SEBI (Research Analysts) Regulations, 2014.",
          ),
          rich(
            strong("Not a credit rating."),
            " Although CRUX uses letter grades, CRUX is not a credit rating agency and is not registered with SEBI under the SEBI (Credit Rating Agencies) Regulations, 1999. A CRUX Grade is not a credit rating, does not assess any security or debt instrument, and must not be represented as one.",
          ),
          rich(
            strong("Not a valuation."),
            " Where CRUX comments on whether a quoted price appears consistent with comparable declared rates, that comparison is not a valuation. It is not prepared by a registered valuer under the Companies Act, 2013 or the IBBI (Registered Valuers and Valuation) Rules, 2017, and must not be used for any statutory, lending, taxation or accounting purpose.",
          ),
          rich(
            strong("Not a title search or legal opinion."),
            " CRUX does not examine title documents, search sub-registrar records, or verify encumbrances. A CRUX Grade is not a substitute for a title search, a legal opinion from an advocate, a technical survey, a site visit, or independent professional due diligence.",
          ),
          rich(
            strong("Not an audit."),
            " CRUX does not audit, verify or independently confirm the accuracy of the filings a developer makes with a regulator. We read what has been filed. If a filing is false, the grade derived from it may be wrong.",
          ),
        ),
      ],
    },
    {
      id: "our-sources",
      heading: "3. Our sources, and their limits",
      blocks: [
        para("CRUX Grades are built from:"),
        bullets(
          rich(
            "Filings made by developers with the Gujarat Real Estate Regulatory Authority, including certified forms and quarterly progress reports;",
          ),
          rich(
            "Records published by the eCourts system, the High Court of Gujarat, the Supreme Court of India, and the Insolvency and Bankruptcy Board of India;",
          ),
          rich(
            "Complaint and order records of the Gujarat real estate regulatory authority and its appellate tribunal;",
          ),
          rich("Location and connectivity data from Google Maps Platform."),
        ),
        para(
          "We do not control any of these sources. They may be incomplete, out of date, mis-indexed or wrong. Records may be added or removed without notice. ",
          strong(
            "We give no warranty, express or implied, as to the accuracy, completeness, currency or fitness for any purpose of any information on this site.",
          ),
        ),
      ],
    },
    {
      id: "court-records-and-identity-matching",
      heading: "4. Court records and identity matching",
      blocks: [
        para(
          "Indian court records are indexed by party name. Names repeat, and companies share names with unrelated companies. CRUX therefore applies a documented matching procedure and assigns each potential match a confidence value.",
        ),
        bullets(
          rich(
            "Where confidence is high, the matter is counted in the grade and shown to signed-in users with a link to the underlying record.",
          ),
          rich(
            "Where confidence is moderate, the matter is ",
            strong("not counted"),
            " in the grade, and is shown only as something a user should verify independently.",
          ),
          rich("Where confidence is low, the matter is excluded entirely."),
        ),
        callout(
          strong(
            "A matter shown on CRUX in connection with a project or promoter is a record we believe, on the stated basis, may relate to that party. It is not an assertion that the party has done anything wrong, and it is not an assertion of guilt, liability or misconduct.",
          ),
          " Pending proceedings are allegations only. A dismissed, withdrawn or settled matter is described as such where the record says so.",
        ),
        para(
          "We describe court records using the classifications used in the record itself. We do not characterise any person or business as fraudulent, dishonest or criminal.",
        ),
      ],
    },
    {
      id: "no-cases-found",
      heading: '5. "No cases found" does not mean "clean"',
      blocks: [
        para(
          "Where our search of a forum is incomplete, CRUX says so and limits the grade accordingly. Where we have too little verified information to form a responsible opinion, CRUX refuses to grade and marks the project ",
          strong("Not Rated"),
          ". An absence of adverse findings on CRUX is never evidence that no adverse facts exist.",
        ),
      ],
    },
    {
      id: "grades-change",
      heading: "6. Grades change",
      blocks: [
        para(
          "A CRUX Grade reflects the information available on the date shown on the grade. Filings, court records and circumstances change. A grade may be revised or withdrawn at any time. Always check the date on the grade you are relying on.",
        ),
      ],
    },
    {
      id: "if-you-believe-a-grade-is-wrong",
      heading: "7. If you believe a grade is wrong",
      blocks: [
        para(
          "We publish a correction process and we use it. If you are a developer, promoter, allottee or any affected person and you believe information shown on CRUX is inaccurate, incomplete or wrongly attributed to you, tell us through our ",
          link("dispute and correction process", "/dispute"),
          ". We will review it on the terms set out there.",
        ),
      ],
    },
    {
      id: "your-decision-is-yours",
      heading: "8. Your decision is yours",
      blocks: [
        para(
          "Property purchase decisions involve large sums and irreversible consequences. ",
          strong("Do not rely on a CRUX Grade alone."),
          " Engage an advocate, a chartered accountant and a technical surveyor, read the documents yourself, and visit the site. To the fullest extent permitted by law, ComfHutt Technologies Private Limited accepts no liability for any decision made, or loss suffered, in reliance on anything published on this site.",
        ),
      ],
    },
    {
      id: "contact",
      heading: "9. Contact",
      blocks: [para(COMPANY_LINE)],
    },
  ],
};
