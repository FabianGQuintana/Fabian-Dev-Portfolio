import type { ProjectEntry } from "@/features/projects/types";

export const versoriTorneos: ProjectEntry = {
  slug: "versori-tournament",
  // Repo privado (no se pública): la tarjeta se muestra sin enlaces a GitHub.
  repo: "FabianGQuintana/VersoriTournament-Frontend",
  private: true,
  featured: false,
  order: 3,
  status: "finished",

  content: {
    es: {
      title: "Versori Torneos",
      tagline: "El motor inteligente detrás de cada torneo de pádel.",
      problem:
        "La gestión y logística de torneos deportivos (específicamente de pádel) sufre de una alta carga operativa manual. La dependencia de hojas de cálculo genéricas y herramientas no especializadas genera cuellos de botella críticos: conflictos de horarios al coordinar múltiples sedes y canchas, errores humanos en el cálculo de posiciones durante la fase de grupos (zonas), y una transición caótica hacia las fases eliminatorias (playoffs). Esta falta de automatización resulta en una experiencia frustrante para los organizadores, que invierten horas en tareas repetitivas, y una comunicación ineficiente de los resultados hacia los jugadores.",
      solution:
        "Desarrollo de una plataforma web integral (Full-Stack) diseñada para automatizar y centralizar el ciclo de vida completo del torneo. El sistema provee un planificador de horarios interactivo con validación de conflictos en tiempo real (evitando superposiciones de turnos o canchas), automatiza el cálculo de métricas en la fase de grupos y genera dinámicamente los árboles de eliminatorias (brackets) de forma escalonada. Además, implementa un motor de persistencia inteligente para gestionar el historial y la reutilización de parejas inscritas, reduciendo el margen de error a cero y optimizando el tiempo de gestión del organizador mediante una interfaz moderna y reactiva.",
      architecture: [
        "Arquitectura de Backend Escalable: Implementación de Clean Architecture en .NET (C#) para desacoplar las reglas de negocio del framework, facilitando la mantenibilidad, la inyección de dependencias y la evolución del modelo de dominio (torneos, zonas, partidos) sin afectar la infraestructura.",
        "Manejo de Estado y UX Avanzada: Desarrollo de un Frontend en React/Vite implementando patrones de UI Optimista en el planificador interactivo. Esto permite una experiencia de usuario fluida al arrastrar y soltar partidos, respaldado por un manejo robusto de errores (rollbacks visuales) y sincronización precisa con la API.",
        "Aislamiento de Entornos: Configuración de un flujo de desarrollo moderno utilizando bases de datos PostgreSQL independientes (mediante Entity Framework Migrations y Docker) para separar estrictamente el entorno local del entorno de integración/producción (Supabase/Railway).",
        "Orquestación y Despliegue: Uso de Docker Compose para definir y ejecutar la aplicación multi-contenedor (Frontend, Backend, Database). Esto garantiza un entorno de ejecución idéntico desde la máquina del desarrollador hasta la infraestructura en la nube (Supabase/Railway).",
      ],
    },
    en: {
      title: "Versori Tournament",
      tagline: "The smart engine behind every padel tournament.",
      problem:
        "The management and logistics of sports tournaments (specifically padel) suffer from a high manual operational burden. Reliance on generic spreadsheets and non-specialized tools creates critical bottlenecks: scheduling conflicts when coordinating multiple venues and courts, human errors in standings calculation during the group stage (zones), and a chaotic transition to the knockout stages (playoffs). This lack of automation results in a frustrating experience for organizers, who invest hours in repetitive tasks, and inefficient communication of results to the players.",
      solution:
        "Development of a comprehensive Full-Stack web platform designed to automate and centralize the entire tournament lifecycle. The system provides an interactive schedule planner with real-time conflict validation (preventing overlapping shifts or courts), automates metric calculations in the group stage, and dynamically generates progressive knockout brackets. Additionally, it implements a smart persistence engine to manage the history and reuse of registered couples, reducing the margin of error to zero and optimizing the organizer's management time through a modern and reactive interface.",

      architecture: [
        "Scalable Backend Architecture: Implementation of Clean Architecture in .NET (C#) to decouple business rules from the framework, facilitating maintainability, dependency injection, and the evolution of the domain model (tournaments, zones, matches) without affecting the underlying infrastructure.",
        "Advanced State Management & UX: Development of a React/Vite Frontend implementing Optimistic UI patterns in the interactive scheduler. This enables a seamless drag-and-drop user experience for matches, backed by robust error handling (visual rollbacks) and precise API synchronization.",
        "Environment Isolation: Configuration of a modern development workflow using independent PostgreSQL databases (via Entity Framework Migrations and Docker) to strictly separate the local environment from the integration/production environment (Supabase/Railway).",
        "Orchestration and Deployment: Use of Docker Compose to define and run the multi-container application (Frontend, Backend, Database). This ensures a consistent execution environment from the developer's machine to the cloud infrastructure (Supabase/Railway).",
      ],
    },
  },

  highlightedTech: ["TypeScript", "CSS", "JavaScript", "HTML", "Docker"],
  // TODO: capturas del sistema, rutas en public/projects/ (p. ej. "/projects/ypora-1.png").
  media: {
    cover: "/projects/versori-1.png",
    gallery: [
      "/projects/versori-1.png",
      "/projects/versori-2.png",
      "/projects/versori-3.png",
      "/projects/versori-4.png",
      "/projects/versori-5.png",
      "/projects/versori-6.png",
      "/projects/versori-7.png",
      "/projects/versori-8.png",
      "/projects/versori-9.png",
      "/projects/versori-10.png",
    ],
  },
  tools: ["Git", "GitHub", "Antigravity", "Stitch", "Lovable"],
  links: {
    demo: undefined,
  },
};
