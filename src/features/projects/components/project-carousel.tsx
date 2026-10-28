"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useInView, useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { StaggerContainer, StaggerItem } from "@/components/motion";
import type {
  ProjectCardModel,
  ProjectUiLabels,
} from "@/features/projects/types";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import { ProjectCard } from "./project-card";

/** Proyectos por pagina en desktop: un bento (1 grande + 2 chicos). */
const PAGE_SIZE = 3;
/** Pausa entre avances automaticos. */
const AUTOPLAY_MS = 7000;
/** Tras una interaccion del usuario, el autoavance espera este tiempo. */
const INTERACTION_COOLDOWN_MS = 12000;

const DESKTOP_QUERY = "(min-width: 1024px)";

function subscribeDesktop(onChange: () => void) {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** true en desktop. En el servidor se asume desktop (el bento es el diseño base). */
function useIsDesktop() {
  return useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => true,
  );
}

function chunk<T>(items: readonly T[], size: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size));
  }
  return pages;
}

/**
 * Clases de posicion de cada tarjeta dentro de su pagina (solo desktop).
 *
 * Pagina completa (3): 1 grande ocupa 2x2 y los chicos se apilan al lado.
 * Las paginas impares se espejan (grande a la derecha) para dar ritmo.
 * Paginas incompletas (1 o 2): las tarjetas rellenan el espacio, nunca
 * queda un hueco vacio.
 */
function cardPlacement(count: number, index: number, mirrored: boolean) {
  if (count === 1) return "lg:col-span-3 lg:row-span-2";
  if (index === 0) {
    return mirrored
      ? "lg:col-span-2 lg:col-start-2 lg:row-span-2 lg:row-start-1"
      : "lg:col-span-2 lg:row-span-2";
  }
  // Clases literales completas: Tailwind no detecta nombres armados con ${}.
  const row = count === 3 && index === 2 ? "lg:row-start-2" : "lg:row-start-1";
  return cn(
    count === 2 && "lg:row-span-2",
    mirrored && "lg:col-start-1",
    mirrored && row,
  );
}

interface ProjectCarouselProps {
  projects: ProjectCardModel[];
  labels: ProjectUiLabels;
  locale: Locale;
  expandedSlug: string | null;
  onOpen: (slug: string) => void;
}

/**
 * Carrusel de proyectos, paginado en bentos de 3.
 *
 * Decision de diseño: avanza de a UNA PAGINA (un bento completo), no de a
 * una tarjeta. Mover una tarjeta rompe la composicion del bento (la grande
 * dejaria de ser la grande); mover la pagina entera mantiene el diseño en
 * cada parada. En pantallas chicas, donde no hay bento, cada parada es una
 * tarjeta.
 *
 * Mecanica: scroll horizontal nativo con scroll-snap. Eso da gratis el
 * swipe tactil, el scroll con trackpad y el foco por teclado (al enfocar
 * una tarjeta el navegador la trae a la vista). Las flechas y los puntos
 * solo llaman a scrollTo. Con una sola pagina no hay controles.
 *
 * Autoavance cada 7 s, pausado cuando: el cursor o el foco estan dentro, el
 * usuario interactuo hace poco, la seccion no esta en pantalla, hay un
 * detalle abierto o el usuario pidio movimiento reducido.
 */
