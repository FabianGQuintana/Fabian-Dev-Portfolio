import type es from "@/messages/es.json";

/**
 * Forma estructural del diccionario de mensajes, derivada de es.json.
 *
 * El acceso en tiempo de ejecucion pasa por next-intl (`getTranslations` en
 * servidor, `useTranslations` en cliente) desde la Fase 3 — este archivo ya
 * no carga JSON en runtime. El tipo se conserva porque `config/navigation.ts`
 * lo usa para que `labelKey` sea una clave real del namespace `nav`, no un
 * string suelto.
 */
export type Dictionary = typeof es;
