import { CanvasTexture, SRGBColorSpace } from "three";

/**
 * Texturas dibujadas en un <canvas> en tiempo de ejecucion.
 *
 * Las leyendas y los logos se pintan en blanco: el color final (el RGB que
 * recorre el teclado) lo aplica el material multiplicando la textura. Asi
 * hay una textura por tecla y cero archivos de imagen o fuentes que
 * descargar.
 */

const PX_PER_U = 128;

/** Leyenda de una tecla. `width` en u: el canvas respeta la proporcion. */
export function createLegendTexture(label: string, width: number) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(PX_PER_U * width);
  canvas.height = PX_PER_U;
  const ctx = canvas.getContext("2d");

  if (ctx && label) {
    const isWord = label.length > 1;
    ctx.fillStyle = "#ffffff";
    ctx.font = `600 ${isWord ? 34 : 64}px ui-monospace, "SF Mono", Menlo, Consolas, monospace`;
    ctx.textBaseline = "middle";
    // Letras centradas; modificadores alineados arriba a la izquierda,
    // como en un teclado real.
    if (isWord) {
      ctx.textAlign = "left";
      ctx.fillText(label, 22, 40);
    } else {
      ctx.textAlign = "center";
      ctx.fillText(label, canvas.width / 2, PX_PER_U / 2 + 2);
    }
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/* Paths de Simple Icons (CC0) en un viewBox de 24x24. */
const GITHUB_PATH =
  "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12";
const LINKEDIN_PATH =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";
/* Sobre de correo (trazo, estilo lucide). */
const MAIL_OUTLINE =
  "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z";
const MAIL_FLAP = "M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7";

export type SocialIconId = "github" | "linkedin" | "gmail";

export function createLogoTexture(id: SocialIconId) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const scale = (size * 0.58) / 24;
    ctx.translate((size - 24 * scale) / 2, (size - 24 * scale) / 2);
    ctx.scale(scale, scale);
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#ffffff";

    if (id === "gmail") {
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke(new Path2D(MAIL_OUTLINE));
      ctx.stroke(new Path2D(MAIL_FLAP));
    } else {
      ctx.fill(new Path2D(id === "github" ? GITHUB_PATH : LINKEDIN_PATH));
    }
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}
