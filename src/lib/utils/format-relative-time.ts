/**
 * Tiempo relativo localizado ("hace 3 días" / "3 days ago").
 *
 * Se ejecuta en el servidor (ProjectsSection es Server Component), asi que el
 * resultado es determinista en el build/ISR y no hay riesgo de mismatch de
 * hidratacion. La fecha llega como ISO string desde GitHub.
 *
 * Si el valor es invalido se devuelve vacio: el caller decide no mostrar nada,
 * consistente con la degradacion elegante del resto del sistema.
 */
export function formatRelativeTime(
  value: string,
  locale: string,
  now: number = Date.now(),
): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const diffMs = date.getTime() - now;
  const absMs = Math.abs(diffMs);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  const SECONDS = 1000;
  const MINUTES = 60 * SECONDS;
  const HOURS = 60 * MINUTES;
  const DAYS = 24 * HOURS;
  const MONTHS = 30.44 * DAYS;
  const YEARS = 12 * MONTHS;

  if (absMs < MINUTES)
    return rtf.format(Math.round(diffMs / SECONDS), "second");
  if (absMs < HOURS) return rtf.format(Math.round(diffMs / MINUTES), "minute");
  if (absMs < DAYS) return rtf.format(Math.round(diffMs / HOURS), "hour");
  if (absMs < MONTHS) return rtf.format(Math.round(diffMs / DAYS), "day");
  if (absMs < YEARS) return rtf.format(Math.round(diffMs / MONTHS), "month");
  return rtf.format(Math.round(diffMs / YEARS), "year");
}
