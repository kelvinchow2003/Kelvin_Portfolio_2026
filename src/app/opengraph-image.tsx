import { ImageResponse } from "next/og";
import { NAME, ROLE } from "@/lib/site";

// The preview card shown when the site is shared (LinkedIn, Slack, iMessage…):
// a Wii Menu with the name front and centre.

export const alt = `${NAME} · Portfolio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TILES = ["Mii Channel", "Skills Channel", "Resume Channel", "Projects Channel"];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(180deg, #f6f6f6 0%, #e9e9ea 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* a row of channel tiles, fading toward the name */}
        <div style={{ display: "flex", gap: 28, padding: "48px 64px 0", opacity: 0.55 }}>
          {TILES.map((t) => (
            <div
              key={t}
              style={{
                width: 250,
                height: 120,
                borderRadius: 22,
                border: "3px solid #b4b4b4",
                background: "linear-gradient(180deg, #ffffff 0%, #eeeeee 100%)",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                paddingBottom: 16,
                fontSize: 22,
                color: "#6b6c71",
              }}
            >
              {t}
            </div>
          ))}
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 104, fontWeight: 900, color: "#2f9fcb", letterSpacing: -2 }}>{NAME}</div>
          <div style={{ marginTop: 18, fontSize: 34, color: "#4a4a50", maxWidth: 1000, textAlign: "center" }}>{ROLE}</div>
        </div>

        {/* the curved grey bar along the bottom of the Wii Menu */}
        <div
          style={{
            height: 110,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 56px",
            borderTop: "5px solid #3cb8e0",
            background: "linear-gradient(180deg, #c9cace 0%, #d6d7dc 100%)",
          }}
        >
          <div
            style={{
              width: 78,
              height: 78,
              borderRadius: 999,
              border: "3px solid #4fbde0",
              background: "linear-gradient(180deg, #f4f4f4 0%, #d6d6d8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 900,
              color: "#a4a4a4",
            }}
          >
            Wii
          </div>
          <div style={{ fontSize: 30, color: "#65666b" }}>Click a channel to start</div>
          <div
            style={{
              width: 78,
              height: 78,
              borderRadius: 999,
              border: "3px solid #4fbde0",
              background: "linear-gradient(180deg, #f4f4f4 0%, #d6d6d8 100%)",
            }}
          />
        </div>
      </div>
    ),
    size
  );
}
