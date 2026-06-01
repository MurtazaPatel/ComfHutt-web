export const SHIVALIK_PLATINUM_PROPERTY = {
  id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  address: "Shivalik Platinum, Bodakdev, SG Highway, Ahmedabad West, Gujarat 380054",
  city: "Ahmedabad",
  state: "Gujarat",
  propertyType: "residential_apartment",
  sizeSqft: 1365,
  developer: "Shivalik Group",
  developerSince: 1998,
  reraId: "MAA07768/141220",
  geocode: { lat: 23.0333, lng: 72.5167 },
  pinCode: "380054",
};

export const SHIVALIK_PLATINUM_SCORE = {
  score_composite: 78,
  confidence_score: 0.83,
  intent_profile: "balanced",
  lifecycle_stage: "delivered",
  macro_cycle: "growth",
  degraded: false,
  data_sources_used: ["CPCB AQI", "Google Maps", "NHB RESIDEX", "MCA21", "eCourts", "CPWD"],
  crux_version: "0.1.0",
  verified_evidence_used: 12,
  score_breakdown: {
    location_intelligence: 82,
    developer_reliability: 74,
    legal_compliance: 68,
    market_valuation: 85,
    structural_physical: 76,
    risk_composite: 81,
  },
  weight_adjustments: [
    {
      category: "developer_reliability",
      delta: 0.05,
      base_weight: 0.15,
      adjusted_weight: 0.20,
      reason: "Shivalik Group has completed 15+ projects in Ahmedabad with average construction quality 4.2/5 from buyer reviews. RERA registration MAA07768 verified.",
      evidence_ids: ["ev-001", "ev-002"],
    },
    {
      category: "location_intelligence",
      delta: 0.03,
      base_weight: 0.25,
      adjusted_weight: 0.28,
      reason: "Ahmedabad Metro Line 2 runs along SG Highway near Bodakdev with stations at Thaltej and Vastrapur. Property prices in West Ahmedabad show 8% annual appreciation.",
      evidence_ids: ["ev-003", "ev-004"],
    },
    {
      category: "market_valuation",
      delta: -0.02,
      base_weight: 0.20,
      adjusted_weight: 0.18,
      reason: "NHB RESIDEX shows Ahmedabad HPI at 142.3 with QoQ growth slowing to 1.2%, indicating moderate market momentum.",
      evidence_ids: ["ev-005"],
    },
  ],
};

const SCORE_BREAKDOWN_DETAIL = `
## CRUX Score Evaluation — Shivalik Platinum

**Overall Score: 78/100 | Confidence: 83% | Grade: Good**

| Category | Score | Weight | Contribution |
|----------|-------|--------|-------------|
| Location Intelligence | 82 | 0.28 | 22.96 |
| Market Valuation | 85 | 0.18 | 15.30 |
| Risk Composite | 81 | 0.12 | 9.72 |
| Structural & Physical | 76 | 0.12 | 9.12 |
| Developer Reliability | 74 | 0.20 | 14.80 |
| Legal Compliance | 68 | 0.10 | 6.80 |

### Location Intelligence (82/100)
Bodakdev is a premium West Ahmedabad micro-market. The area benefits from the upcoming Metro Line 2 along SG Highway with stations at Thaltej (1.8 km) and Vastrapur (3.2 km). School, hospital, and retail density scores are above the city average. Air quality (CPCB AQI 94) is moderate — typical for an urban corridor.

### Market Valuation (85/100)
NHB RESIDEX HPI for Ahmedabad stands at 142.3 with 8% YoY appreciation. West Ahmedabad commands a 15-20% premium over the city average. Registered sale comparables in Bodakdev for similar units (1350-1400 sqft) range from ₹1.1 Cr to ₹1.35 Cr, placing this property in the upper-mid segment.

### Risk Composite (81/100)
Flood risk is low (NASA VIIRS shows no historical inundation). Seismic zone III — standard for Gujarat. No encroachment or land-use violation flags from satellite imagery analysis. The developer has no pending insolvency proceedings.

### Structural & Physical (76/100)
1365 sqft 2BHK with contemporary specifications. CPWD construction cost index for Ahmedabad zone is 1.28× base. Construction quality ratings for Shivalik projects average 4.2/5. No major structural complaints found in buyer forums or RERA complaint portal.

### Developer Reliability (74/100)
Shivalik Group (est. 1998) has delivered 15+ projects in Ahmedabad. RERA registration MAA07768 is active with no major violations on record. However, 2 projects in the portfolio show delays of 4-6 months. MCA21 filings show moderate debt-to-equity ratio (1.4:1) — within acceptable range for mid-tier developers.

### Legal Compliance (68/100)
eCourts search returned 2 civil suits involving the developer — both related to land title disputes from 2021, currently pending. No criminal proceedings against directors. Property tax records are current. The lower score reflects the open litigation, though none involves this specific project.

### Evidence-Backed Adjustments
- **Developer +5% weight**: Verified track record from web crawl + buyer reviews
- **Location +3% weight**: Metro connectivity and price appreciation data confirmed
- **Market -2% weight**: QoQ momentum softening per NHB RESIDEX

---

*Methodology: CRUX v0.1.0 | Data freshness: <24 hours | Sources: 6 of 6 succeeded*
`;

