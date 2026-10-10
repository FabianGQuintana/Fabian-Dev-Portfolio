import type { ProjectEntry } from "@/features/projects/types";

import { countrySecure } from "./country-secure";
import { ibera } from "./ibera";
import { versoriTorneos } from "./versori-torneos";

/**
 * Registro de proyectos.
 *
 * Fuente unica de la CURADURIA: un repo aparece en el portafolio si y solo si
 * existe su entrada aqui. Importar + ordenar es deliberado: el orden visual
 * se controla con el campo `order` de cada entrada, y agregar un proyecto es
 * un import mas.
 */
export const projectEntries: readonly ProjectEntry[] = [
  versoriTorneos,
  countrySecure,
  ibera,
].toSorted((a, b) => a.order - b.order);

export type { ProjectEntry };
