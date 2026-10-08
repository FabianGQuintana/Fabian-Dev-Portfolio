/**
 * Tema claro/oscuro.
 *
 * Fuente de verdad: el atributo `data-theme` de <html>. El CSS
 * (globals.css) redefine las variables --theme-* segun ese atributo, asi que
 * cambiar de tema es cambiar un atributo: ningun componente re-renderiza.
 *
 * Sin dependencia externa (next-themes): son dos funciones y un script.
 */

export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "theme";

/**
 * Script anti-parpadeo. Corre en <head> ANTES del primer pintado: lee la
 * preferencia guardada (o la del sistema) y fija `data-theme`. Si corriera
 * despues de hidratar, un visitante en tema claro veria un destello oscuro.
 *
 * Es una cadena porque se inyecta con dangerouslySetInnerHTML; el try/catch
 * cubre navegadores con el almacenamiento bloqueado.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="dark"}})();`;

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function setTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Almacenamiento bloqueado: el tema aplica igual, solo no se recuerda.
  }
}