export const SHIVALIK_LENS_MOCK_MESSAGES = [
  {
    id: "msg-shivalik-user-1",
    role: "user" as const,
    content: "Give me a full property evaluation for Shivalik Platinum, Bodakdev, Ahmedabad",
    timestamp: new Date(Date.now() - 120000).toISOString(),
  },
  {
    id: "msg-shivalik-assistant-1",
    role: "assistant" as const,
    content: "Let me pull up the complete evaluation for **Shivalik Platinum, Bodakdev, SG Highway, Ahmedabad — developed by Shivalik Group**. The CRUX score is based on 6 external data sources and verified web evidence.",
    timestamp: new Date(Date.now() - 115000).toISOString(),
    toolResults: [
      {
        type: "score" as const,
        data: {
          score_composite: SHIVALIK_PLATINUM_SCORE.score_composite,
          confidence_score: SHIVALIK_PLATINUM_SCORE.confidence_score,
          score_breakdown: SHIVALIK_PLATINUM_SCORE.score_breakdown,
          data_sources_used: SHIVALIK_PLATINUM_SCORE.data_sources_used,
          degraded: false,
          weight_adjustments: SHIVALIK_PLATINUM_SCORE.weight_adjustments,
        },
      },
    ],
  },
  {
    id: "msg-shivalik-assistant-2",
    role: "assistant" as const,
    content: SCORE_BREAKDOWN_DETAIL,
    timestamp: new Date(Date.now() - 110000).toISOString(),
  },
  {
    id: "msg-shivalik-user-2",
    role: "user" as const,
    content: "What's the litigation risk specifically?",
    timestamp: new Date(Date.now() - 60000).toISOString(),
  },
  {
    id: "msg-shivalik-assistant-3",
    role: "assistant" as const,
    content: `The litigation risk for Shivalik Platinum is **moderate**. Here's the breakdown:

**Open Litigation:**
- 2 civil suits against Shivalik Group (filed 2021) — both involve land title disputes for projects in South Ahmedabad. **Neither involves Shivalik Platinum directly.**
- No criminal proceedings against any director of Shivalik Group.
- No consumer court complaints filed against this specific project.

**RERA Status:**
- Registration MAA07768/141220 is **active and current**
- No adverse orders from Gujarat RERA Authority
- Project completion certificate was filed on time

**Property Tax:**
- Records are current with Ahmedabad Municipal Corporation
- No outstanding dues

**Verdict:** The litigation exists but is contained. It doesn't directly impact this project. The Legal Compliance score of 68/100 reflects the open cases as a caution flag — typical for developers with 15+ projects. I'd recommend monitoring case status at eCourts (CNR numbers available on request).`,
    timestamp: new Date(Date.now() - 55000).toISOString(),
  },
];