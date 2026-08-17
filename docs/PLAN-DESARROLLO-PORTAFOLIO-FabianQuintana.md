# PLAN DE DESARROLLO — Portafolio Profesional
### Fabián Quintana · Fullstack Developer

> **Documento de arquitectura y ejecución**
> Versión 1.0 · 16 de agosto de 2026
> GitHub: [@FabianGQuintana](https://github.com/FabianGQuintana)

---

## Índice

1. [Resumen ejecutivo y decisiones cerradas](#1-resumen-ejecutivo-y-decisiones-cerradas)
2. [Stack técnico definitivo](#2-stack-técnico-definitivo)
3. [Arquitectura general](#3-arquitectura-general)
4. [Estrategia de integración con GitHub](#4-estrategia-de-integración-con-github-el-núcleo-del-proyecto)
5. [Estructura de carpetas (Clean Code)](#5-estructura-de-carpetas-clean-code)
6. [Sistema de diseño: paleta y tipografía](#6-sistema-de-diseño-paleta-y-tipografía)
7. [Lenguaje de animación con Motion](#7-lenguaje-de-animación-con-motion)
8. [Internacionalización bilingüe](#8-internacionalización-bilingüe)
9. [Formulario de contacto funcional](#9-formulario-de-contacto-funcional)
10. [Accesibilidad, SEO y performance](#10-accesibilidad-seo-y-performance)
11. [Roadmap de construcción por fases](#11-roadmap-de-construcción-por-fases)
12. [Anexos](#12-anexos)

---

## 1. Resumen ejecutivo y decisiones cerradas

Este documento define la arquitectura completa de un portafolio web profesional cuyo objetivo no es ser una galería de trabajos visuales, sino **una demostración de criterio de ingeniería**. El portafolio en sí es la primera prueba técnica: quien lo audite debe encontrar código limpio, decisiones justificadas y una arquitectura que escala.

### Decisiones tomadas en la Fase 1

| Dimensión | Decisión | Implicancia arquitectónica |
|---|---|---|
| **Estilo visual** | Dark-Tech minimalista, acento violeta | Sistema de tokens semánticos oscuro-nativo. No es "modo oscuro" de un tema claro: el oscuro es el estado base. |
| **Integración GitHub** | Curaduría manual + datos en vivo | Un registro local de proyectos define *qué* se muestra; la API de GitHub define *el estado actual* de cada uno. |
| **Profundidad de proyecto** | Tarjetas + detalle expandible | Sin rutas por proyecto. Estado de UI compartido, animación de layout con `layoutId`. |
| **Punto de partida** | Desde cero | Libertad total de arquitectura, sin deuda técnica heredada. |
| **Idioma** | Bilingüe ES / EN | Enrutamiento por locale, diccionarios externalizados, contenido de proyectos bilingüe. |
| **Estructura** | One-Page con anclas | Una ruta principal por locale; navegación por scroll, no por navegación de página. |
| **Contacto** | Formulario funcional | Server Action + servicio de email transaccional + validación + anti-spam. |
| **CV** | Placeholder por ahora | Componente `<ResumeButton>` con estado `disabled` controlado por config. Un flag lo activa cuando el PDF exista. |
| **Deploy** | Vercel (subdominio gratuito) | Vercel Analytics nativo; ISR y Server Actions sin configuración adicional. |

### Principio rector

> **Curaduría sobre automatización.** Un portafolio que lista automáticamente los 40 repositorios de una cuenta comunica volumen. Un portafolio que muestra 6 sistemas con su problema, su arquitectura y su estado actual comunica criterio. Este plan optimiza para lo segundo, pero mantiene el costo de agregar un proyecto en **un solo archivo**.

---

## 2. Stack técnico definitivo

### 2.1 Núcleo

| Paquete | Versión objetivo | Rol |
|---|---|---|
| `next` | 16.3.x (LTS actual) | Framework, App Router, Server Components, Server Actions, ISR |
| `react` / `react-dom` | 19.x | Librería de UI |
| `typescript` | 5.x | Tipado estático — **modo `strict` obligatorio** |
| `tailwindcss` | 4.x | Sistema de estilos con tokens en CSS nativo (`@theme`) |
| `motion` | 12.x | Animaciones, transiciones y microinteracciones |

> **Nota sobre versiones:** Next.js 16.3 es la versión LTS vigente a agosto de 2026. Al inicializar el proyecto conviene fijar las versiones exactas en `package.json` (sin `^`) para que el entorno sea reproducible, y actualizar de forma deliberada.

### 2.2 Soporte

| Paquete | Rol | Justificación |
|---|---|---|
| `next-intl` | i18n ES/EN | Integración nativa con App Router y Server Components; sin hidratación de diccionarios en el cliente. |
| `zod` | Validación de esquemas | Valida el formulario **y** las respuestas de la API de GitHub. Fuente única de verdad para los tipos. |
| `resend` | Envío de emails | API moderna, plan gratuito suficiente (3.000 emails/mes), SDK de primera clase para Next.js. |
| `@vercel/analytics` | Métricas de visitas | Sin cookies, sin banner de consentimiento, integración de una línea. |
| `@vercel/speed-insights` | Core Web Vitals reales | Mide el rendimiento percibido por usuarios reales, no sólo en Lighthouse. |
| `lucide-react` | Iconografía | Set coherente, tree-shakeable, estilo de trazo alineado con la estética técnica. |
| `clsx` + `tailwind-merge` | Composición de clases | Utilidad `cn()` para variantes sin conflictos de especificidad. |
| `class-variance-authority` | Variantes de componentes | Define las variantes de un componente como datos tipados, no como cadenas de condicionales. |
| `geist` | Tipografía | Fuentes Geist Sans y Geist Mono optimizadas vía `next/font`. |

### 2.3 Calidad

| Herramienta | Rol |
|---|---|
| ESLint (`eslint-config-next`) + `@typescript-eslint` | Linting con reglas estrictas |
| Prettier + `prettier-plugin-tailwindcss` | Formato consistente y orden canónico de clases |
| Husky + `lint-staged` | Pre-commit hook: no entra código sin lint ni tipos válidos |
| `@axe-core/react` (solo en dev) | Detecta violaciones de accesibilidad en tiempo de desarrollo |

### 2.4 Comandos de inicialización

```bash
# 1 · Scaffold del proyecto
npx create-next-app@latest portfolio-fabian \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --use-npm

cd portfolio-fabian

# 2 · Animaciones (solicitado explícitamente)
npm install motion

# 3 · Núcleo funcional
npm install next-intl zod resend

# 4 · Analytics de Vercel
npm install @vercel/analytics @vercel/speed-insights

# 5 · UI y utilidades
npm install lucide-react clsx tailwind-merge class-variance-authority geist

# 6 · Calidad (desarrollo)
npm install -D prettier prettier-plugin-tailwindcss husky lint-staged @axe-core/react
npx husky init
```

### 2.5 Nota sobre las skills solicitadas

Los comandos `npx skills add ...` que indicaste (`ui-ux-pro-max` e `interface-design`) instalan skills en el directorio local `.claude/skills` de **Claude Code corriendo en tu máquina**. Esta sesión se ejecuta en un contenedor efímero en la nube con el registro de npm restringido, así que instalarlas aquí no tendría efecto persistente.

Dos caminos, ambos válidos:

- **Los principios ya están incorporados a este plan.** La sección 5 (Clean Code y modularidad), la sección 6 (jerarquía visual, tokens semánticos, contraste verificado) y la sección 10 (accesibilidad) cubren exactamente el terreno de esas dos skills, con las decisiones ya tomadas y los valores ya validados.
- **Si querés las skills reales**, ejecutá esos dos comandos en Claude Code desde tu máquina antes de arrancar la Fase 3. Este documento sigue siendo la especificación de entrada.

---

## 3. Arquitectura general

### 3.1 Modelo de capas

La aplicación se organiza en cuatro capas con dependencias unidireccionales. **Una capa nunca importa de una capa superior.**

```
┌──────────────────────────────────────────────────────────────┐
│  CAPA 4 · PRESENTACIÓN                                       │
│  app/[locale]/page.tsx · Secciones · Componentes de UI       │
│  Responsabilidad: cómo se ve y cómo se siente.               │
└──────────────────────────────┬───────────────────────────────┘
                               │ consume
┌──────────────────────────────▼───────────────────────────────┐
│  CAPA 3 · FEATURES (dominio de la aplicación)                │
│  features/projects · features/contact · features/experience  │
│  Responsabilidad: reglas de negocio de cada sección.         │
│  Cada feature es autocontenida: componentes + lógica + tipos.│
└──────────────────────────────┬───────────────────────────────┘
                               │ consume
┌──────────────────────────────▼───────────────────────────────┐
│  CAPA 2 · SERVICIOS                                          │
│  lib/github · lib/email · lib/analytics                      │
│  Responsabilidad: hablar con el mundo exterior.              │
│  Único lugar donde ocurre I/O de red.                        │
└──────────────────────────────┬───────────────────────────────┘
                               │ consume
┌──────────────────────────────▼───────────────────────────────┐
│  CAPA 1 · CONTENIDO Y CONFIGURACIÓN                          │
│  content/projects · config/site · messages/*.json            │
│  Responsabilidad: los datos. Sin lógica, sin JSX.            │
└──────────────────────────────────────────────────────────────┘
```

**Por qué importa esta separación:** cuando dentro de seis meses quieras agregar un blog, o migrar de Resend a otro proveedor, o cambiar la API de GitHub por la GraphQL v4, sólo tocás una capa. El resto no se entera.

### 3.2 Estrategia de renderizado

Este es el punto donde la mayoría de los portafolios pierden performance: hacen todo cliente. Aquí el reparto es deliberado.

| Elemento | Entorno | Estrategia | Por qué |
|---|---|---|---|
| Layout, Hero, About, Experiencia | Servidor | Estático (SSG) | Contenido que no cambia. Cero JS enviado al cliente. |
| Grid de proyectos (datos) | Servidor | **ISR, `revalidate: 3600`** | Los stats de GitHub se refrescan cada hora sin rebuild ni llamadas desde el navegador. |
| Tarjeta de proyecto (interacción) | Cliente | Componente cliente aislado | Sólo el fragmento que necesita estado se hidrata. |
| Panel de detalle expandible | Cliente | `AnimatePresence` + `layoutId` | Animación de layout compartido. |
| Formulario de contacto | Ambos | Server Action + `useActionState` | Funciona incluso con JS deshabilitado. Progresivamente mejorado. |
| Selector de idioma | Cliente | Navegación por router | Cambia el segmento de locale en la URL. |

**Regla de oro:** todo componente es Server Component por defecto. `"use client"` se agrega sólo cuando el componente necesita estado, efectos, listeners de eventos o APIs del navegador — y se empuja lo más abajo posible en el árbol.

### 3.3 Flujo de datos de la página de proyectos

```
                    ┌─────────────────────────────┐
                    │  content/projects/*.ts      │
                    │  (curaduría manual — vos)   │
                    │  slug, repo, narrativa,     │
                    │  imágenes, orden, destacado │
                    └──────────────┬──────────────┘
                                   │
     ┌─────────────────────────────┼─────────────────────────────┐
     │                             │                             │
     ▼                             ▼                             ▼
┌─────────────┐          ┌──────────────────┐         ┌──────────────────┐
│ getProjects │          │ lib/github       │         │ Validación Zod   │
│ (registro)  │─ repo ──▶│ fetchRepo()      │────────▶│ RepoSchema       │
└─────────────┘          │ fetchLanguages() │         └────────┬─────────┘
                         │ fetchLastCommit()│                  │
                         └──────────────────┘                  │
                              cache 1h · fallback              │
                                   │                           │
                                   └──────────┬────────────────┘
                                              ▼
                              ┌───────────────────────────────┐
                              │  Project (modelo unificado)   │
                              │  narrativa + stats en vivo    │
                              └───────────────┬───────────────┘
                                              ▼
                              ┌───────────────────────────────┐
                              │  <ProjectsSection />          │
                              │  Server Component             │
                              └───────────────────────────────┘
```

---

## 4. Estrategia de integración con GitHub (el núcleo del proyecto)

Esta es la sección más importante del documento, porque define exactamente lo que pediste: **vos elegís qué se publica, pero publicarlo tiene que ser fácil.**

### 4.1 El modelo: dos fuentes de verdad, cada una con su rol

| Fuente | Es dueña de | Cambia cuando |
|---|---|---|
| **Registro local** (`content/projects/`) | La narrativa: título, problema, solución, decisiones de arquitectura, capturas, orden, si es destacado | Vos lo editás |
| **API de GitHub** | El estado: stars, forks, lenguajes y su distribución, fecha del último commit, topics, descripción, si está archivado | Solo, cada hora |

Nada se publica automáticamente. Un repositorio aparece en el portafolio **si y sólo si** existe un archivo suyo en `content/projects/`. Si borrás el archivo, desaparece del sitio; el repo en GitHub queda intacto.

### 4.2 Agregar un proyecto: el flujo completo

Este es el criterio de aceptación de toda la integración — **agregar un proyecto no puede costar más de esto:**

```bash
# Paso 1 — copiar la plantilla
cp src/content/projects/_template.ts src/content/projects/sistema-gestion.ts
```

```ts
// Paso 2 — completar. Es el único archivo que se toca.
import type { ProjectEntry } from "@/features/projects/types";

export const sistemaGestion: ProjectEntry = {
  slug: "sistema-gestion",
  repo: "FabianGQuintana/sistema-gestion",   // ← el enlace vivo con GitHub

  featured: true,
  order: 1,
  status: "production",                       // production | active | archived | wip

  // Narrativa bilingüe. Lo que GitHub no puede contar.
  content: {
    es: {
      title: "Sistema de Gestión Comercial",
      tagline: "ERP a medida para control de stock, ventas y facturación.",
      problem:  "El cliente operaba sobre planillas de cálculo, sin trazabilidad de stock ni integridad entre ventas y depósito.",
      solution: "Sistema web con base relacional normalizada, control de acceso por roles y reportes en tiempo real.",
      architecture: [
        "Modelo relacional en 3FN con constraints a nivel de base de datos",
        "Capa de servicios desacoplada de los controladores",
        "Transacciones ACID para las operaciones de stock",
      ],
    },
    en: { /* mismos campos */ },
  },

  // Overrides opcionales — solo si querés pisar lo que trae GitHub
  highlightedTech: ["Next.js", "PostgreSQL", "Prisma", "TypeScript"],
  media: {
    cover: "/projects/sistema-gestion/cover.webp",
    gallery: ["/projects/sistema-gestion/01.webp"],
  },
  links: { demo: "https://sistema-gestion.vercel.app" },
};
```

```bash
# Paso 3 — publicar
git add . && git commit -m "feat(projects): agregar Sistema de Gestión" && git push
```

Vercel despliega solo. **Un archivo, un commit.** El registro (`content/projects/index.ts`) importa y ordena; si preferís evitar incluso ese paso, se puede resolver con importación dinámica del directorio.

### 4.3 Capa de servicio GitHub (`lib/github/`)

```
lib/github/
├── client.ts        # fetch con auth, headers y manejo de rate limit
├── queries.ts       # fetchRepository, fetchLanguages, fetchLastCommit
├── schemas.ts       # esquemas Zod — la API externa NO se confía
├── mappers.ts       # respuesta de GitHub → modelo de dominio propio
└── index.ts         # superficie pública del módulo (barrel)
```

**Decisiones técnicas de esta capa:**

**a) Autenticación.** Un Personal Access Token de solo lectura (fine-grained, permiso `Metadata: Read-only`, sin acceso de escritura) eleva el límite de 60 a **5.000 peticiones/hora**. Vive en `GITHUB_TOKEN` como variable de entorno del servidor. Nunca con prefijo `NEXT_PUBLIC_`; nunca llega al navegador.

**b) Caché e ISR.** Cada petición usa el caché nativo de Next:

```ts
const res = await fetch(`https://api.github.com/repos/${repo}`, {
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  },
  next: { revalidate: 3600, tags: [`gh:${repo}`] },
});
```

Con 6–10 proyectos y revalidación horaria, el consumo real ronda las **30 peticiones/hora** sobre un presupuesto de 5.000. Margen holgado.

**c) Validación con Zod.** La respuesta de la API se parsea contra un esquema antes de entrar a la aplicación. Si GitHub cambia un campo, el error aparece en el borde del sistema con un mensaje claro, no como un `undefined` propagándose hasta el JSX.

**d) Degradación elegante — requisito no negociable.** La API de GitHub puede fallar, tener rate limit o estar caída. **El portafolio nunca puede romperse por eso.**

```
fetchRepository()
  ├─ éxito       → proyecto con narrativa + stats en vivo
  ├─ 404         → log de advertencia + proyecto solo con narrativa
  ├─ 403 (límite)→ último valor cacheado + stats ocultos
  └─ error red   → proyecto solo con narrativa
```

En todos los casos la tarjeta se renderiza. Lo que se degrada es el enriquecimiento, no el contenido. En la UI, los stats ausentes simplemente no se muestran — sin mensajes de error, sin espacios vacíos.

**e) Todas las peticiones se resuelven en paralelo** con `Promise.allSettled`, de modo que un repo que falla no bloquea a los demás.

### 4.4 Datos que se muestran por proyecto

| Dato | Origen | Presentación |
|---|---|---|
| Título, tagline, problema, solución | Registro local | Tarjeta y panel expandido |
| Decisiones de arquitectura | Registro local | Panel expandido, lista con viñetas |
| Lenguajes y % de cada uno | GitHub `/languages` | Barra segmentada con colores por lenguaje |
| Stars / forks | GitHub `/repos` | Chips discretos, solo si > 0 |
| Último commit | GitHub `/commits?per_page=1` | "Actualizado hace 3 días" — señal de proyecto vivo |
| Topics | GitHub `/repos` | Tags secundarios |
| Enlace al repo | Derivado de `repo` | Botón primario |
| Demo en vivo | Registro local | Botón primario, solo si existe |

> El campo **"último commit"** es el que más trabaja a tu favor: comunica que estos sistemas están activos, no que son ejercicios abandonados.

### 4.5 Contrato de la interfaz

```ts
/** Lo que vos escribís a mano. */
export interface ProjectEntry {
  slug: string;
  repo: `${string}/${string}`;
  featured: boolean;
  order: number;
  status: "production" | "active" | "archived" | "wip";
  content: Record<Locale, ProjectContent>;
  highlightedTech?: string[];
  media?: ProjectMedia;
  links?: { demo?: string; docs?: string };
}

/** Lo que trae GitHub. Todo opcional: puede no estar disponible. */
export interface RepoStats {
  stars?: number;
  forks?: number;
  languages?: Array<{ name: string; percentage: number; color: string }>;
  lastCommitAt?: string;
  topics?: string[];
  isArchived?: boolean;
}

/** Lo que consume la UI. */
export type Project = ProjectEntry & { stats: RepoStats };
```

---

## 5. Estructura de carpetas (Clean Code)

Organización **feature-first**: el código se agrupa por lo que hace, no por lo que es. Todo lo relativo a proyectos vive junto; borrar la feature es borrar una carpeta.

```
portfolio-fabian/
│
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx              # Fuentes, providers, metadata, analytics
│   │   │   ├── page.tsx                # One-page: compone las secciones
│   │   │   ├── error.tsx               # Error boundary
│   │   │   └── not-found.tsx
│   │   ├── api/
│   │   │   └── revalidate/route.ts     # Webhook opcional de GitHub → purga caché
│   │   ├── globals.css                 # @theme de Tailwind v4 + tokens
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   └── opengraph-image.tsx         # OG dinámico con next/og
│   │
│   ├── features/                       # ◀ El corazón. Una carpeta = un dominio.
│   │   ├── hero/
│   │   │   ├── components/
│   │   │   │   ├── hero-section.tsx
│   │   │   │   ├── animated-headline.tsx
│   │   │   │   └── resume-button.tsx    # Placeholder de CV controlado por flag
│   │   │   └── index.ts
│   │   │
│   │   ├── about/
│   │   │   ├── components/about-section.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── experience/
│   │   │   ├── components/
│   │   │   │   ├── experience-section.tsx
│   │   │   │   ├── timeline.tsx
│   │   │   │   └── timeline-item.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── projects/                    # ◀ La feature más compleja
│   │   │   ├── components/
│   │   │   │   ├── projects-section.tsx       # Server Component
│   │   │   │   ├── project-grid.tsx           # Client — orquesta estado expandido
│   │   │   │   ├── project-card.tsx           # Client — layoutId
│   │   │   │   ├── project-detail-panel.tsx   # Client — AnimatePresence
│   │   │   │   ├── language-bar.tsx
│   │   │   │   ├── repo-stats.tsx
│   │   │   │   └── tech-badge.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── use-expanded-project.ts
│   │   │   │   └── use-project-filter.ts
│   │   │   ├── lib/
│   │   │   │   ├── get-projects.ts            # Compone registro + GitHub
│   │   │   │   └── sort-projects.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   │
│   │   └── contact/
│   │       ├── components/
│   │       │   ├── contact-section.tsx
│   │       │   ├── contact-form.tsx           # Client — useActionState
│   │       │   └── social-links.tsx
│   │       ├── actions/send-message.ts        # "use server"
│   │       ├── schemas/contact-schema.ts      # Zod — compartido cliente/servidor
│   │       └── index.ts
│   │
│   ├── components/
│   │   ├── ui/                          # Primitivas sin lógica de negocio
│   │   │   ├── button.tsx               # cva: variant, size
│   │   │   ├── badge.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── spotlight.tsx            # Resplandor violeta que sigue al cursor
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   ├── nav-links.tsx
│   │   │   ├── locale-switcher.tsx
│   │   │   ├── footer.tsx
│   │   │   └── scroll-progress.tsx
│   │   └── motion/                      # Envoltorios de animación reutilizables
│   │       ├── fade-in.tsx
│   │       ├── stagger-container.tsx
│   │       ├── reveal-on-scroll.tsx
│   │       └── magnetic.tsx
│   │
│   ├── lib/                             # Servicios: I/O con el exterior
│   │   ├── github/
│   │   │   ├── client.ts
│   │   │   ├── queries.ts
│   │   │   ├── schemas.ts
│   │   │   ├── mappers.ts
│   │   │   ├── language-colors.ts
│   │   │   └── index.ts
│   │   ├── email/
│   │   │   ├── resend-client.ts
│   │   │   └── templates/contact-notification.tsx
│   │   ├── utils/
│   │   │   ├── cn.ts
│   │   │   ├── format-date.ts
│   │   │   └── rate-limit.ts
│   │   └── env.ts                       # Variables de entorno validadas con Zod
│   │
│   ├── content/
│   │   └── projects/
│   │       ├── _template.ts             # Plantilla para copiar
│   │       ├── index.ts                 # Registro: importa y ordena
│   │       └── ...                      # Un archivo por proyecto
│   │
│   ├── config/
│   │   ├── site.ts                      # Nombre, URL, redes, flags
│   │   ├── navigation.ts
│   │   └── experience.ts                # Timeline laboral/académico
│   │
│   ├── i18n/
│   │   ├── routing.ts
│   │   ├── request.ts
│   │   └── navigation.ts
│   │
│   ├── messages/
│   │   ├── es.json
│   │   └── en.json
│   │
│   ├── styles/
│   │   ├── tokens.css                   # Variables de diseño
│   │   └── animations.css               # Keyframes que no requieren JS
│   │
│   ├── types/
│   │   ├── index.ts
│   │   └── github.ts
│   │
│   └── middleware.ts                    # Detección y enrutamiento de locale
│
├── public/
│   ├── projects/                        # Capturas por proyecto
│   ├── cv/                              # (vacío por ahora)
│   └── fonts/
│
├── .env.local                           # No versionado
├── .env.example                         # Documenta las variables requeridas
├── next.config.ts
├── tsconfig.json
└── package.json
```

### 5.1 Reglas de Clean Code aplicadas

1. **Un componente, una responsabilidad.** Si un archivo pasa de ~150 líneas o su nombre necesita "y", se parte.
2. **Barrel exports (`index.ts`) por feature.** El exterior importa `@/features/projects`, nunca rutas internas. La estructura interna puede refactorizarse sin romper nada.
3. **Sin `any`.** `strict: true` en TypeScript. Los datos externos se validan con Zod, que además infiere los tipos.
4. **Sin números mágicos.** Duraciones, easings, breakpoints y colores viven en tokens y constantes nombradas.
5. **`"use client"` lo más abajo posible.** Una tarjeta interactiva no obliga a hidratar la sección entera.
6. **Nombres explícitos.** `fetchRepositoryStats()` sobre `getData()`. El nombre debe hacer innecesario el comentario.
7. **Datos separados de la presentación.** Ningún componente contiene texto hardcodeado: todo viene de `messages/` o de `content/`.
8. **Variables de entorno validadas al arrancar** en `lib/env.ts`. Si falta `RESEND_API_KEY`, el build falla con un mensaje claro — no en producción cuando alguien envía el formulario.

---

## 6. Sistema de diseño: paleta y tipografía

### 6.1 Filosofía cromática

El violeta funciona como acento en contextos técnicos porque no arrastra las connotaciones del azul (corporativo, genérico, usado por todas las tecnológicas) ni la agresividad del rojo. Sobre un fondo casi negro, un violeta saturado produce **resplandor percibido** — el efecto que buscás con Motion — sin necesidad de sombras pesadas.

La regla de proporción es **90 / 7 / 3**: el 90% de la superficie es neutro oscuro, el 7% es texto, y sólo el 3% es violeta. El acento manda porque es escaso. Un portafolio violeta *en todos lados* pierde exactamente la elegancia que buscás.

### 6.2 Paleta — Superficies y neutros

| Token | Hex | Uso |
|---|---|---|
| `--bg-base` | `#0B0A0F` | Fondo del documento. Negro con tinte violeta, no negro puro. |
| `--bg-surface` | `#121118` | Tarjetas, contenedores en reposo. |
| `--bg-surface-raised` | `#1A1823` | Tarjeta en hover, panel expandido, elementos elevados. |
| `--bg-overlay` | `#0B0A0FE6` | Fondo de overlay al 90% de opacidad. |

**Por qué no `#000000`:** el negro puro sobre pantallas OLED produce halos y bordes duros en los desenfoques. Un negro con un ligero tinte violeta (`#0B0A0F`) hace que el acento se sienta parte del mismo sistema y no pegado encima.

### 6.3 Paleta — Texto

| Token | Hex | Contraste vs `--bg-base` | Nivel | Uso |
|---|---|---|---|---|
| `--text-primary` | `#EDEDF2` | **16.91 : 1** | AAA | Titulares, cuerpo principal |
| `--text-secondary` | `#A1A0AE` | **7.66 : 1** | AAA | Descripciones, párrafos de apoyo |
| `--text-muted` | `#6E6D7A` | **3.88 : 1** | AA-large | Metadatos, timestamps — **solo ≥ 18.66px o bold ≥ 14px** |
| `--text-accent` | `#A78BFA` | **7.25 : 1** | AAA | Enlaces, texto destacado, números |

### 6.4 Paleta — Acento violeta

| Token | Hex | Uso | Verificación |
|---|---|---|---|
| `--accent-300` | `#C4B5FD` | Focus ring, hover de texto accent | 10.69 : 1 vs base |
| `--accent-400` | `#A78BFA` | **Texto de acento sobre oscuro** | 7.25 : 1 — AAA |
| `--accent-500` | `#8B5CF6` | Bordes activos, iconos, rellenos | 4.66 : 1 — AA |
| `--accent-600` | `#7C3AED` | **Fondo de botón primario** | Blanco encima: 5.70 : 1 — AA |
| `--accent-700` | `#6D28D9` | Botón primario en `:active` | — |
| `--accent-glow` | `rgba(139,92,246,.35)` | Resplandores, sombras de color | Decorativo |
| `--accent-gradient` | `#8B5CF6 → #D946EF` | Gradiente de titular, **uso muy puntual** | Decorativo |

> **Regla crítica de accesibilidad:** `--accent-500` (`#8B5CF6`) tiene 4.66:1 — suficiente para texto normal, pero **texto sobre relleno violeta debe usar `--accent-600` con blanco**, no `--accent-500` (que sólo alcanza 4.23:1, AA-large). Esta distinción se codifica en las variantes del componente `Button`, no queda a criterio de quien lo use.

### 6.5 Paleta — Bordes

| Token | Hex | Uso | Nota |
|---|---|---|---|
| `--border-subtle` | `#24222E` | Separadores decorativos | Decorativo — exento de WCAG 1.4.11 |
| `--border-default` | `#322F40` | Bordes de tarjeta en reposo | Decorativo |
| `--border-interactive` | `#6E6B82` | **Inputs, controles enfocables** | **3.84 : 1** vs base — cumple WCAG 1.4.11 |
| `--border-accent` | `#8B5CF6` | Estado activo / seleccionado | 4.66 : 1 |

Este es el detalle que separa un portafolio bonito de uno correcto: WCAG 1.4.11 exige 3:1 para los bordes de **componentes interactivos**. Un input con borde `#322F40` se ve elegante y es inutilizable para alguien con baja visión. Por eso hay dos tokens distintos, y no uno.

### 6.6 Paleta — Estados

| Token | Hex | Contraste | Uso |
|---|---|---|---|
| `--success` | `#34D399` | 10.26 : 1 | Formulario enviado, proyecto en producción |
| `--error` | `#F87171` | 7.13 : 1 | Errores de validación |
| `--warning` | `#FBBF24` | 11.82 : 1 | Proyecto archivado / WIP |
| `--info` | `#38BDF8` | 9.21 : 1 | Notas informativas |

> Los estados **nunca** se comunican sólo por color: siempre van acompañados de icono y texto. Un usuario con daltonismo debe poder distinguir "enviado" de "error" sin percibir el matiz.

### 6.7 Implementación en Tailwind CSS v4

Tailwind v4 define el tema en CSS nativo, sin `tailwind.config.js`:

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  /* Superficies */
  --color-bg-base:            #0B0A0F;
  --color-bg-surface:         #121118;
  --color-bg-surface-raised:  #1A1823;

  /* Texto */
  --color-text-primary:       #EDEDF2;
  --color-text-secondary:     #A1A0AE;
  --color-text-muted:         #6E6D7A;

  /* Acento */
  --color-accent-300:         #C4B5FD;
  --color-accent-400:         #A78BFA;
  --color-accent-500:         #8B5CF6;
  --color-accent-600:         #7C3AED;
  --color-accent-700:         #6D28D9;

  /* Bordes */
  --color-border-subtle:      #24222E;
  --color-border-default:     #322F40;
  --color-border-interactive: #6E6B82;

  /* Estados */
  --color-success:            #34D399;
  --color-error:              #F87171;
  --color-warning:            #FBBF24;

  /* Tipografía */
  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, "SF Mono", monospace;

  /* Movimiento */
  --ease-out-expo:   cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart:  cubic-bezier(0.25, 1, 0.5, 1);
  --duration-fast:   150ms;
  --duration-base:   300ms;
  --duration-slow:   600ms;

  /* Radios */
  --radius-sm: 0.375rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
}
```

Uso: `bg-bg-surface`, `text-text-secondary`, `border-border-interactive`. **Nunca `bg-purple-500` directo** — si todos los violetas están en tokens, cambiar el acento del sitio entero es editar cuatro líneas.

### 6.8 Sistema tipográfico

**Familias:**

| Rol | Fuente | Justificación |
|---|---|---|
| **Titulares y cuerpo** | **Geist Sans** | Diseñada por Vercel para interfaces técnicas. Geometría precisa, excelente en pesos altos, muy legible en oscuro. Se carga vía `next/font` con cero layout shift. |
| **Datos y metadatos** | **Geist Mono** | Para stats de GitHub, fechas, badges de tecnología y números. La monoespaciada es el guiño técnico que le da carácter al dark-tech sin recurrir a decoración. |

*Alternativa si querés más personalidad en los titulares:* **Space Grotesk** para h1/h2 (formas más expresivas, terminaciones distintivas) manteniendo Geist Sans para el cuerpo. Sumar una tercera familia sólo se justifica si aporta contraste real.

**Escala fluida** — con `clamp()`, un solo valor cubre móvil y desktop sin breakpoints:

| Rol | Tamaño | Peso | Tracking | Line-height |
|---|---|---|---|---|
| Display (Hero H1) | `clamp(2.75rem, 7vw, 5rem)` | 600 | `-0.03em` | 1.05 |
| H2 (secciones) | `clamp(2rem, 4.5vw, 3rem)` | 600 | `-0.02em` | 1.15 |
| H3 (títulos de proyecto) | `clamp(1.25rem, 2vw, 1.5rem)` | 600 | `-0.01em` | 1.3 |
| Body large | `1.125rem` | 400 | `0` | 1.7 |
| Body | `1rem` | 400 | `0` | 1.7 |
| Small | `0.875rem` | 400 | `0` | 1.6 |
| Mono / label | `0.8125rem` | 500 | `0.02em` | 1.5 |
| Eyecatch (`// SOBRE MÍ`) | `0.75rem` | 500 | `0.15em` | 1.4 |

**Reglas tipográficas:**

- **Tracking negativo en titulares grandes.** A partir de 40px el espaciado por defecto se ve suelto. `-0.03em` es lo que hace que un titular se vea diseñado y no simplemente agrandado.
- **Line-height 1.7 en el cuerpo.** Sobre fondo oscuro el texto necesita más aire: el resplandor del texto claro reduce la separación percibida entre líneas.
- **Ancho máximo de 65–70 caracteres** (`max-w-[68ch]`) en todo párrafo.
- **Máximo dos pesos por familia** (400 y 600). Los pesos intermedios diluyen la jerarquía.
- **Eyecatch en mono con tracking amplio y color `--text-muted`** encabezando cada sección: aporta ritmo y refuerza la identidad técnica.

### 6.9 Espaciado y ritmo

Escala base de **4px**. Valores permitidos: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128`.

| Contexto | Valor |
|---|---|
| Padding interno de tarjeta | 24–32px |
| Separación entre elementos de un grupo | 12–16px |
| Separación entre grupos | 32–48px |
| Padding vertical de sección | `clamp(80px, 12vh, 160px)` |
| Ancho máximo del contenido | 1200px (`max-w-6xl`) |
| Gutter lateral móvil | 20px |

### 6.10 Efectos característicos del dark-tech

Cuatro recursos, usados con moderación, definen la identidad visual:

1. **Grid sutil de fondo** — patrón de puntos o líneas a `#24222E` con máscara radial que se desvanece hacia los bordes. Da profundidad sin ruido.
2. **Spotlight que sigue al cursor** — resplandor violeta radial de baja opacidad que sigue al mouse dentro del Hero y de las tarjetas. Se implementa con `useMotionValue` + `useSpring`; corre en el compositor, no en el hilo principal.
3. **Borde con gradiente en hover** — la tarjeta revela un borde violeta al pasar el cursor, usando un pseudo-elemento con `mask` en lugar de cambiar el `border-color` (evita el salto de layout).
4. **Glow como sombra de color** — `box-shadow: 0 0 40px -10px var(--accent-glow)` en elementos activos. Sustituye a las sombras negras, que en dark UI no se ven.

---

## 7. Lenguaje de animación con Motion

Las animaciones tienen que comunicar estructura, no adornar. Si al quitar una animación no se pierde información, sobraba.

### 7.1 Tokens de movimiento

| Token | Valor | Uso |
|---|---|---|
| `duration.fast` | 150 ms | Hover, cambio de color, focus |
| `duration.base` | 300 ms | Entradas, cambios de estado |
| `duration.slow` | 600 ms | Reveals al hacer scroll |
| `ease.out` | `[0.16, 1, 0.3, 1]` | Todo lo que entra — arranca rápido y frena suave |
| `ease.inOut` | `[0.65, 0, 0.35, 1]` | Transiciones de estado |
| `spring.soft` | `{ stiffness: 260, damping: 30 }` | Movimiento de layout, panel expandible |
| `spring.snappy` | `{ stiffness: 400, damping: 25 }` | Microinteracciones, botones magnéticos |

Viven en `src/lib/motion-tokens.ts` y se importan. Ninguna duración se escribe a mano dentro de un componente.

### 7.2 Catálogo de animaciones por elemento

| Elemento | Animación | Implementación |
|---|---|---|
| **Titular del Hero** | Entrada por palabras, escalonada 40ms | `motion.span` + variants con `staggerChildren` |
| **Secciones al scrollear** | Fade + subida de 24px, una sola vez | `whileInView` + `viewport={{ once: true, margin: "-100px" }}` |
| **Grid de proyectos** | Entrada escalonada de tarjetas | `staggerChildren: 0.08` en el contenedor |
| **Tarjeta en hover** | Elevación de 4px + glow + borde violeta | `whileHover` con `spring.snappy` |
| **Tarjeta → panel expandido** | **Transición de layout compartido** | `layoutId` idéntico en tarjeta y panel — el corazón de la interacción |
| **Cierre del panel** | Salida con fade + escala | `AnimatePresence mode="wait"` |
| **Barra de lenguajes** | Segmentos que crecen desde 0 al entrar en viewport | `whileInView` con stagger |
| **Contadores (stars)** | Conteo animado hasta el valor real | `useMotionValue` + `animate` |
| **Botones primarios** | Efecto magnético leve (máx. 6px) | `useMotionValue` + `useSpring` |
| **Barra de progreso de scroll** | Línea violeta fija arriba | `useScroll` + `scaleX` |
| **Navegación** | Indicador de sección activa que se desliza | `layoutId` en el subrayado |
| **Estado del formulario** | Transición idle → enviando → éxito | `AnimatePresence` |

### 7.3 La interacción central: tarjeta → detalle

Elegiste "tarjetas + detalle expandible", y esa decisión tiene una implementación canónica en Motion que conviene hacer bien:

```
Estado A · Grid            Estado B · Expandido
┌───────┐ ┌───────┐        ┌─────────────────────────────┐
│ [1]   │ │  [2]  │        │  [1] Panel expandido        │
│ card  │ │ card  │   ──▶  │  · Problema y solución      │
└───────┘ └───────┘        │  · Decisiones de arquitect. │
┌───────┐ ┌───────┐        │  · Galería                  │
│ [3]   │ │  [4]  │        │  · Stats de GitHub          │
└───────┘ └───────┘        └─────────────────────────────┘

layoutId="project-1" en ambos estados → Motion interpola posición,
tamaño y bordes automáticamente. La tarjeta *se convierte* en el panel;
no desaparece una y aparece otra.
```

**Detalles que definen la calidad de esta interacción:**

- Foco atrapado dentro del panel mientras está abierto (`focus trap`).
- `Escape` cierra; el foco vuelve exactamente a la tarjeta de origen.
- El scroll del body se bloquea con compensación del ancho de la scrollbar (sin salto de layout).
- El panel abierto sincroniza con la URL vía hash (`#proyecto/sistema-gestion`) para que sea compartible sin necesitar rutas dedicadas.
- `aria-expanded` en la tarjeta y `role="dialog"` + `aria-modal` en el panel.

### 7.4 Movimiento reducido — no opcional

```ts
const shouldReduceMotion = useReducedMotion();
```

Con `prefers-reduced-motion: reduce`: se eliminan traslaciones, parallax, contadores animados y el spotlight; se conservan los cambios de opacidad (que no producen malestar vestibular). Las transiciones de layout se acortan a 0ms. **Este comportamiento se implementa desde el primer componente animado, no se agrega al final.**

---

## 8. Internacionalización bilingüe

### 8.1 Estrategia

`next-intl` con enrutamiento por prefijo de locale y detección automática por `Accept-Language` en el primer ingreso.

```
/es          → versión en español (default)
/en          → versión en inglés
/            → middleware redirige según el navegador
```

### 8.2 Organización de las traducciones

Dos fuentes distintas, por naturaleza distinta:

| Contenido | Dónde vive | Por qué |
|---|---|---|
| UI: navegación, botones, labels, mensajes de error | `messages/es.json`, `messages/en.json` | Cadenas cortas, estructura plana, fáciles de mantener en paralelo |
| Contenido: narrativa de proyectos, experiencia, bio | `content/` y `config/`, con clave por locale | Texto largo y estructurado que conviene tener junto a su proyecto |

```json
// messages/es.json
{
  "nav":      { "about": "Sobre mí", "experience": "Experiencia",
                "projects": "Proyectos", "contact": "Contacto" },
  "hero":     { "role": "Fullstack Developer",
                "cta_projects": "Ver proyectos", "cta_resume": "Descargar CV" },
  "projects": { "eyebrow": "// PROYECTOS",
                "updated": "Actualizado hace {time}",
                "view_repo": "Ver repositorio", "view_demo": "Demo en vivo" },
  "contact":  { "eyebrow": "// CONTACTO",
                "success": "Mensaje enviado. Te respondo a la brevedad." }
}
```

**Tipado estricto de las claves:** se declara el tipo global de mensajes a partir de `es.json`, de modo que `t("hero.rol")` (con typo) sea un error de compilación y no un texto faltante en producción. Un script de CI verifica además que `en.json` tenga exactamente las mismas claves que `es.json`.

### 8.3 SEO multiidioma

- `hreflang` alternates en el metadata de cada locale.
- `sitemap.ts` genera entradas para ambas versiones.
- `<html lang>` dinámico según el locale activo.
- OG image por idioma vía `opengraph-image.tsx`.

---

## 9. Formulario de contacto funcional

### 9.1 Arquitectura

**Server Action**, no API Route. Menos código, sin endpoint público que proteger, y funciona sin JavaScript (mejora progresiva real).

```
Usuario completa el formulario
        │
        ▼
Validación en cliente (Zod, feedback inmediato)
        │
        ▼
Server Action  "use server"
        ├─ Re-validación con el mismo esquema Zod   ← nunca se confía en el cliente
        ├─ Honeypot: campo oculto que debe ir vacío
        ├─ Time-trap: descartar envíos en < 3 segundos
        ├─ Rate limit por IP (5 envíos / hora)
        └─ Resend → email a tu casilla
        │
        ▼
useActionState → estado de éxito o error, animado con AnimatePresence
```

### 9.2 Esquema compartido

```ts
// features/contact/schemas/contact-schema.ts
export const contactSchema = z.object({
  name:    z.string().min(2, "errors.name_short").max(80),
  email:   z.string().email("errors.email_invalid"),
  subject: z.string().min(3).max(120),
  message: z.string().min(20, "errors.message_short").max(2000),
  website: z.string().max(0),   // honeypot: debe estar vacío
});
```

El **mismo** esquema corre en cliente y servidor. Los mensajes son **claves de i18n**, no texto — así los errores también se traducen.

### 9.3 Anti-spam sin CAPTCHA

Tres capas silenciosas, sin fricción para el usuario legítimo:

1. **Honeypot** — campo `website` oculto vía CSS con `aria-hidden` y `tabindex="-1"`. Los bots lo completan; las personas no lo ven.
2. **Time-trap** — timestamp al montar el formulario. Un envío en menos de 3 segundos es automatizado.
3. **Rate limit por IP** — 5 envíos por hora, con Vercel KV o un `Map` en memoria si el volumen no lo justifica.

Un CAPTCHA en un portafolio castiga al reclutador que quiere escribirte. Estas tres capas filtran prácticamente todo el spam automatizado sin que nadie tenga que identificar semáforos.

### 9.4 Configuración de Resend

1. Crear cuenta en Resend y generar API key.
2. Con el subdominio de Vercel, se envía desde `onboarding@resend.dev` hacia tu casilla personal (funciona sin verificar dominio).
3. Cuando tengas dominio propio: verificar DNS (SPF + DKIM) y enviar desde `contacto@tudominio.com`.
4. Plantilla del email en React Email, con el contenido del mensaje y `reply-to` apuntando al remitente — así respondés directo desde tu cliente de correo.

---

## 10. Accesibilidad, SEO y performance

### 10.1 Accesibilidad — objetivo WCAG 2.1 AA

| Requisito | Implementación |
|---|---|
| Contraste de texto | Verificado en la sección 6. Todos los pares de uso real ≥ 4.5:1; los principales ≥ 7:1 (AAA). |
| Contraste de UI (1.4.11) | `--border-interactive` a 3.84:1 para inputs y controles. |
| Navegación por teclado | Todo elemento interactivo es alcanzable con Tab. Panel con focus trap y retorno de foco. |
| Focus visible | Anillo de 2px `--accent-300` + offset de 2px. **Nunca `outline: none` sin reemplazo.** |
| Semántica | `<header>`, `<main>`, `<section aria-labelledby>`, `<nav>`, `<footer>`. Un solo `<h1>` por página. |
| Skip link | "Saltar al contenido" como primer elemento enfocable. |
| Movimiento reducido | Respetado en todas las animaciones (sección 7.4). |
| Imágenes | `alt` descriptivo en capturas; `alt=""` en decorativas. |
| Formulario | `<label>` asociado, `aria-invalid`, `aria-describedby` en errores, `role="status"` en el mensaje de éxito. |
| Color no exclusivo | Todo estado va acompañado de icono y texto. |

### 10.2 SEO

- Metadata API de Next con títulos y descripciones por locale.
- **JSON-LD `Person`** con `name`, `jobTitle`, `url`, `sameAs` (GitHub, LinkedIn) y `knowsAbout` — le da a Google contexto estructurado sobre quién sos.
- OG image dinámica generada con `next/og`.
- `sitemap.ts` y `robots.ts` generados en el build.
- URLs canónicas y `hreflang` por locale.

### 10.3 Presupuesto de performance

| Métrica | Objetivo |
|---|---|
| Lighthouse Performance | ≥ 95 |
| Lighthouse Accessibility | 100 |
| LCP | < 1.8 s |
| CLS | < 0.05 |
| INP | < 200 ms |
| JS inicial (First Load) | < 120 KB gzip |

**Cómo se logra:**

- La mayor parte del sitio es Server Component: no viaja JS para el Hero, About ni Experiencia.
- `next/font` elimina el layout shift de tipografías.
- Capturas en WebP/AVIF servidas por `next/image` con `sizes` correcto; sólo la primera con `priority`.
- `dynamic()` para el panel de detalle: no se descarga hasta que se abre una tarjeta.
- Los stats de GitHub se resuelven en el servidor: el navegador nunca llama a la API.
- `@next/bundle-analyzer` para revisar el bundle antes de cada release.

---

## 11. Roadmap de construcción por fases

Ocho fases. Cada una termina en algo desplegable y verificable — nada de "está a medias hasta la fase 7".

---

### FASE 0 · Fundaciones
**Objetivo:** proyecto en marcha, en línea y con las reglas de calidad activas.

- [ ] `create-next-app` con TypeScript, Tailwind v4, App Router, `src/`
- [ ] Instalar dependencias (sección 2.4)
- [ ] Configurar `tsconfig` en modo `strict`, alias `@/*`
- [ ] ESLint + Prettier + `prettier-plugin-tailwindcss`
- [ ] Husky + lint-staged (pre-commit)
- [ ] Repositorio en GitHub, conectado a Vercel
- [ ] Primer deploy: página en blanco pero **en línea**
- [ ] `.env.example` documentando las variables requeridas

**Criterio de aceptación:** `npm run build` sin errores ni warnings, y la URL de Vercel responde.

---

### FASE 1 · Sistema de diseño
**Objetivo:** el vocabulario visual existe antes que cualquier pantalla.

- [ ] `globals.css` con el bloque `@theme` completo (sección 6.7)
- [ ] Fuentes Geist Sans y Geist Mono vía `next/font`
- [ ] Escala tipográfica fluida como clases utilitarias
- [ ] Primitivas: `Button` (cva: primary/secondary/ghost × sm/md/lg), `Badge`, `Card`, `Input`, `Textarea`
- [ ] Utilidad `cn()`
- [ ] Tokens de movimiento en `lib/motion-tokens.ts`
- [ ] Envoltorios de Motion: `FadeIn`, `StaggerContainer`, `RevealOnScroll`
- [ ] **Ruta `/dev/design-system`** que renderiza todas las primitivas en todos sus estados

**Criterio de aceptación:** la página de design system muestra cada componente en reposo, hover, focus y disabled. Auditoría de contraste sin fallos.

> La ruta `/dev/design-system` se excluye del build de producción. Es la herramienta que evita que el sistema visual se degrade a medida que crece el sitio.

---

### FASE 2 · Layout y navegación
**Objetivo:** el esqueleto navegable.

- [ ] `Header` sticky con blur de fondo al scrollear
- [ ] Navegación con scroll suave por anclas e indicador de sección activa (`layoutId`)
- [ ] Menú móvil (drawer animado, con focus trap)
- [ ] `Footer` con enlaces sociales
- [ ] `ScrollProgress` (barra violeta superior)
- [ ] Fondo global: grid sutil con máscara radial
- [ ] Skip link y estructura semántica de landmarks

**Criterio de aceptación:** navegación completa por teclado, de principio a fin, con foco siempre visible.

---

### FASE 3 · Internacionalización
**Objetivo:** la base bilingüe instalada **antes** de escribir contenido — reformar esto después cuesta el triple.

- [ ] `next-intl`: `routing.ts`, `request.ts`, `navigation.ts`
- [ ] `middleware.ts` con detección de locale
- [ ] Reestructurar a `app/[locale]/`
- [ ] `messages/es.json` y `messages/en.json` con el andamiaje de claves
- [ ] Componente `LocaleSwitcher` en el header
- [ ] Tipado global de mensajes + script de CI que verifica paridad de claves
- [ ] `hreflang` y `<html lang>` dinámico

**Criterio de aceptación:** `/es` y `/en` renderizan; cambiar de idioma conserva la posición de scroll.

---

### FASE 4 · Hero, About y Experiencia
**Objetivo:** las secciones narrativas, completas y animadas.

- [ ] `HeroSection`: nombre, título, tagline animada por palabras
- [ ] Spotlight que sigue al cursor en el Hero
- [ ] CTAs: "Ver proyectos" + `ResumeButton` (placeholder controlado por `siteConfig.resume.enabled`)
- [ ] `AboutSection`: bio breve + stack técnico en badges
- [ ] `ExperienceSection`: timeline vertical con reveal escalonado
- [ ] Datos de experiencia en `config/experience.ts`, bilingües
- [ ] `useReducedMotion` respetado en todo

**Criterio de aceptación:** con `prefers-reduced-motion: reduce` activo, el contenido es plenamente legible y funcional.

> **`ResumeButton`:** cuando `enabled: false`, se renderiza en estado deshabilitado con un tooltip ("CV en preparación") y `aria-disabled`. El día que tengas el PDF, lo ponés en `/public/cv/` y cambiás el flag a `true`. Sin tocar componentes.

---

### FASE 5 · Integración con GitHub ★
**Objetivo:** el núcleo del portafolio. La fase más importante.

- [ ] `lib/github/client.ts` con auth, headers y manejo de rate limit
- [ ] `lib/github/schemas.ts` — esquemas Zod de las respuestas
- [ ] `queries.ts`: `fetchRepository`, `fetchLanguages`, `fetchLastCommit`
- [ ] `mappers.ts`: respuesta de GitHub → modelo `RepoStats`
- [ ] Manejo de errores con degradación elegante (sección 4.3d)
- [ ] `language-colors.ts` — mapa de colores oficiales por lenguaje
- [ ] `content/projects/_template.ts` + `index.ts` (registro)
- [ ] `getProjects()`: compone registro + stats, con `Promise.allSettled`
- [ ] Configurar `GITHUB_TOKEN` en local y en Vercel
- [ ] **Cargar 2 proyectos reales como prueba**

**Criterio de aceptación:** las tres pruebas obligatorias —

1. Con token válido: los stats aparecen y son correctos.
2. **Con token inválido: el sitio renderiza igual, sólo sin stats.** ← la que importa.
3. Con un `repo` inexistente: log de advertencia, la tarjeta se renderiza con la narrativa.

---

### FASE 6 · Sección de proyectos (UI)
**Objetivo:** la vitrina.

- [ ] `ProjectsSection` (Server Component) que consume `getProjects()`
- [ ] `ProjectCard`: cover, título, tagline, badges de tech, stats, `layoutId`
- [ ] `LanguageBar`: barra segmentada animada
- [ ] `RepoStats`: stars, forks, "actualizado hace X"
- [ ] `ProjectGrid` con entrada escalonada
- [ ] `ProjectDetailPanel` con `AnimatePresence` + transición de layout compartido
- [ ] Focus trap, cierre con `Escape`, bloqueo de scroll, retorno de foco
- [ ] Sincronización del panel con el hash de la URL
- [ ] Filtro por tecnología (opcional, si hay volumen suficiente)
- [ ] Carga diferida del panel con `dynamic()`
- [ ] **Cargar todos los proyectos reales**

**Criterio de aceptación:** el ciclo abrir → leer → cerrar funciona íntegramente por teclado, y la animación de layout no produce parpadeos.

---

### FASE 7 · Contacto y cierre
**Objetivo:** el sitio, completo.

- [ ] Cuenta de Resend y API key en Vercel
- [ ] `contact-schema.ts` (Zod, mensajes como claves i18n)
- [ ] Server Action `send-message.ts` con las tres capas anti-spam
- [ ] `ContactForm` con `useActionState` y estados animados
- [ ] Plantilla de email en React Email con `reply-to`
- [ ] `SocialLinks`: GitHub, LinkedIn, email
- [ ] Rate limit por IP
- [ ] Prueba de envío real de punta a punta

**Criterio de aceptación:** el email llega a tu casilla; responder desde el cliente de correo va directo al remitente.

---

### FASE 8 · Pulido, auditoría y lanzamiento
**Objetivo:** de "funciona" a "impresiona".

- [ ] Metadata completa por locale + JSON-LD `Person`
- [ ] OG image dinámica con `next/og`
- [ ] `sitemap.ts` y `robots.ts`
- [ ] `@vercel/analytics` y `@vercel/speed-insights`
- [ ] Favicon y manifest
- [ ] `error.tsx`, `not-found.tsx`, `loading.tsx`
- [ ] Auditoría Lighthouse en las 4 categorías (objetivo: 95+/100/100/100)
- [ ] Auditoría axe DevTools: cero violaciones
- [ ] Prueba con lector de pantalla (NVDA o VoiceOver) del recorrido completo
- [ ] Prueba en dispositivos reales: iOS Safari, Android Chrome
- [ ] Prueba de rendimiento con red 3G simulada
- [ ] Revisión ortográfica de ambos idiomas
- [ ] Optimización del bundle con `@next/bundle-analyzer`
- [ ] `README.md` del repositorio — **es parte del portafolio**

**Criterio de aceptación:** todas las métricas de la sección 10.3 alcanzadas y verificadas.

---

### Fases opcionales (después del lanzamiento)

| Fase | Contenido | Cuándo tiene sentido |
|---|---|---|
| 9 · Blog | MDX + `content/blog/`, RSS, tiempo de lectura | Si vas a escribir con regularidad |
| 10 · Webhook de GitHub | `/api/revalidate` que purga el caché al recibir un push | Si querés stats instantáneos en vez de horarios |
| 11 · Command palette | `⌘K` para navegar y buscar proyectos | Detalle que los perfiles técnicos notan |
| 12 · Dominio propio | DNS en Vercel + email desde tu dominio | Cuando lo compres |
| 13 · Tema claro | Los tokens ya están en variables: es agregar un `[data-theme]` | Si aparece la necesidad |

---

## 12. Anexos

### 12.1 Taglines propuestas

Pediste una frase corta y contundente que refleje la capacidad de construir sistemas completos, del modelo relacional a la interfaz, priorizando arquitecturas limpias.

**Opción A — recomendada.** Concreta, técnica, con ritmo. Nombra las dos puntas del recorrido y cierra con el principio.

> **ES:** *Diseño la base de datos, construyo la API y pulo la interfaz. Sistemas completos, con arquitectura limpia.*
> **EN:** *I design the database, build the API and refine the interface. Complete systems, clean architecture.*

**Opción B — más corta y punzante.** Funciona bien si el Hero es muy minimalista.

> **ES:** *Del esquema relacional a la última microinteracción. Sistemas completos, arquitecturas que escalan.*
> **EN:** *From the relational schema to the last microinteraction. Complete systems, architecture that scales.*

**Opción C — orientada a beneficio.** Habla de lo que recibe el cliente, no de lo que hacés.

> **ES:** *Construyo sistemas end-to-end: datos íntegros por diseño, interfaces que se sienten inevitables.*
> **EN:** *I build end-to-end systems: data that holds by design, interfaces that feel inevitable.*

Mi recomendación es la **A**: dice exactamente qué hacés sin adjetivos vacíos, y "arquitectura limpia" al final funciona como firma. La B es más memorable pero un poco más abstracta.

### 12.2 Variables de entorno

```bash
# .env.example  (versionado — documenta, no contiene secretos)

# GitHub — PAT fine-grained, solo lectura (Metadata: Read-only)
GITHUB_TOKEN=github_pat_xxxxxxxxxxxx
GITHUB_USERNAME=FabianGQuintana

# Resend
RESEND_API_KEY=re_xxxxxxxxxxxx
CONTACT_EMAIL_TO=tu-email@ejemplo.com
CONTACT_EMAIL_FROM=onboarding@resend.dev

# Sitio
NEXT_PUBLIC_SITE_URL=https://fabianquintana.vercel.app
```

Todas se validan al arrancar en `lib/env.ts` con Zod. Si falta una, el build falla con un mensaje explícito.

### 12.3 Convención de commits

Conventional Commits — el historial también es parte del portafolio:

```
feat(projects): agregar transición de layout compartido en tarjetas
fix(github): manejar 403 por rate limit con degradación elegante
style(hero): ajustar tracking del titular display
refactor(contact): extraer esquema Zod a módulo compartido
perf(projects): cargar panel de detalle de forma diferida
a11y(nav): agregar focus trap al menú móvil
docs(readme): documentar cómo agregar un proyecto
```

### 12.4 Checklist antes de cada deploy

- [ ] `npm run build` sin errores ni warnings
- [ ] `npm run lint` limpio
- [ ] `tsc --noEmit` sin errores
- [ ] Sin `console.log` en el código de producción
- [ ] Variables de entorno configuradas en Vercel
- [ ] Probado con `prefers-reduced-motion: reduce`
- [ ] Probado en móvil real
- [ ] Recorrido completo por teclado

### 12.5 Notas de ejecución para la Fase 2 (construcción)

Este entorno de nube tiene el registro de npm restringido, por lo que **`npm install` no puede ejecutarse aquí**. El flujo de trabajo para construir será:

1. Yo genero los archivos del proyecto — configuración, componentes, servicios, contenido — completos y listos.
2. Vos los ejecutás en tu máquina: `npm install` y `npm run dev`.
3. Iteramos sobre lo que veas en pantalla.

Alternativamente, podés inicializar el proyecto localmente con los comandos de la sección 2.4 y después ir incorporando los módulos a medida que los generemos, fase por fase. Es el camino que recomiendo: te deja ver el resultado desde el primer día.

---

## Cierre

Este plan está diseñado para que cada fase produzca algo que puedas mirar y evaluar. No hay un tramo largo de "confiá en mí, al final funciona".

Las tres decisiones que más van a definir la calidad del resultado:

1. **La curaduría manual de proyectos.** Seis sistemas bien contados valen más que cuarenta repos listados. Tu registro local es el filtro editorial; la API de GitHub sólo aporta el pulso.
2. **El sistema de diseño antes que las pantallas.** La Fase 1 parece un rodeo, pero es lo que hace que la Fase 6 tarde horas en vez de días — y que el sitio se vea coherente en lugar de ensamblado.
3. **La degradación elegante de la API.** El día que GitHub tenga un incidente y un reclutador abra tu portafolio, la diferencia entre una tarjeta sin stars y una pantalla en blanco es exactamente la diferencia entre parecer senior y no parecerlo.

**Próximo paso:** confirmame la tagline que preferís y arrancamos con la Fase 0.

---

*Documento generado el 16 de agosto de 2026 · Plan de desarrollo v1.0*
