import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CRUX Property Score";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface PeekResponse {
  success: boolean;
  data?: { score_composite: number; grade: string };
}

interface PropertyResponse {
  success: boolean;
  data?: { address_raw: string; city: string | null };
}

function scoreColor(score: number): string {
  if (score < 30) return "#EF4444";
  if (score <= 55) return "#F59E0B";
  return "#16A34A";
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
  const grade = peekRes?.data?.grade;
  const address = propertyRes?.data?.city || propertyRes?.data?.address_raw?.slice(0, 40) || "Property Report";

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
          background: "linear-gradient(135deg, #F4FBF6 0%, #FFFFFF 60%)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 620 }}>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 800, color: "#0F0F0F", letterSpacing: "-0.03em" }}>
            CRUX
          </div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 32, fontWeight: 600, color: "#111827" }}>
            {address}
          </div>
          <div style={{ display: "flex", marginTop: 12, fontSize: 22, color: "#6B7280" }}>
            AI Property Intelligence Score
          </div>
        </div>

        {typeof score === "number" ? (
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
            <div style={{ display: "flex", fontSize: 88, fontWeight: 800, color: "#0F0F0F" }}>{Math.round(score)}</div>
            <div style={{ display: "flex", fontSize: 26, fontWeight: 600, color: scoreColor(score) }}>{grade}</div>
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
              background: "#F4FBF6",
              border: "14px solid #16A34A33",
              fontSize: 28,
              fontWeight: 600,
              color: "#16A34A",
              textAlign: "center",
            }}
          >
            View Score
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}
