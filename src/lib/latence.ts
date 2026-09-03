/*
 * Simulation de la couche reseau tant que le backend n'existe pas.
 * Utilise uniquement par `features/<domaine>/services/`, jamais par un ecran.
 *
 * L'objectif n'est pas de faire joli : sans latence ni echec, les etats de
 * chargement et d'erreur ne sont jamais rencontres pendant l'integration et
 * on decouvre a la mise en service qu'ils n'ont jamais fonctionne.
 */

import { ErreurApi, MESSAGE_PAR_GENRE, type GenreErreur } from "./erreurs";

/*
 * Fenetre de latence simulee, en millisecondes.
 * Pilotable par VITE_LATENCE_MS sans rebuild, pour pouvoir observer les
 * etats de chargement aussi longtemps qu'il le faut pendant une revue.
 */
const LATENCE_FIXE = Number(import.meta.env.VITE_LATENCE_MS ?? 0);
const LATENCE_MIN = 350;
const LATENCE_MAX = 900;

/**
 * Taux d'echec simule. Pilotable sans rebuild via VITE_TAUX_ECHEC afin de
 * pouvoir eprouver l'ecran d'erreur a la demande, par exemple `0.5` en revue.
 */
const TAUX_ECHEC = Number(import.meta.env.VITE_TAUX_ECHEC ?? 0);

function attendre(ms: number) {
  return new Promise<void>((resoudre) => setTimeout(resoudre, ms));
}

/**
 * Enveloppe une donnee factice dans une promesse qui se comporte comme un
 * appel reseau. Signature volontairement identique a celle d'un appel Axios
 * du point de vue de l'appelant : le service passera de
 *   `return simulerReponse(marchands)`
 * a
 *   `const { data } = await api.get("/marchands"); return data`
 * sans qu'aucun hook ni composant ne change.
 */
export async function simulerReponse<T>(
  donnee: T,
  options: { genreEchec?: GenreErreur; tauxEchec?: number } = {},
): Promise<T> {
  const duree =
    LATENCE_FIXE > 0
      ? LATENCE_FIXE
      : LATENCE_MIN + Math.random() * (LATENCE_MAX - LATENCE_MIN);
  await attendre(duree);

  const taux = options.tauxEchec ?? TAUX_ECHEC;
  if (taux > 0 && Math.random() < taux) {
    const genre = options.genreEchec ?? "serveur";
    throw new ErreurApi(genre, MESSAGE_PAR_GENRE[genre], genre === "serveur" ? 500 : null);
  }

  return donnee;
}
