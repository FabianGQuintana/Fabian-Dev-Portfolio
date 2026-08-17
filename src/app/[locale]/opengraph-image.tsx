import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";
import { routing, type Locale } from "@/i18n/routing";

/**
 * OG image por locale (1200x630). Se renderiza por ruta, asi que el tag
 * `og:image` que genera Next apunta a la URL de esa pagina concreta.
 *
 * Tipografia: Geist desde node_modules, leida como buffer (requisito de
 * ImageResponse). `export const alt` y `export const size` son convencion
 * de Next para la ruta de imagen dinamica.
 */

export const size = { width: 1200, height: 630 } as const;
export const contentType = "image/png";

export const alt = siteConfig.tagline.es;

async function loadFont(weight: "Regular" | "SemiBold") {
  const path = join(
    process.cwd(),
    "node_modules",
    "geist",
    "dist",
    "fonts",
    "geist-sans",
    `Geist-${weight}.woff2`,
  );
  return readFile(path);
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale)) {
    return new ImageResponse(
      <div style={{ background: "#0b0a0f", color: "#ededf2" }}>
        Invalid locale
      </div>,
      size,
    );
  }

  const [regular, semiBold] = await Promise.all([
    loadFont("Regular"),
    loadFont("SemiBold"),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0b0a0f",
        color: "#ededf2",
        padding: "64px 72px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "9999px",
            background: "#8b5cf6",
          }}
        />
        <div style={{ fontSize: "28px", color: "#a1a0ae" }}>
          {siteConfig.name}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ fontSize: "72px", fontWeight: 600 }}>
          {siteConfig.role}
        </div>
        <div
          style={{
            fontSize: "34px",
            lineHeight: 1.5,
            color: "#a1a0ae",
            maxWidth: "900px",
          }}
        >
          {siteConfig.tagline[locale]}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div
          style={{
            width: "88px",
            height: "6px",
            borderRadius: "9999px",
            background: "#7c3aed",
          }}
        />
        <div style={{ fontSize: "28px", color: "#6e6d7a" }}>
          fullstack dev · {locale}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Geist", data: semiBold, weight: 600, style: "normal" },
      ],
    },
  );
}
