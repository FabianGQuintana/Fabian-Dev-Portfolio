# Fabián Quintana — Portafolio

Portafolio profesional construido para exhibir sistemas reales, no maquetas.
La integración con GitHub es **curada**: un repositorio aparece únicamente si
existe su archivo en `src/content/projects/`; la API de GitHub sólo aporta el
estado en vivo (stars, lenguajes, último commit).

El plan de arquitectura completo está en [`docs/`](./docs).

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16.3 (App Router, Server Components) |
| UI | React 19 · Tailwind CSS 4 |
| Animación | Motion 13 |
| i18n | next-intl 4 (ES / EN) — Fase 3 |
| Validación | Zod 4 |
| Email | Resend — Fase 7 |
| Deploy | Vercel |

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # completar valores
npm run dev
```

Abrir <http://localhost:3000>.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run format` | Prettier sobre todo el proyecto |
| `npm run check` | typecheck + lint + format:check |

## Design system

`/dev/design-system` renderiza toda la paleta con sus ratios de contraste
verificados, la escala tipográfica y cada primitiva en sus estados.
La ruta devuelve **404 en producción**: es herramienta interna.

## Arquitectura

Cuatro capas con dependencias unidireccionales — una capa nunca importa de una
capa superior:

```
app/          → presentación: rutas y composición
features/     → dominio: una carpeta por sección del sitio
lib/          → servicios: único lugar donde ocurre I/O de red
content/ config/ messages/  → datos, sin lógica ni JSX
```

### Agregar un proyecto (a partir de la Fase 5)

```bash
cp src/content/projects/_template.ts src/content/projects/mi-sistema.ts
# completar el archivo
git commit -am "feat(projects): agregar Mi Sistema" && git push
```

Un archivo, un commit. Vercel despliega solo.

## Convención de commits

[Conventional Commits](https://www.conventionalcommits.org/): `feat`, `fix`,
`style`, `refactor`, `perf`, `a11y`, `docs`, `chore`.

## Accesibilidad

Objetivo WCAG 2.1 AA. Contrastes verificados numéricamente, focus visible en
todo control, navegación completa por teclado y `prefers-reduced-motion`
respetado desde el primer componente animado.

## Licencia

MIT — ver [LICENSE](./LICENSE).
