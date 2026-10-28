import type { ProjectEntry } from "@/features/projects/types";

/**
 * GoberTrack — NEA Tech Ideathon 2026 (hackathon provincial de Corrientes),
 * vertical Stellar.
 *
 * Repo privado: la tarjeta no tiene enlaces a GitHub ni consulta la API.
 * El tablero está desplegado en Vercel (links.demo) y el contrato en Stellar
 * testnet.
 *
 * TODO: capturas del sistema en public/projects/gobertrack-1.png, ... y luego
 * `media: { cover: "/projects/gobertrack-1.png", gallery: [...] }`. Sin
 * `cover` la tarjeta usa la portada generada con la paleta del sitio.
 */
export const goberTrack: ProjectEntry = {
  slug: "gobertrack",
  repo: "SergiNavarr/obra-publica-verificable",
  private: true,
  featured: false,
  order: 4,
  // Presentado en una hackathon y desplegado (Vercel + Stellar testnet).
  // Mantiene la etiqueta "Hackathon · Desplegado".
  status: "hackathon",

  content: {
    es: {
      title: "GoberTrack",
      tagline:
        "Obra pública verificable en blockchain: cada pago queda retenido en un smart contract de Stellar hasta que el avance se aprueba en forma independiente.",
      problem:
        "En una obra pública, nadie fuera del circuito puede comprobar que cada pago respondió a un avance real. Las aprobaciones viven en expedientes que se pueden editar después, y la ciudadanía no tiene forma de seguir en qué se gasta el presupuesto ni de detectar un pago adelantado.",
      solution:
        "Un smart contract en Rust sobre Soroban (Stellar) retiene los fondos de cada obra y libera el pago de cada hito solo con la aprobación del inspector y de un veedor independiente, después de un período de objeción y sin objeciones abiertas. Los firmantes operan desde un panel con la wallet Freighter, un backend indexa los eventos de la cadena y un tablero público muestra en vivo el estado de cada obra, sus hitos y la evidencia.",
      architecture: [
        "Smart contract multi-obra en Rust y Soroban, desplegado en Stellar testnet: es la fuente de verdad de roles, montos y reglas de pago, con un catálogo cerrado de 15 errores.",
        "Las reglas las impone la cadena: no se declara, aprueba ni paga el hito N+1 sin el N aprobado, y una objeción del veedor congela el pago hasta que el árbitro la resuelve.",
        "Evidencia verificable: el backend guarda la foto o el PDF y calcula su SHA-256, que el contratista registra on-chain al declarar el hito; cualquiera puede comprobar que el archivo no cambió.",
        "Las transacciones las firma la wallet Freighter y van directo a la red; el backend (Fastify y SQLite) solo indexa eventos del contrato y sirve una API de lectura: no firma ni paga nada.",
        "Cerca de 1.000 pruebas automatizadas entre las tres capas, incluidas pruebas de ataque al contrato (reentrada, robo de fondos entre obras y roles cruzados) y una demo de punta a punta contra testnet.",
      ],
    },
    en: {
      title: "GoberTrack",
      tagline:
        "Verifiable public works on the blockchain: every payment is held in a Stellar smart contract until progress is independently approved.",
      problem:
        "In a public works project, nobody outside the process can check that each payment matched real progress. Approvals live in records that can be edited afterwards, and citizens have no way to follow how the budget is spent or to spot an early payment.",
      solution:
        "A Rust smart contract on Soroban (Stellar) holds each project's funds and releases each milestone's payment only with the approval of the inspector and an independent auditor, after an objection period and with no open objections. Signers act from a panel with the Freighter wallet, a backend indexes on-chain events and a public dashboard shows each project, its milestones and its evidence live.",
      architecture: [
        "Multi-project smart contract in Rust and Soroban, deployed on Stellar testnet: it is the source of truth for roles, amounts and payment rules, with a closed catalog of 15 errors.",
        "Rules are enforced on-chain: milestone N+1 cannot be declared, approved or paid until N is approved, and an auditor's objection freezes the payment until the arbiter resolves it.",
        "Verifiable evidence: the backend stores the photo or PDF and computes its SHA-256, which the contractor records on-chain when declaring the milestone; anyone can check the file was not altered.",
        "Transactions are signed with the Freighter wallet and go straight to the network; the backend (Fastify and SQLite) only indexes contract events and serves a read API: it never signs or pays.",
        "Nearly 1,000 automated tests across the three layers, including attack tests on the contract (reentrancy, cross-project fund theft and mixed-up roles) and an end-to-end demo on testnet.",
      ],
    },
  },

  highlightedTech: [
    "Stellar",
    "Soroban",
    "Rust",
    "Smart Contracts",
    "Freighter",
    "TypeScript",
    "Next.js",
    "React",
    "Node.js",
    "Fastify",
    "SQLite",
    "Vitest",
  ],
  tools: ["Git", "GitHub", "VS Code", "Stellar CLI", "OpenAPI", "Vercel"],
  media: { gallery: [] },
  links: {
    demo: "https://gober-track.vercel.app",
  },
};
