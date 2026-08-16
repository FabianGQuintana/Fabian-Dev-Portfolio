/**
 * Datos del design system.
 *
 * Los ratios de contraste NO son estimaciones: estan calculados segun la
 * formula de luminancia relativa de WCAG 2.1 contra --color-base (#0b0a0f)
 * y verificados numericamente antes de fijar la paleta.
 */

export interface Swatch {
  readonly token: string;
  readonly hex: string;
  readonly ratio: string;
  readonly level: "AAA" | "AA" | "AA-large" | "decorativo";
  readonly usage: string;
}

export interface SwatchGroup {
  readonly title: string;
  readonly note?: string;
  readonly swatches: readonly Swatch[];
}

export const swatchGroups: readonly SwatchGroup[] = [
  {
    title: "Superficies",
    note: "Negro con tinte violeta, no negro puro: el #000 produce halos duros en OLED.",
    swatches: [
      {
        token: "base",
        hex: "#0b0a0f",
        ratio: "—",
        level: "decorativo",
        usage: "Fondo del documento",
      },
      {
        token: "surface",
        hex: "#121118",
        ratio: "—",
        level: "decorativo",
        usage: "Tarjetas en reposo",
      },
      {
        token: "raised",
        hex: "#1a1823",
        ratio: "—",
        level: "decorativo",
        usage: "Hover, panel expandido",
      },
    ],
  },
  {
    title: "Texto",
    swatches: [
      {
        token: "fg",
        hex: "#ededf2",
        ratio: "16.91:1",
        level: "AAA",
        usage: "Titulares y cuerpo",
      },
      {
        token: "fg-muted",
        hex: "#a1a0ae",
        ratio: "7.66:1",
        level: "AAA",
        usage: "Descripciones",
      },
      {
        token: "fg-subtle",
        hex: "#6e6d7a",
        ratio: "3.88:1",
        level: "AA-large",
        usage: "Metadatos — solo ≥18.66px o bold ≥14px",
      },
    ],
  },
  {
    title: "Acento violeta",
    note: "Proporcion 90/7/3. El acento manda porque es escaso.",
    swatches: [
      {
        token: "accent-300",
        hex: "#c4b5fd",
        ratio: "10.69:1",
        level: "AAA",
        usage: "Focus ring, hover de enlace",
      },
      {
        token: "accent-400",
        hex: "#a78bfa",
        ratio: "7.25:1",
        level: "AAA",
        usage: "TEXTO de acento",
      },
      {
        token: "accent-500",
        hex: "#8b5cf6",
        ratio: "4.66:1",
        level: "AA",
        usage: "Iconos, bordes activos",
      },
      {
        token: "accent-600",
        hex: "#7c3aed",
        ratio: "5.70:1 (blanco encima)",
        level: "AA",
        usage: "Fondo de boton primario",
      },
      {
        token: "accent-700",
        hex: "#6d28d9",
        ratio: "—",
        level: "decorativo",
        usage: "Boton primario :active",
      },
    ],
  },
  {
    title: "Lineas y bordes",
    note: "WCAG 1.4.11 exige 3:1 en bordes de componentes interactivos. Por eso hay un token aparte.",
    swatches: [
      {
        token: "line",
        hex: "#24222e",
        ratio: "1.36:1",
        level: "decorativo",
        usage: "Separadores — decorativo, exento",
      },
      {
        token: "line-strong",
        hex: "#322f40",
        ratio: "1.71:1",
        level: "decorativo",
        usage: "Borde de tarjeta",
      },
      {
        token: "line-interactive",
        hex: "#6e6b82",
        ratio: "3.84:1",
        level: "AA",
        usage: "Inputs y controles enfocables",
      },
    ],
  },
  {
    title: "Estados",
    note: "Nunca se comunican solo por color: siempre con icono y texto.",
    swatches: [
      {
        token: "success",
        hex: "#34d399",
        ratio: "10.26:1",
        level: "AAA",
        usage: "Envio correcto, en produccion",
      },
      {
        token: "error",
        hex: "#f87171",
        ratio: "7.13:1",
        level: "AAA",
        usage: "Errores de validacion",
      },
      {
        token: "warning",
        hex: "#fbbf24",
        ratio: "11.82:1",
        level: "AAA",
        usage: "Archivado, WIP",
      },
      {
        token: "info",
        hex: "#38bdf8",
        ratio: "9.21:1",
        level: "AAA",
        usage: "Notas informativas",
      },
    ],
  },
];

export interface TypeSpec {
  readonly className: string;
  readonly token: string;
  readonly spec: string;
  readonly sample: string;
}

export const typeScale: readonly TypeSpec[] = [
  {
    className: "text-display",
    token: "display",
    spec: "clamp(2.75rem, 7vw, 5rem) · 600 · -0.03em",
    sample: "Fabián Quintana",
  },
  {
    className: "text-h2",
    token: "h2",
    spec: "clamp(2rem, 4.5vw, 3rem) · 600 · -0.02em",
    sample: "Proyectos destacados",
  },
  {
    className: "text-h3",
    token: "h3",
    spec: "clamp(1.25rem, 2vw, 1.5rem) · 600 · -0.01em",
    sample: "Sistema de Gestión Comercial",
  },
  {
    className: "text-body-lg",
    token: "body-lg",
    spec: "1.125rem · 400 · lh 1.7",
    sample: "Diseño la base de datos, construyo la API y pulo la interfaz.",
  },
  {
    className: "text-body",
    token: "body",
    spec: "1rem · 400 · lh 1.7",
    sample: "Sistemas completos, con arquitectura limpia.",
  },
  {
    className: "text-label font-mono",
    token: "label",
    spec: "0.8125rem · 500 · mono",
    sample: "Actualizado hace 3 días",
  },
  {
    className: "text-eyebrow font-mono uppercase",
    token: "eyebrow",
    spec: "0.75rem · 500 · 0.15em · mono",
    sample: "// Proyectos",
  },
];
