import { BACKSPACE_KEY_ID, ENTER_KEY_ID } from "./layout";

/**
 * Guion del tecleo automatico.
 *
 * En vez de encadenar setTimeout (que se desincronizan al cambiar de
 * pestaña o pausar el render), el ciclo completo se precalcula como una
 * lista de eventos con su instante. El estado en cualquier momento es una
 * funcion pura del tiempo transcurrido: pausar, reanudar o saltar frames
 * nunca deja el teclado en un estado inconsistente.
 */

export interface TypingEvent {
  /** Segundos desde el inicio del ciclo. */
  readonly time: number;
  readonly keyId: string;
  /** Texto en pantalla despues de este evento. */
  readonly text: string;
}

export interface TypingTimeline {
  readonly events: readonly TypingEvent[];
  /** Duracion de un ciclo completo, en segundos. */
  readonly duration: number;
  /** Instante (dentro del ciclo) en que emerge el icono de cada palabra. */
  readonly revealTimes: readonly number[];
}

const BASE_CHAR_DELAY = 0.15;
/** Variacion del ritmo entre letras: un ritmo constante delata a la maquina. */
const CHAR_JITTER = 0.11;
const BEFORE_ENTER = 0.32;
const HOLD_AFTER_ENTER = 1.5;
const BACKSPACE_DELAY = 0.045;
const BETWEEN_WORDS = 0.45;
const END_OF_CYCLE = 1.2;

/** Pseudoaleatorio determinista: el mismo ritmo en cada ciclo y en cada visita. */
function jitter(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export function buildTimeline(words: readonly string[]): TypingTimeline {
  const events: TypingEvent[] = [];
  const revealTimes: number[] = [];
  let time = 0.6;
  let seed = 1;

  for (const word of words) {
    let text = "";

    for (const char of word) {
      text += char;
      events.push({ time, keyId: char, text });
      time += BASE_CHAR_DELAY + jitter(seed++) * CHAR_JITTER;
    }

    time += BEFORE_ENTER;
    events.push({ time, keyId: ENTER_KEY_ID, text });
    revealTimes.push(time);
    time += HOLD_AFTER_ENTER;

    // Borra la palabra tecla a tecla antes de la siguiente.
    for (let i = word.length - 1; i >= 0; i--) {
      text = text.slice(0, i);
      events.push({ time, keyId: BACKSPACE_KEY_ID, text });
      time += BACKSPACE_DELAY;
    }

    time += BETWEEN_WORDS;
  }

  return { events, duration: time + END_OF_CYCLE, revealTimes };
}

/** Ultimo evento ocurrido en `cycleTime`, o null antes del primero. */
export function eventAt(
  timeline: TypingTimeline,
  cycleTime: number,
): TypingEvent | null {
  let current: TypingEvent | null = null;
  for (const event of timeline.events) {
    if (event.time > cycleTime) break;
    current = event;
  }
  return current;
}
