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

/**
 * Cambia el tema al instante.
 *
 * Los dos temas ya estan en el CSS (solo cambian variables), pero cada
 * elemento con `transition-colors` animaba su propio cambio de color: en
 * movil eso eran cientos de transiciones a la vez y el cambio se sentia
 * lento, como si el tema "cargara". Durante el frame del cambio se apagan
 * todas las transiciones (clase `theme-switching`, ver globals.css) y se
 * vuelven a encender en el frame siguiente.
 */
export function setTheme(theme: Theme): void {
  const root = document.documentElement;
  root.classList.add("theme-switching");
  root.dataset.theme = theme;
  // Fuerza el recalculo de estilos con las transiciones apagadas.
  void root.offsetWidth;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => root.classList.remove("theme-switching"));
  });
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Almacenamiento bloqueado: el tema aplica igual, solo no se recuerda.
  }
}

/**
 * Misma logica que `themeInitScript`, pero ejecutable desde React.
 *
 * Hace falta porque cambiar de idioma (/es <-> /en) cambia el segmento del
 * root layout y React vuelve a montar <html> con `data-theme="dark"`. En esa
 * navegacion del lado del cliente el script inline no se ejecuta, asi que
 * el tema se re-aplica desde un efecto (ver ThemeScript).
 */
export function applyStoredTheme(): void {
  let theme: Theme;
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    theme =
      stored === "light" || stored === "dark"
        ? stored
        : window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark";
  } catch {
    theme = "dark";
  }
  document.documentElement.dataset.theme = theme;
}
