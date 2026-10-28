import type { ProjectEntry } from "@/features/projects/types";

/**
 * IBERA — Gran Parque Iberá (proyecto de Hackathon, Desafío Iberá).
 *
 * Repos privados: la tarjeta no tiene enlaces a GitHub ni consulta la API.
 * El deploy del frontend se enlaza como demo en vivo (links.demo).
 *
 * TODO: capturas del sistema en public/projects/ibera-1.png, ... y luego
 * `media: { cover: "/projects/ibera-1.png", gallery: [...] }`. Sin `cover`
 * la tarjeta usa la portada generada con la paleta del sitio.
 */
export const ibera: ProjectEntry = {
  slug: "ibera",
  repo: "FabianGQuintana/IBERA-Reclamos-Backend",
  private: true,
  featured: false,
  order: 3,
  // Presentado en una hackathon y ya desplegado; si lo aprueban, sigue el
  // desarrollo. Mantiene la etiqueta "Hackathon · Desplegado".
  status: "hackathon",

  content: {
    es: {
      title: "IBERA",
      tagline:
        "Plataforma del Gran Parque Iberá: portales, estado de los caminos, minijuegos y reportes de guardaparques sin señal.",
      problem:
        "El Iberá es uno de los humedales más grandes del mundo, pero la información para el visitante está dispersa y los turistas no tienen un canal simple para dejar quejas o sugerencias. Además, los guardaparques detectan problemas ambientales en zonas sin señal y los reportan tarde o en papel, sin ubicación ni fotos.",
      solution:
        "Un sistema de tres piezas: una landing para turistas (Next.js) con portales, estado de los caminos, minijuegos educativos y valoraciones con foto; un módulo offline para guardaparques, instalable como app (PWA), con botones grandes, GPS automático y sincronización con un solo toque; y una API en .NET 10 con PostgreSQL, roles y autenticación JWT que centraliza todo.",
      architecture: [
        "Backend en .NET 10 con Clean Architecture (API, Application, Domain e Infrastructure), Entity Framework Core y PostgreSQL.",
        "Offline-first: service worker propio e IndexedDB para guardar reportes y fotos comprimidas en el teléfono.",
        "Sincronización idempotente: cada reporte lleva un `clientId` generado en el dispositivo y se inserta en lote, así un reintento nunca duplica datos.",
        "Fotos fuera de la base de datos, en Cloudflare R2; autenticación JWT con roles (Admin, Ranger).",
        "Frontend en Next.js 16 y React 19 desplegado en Vercel; API lista para Railway con Docker.",
      ],
    },
    en: {
      title: "IBERA",
      tagline:
        "Platform for the Gran Parque Iberá: park gateways, road status, mini-games and offline incident reports for rangers.",
      problem:
        "Iberá is one of the largest wetlands in the world, but visitor information is scattered and tourists have no simple way to leave complaints or suggestions. Meanwhile, rangers spot environmental issues in areas with no signal and report them late or on paper, without location or photos.",
      solution:
        "A three-part system: a tourist landing (Next.js) with park gateways, road status, educational mini-games and reviews with photos; an offline module for rangers, installable as an app (PWA), with big buttons, automatic GPS and one-tap sync; and a .NET 10 API with PostgreSQL, roles and JWT authentication that centralizes everything.",
      architecture: [
        ".NET 10 backend with Clean Architecture (API, Application, Domain and Infrastructure), Entity Framework Core and PostgreSQL.",
        "Offline-first: hand-written service worker and IndexedDB to store reports and compressed photos on the phone.",
        "Idempotent sync: each report carries a device-generated `clientId` and is bulk-inserted, so a retry never duplicates data.",
        "Photos kept out of the database, on Cloudflare R2; JWT authentication with roles (Admin, Ranger).",
        "Next.js 16 and React 19 frontend deployed on Vercel; API ready for Railway with Docker.",
      ],
    },
  },

  highlightedTech: [
    ".NET",
    "C#",
    "PostgreSQL",
    "TypeScript",
    "React",
    "Next.js",
    "Tailwind CSS",
    "MapLibre",
    "JWT",
    "Zod",
    "Cloudflare",
  ],
  tools: [
    "Git",
    "GitHub",
    "Swagger",
    "Postman",
    "VS Code",
    "Visual Studio",
    "Docker",
    "Vercel",
    "Railway",
    "Cloudflare",
    "pgAdmin 4",
  ],
  media: { gallery: [] },
  links: {
    demo: "https://iberapp-esteros.vercel.app",
  },
};
