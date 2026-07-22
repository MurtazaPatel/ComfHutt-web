import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CRUX — AI Property Intelligence by ComfHutt";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          background: "linear-gradient(135deg, #F4FBF6 0%, #FFFFFF 60%)",
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "#0F0F0F",
          }}
        >
          CRUX
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 34,
            fontWeight: 600,
            color: "#16A34A",
          }}
        >
          AI Property Intelligence
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 24,
            color: "#4B5563",
          }}
        >
          Score any property in India — free, no signup required
        </div>
      </div>
    ),
    { ...size }
  );
}
