export type Theme = "light" | "dark";

export const THEME_KEY = "theme";

/**
 * Se ejecuta en el <head> antes de pintar (ver app/layout.tsx), así la página nunca parpadea en blanco
 * cuando el tema guardado es el oscuro. Sin elección guardada usa la preferencia del sistema.
 */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");`
    + "if(t!==\"light\"&&t!==\"dark\"){t=matchMedia(\"(prefers-color-scheme: dark)\").matches?\"dark\":\"light\"}"
    + "var d=document.documentElement;d.dataset.theme=t;d.style.colorScheme=t}catch(e){}})();";
