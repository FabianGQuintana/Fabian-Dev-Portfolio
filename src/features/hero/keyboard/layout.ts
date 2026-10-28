/**
 * Distribucion de un teclado 60% (ANSI), en unidades de tecla ("u").
 *
 * Cada fila suma exactamente 15u. Las posiciones se calculan una sola vez a
 * partir de los anchos: agregar o mover una tecla es editar una fila.
 */

export interface KeyDef {
  /** Unico en todo el teclado. Para letras es la propia letra ("G"). */
  readonly id: string;
  readonly label: string;
  /** Ancho en u. */
  readonly width: number;
  /** Centro de la tecla, en u, con el teclado centrado en el origen. */
  readonly x: number;
  readonly z: number;
}

type RowSpec = readonly (string | readonly [label: string, width: number])[];

// prettier-ignore
const ROWS: readonly RowSpec[] = [
  [
    "Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=",
    ["⌫", 2],
  ],
  [
    ["Tab", 1.5],
    "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]",
    ["\\", 1.5],
  ],
  [
    ["Caps", 1.75],
    "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'",
    ["Enter", 2.25],
  ],
  [
    ["Shift", 2.25],
    "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/",
    ["Shift", 2.75],
  ],
  [
    ["Ctrl", 1.25], ["Win", 1.25], ["Alt", 1.25], ["", 6.25],
    ["Alt", 1.25], ["Fn", 1.25], ["Menu", 1.25], ["Ctrl", 1.25],
  ],
];

export const KEYBOARD_WIDTH_U = 15;
export const KEYBOARD_DEPTH_U = ROWS.length;

function buildKeys(): readonly KeyDef[] {
  const keys: KeyDef[] = [];
  const seen = new Map<string, number>();

  ROWS.forEach((row, rowIndex) => {
    let cursor = -KEYBOARD_WIDTH_U / 2;

    for (const spec of row) {
      const [label, width] = typeof spec === "string" ? [spec, 1] : spec;
      const base = label === "" ? "Space" : label;
      // Modificadores repetidos (Shift, Alt, Ctrl) reciben sufijo.
      const count = seen.get(base) ?? 0;
      seen.set(base, count + 1);

      keys.push({
        id: count === 0 ? base : `${base}-${count}`,
        label,
        width,
        x: cursor + width / 2,
        z: rowIndex - (KEYBOARD_DEPTH_U - 1) / 2,
      });
      cursor += width;
    }
  });

  return keys;
}

export const KEYS = buildKeys();

export const ENTER_KEY_ID = "Enter";
export const BACKSPACE_KEY_ID = "⌫";
