import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { site } from "@/lib/site"

export const alt = `${site.name}, desarrollador full stack en Colombia`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  const [sans, mono] = await Promise.all([
    readFile(join(process.cwd(), "assets/Geist-SemiBold.ttf")),
    readFile(join(process.cwd(), "assets/GeistMono-Medium.ttf")),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#000000",
          color: "#ededed",
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: "Geist Mono", fontSize: 30 }}>
          <span>lim</span>
          <span style={{ width: 16, height: 32, background: "#ff5a52" }} />
          <span style={{ color: "#9b9b9b" }}>@{site.handle}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 80, lineHeight: 1.05, letterSpacing: -3 }}>
          <span>Construyo para la web</span>
          <span style={{ color: "#9b9b9b" }}>y después intento romperla.</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "Geist Mono",
            fontSize: 26,
            color: "#9b9b9b",
          }}
        >
          <span>Full stack · Next.js · JavaScript</span>
          <div style={{ display: "flex", gap: 12 }}>
            <span style={{ color: "#ff5a52" }}>red team</span>
            <span>/</span>
            <span style={{ color: "#4a90ff" }}>blue team</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: sans, weight: 600, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  )
}
