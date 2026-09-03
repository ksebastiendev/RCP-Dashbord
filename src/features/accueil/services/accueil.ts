import { simulerReponse } from "@/lib/latence";
import { TABLEAU_DE_BORD } from "@/mocks/accueil";
import type { TableauDeBord } from "../types";

/*
 * Couche service de l'Accueil.
 *
 * Le tableau de bord est un constat produit par la plateforme, pas un
 * assemblage cote client : une seule requete le rapporte entier, comme le
 * fera l'appel reel.
 *   const { data } = await api.get<TableauDeBord>("/tableau-de-bord");
 *   return data;
 */
export async function lireTableauDeBord(): Promise<TableauDeBord> {
  return simulerReponse(TABLEAU_DE_BORD);
}
