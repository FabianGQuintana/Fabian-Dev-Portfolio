#!/usr/bin/env node
/* eslint-disable no-console -- script de CLI: su salida ES el producto. */
/**
 * Verifica que todos los diccionarios tengan exactamente las mismas claves.
 *
 * Sin esto, una traduccion faltante no falla el build: simplemente aparece la
 * clave cruda en pantalla, en produccion, y nadie se entera hasta que alguien
 * cambia de idioma.
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = join(dirname(fileURLToPath(import.meta.url)), "../src/messages/");
const REFERENCE = "es.json";

const flatten = (obj, prefix = "") =>
  Object.entries(obj).flatMap(([key, value]) =>
    value !== null && typeof value === "object"
      ? flatten(value, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  );

const read = (file) => JSON.parse(readFileSync(join(DIR, file), "utf8"));

const reference = new Set(flatten(read(REFERENCE)));
const others = readdirSync(DIR).filter(
  (f) => f.endsWith(".json") && f !== REFERENCE,
);

let failed = false;
for (const file of others) {
  const keys = new Set(flatten(read(file)));
  const missing = [...reference].filter((k) => !keys.has(k));
  const extra = [...keys].filter((k) => !reference.has(k));

  if (missing.length || extra.length) {
    failed = true;
    console.error(`\n${file}`);
    missing.forEach((k) => console.error(`  falta:   ${k}`));
    extra.forEach((k) => console.error(`  sobra:   ${k}`));
  } else {
    console.log(
      `${file}: ${keys.size} claves, paridad correcta con ${REFERENCE}`,
    );
  }
}

process.exit(failed ? 1 : 0);
