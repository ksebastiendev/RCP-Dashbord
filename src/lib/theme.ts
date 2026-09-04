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

const SOMBRE = "(prefers-color-scheme: dark)";

export function themeEffectif(mode: ModeTheme): "clair" | "sombre" {
  if (mode !== "systeme") return mode;
  return window.matchMedia(SOMBRE).matches ? "sombre" : "clair";
}

export function appliquerTheme(mode: ModeTheme) {
  document.documentElement.classList.toggle(
    "dark",
    themeEffectif(mode) === "sombre",
  );
}

/**
 * S'abonne aux changements du systeme. Ne fait rien tant que le mode
 * choisi n'est pas "systeme" : un utilisateur qui a demande le clair ne
 * veut pas basculer parce que la nuit tombe.
 */
export function suivreLeSysteme(mode: ModeTheme, appliquer: () => void) {
  if (mode !== "systeme") return () => {};
  const requete = window.matchMedia(SOMBRE);
  requete.addEventListener("change", appliquer);
  return () => requete.removeEventListener("change", appliquer);
}
