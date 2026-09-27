import { ImageResponse } from "next/og";
import { fetchShareCard } from "@/lib/share-card";

export const alt = "A shared CRUX verdict";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Brand green (#10B981). Literal because an OG image gets no CSS variables. */
const CRUX_GREEN = "#10B981";

/** Matches scoreColor() in @/lib/grade — same thresholds, inlined for this runtime. */
function scoreColor(score: number): string {
  if (score < 30) return "#EF4444";
  if (score <= 55) return "#F59E0B";
  return CRUX_GREEN;
}

function truncate(text: string, max: number): string {
  const clean = text.trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

/**
 * The unfurl for a shared verdict.
 *
 * This is the image that decides whether a forwarded CRUX link gets opened, so it
 * carries the property and the number and nothing else. An expired card is drawn
 * without its score: a stale grade shown full-size in a chat preview is read as
 * current, and the preview is the part nobody clicks through to correct.
 */
export default async function CardOpengraphImage({
  params,
}: {
  params: Promise<{ shareToken: string }>;
}) {
  const { shareToken } = await params;
  const result = await fetchShareCard(shareToken);

  const card = result.status === "ok" || result.status === "expired" ? result.card : null;
  const expired = result.status === "expired";
  const raw = card?.card_data.score_composite;
  const score = !expired && typeof raw === "number" && Number.isFinite(raw) ? Math.round(raw) : null;

  const headline = card ? truncate(card.card_data.address, 62) : "Shared verdict";
  const location = card
    ? [card.card_data.city, card.card_data.state].filter(Boolean).join(", ")
    : "";

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
          {location && (
            <div style={{ display: "flex", marginTop: 10, fontSize: 22, color: "#52525B" }}>
              {location}
            </div>
          )}
          <div style={{ display: "flex", marginTop: 20, fontSize: 21, color: "#52525B" }}>
            {expired
              ? "Shared verdict · link expired"
              : "A verdict from Gujarat's public record"}
          </div>
        </div>

        {score !== null ? (
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
              {score}
            </div>
            <div style={{ display: "flex", fontSize: 24, color: "#52525B" }}>out of 100</div>
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
              fontSize: 26,
              fontWeight: 600,
              color: "#047857",
              textAlign: "center",
              padding: "0 30px",
            }}
          >
            {expired ? "Link expired" : "Open verdict"}
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}
