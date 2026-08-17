/**
 * Rate limiter en memoria, por clave (IP).
 *
 * Suficiente para la escala de un portafolio (volumen bajo y un solo
 * proceso). Se podria cambiar por Vercel KV cuando el sitio necesite varias
 * instancias; la firma de `isRateLimited` no cambiaria.
 *
 * La ventana y el maximo son datos de configuracion del contacto; este
 * modulo solo implementa la mecanica.
 */

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 5;
const MAX_KEYS = 10_000;

const hits = new Map<string, number[]>();

function prune(key: string, now: number): number[] {
  const cutoff = now - WINDOW_MS;
  return (hits.get(key) ?? []).filter((timestamp) => timestamp > cutoff);
}

function cleanup(now: number): void {
  if (hits.size <= MAX_KEYS) return;
  for (const [key, timestamps] of hits) {
    const recent = timestamps.filter(
      (timestamp) => timestamp > now - WINDOW_MS,
    );
    if (recent.length === 0) hits.delete(key);
    else hits.set(key, recent);
  }
}

/** Devuelve `true` si la clave ya agoto su cupo en la ventana actual. */
export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = prune(key, now);

  if (recent.length >= MAX_REQUESTS) {
    hits.set(key, recent);
    return true;
  }

  recent.push(now);
  hits.set(key, recent);
  cleanup(now);

  return false;
}
