/**
 * `/privacy` — Privacy Policy.
 *
 * Drafted against the Digital Personal Data Protection Act, 2023 and the Digital
 * Personal Data Protection Rules, 2025. The notice structure — purpose, basis,
 * retention, rights, named Grievance Officer — is what those rules require, so it
 * is built now rather than retrofitted when the obligations bite.
 */

import type { LegalDoc } from "./types";
import { bullets, callout, link, para, rich, strong, table } from "./types";
import {
  EFFECTIVE_DATE_LABEL,
  GRIEVANCE_EMAIL,
  GRIEVANCE_OFFICER_NAME,
  REGISTERED_ADDRESS_TEXT,
} from "./facts";

export const privacyDoc: LegalDoc = {
  title: "Privacy Policy",
  lastUpdated: EFFECTIVE_DATE_LABEL,
  summary:
    "What personal data CRUX collects, why, who it is shared with, how long it is kept, and the rights you can exercise under the Digital Personal Data Protection Act, 2023.",
  intro: [
    para(
      'ComfHutt Technologies Private Limited ("ComfHutt", "we") is the ',
      strong("Data Fiduciary"),
      " for personal data processed through CRUX. This notice tells you, in plain language, what we collect, why, what we do with it, and what you can require of us.",
    ),
  ],
  sections: [
    {
      id: "what-we-collect",
      heading: "1. What we collect, and why",
      blocks: [
        table(
          "Personal data processed through CRUX, the purpose of each processing activity, and our basis for it.",
          ["What", "Why we process it", "Our basis"],
          [
            [
              rich("Name, email address, phone number (if given)"),
              rich(
                "To create and operate your account, authenticate you, and contact you about the service",
              ),
              rich("Your consent, given when you create an account"),
            ],
            [
              rich("Projects you grade, search, save or watch"),
              rich(
                "To deliver the grade you asked for, show your history, and operate saved lists",
              ),
              rich("Your consent"),
            ],
            [
              rich("Questions you ask our AI assistant"),
              rich("To answer them, and to diagnose and improve the assistant"),
              rich("Your consent"),
            ],
            [
              rich("A quoted price you enter for a project"),
              rich("To compare it against comparable declared rates in that report"),
              rich("Your consent"),
            ],
            [
              rich("Payment details"),
              rich(
                "Processed ",
                strong("by our payment gateway"),
                ", not by us. We store only a transaction reference, the amount, and the plan purchased",
              ),
              rich("Performance of your purchase"),
            ],
            [
              rich("Device, browser, IP address, pages viewed"),
              rich(
                "Security, fraud and abuse prevention, and aggregate usage measurement",
              ),
              rich(
                "Our legitimate use in operating a secure service, as permitted under the Act",
              ),
            ],
            [
              rich("Documents and statements you send us in a dispute"),
              rich("To review and decide the dispute"),
              rich("Your consent"),
            ],
          ],
        ),
        callout(
          strong(
            "We do not sell your personal data. We do not share it with developers, builders, brokers or listing platforms. No third party pays us for access to it.",
          ),
        ),
      ],
    },
    {
      id: "what-we-do-not-collect",
      heading: "2. What we do not collect",
      blocks: [
        para(
          "We do not ask for and do not want your Aadhaar number, PAN, bank account details, income details, or copies of your identity documents. Do not send them to us. If you send them in a dispute submission, we will delete them and tell you we have.",
        ),
      ],
    },
    {
      id: "cookies-and-analytics",
      heading: "3. Cookies and analytics",
      blocks: [
        para(
          "We use cookies that are necessary for the site to work and to keep you signed in, and privacy-respecting analytics to count visits and understand which pages are used. We do not use advertising cookies and we do not run cross-site advertising trackers. You can control cookies through your browser; blocking necessary cookies will break sign-in.",
        ),
      ],
    },
    {
      id: "who-we-share-data-with",
      heading: "4. Who we share data with",
      blocks: [
        para(
          "Only with service providers who process data on our instructions, under contract, and only as needed to run CRUX:",
        ),
        bullets(
          rich("cloud hosting and database providers;"),
          rich("our authentication provider;"),
          rich("our payment gateway;"),
          rich("our email provider;"),
          rich(
            "AI model providers, for the specific purpose of generating the explanation or answer you requested.",
          ),
        ),
        para(
          "We may disclose data where required by law, a court, or a regulator, or to establish or defend legal claims.",
        ),
      ],
    },
    {
      id: "storage-and-retention",
      heading: "5. Where data is stored, and for how long",
      blocks: [
        para(
          "We store personal data on servers located in India wherever the service supports it, and otherwise with reputable providers subject to contractual protections. Some processing may occur outside India; we will not transfer personal data to any territory restricted by the Central Government.",
        ),
        para("We keep personal data only as long as the purpose requires:"),
        bullets(
          rich(
            "Account data: while your account is open, and for up to 12 months after you close it, to handle disputes and meet legal obligations.",
          ),
          rich(
            "Grading history and reports: while your account is open. Purchased reports are retained for 3 years so you can retrieve what you paid for.",
          ),
          rich("Dispute records: 3 years from the decision."),
          rich("Security and access logs: at least 1 year, as required under the DPDP Rules."),
        ),
        para(
          "We will notify you at least 48 hours before we erase data under a retention rule.",
        ),
      ],
    },
    {
      id: "your-rights",
      heading: "6. Your rights",
      blocks: [
        para("Under the Digital Personal Data Protection Act, 2023 you may:"),
        bullets(
          rich(
            strong("Access"),
            " — obtain a summary of the personal data we hold about you and how we process it;",
          ),
          rich(
            strong("Correct"),
            " — have inaccurate or incomplete data corrected, completed or updated;",
          ),
          rich(
            strong("Erase"),
            " — have your personal data erased where the purpose no longer requires it and no law requires us to keep it;",
          ),
          rich(
            strong("Nominate"),
            " — nominate another person to exercise your rights in the event of your death or incapacity;",
          ),
          rich(
            strong("Grieve"),
            " — have a complaint heard by us, and escalate it to the Data Protection Board of India if you are not satisfied;",
          ),
          rich(
            strong("Withdraw consent"),
            " — at any time, as easily as you gave it. Withdrawal does not affect processing already carried out.",
          ),
        ),
        para(
          "To exercise any of these, write to ",
          link(GRIEVANCE_EMAIL, `mailto:${GRIEVANCE_EMAIL}`),
          " from the email address on your account. We will respond within 90 days, and usually far sooner.",
        ),
      ],
    },
    {
      id: "your-duties",
      heading: "7. Your duties",
      blocks: [
        para(
          "The Act also places duties on you. Do not impersonate anyone, do not submit false particulars, and do not file a frivolous or false complaint. Provide only authentic information when exercising a right to correction.",
        ),
      ],
    },
    {
      id: "security",
      heading: "8. Security",
      blocks: [
        para(
          "We use access controls, encryption in transit, restricted administrative access, logging and regular review. No system is perfectly secure, but we take these obligations seriously and design for the least data necessary.",
        ),
      ],
    },
    {
      id: "breach",
      heading: "9. If there is a breach",
      blocks: [
        para(
          "If a personal data breach affects you, we will notify you without delay and in any case within 72 hours of the reporting trigger, in plain language: what happened, what data was involved, what we are doing, and what you can do. We will also notify the Data Protection Board of India as required.",
        ),
      ],
    },
    {
      id: "children",
      heading: "10. Children",
      blocks: [
        para(
          "CRUX is not for anyone under 18. We do not knowingly process a child's personal data, and we do not undertake behavioural tracking or targeted advertising directed at children. If you believe a child has given us personal data, tell our Grievance Officer and we will delete it.",
        ),
      ],
    },
    {
      id: "information-about-third-parties",
      heading: "11. Information about third parties",
      blocks: [
        para(
          "CRUX publishes analysis of businesses and projects based on public records, including records that name individuals in their business or professional capacity. That processing is of publicly available information and is separate from the personal data you give us as a user. If you believe information published about you is inaccurate or wrongly attributed, use our ",
          link("dispute and correction process", "/dispute"),
          ".",
        ),
      ],
    },
    {
      id: "grievance-officer",
      heading: "12. Grievance Officer",
      blocks: [
        para(
          strong(GRIEVANCE_OFFICER_NAME),
          " · ",
          link(GRIEVANCE_EMAIL, `mailto:${GRIEVANCE_EMAIL}`),
          " · ComfHutt Technologies Private Limited, ",
          REGISTERED_ADDRESS_TEXT,
        ),
        para(
          "If we do not resolve your complaint to your satisfaction, you may complain to the ",
          strong("Data Protection Board of India"),
          ".",
        ),
      ],
    },
    {
      id: "changes",
      heading: "13. Changes",
      blocks: [
        para(
          "We will post any updated policy here with a new date, and give notice where changes are material.",
        ),
      ],
    },
  ],
};
