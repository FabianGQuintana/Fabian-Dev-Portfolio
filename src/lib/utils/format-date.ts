/**
 * Formatea "YYYY-MM" a un mes/año legible según el locale.
 *
 * `Intl.DateTimeFormat` se ejecuta en el servidor (las secciones son Server
 * Components), así que el resultado es determinista en el build y no hay
 * riesgo de mismatch de hidratación.
 */
export function formatMonthYear(value: string, locale: string): string {
  const [year, month] = value.split("-").map(Number);

  // Con un mes invalido se devuelve el valor crudo en vez de "Invalid Date"
  // o una excepcion que rompa toda la seccion.
  if (!year || !month || month < 1 || month > 12) return value;

  const date = new Date(year, month - 1, 1);

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
  }).format(date);
}
