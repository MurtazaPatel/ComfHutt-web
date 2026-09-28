import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "CRUX — the credibility grade for Gujarat's RERA projects, A+ to D";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Colours are literal here, unlike everywhere else in the app.
 *
 * Satori renders this image outside the document, so `var(--color-crux-*)` has
 * nothing to resolve against. #10B981 is the brand green from globals.css — kept
 * in sync by hand because there is no stylesheet at this point. (The previous
 * version used #16A34A, the rejected green.)
 */
const GREEN = "#10B981";
const INK = "#09090B";
const MUTED = "#52525B";
const BORDER = "#E4E4E7";

const GRADES = ["A+", "A", "B+", "B", "C+", "C", "D"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #ECFDF5 0%, #FFFFFF 60%)",
        }}
      >
        <div
          style={{
            fontSize: 112,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: INK,
          }}
        >
          CRUX
        </div>

        {/* The letter grade leads. The composite number is never the headline. */}
        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          {GRADES.map((g) => (
            <div
              key={g}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 64,
                padding: "10px 16px",
                borderRadius: 14,
                border: `2px solid ${g === "A+" ? GREEN : BORDER}`,
                color: g === "A+" ? GREEN : MUTED,
                background: "#FFFFFF",
                fontSize: 30,
                fontWeight: 700,
              }}
            >
              {g}
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 34,
            fontSize: 30,
            fontWeight: 600,
            color: INK,
          }}
        >
          The credibility grade for Gujarat&rsquo;s RERA projects
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 22,
            color: MUTED,
          }}
        >
          Certified filings and court records. Free for buyers. Published method.
        </div>
      </div>
    ),
    { ...size }
  );
}