export function ProjectCarousel({
  projects,
  labels,
  locale,
  expandedSlug,
  onOpen,
}: ProjectCarouselProps) {
  const isDesktop = useIsDesktop();
  const shouldReduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lastInteraction = useRef(0);
  const hoveredRef = useRef(false);
  const [active, setActive] = useState(0);
  const [stops, setStops] = useState(1);
  const inView = useInView(rootRef, { margin: "-20% 0px -20% 0px" });

  const pages = chunk(projects, PAGE_SIZE);
  const selector = isDesktop ? "[data-snap-page]" : "[data-snap-card]";

  const getStops = useCallback(() => {
    const track = trackRef.current;
    return track
      ? Array.from(track.querySelectorAll<HTMLElement>(selector))
      : [];
  }, [selector]);

  const sync = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const items = getStops();
    setStops(items.length);
    let nearest = 0;
    let best = Infinity;
    items.forEach((item, index) => {
      const distance = Math.abs(item.offsetLeft - track.scrollLeft);
      if (distance < best) {
        best = distance;
        nearest = index;
      }
    });
    setActive(nearest);
  }, [getStops]);

  // Recalcula al cambiar de breakpoint y al montar.
  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [sync, projects.length]);

  const goTo = useCallback(
    (index: number) => {
      const track = trackRef.current;
      const item = getStops()[index];
      if (!track || !item) return;
      track.scrollTo({
        left: item.offsetLeft,
        behavior: shouldReduceMotion ? "auto" : "smooth",
      });
    },
    [getStops, shouldReduceMotion],
  );

  const markInteraction = useCallback(() => {
    lastInteraction.current = Date.now();
  }, []);

  // Autoavance. Usa la posicion real del scroll (no un contador propio):
  // si el usuario arrastro, continua desde donde quedo.
  useEffect(() => {
    if (stops <= 1 || shouldReduceMotion || !inView || expandedSlug) return;

    const timer = window.setInterval(() => {
      const idle =
        Date.now() - lastInteraction.current > INTERACTION_COOLDOWN_MS;
      if (hoveredRef.current || !idle) return;
      goTo(active + 1 >= stops ? 0 : active + 1);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [stops, shouldReduceMotion, inView, expandedSlug, active, goTo]);

  const hasControls = stops > 1;

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={labels.carouselRegion}
      className="mt-12"
      onPointerEnter={() => (hoveredRef.current = true)}
      onPointerLeave={() => (hoveredRef.current = false)}
      onPointerDown={markInteraction}
      onWheel={markInteraction}
      onFocusCapture={markInteraction}
    >
      <StaggerContainer staggerDelay={0.12}>
        {/* py/-my dan aire al brillo del hover, que el overflow recortaria. */}
        <div
          ref={trackRef}
          onScroll={sync}
          className="-my-6 flex snap-x snap-mandatory [scrollbar-width:none] gap-5 overflow-x-auto overscroll-x-contain py-6 [&::-webkit-scrollbar]:hidden"
        >
          {pages.map((page, pageIndex) => (
            <div
              key={page[0]?.slug ?? pageIndex}
              data-snap-page=""
              className="max-lg:contents lg:grid lg:w-full lg:shrink-0 lg:snap-start lg:grid-cols-3 lg:grid-rows-2 lg:gap-5"
            >
              {page.map((project, index) => (
                <StaggerItem
                  key={project.slug}
                  data-snap-card=""
                  className={cn(
                    "max-lg:w-[85%] max-lg:shrink-0 max-lg:snap-start max-md:w-[88%] md:max-lg:w-[62%]",
                    cardPlacement(page.length, index, pageIndex % 2 === 1),
                  )}
                >
                  <ProjectCard
                    project={project}
                    labels={labels}
                    locale={locale}
                    featured={index === 0}
                    isExpanded={expandedSlug === project.slug}
                    onOpen={() => onOpen(project.slug)}
                  />
                </StaggerItem>
              ))}
            </div>
          ))}
        </div>
      </StaggerContainer>

      {hasControls ? (
        <div className="mt-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {Array.from({ length: stops }, (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  markInteraction();
                  goTo(index);
                }}
                aria-label={labels.carouselGoTo
                  .replace("{n}", String(index + 1))
                  .replace("{total}", String(stops))}
                aria-current={index === active}
                className="grid h-6 place-items-center px-0.5"
              >
                <span
                  className={cn(
                    "block h-1.5 rounded-full transition-all duration-300",
                    index === active
                      ? "w-8 bg-accent-500"
                      : "w-3 bg-border-interactive hover:bg-accent-400",
                  )}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                markInteraction();
                goTo(active - 1);
              }}
              disabled={active === 0}
              aria-label={labels.carouselPrev}
              className="grid size-11 place-items-center rounded-full border border-border-default bg-bg-surface text-text-primary transition-colors hover:border-accent-500 hover:text-accent-400 disabled:pointer-events-none disabled:opacity-35"
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                markInteraction();
                goTo(active + 1);
              }}
              disabled={active >= stops - 1}
              aria-label={labels.carouselNext}
              className="grid size-11 place-items-center rounded-full border border-border-default bg-bg-surface text-text-primary transition-colors hover:border-accent-500 hover:text-accent-400 disabled:pointer-events-none disabled:opacity-35"
            >
              <ChevronRight aria-hidden="true" className="size-5" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
