import { ImageResponse } from "next/og";

// สำหรับหน้า Home - Dynamic OG Image
export const runtime = "edge";
export const alt = "UnfakeNews - Multilingual News Platform";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: "bold",
            marginBottom: 20,
          }}
        >
          UnfakeNews
        </div>
        <div
          style={{
            fontSize: 40,
            opacity: 0.9,
            textAlign: "center",
            maxWidth: 1000,
          }}
        >
          Multilingual News Platform
        </div>
        <div
          style={{
            fontSize: 32,
            marginTop: 20,
            opacity: 0.8,
          }}
        >
          🌍 15 Languages • 📰 Global News
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
