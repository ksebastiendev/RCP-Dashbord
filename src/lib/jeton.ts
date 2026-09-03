/*
 * Point d'acces au jeton de session pour l'intercepteur Axios.
 * Un module dedie, et non le store Zustand directement, pour que `lib/`
 * ne dependt d'aucun store : c'est le store qui pousse le jeton ici.
 */

let jeton: string | null = null;
let surExpiration: (() => void) | null = null;

export function definirJeton(valeur: string | null) {
  jeton = valeur;
}

export function lireJeton(): string | null {
  return jeton;
}

/** Appele par l'intercepteur sur un 401, branche par le store de session. */
export function definirGestionExpiration(rappel: (() => void) | null) {
  surExpiration = rappel;
}

export function signalerExpiration() {
  surExpiration?.();
}
