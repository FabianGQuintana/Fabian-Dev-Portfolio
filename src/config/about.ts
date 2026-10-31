import type { Locale } from "@/i18n/routing";

/**
 * Contenido de la sección About.
 *
 * `bio` es la intro (tambien alimenta la descripcion del JSON-LD) y
 * `process` los pasos de mi forma de trabajar, en orden.
 */
export interface AboutProcessStep {
  readonly title: Record<Locale, string>;
  readonly description: Record<Locale, string>;
}

export const aboutContent = {
  bio: {
    es: "Trabajo de punta a punta y encaro cada proyecto con el mismo proceso: primero entiendo el problema, después planifico y construyo bases sólidas, y recién entonces diseño la mejor experiencia posible para quien lo va a usar.",
    en: "I work end to end and approach every project with the same process: first I understand the problem, then I plan and build solid foundations, and only then do I design the best possible experience for the people who will use it.",
  } satisfies Record<Locale, string>,
  process: [
    {
      title: {
        es: "Relevo los requerimientos",
        en: "I gather the requirements",
      },
      description: {
        es: "Aplico lo aprendido en la facultad sobre Especificación de Requerimientos de Software (ERS): entrevistas con los interesados, análisis del proceso actual y requerimientos funcionales y no funcionales bien documentados antes de escribir código.",
        en: "I apply what I learned at university about Software Requirements Specification (SRS): stakeholder interviews, analysis of the current process, and well-documented functional and non-functional requirements before writing any code.",
      },
    },
    {
      title: {
        es: "Defino la arquitectura y los datos",
        en: "I define the architecture and data",
      },
      description: {
        es: "Elijo la arquitectura según lo que el sistema necesita y modelo la base de datos para que refleje fielmente el dominio del negocio.",
        en: "I choose the architecture based on what the system needs and model the database so it faithfully reflects the business domain.",
      },
    },
    {
      title: {
        es: "Construyo un backend robusto",
        en: "I build a robust backend",
      },
      description: {
        es: "Levanto las bases del backend con la seguridad pensada desde el diseño: validación, control de acceso, manejo de errores y buenas prácticas para que sea confiable y fácil de mantener.",
        en: "I lay the backend foundations with security built in from the start: validation, access control, error handling and best practices so it stays reliable and easy to maintain.",
      },
    },
    {
      title: {
        es: "Diseño pensando en el usuario",
        en: "I design with the user in mind",
      },
      description: {
        es: "Por último, desarrollo el frontend cuidando cada detalle: interfaces claras, accesibles y rápidas, siempre pensando en quien las va a usar.",
        en: "Finally, I build the frontend with care for every detail: clear, accessible and fast interfaces, always thinking about the people who will use them.",
      },
    },
  ] satisfies readonly AboutProcessStep[],
} as const;

export interface AboutPhoto {
  /** Ruta bajo public/, p. ej. "/about/fabian.png". */
  readonly src: string;
  readonly alt: Record<Locale, string>;
}

/**
 * Foto del retrato de la seccion Sobre mi (null = placeholder con iniciales).
 *
 * El marco es vertical 3:4: con una foto de ese ratio entra completa, sin
 * recortes. Se sirve tal cual, sin recompresion: por eso el archivo ya esta
 * optimizado (WebP 960x1280, ~145 KB, nitido hasta pantallas 3x) en vez del
 * PNG original de 2,3 MB, que en movil era la descarga mas pesada del sitio.
 */
export const aboutPhoto: AboutPhoto | null = {
  src: "/about/fabian-quintana.webp",
  alt: {
    es: "Retrato profesional de Fabian Quintana",
    en: "Professional portrait of Fabian Quintana",
  },
};

/**
 * Tecnologias del perfil. NO se muestran en la pagina: solo alimentan los
 * datos estructurados (JSON-LD `knowsAbout`) para buscadores.
 */
export const techStack: readonly string[] = [
  "C#",
  ".NET",
  "PostgreSQL",
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind CSS",
  "Docker",
];
