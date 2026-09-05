/*
 * Application du theme sur le document.
 *
 * Trois modes. "systeme" n'est pas un troisieme theme mais l'absence de
 * choix : il suit la preference du systeme d'exploitation et change avec
 * elle, sans rechargement. C'est le defaut.
 *
 * La classe est posee sur <html>, jamais sur un composant. Aucune classe
 * `dark:` n'existe dans le projet : le theme vit entierement dans les
 * fichiers de tokens.
 */

export type ModeTheme = "clair" | "sombre" | "systeme";

export const CLE_THEME = "bcp-theme";

export const REQUETE_SOMBRE = "(prefers-color-scheme: dark)";

export function themeEffectif(mode: ModeTheme): "clair" | "sombre" {
  if (mode !== "systeme") return mode;
  return window.matchMedia(REQUETE_SOMBRE).matches ? "sombre" : "clair";
}

export function appliquerTheme(mode: ModeTheme) {
  document.documentElement.classList.toggle(
    "dark",
    themeEffectif(mode) === "sombre",
  );
}
