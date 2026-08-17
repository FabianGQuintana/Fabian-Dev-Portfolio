import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases condicionales (clsx) y resuelve conflictos de Tailwind
 * quedandose con la ultima (twMerge).
 *
 * Sin esto, `cn("px-4", "px-6")` dejaria ambas y ganaria la del CSS por orden
 * de declaracion, no por orden de escritura — la fuente clasica de bugs de
 * estilo al componer variantes.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
