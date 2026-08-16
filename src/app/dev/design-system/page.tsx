import { AlertTriangle, ArrowRight, CheckCircle2, Star } from "lucide-react";

import {
  FadeIn,
  RevealOnScroll,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Eyebrow,
  GithubIcon,
  Input,
  Label,
  Spotlight,
  Textarea,
} from "@/components/ui";

import { swatchGroups, typeScale } from "./tokens";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design System",
};

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-8">
      <Eyebrow>{title}</Eyebrow>
      <h2 id={`${id}-heading`} className="mt-2 text-h3">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-[68ch] text-sm text-fg-muted">{description}</p>
      ) : null}
      <div className="mt-8">{children}</div>
    </section>
  );
}

export default function DesignSystemPage() {
  return (
    <main id="main" className="container-section py-16">
      <header className="border-b border-line pb-10">
        <Eyebrow>Interno</Eyebrow>
        <h1 className="mt-2 text-h2">Design System</h1>
        <p className="mt-3 max-w-[68ch] text-fg-muted">
          Referencia viva del lenguaje visual. Esta ruta devuelve 404 en
          producción: existe para que el sistema no se degrade a medida que
          crece el sitio.
        </p>
      </header>

      <div className="mt-16 space-y-24">
        {/* ------------------------------------------------------ PALETA */}
        <Section
          id="palette"
          title="Paleta"
          description="Los ratios están calculados contra --color-base (#0b0a0f) según WCAG 2.1, no estimados."
        >
          <div className="space-y-12">
            {swatchGroups.map((group) => (
              <div key={group.title}>
                <h3 className="font-mono text-label text-fg">{group.title}</h3>
                {group.note ? (
                  <p className="mt-1 max-w-[68ch] text-sm text-fg-subtle">
                    {group.note}
                  </p>
                ) : null}

                <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.swatches.map((swatch) => (
                    <li key={swatch.token}>
                      <Card className="flex items-center gap-4 p-3">
                        <span
                          aria-hidden="true"
                          className="size-12 shrink-0 rounded-md border border-line-strong"
                          style={{ backgroundColor: swatch.hex }}
                        />
                        <div className="min-w-0">
                          <p className="font-mono text-sm">{swatch.token}</p>
                          <p className="font-mono text-xs text-fg-subtle uppercase">
                            {swatch.hex}
                          </p>
                          <p className="mt-1 text-xs text-fg-muted">
                            {swatch.usage}
                          </p>
                          <p className="mt-1.5">
                            <Badge
                              variant={
                                swatch.level === "AAA"
                                  ? "success"
                                  : swatch.level === "AA"
                                    ? "accent"
                                    : swatch.level === "AA-large"
                                      ? "warning"
                                      : "default"
                              }
                            >
                              {swatch.ratio} · {swatch.level}
                            </Badge>
                          </p>
                        </div>
                      </Card>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* ------------------------------------------------- TIPOGRAFIA */}
        <Section
          id="typography"
          title="Tipografía"
          description="Geist Sans para texto, Geist Mono para datos y metadatos. Escala fluida con clamp(): un solo valor cubre móvil y desktop."
        >
          <ul className="divide-y divide-line">
            {typeScale.map((item) => (
              <li
                key={item.token}
                className="grid gap-2 py-6 lg:grid-cols-[1fr_18rem]"
              >
                <p className={item.className}>{item.sample}</p>
                <p className="self-center font-mono text-xs text-fg-subtle">
                  <span className="text-accent-400">{item.token}</span>
                  <br />
                  {item.spec}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        {/* ---------------------------------------------------- BOTONES */}
        <Section
          id="buttons"
          title="Botones"
          description="La variante primary usa accent-600 (blanco encima: 5.70:1). accent-500 daría 4.23:1, insuficiente para texto normal — la regla está codificada en el componente, no queda a criterio de quien lo use."
        >
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">
                Ver proyectos <ArrowRight />
              </Button>
              <Button variant="secondary">
                <GithubIcon /> Ver repositorio
              </Button>
              <Button variant="ghost">Descargar CV</Button>
              <Button variant="link">Demo en vivo</Button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="icon" aria-label="Ver en GitHub">
                <GithubIcon />
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button disabled>Deshabilitado</Button>
              <Button variant="secondary" disabled>
                Deshabilitado
              </Button>
              <span className="self-center text-sm text-fg-subtle">
                Probá navegar con Tab: todos muestran anillo de foco.
              </span>
            </div>
          </div>
        </Section>

        {/* ----------------------------------------------------- BADGES */}
        <Section
          id="badges"
          title="Badges"
          description="Los estados nunca se comunican solo por color: siempre con icono y texto."
        >
          <div className="flex flex-wrap gap-3">
            <Badge>TypeScript</Badge>
            <Badge>PostgreSQL</Badge>
            <Badge variant="accent">
              <Star /> 24
            </Badge>
            <Badge variant="success">
              <CheckCircle2 /> En producción
            </Badge>
            <Badge variant="warning">
              <AlertTriangle /> Archivado
            </Badge>
          </div>
        </Section>

        {/* ---------------------------------------------------- TARJETAS */}
        <Section
          id="cards"
          title="Tarjetas"
          description="La variante interactive cambia el color del borde en hover, no su ancho: cambiar el ancho provocaría un salto de layout de 1px."
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Tarjeta estática</CardTitle>
                <CardDescription>
                  Superficie base sin interacción. Se usa para contenedores de
                  contenido.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Badge>Next.js</Badge>
                  <Badge>Prisma</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" size="sm">
                  <GithubIcon /> Repositorio
                </Button>
              </CardFooter>
            </Card>

            <Card interactive>
              <CardHeader>
                <CardTitle>Tarjeta interactiva</CardTitle>
                <CardDescription>
                  Pasá el cursor: el borde vira a violeta y la superficie se
                  eleva. Es el comportamiento base de las tarjetas de proyecto.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Badge variant="accent">
                    <Star /> 12
                  </Badge>
                  <Badge>TypeScript</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* --------------------------------------------- FORMULARIOS */}
        <Section
          id="forms"
          title="Formularios"
          description="Los bordes usan line-interactive (3.84:1). Un input con borde decorativo se ve elegante y es invisible para alguien con baja visión."
        >
          <form className="grid max-w-xl gap-5">
            <div className="grid gap-2">
              <Label htmlFor="ds-name">Nombre</Label>
              <Input id="ds-name" placeholder="Cómo te llamás" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ds-email">Email — estado inválido</Label>
              <Input
                id="ds-email"
                type="email"
                defaultValue="no-es-un-email"
                aria-invalid
                aria-describedby="ds-email-error"
              />
              <p
                id="ds-email-error"
                className="flex items-center gap-1.5 text-sm text-error"
              >
                <AlertTriangle className="size-4" aria-hidden="true" />
                Ingresá un email válido.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ds-message">Mensaje</Label>
              <Textarea
                id="ds-message"
                placeholder="Contame en qué estás trabajando"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ds-disabled">Deshabilitado</Label>
              <Input id="ds-disabled" disabled defaultValue="No editable" />
            </div>
          </form>
        </Section>

        {/* ------------------------------------------------- MOVIMIENTO */}
        <Section
          id="motion"
          title="Movimiento"
          description="Todos los envoltorios respetan prefers-reduced-motion desde el primer commit. Activalo en tu sistema y recargá: las traslaciones desaparecen, la opacidad se conserva."
        >
          <div className="space-y-10">
            <div>
              <p className="font-mono text-label text-fg-subtle">FadeIn</p>
              <FadeIn className="mt-3">
                <Card className="p-6">
                  <p className="text-sm text-fg-muted">
                    Entra al montar: opacidad + 24px de desplazamiento.
                  </p>
                </Card>
              </FadeIn>
            </div>

            <div>
              <p className="font-mono text-label text-fg-subtle">
                StaggerContainer — 80ms entre hijos
              </p>
              <StaggerContainer className="mt-3 grid gap-3 sm:grid-cols-3">
                {["Uno", "Dos", "Tres"].map((label) => (
                  <StaggerItem key={label}>
                    <Card className="p-6">
                      <p className="font-mono text-sm">{label}</p>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>

            <div>
              <p className="font-mono text-label text-fg-subtle">
                RevealOnScroll — once: true
              </p>
              <RevealOnScroll className="mt-3">
                <Card className="p-6">
                  <p className="text-sm text-fg-muted">
                    Se anima una sola vez. Re-animar al volver a subir convierte
                    el scroll en un espectáculo y molesta a la segunda pasada.
                  </p>
                </Card>
              </RevealOnScroll>
            </div>

            <div>
              <p className="font-mono text-label text-fg-subtle">
                Spotlight — seguí el cursor dentro del recuadro
              </p>
              <Spotlight className="mt-3 overflow-hidden rounded-lg border border-line-strong bg-surface">
                <div className="grid min-h-56 place-items-center p-10 text-center">
                  <p className="max-w-[46ch] text-sm text-fg-muted">
                    Las coordenadas viven en MotionValues, no en estado de
                    React: mover el mouse no dispara un solo re-render.
                  </p>
                </div>
              </Spotlight>
            </div>
          </div>
        </Section>

        {/* ---------------------------------------------------- FONDOS */}
        <Section
          id="backgrounds"
          title="Fondos y efectos"
          description="Cuatro recursos definen la identidad dark-tech. Usados con moderación."
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="grid min-h-40 place-items-center rounded-lg border border-line-strong bg-grid">
              <span className="font-mono text-sm">bg-grid</span>
            </div>
            <div className="grid min-h-40 place-items-center rounded-lg border border-line-strong bg-dots">
              <span className="font-mono text-sm">bg-dots</span>
            </div>
            <div className="grid min-h-40 place-items-center rounded-lg border border-accent-500/40 bg-surface shadow-glow">
              <span className="font-mono text-sm">shadow-glow</span>
            </div>
            <div className="grid min-h-40 place-items-center rounded-lg border border-line-strong bg-surface">
              <span className="text-gradient-accent text-h3">
                text-gradient-accent
              </span>
            </div>
          </div>
        </Section>
      </div>
    </main>
  );
}
