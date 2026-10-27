import type { ProjectEntry } from "@/features/projects/types";

/**
 * CountrySecure — proyecto dividido en API + Frontend.
 *
 * Los stats de GitHub se leen del repositorio principal (la API, donde vive
 * el backend). El frontend se enlaza desde la tarjeta via `links.frontendRepo`,
 * sin hacer peticiones extra a la API de GitHub.
 *
 * Sin demo en vivo: se desplegó en AWS durante el bootcamp y hoy está dado
 * de baja.
 *
 * TODO: capturas del sistema en public/projects/country-secure-1.png, ... y
 * luego `media: { cover: "...", gallery: [...] }`. Sin `cover` la tarjeta usa
 * la portada generada con la paleta del sitio.
 */
export const countrySecure: ProjectEntry = {
  slug: "country-secure",
  repo: "FabianGQuintana/CountrySecure-API",
  featured: true,
  order: 2,
  status: "finished",

  content: {
    es: {
      title: "CountrySecure",
      tagline:
        "Control de accesos y gestión de barrios privados, con pases QR firmados y portales para administración, residentes y guardia.",
      problem:
        "En un barrio privado, el ingreso de visitas depende de llamadas a la guardia, planillas en papel y mensajes de WhatsApp. No queda claro quién autorizó a quién ni a qué hora entró o salió cada persona, y un permiso se puede reutilizar o falsificar. Además, lotes, reservas de amenities y pedidos de mantenimiento se gestionan en herramientas separadas.",
      solution:
        "Una API REST en .NET y un frontend en Next.js con tres portales según el rol: el residente autoriza visitas y genera un pase QR (también en PDF), reserva amenities y hace pedidos; la guardia escanea el QR desde el navegador, valida la ventana horaria y registra ingresos y egresos; la administración gestiona usuarios, lotes, propiedades, reservas y órdenes de servicio desde un panel con estadísticas.",
      architecture: [
        "Clean Architecture en 4 capas (Domain, Application, Infrastructure y API): la lógica de negocio depende solo de interfaces y se testea con xUnit y NSubstitute, sin base de datos real.",
        "Repositorios y Unit of Work sobre EF Core y PostgreSQL, con migraciones versionadas y soft delete mediante filtros globales de consulta.",
        "Pases QR firmados con HMAC-SHA256: el QR lleva el id y una firma que solo el servidor puede generar, así nadie fabrica ni altera un pase a partir de una foto.",
        "JWT de vida corta con refresh token rotativo y autorización deny-by-default con políticas por rol; en el frontend, un proxy de Next.js protege cada portal según el rol.",
        "Recuperación de contraseña segura: solo se guarda el hash del token, el enlace vence y se usa una sola vez, hay rate limiting por IP y se revocan todas las sesiones al cambiarla.",
      ],
    },
    en: {
      title: "CountrySecure",
      tagline:
        "Access control and management for gated communities, with signed QR passes and portals for administration, residents and security staff.",
      problem:
        "In a gated community, letting visitors in relies on calls to the guard house, paper logs and WhatsApp messages. There is no reliable record of who authorized whom or when each person entered or left, and a pass can be reused or forged. On top of that, lots, amenity bookings and maintenance requests are handled in separate tools.",
      solution:
        "A .NET REST API and a Next.js frontend with three role-based portals: residents authorize visits and generate a QR pass (also as a PDF), book amenities and file requests; security staff scan the QR in the browser, check the authorized time window and log entries and exits; administrators manage users, lots, properties, bookings and service orders from a dashboard with statistics.",
      architecture: [
        "4-layer Clean Architecture (Domain, Application, Infrastructure and API): business logic depends only on interfaces and is tested with xUnit and NSubstitute, without a real database.",
        "Repositories and Unit of Work on top of EF Core and PostgreSQL, with versioned migrations and soft delete through global query filters.",
        "QR passes signed with HMAC-SHA256: the QR carries the id and a signature only the server can produce, so nobody can forge or tamper with a pass from a photo.",
        "Short-lived JWTs with rotating refresh tokens and deny-by-default authorization with role policies; on the frontend, a Next.js proxy guards each portal by role.",
        "Secure password recovery: only the token hash is stored, the link expires and works once, the endpoint is rate limited per IP and every session is revoked on change.",
      ],
    },
  },

  highlightedTech: [
    ".NET",
    "C#",
    "EF Core",
    "PostgreSQL",
    "JWT",
    "FluentValidation",
    "xUnit",
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "NextAuth.js",
    "React Hook Form",
    "Zod",
  ],
  // TODO: capturas del sistema, rutas en public/projects/ (p. ej. "/projects/country-secure-1.png").
  media: { gallery: [] },
  tools: ["Docker", "pgAdmin 4", "Swagger", "Git", "GitHub", "AWS"],
  links: {
    frontendRepo: "FabianGQuintana/CountrySecure-Fronted",
  },
};
