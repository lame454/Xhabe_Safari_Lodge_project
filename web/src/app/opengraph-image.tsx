import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Xhabe Safari Lodge in Chobe, Botswana";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ background: "#1e251c", color: "#fcf9f2", display: "flex", height: "100%", width: "100%", padding: "80px", flexDirection: "column", justifyContent: "flex-end" }}>
      <div style={{ color: "#e5d096", fontSize: 28, letterSpacing: 8, textTransform: "uppercase" }}>Chobe District · Botswana</div>
      <div style={{ fontFamily: "serif", fontSize: 88, lineHeight: 1.05, marginTop: 24 }}>Xhabe Safari Lodge</div>
      <div style={{ fontSize: 32, marginTop: 24, color: "#e5d096" }}>Wilderness, unfiltered.</div>
    </div>,
    size,
  );
}
