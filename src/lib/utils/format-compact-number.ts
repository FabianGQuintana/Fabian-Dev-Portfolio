/**
 * Numero compacto localizado para los contadores de GitHub ("1.2k", "340").
 *
 * Determinista en el servidor: ProjectsSection lo resuelve antes de pasar los
 * datos al cliente, evitando mismatch de hidratacion.
 */
export function formatCompactNumber(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
