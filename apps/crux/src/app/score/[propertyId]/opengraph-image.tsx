import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CRUX Grade for a Gujarat property";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface PeekResponse {
  success: boolean;
  data?: {
    score_composite: number | null;
    grade: string | null;
    /** Optional — rendered only when the API supplies it. */
    created_at?: string;
  };
}

interface PropertyResponse {
  success: boolean;
  data?: { address_raw: string; address_normalized?: string | null; city: string | null };
}

/** Brand green (#10B981). Kept literal because an OG image gets no CSS variables. */
const CRUX_GREEN = "#10B981";

/** Matches scoreColor() in @/lib/grade — the same thresholds, hard-coded for the edge runtime. */
function scoreColor(score: number): string {
  if (score < 30) return "#EF4444";
  if (score <= 55) return "#F59E0B";
  return CRUX_GREEN;
}

/** Trim to a word boundary rather than mid-word, and mark the trim. */
function truncate(text: string, max: number): string {
  const clean = text.trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

export default async function ScoreOpengraphImage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  const [peekRes, propertyRes] = await Promise.all([
    fetch(`${apiUrl}/crux/score/${propertyId}/peek`).then((r) => r.json() as Promise<PeekResponse>).catch(() => null),
    fetch(`${apiUrl}/crux/property/${propertyId}`).then((r) => r.json() as Promise<PropertyResponse>).catch(() => null),
  ]);

  const score = peekRes?.data?.score_composite;
  const grade = peekRes?.data?.grade?.trim() || null;
  const notRated = grade?.toUpperCase() === "NR";
  const hasScore = typeof score === "number" && Number.isFinite(score) && !notRated;

  // Lead with what the sharer searched for — the project's name. This used to prefer
  // `city`, so a card shared for "Shivalik Platinum, Bodakdev" read simply
  // "Ahmedabad": the one piece of information the recipient needs, dropped. The
  // geocoded city is the fallback, not the headline.
  const property = propertyRes?.data;
  const rawName = property?.address_raw || property?.address_normalized || "";
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawName);
  const headline = rawName && !isUuid ? truncate(rawName, 62) : property?.city || "Property report";

  const gradedOn = peekRes?.data?.created_at
    ? new Date(peekRes.data.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "70px",
          background: "linear-gradient(135deg, #ECFDF5 0%, #FFFFFF 60%)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 620 }}>
          <div
            style={{
              display: "flex",
              fontSize: 40,
              fontWeight: 800,
              color: "#09090B",
              letterSpacing: "-0.03em",
            }}
          >
            CRUX
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 22,
              fontSize: 34,
              fontWeight: 600,
              color: "#09090B",
              lineHeight: 1.2,
            }}
          >
            {headline}
          </div>
          {property?.city && rawName && !isUuid && (
            <div style={{ display: "flex", marginTop: 10, fontSize: 22, color: "#52525B" }}>
              {property.city}
            </div>
          )}
          <div style={{ display: "flex", marginTop: 20, fontSize: 21, color: "#52525B" }}>
            {/* The product's own term, and the coverage it actually has. */}
            CRUX Grade · property intelligence for Gujarat
          </div>
          {gradedOn && (
            // A grade without its date reads as permanently current. It is a
            // snapshot of the public record on one day.
            <div style={{ display: "flex", marginTop: 10, fontSize: 18, color: "#A1A1AA" }}>
              Graded {gradedOn}
            </div>
          )}
        </div>

        {hasScore ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: 280,
              height: 280,
              borderRadius: "50%",
              background: "#FFFFFF",
              border: `14px solid ${scoreColor(score)}`,
            }}
          >
            <div style={{ display: "flex", fontSize: 88, fontWeight: 800, color: "#09090B" }}>
              {Math.round(score)}
            </div>
            {grade && (
              <div style={{ display: "flex", fontSize: 26, fontWeight: 600, color: scoreColor(score) }}>
                Grade {grade}
              </div>
            )}
          </div>
        ) : notRated ? (
          // NR is a deliberate refusal to grade thin data, not a missing score, and
          // the card should say so rather than inviting a click to a blank report.
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: 280,
              height: 280,
              borderRadius: "50%",
              background: "#FFFFFF",
              border: "14px solid #D4D4D8",
              textAlign: "center",
              padding: "0 28px",
            }}
          >
            <div style={{ display: "flex", fontSize: 56, fontWeight: 800, color: "#52525B" }}>NR</div>
            <div style={{ display: "flex", marginTop: 8, fontSize: 19, color: "#52525B" }}>
              Not enough verified data
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 280,
              height: 280,
              borderRadius: "50%",
              background: "#ECFDF5",
              border: `14px solid ${CRUX_GREEN}33`,
              fontSize: 28,
              fontWeight: 600,
              color: "#047857",
              textAlign: "center",
            }}
          >
            View grade
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}
