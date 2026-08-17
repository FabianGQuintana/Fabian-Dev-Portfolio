import type { Locale } from "@/i18n/routing";

/**
 * Contenido de la sección About.
 *
 * Borrador inicial acorde al rol y a la tagline ya aprobados — personalizalo
 * con tu texto real cuando quieras, el componente no cambia.
 */
export const aboutContent = {
  bio: {
    es: "Trabajo de punta a punta: modelo los datos, diseño la API y construyo la interfaz que los conecta. Me interesa la arquitectura tanto como el detalle visual — un sistema bien pensado es tan parte del producto como lo que se ve en pantalla.",
    en: "I work end to end: I model the data, design the API and build the interface that connects them. I care about architecture as much as visual detail — a well-thought system is as much part of the product as what shows on screen.",
  } satisfies Record<Locale, string>,
} as const;

/**
 * Stack técnico mostrado como badges.
 * Hoy refleja las tecnologías confirmadas de este proyecto — sumale las
 * tuyas (backend, base de datos, infraestructura) cuando quieras.
 */
export const techStack: readonly string[] = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "PostgreSQL",
  "Tailwind CSS",
];
