/**
 * CRUX plan definitions.
 *
 * The tiers below are the ones locked in the business decisions doc. Two things
 * about them are easy to get wrong and expensive to get wrong:
 *
 * 1. **Consumer Pro at ₹199/month is retired.** It was replaced by the one-time
 *    Booking Report. Nothing in the product may offer it, price it, or imply it.
 *
 * 2. **Only Free is purchasable today.** Booking Report and the Professional
 *    seats are real, decided prices, but invoicing them is gated on shipping the
 *    Booking Report page, one-time Razorpay and PDF export. Until then the price
 *    is the plan, not the invoice — so `purchasable` is false and no surface may
 *    render a checkout button for them. A pay button that cannot complete is
 *    worse than no button.
 *
 * Feature strings list only what is built. CRUX Cast and CRUX Yield return HTTP
 * 501, and alerts, re-scoring and the PDF dossier are unshipped, so none of them
 * appear here regardless of what a roadmap says.
 */

export type PlanId = "free" | "booking_report" | "professional_solo" | "professional_firm" | "institutional";

export interface PlanDefinition {
  id: PlanId;
  name: string;
  /** Who the tier is for, in the buyer's own words. */
  audience: string;
  billingCycle: "one_time" | "monthly" | "annual" | null;
  /** Rupees. Null where the price is set per pilot rather than listed. */
  priceRupees: number | null;
  priceLabel: string;
  /** Annual price where the tier offers one, for the "or ₹X/year" line. */
  annualRupees?: number;
  features: string[];
  /**
   * False when the tier cannot be bought right now. A false value must suppress
   * every checkout affordance for that tier, not merely grey it out.
   */
  purchasable: boolean;
  /** Shown beside an unpurchasable tier so the state is explained, not hidden. */
  availabilityNote?: string;
}

export const PLANS: PlanDefinition[] = [
  {
    id: "free",
    name: "Free",
    audience: "Every buyer",
    billingCycle: null,
    priceRupees: 0,
    priceLabel: "forever",
    features: [
      "The CRUX Grade, A+ to D",
      "Cohort percentile once the corpus supports one",
      "All seven module verdicts",
      "Confidence on every grade",
      "Evidence links back to the filing or case",
      "CRUX Lens, the AI assistant",
      "Shareable verdict card",
      "3 grades without an account, unlimited with a free one",
    ],
    purchasable: true,
  },
  {
    id: "booking_report",
    name: "Booking Report",
    audience: "A buyer about to pay a booking amount",
    billingCycle: "one_time",
    priceRupees: 999,
    priceLabel: "one-time",
    features: [
      "Counted court cases with match confidence and links",
      "RERA complaints against the promoter",
      "Escrow and construction-progress trend",
      "Price fairness against comparables, for a price you enter",
      "Developer track record and delivery forecast",
      "Questions to ask the builder, as a checklist",
    ],
    purchasable: false,
    availabilityNote: "Coming shortly after launch",
  },
  {
    id: "professional_solo",
    name: "Professional — Solo",
    audience: "Brokers, CAs and property advocates · 1 seat",
    billingCycle: "monthly",
    priceRupees: 4999,
    priceLabel: "per month",
    annualRupees: 49999,
    features: [
      "Unlimited Booking Reports",
      "Full legal detail on every case",
      "Comparables",
      "Share cards",
    ],
    purchasable: false,
    availabilityNote: "Coming shortly after launch",
  },
  {
    id: "professional_firm",
    name: "Professional — Firm",
    audience: "Brokerages and practices · 5 seats",
    billingCycle: "monthly",
    priceRupees: 10000,
    priceLabel: "per month",
    annualRupees: 99999,
    features: ["Everything in Solo, across 5 seats", "Branded share cards", "Firm dashboard"],
    purchasable: false,
    availabilityNote: "Coming shortly after launch",
  },
  {
    id: "institutional",
    name: "Institutional",
    audience: "Housing finance, NBFCs, co-operative banks and diligence teams",
    billingCycle: null,
    // Deliberately unpriced. The doc is explicit that institutional pricing is
    // set with the first pilot, so putting a number here would invent one.
    priceRupees: null,
    priceLabel: "Priced with each pilot",
    features: [
      "Per-pull grading against your own pipeline",
      "Portfolio Watch on financed projects",
    ],
    purchasable: false,
    availabilityNote: "Talk to us",
  },
];

/** The only tier anyone can act on today. */
export const FREE_PLAN = PLANS[0];

/** Format a rupee figure the way an Indian reader expects: ₹4,999 / ₹49,999. */
export function formatRupees(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}
