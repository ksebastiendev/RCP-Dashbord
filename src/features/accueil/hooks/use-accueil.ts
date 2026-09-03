import { useQuery } from "@tanstack/react-query";
import { lireTableauDeBord } from "../services/accueil";

/*
 * Hook de donnees de l'Accueil.
 *
 * L'ecran d'accueil est le premier ouvert de la journee et celui qu'on
 * recharge le plus : sa fraicheur compte plus que celle d'un referentiel,
 * d'ou une duree de fraicheur plus courte que la valeur par defaut.
 */
export const clesAccueil = {
  tableauDeBord: () => ["accueil", "tableau-de-bord"] as const,
};

export function useTableauDeBord() {
  return useQuery({
    queryKey: clesAccueil.tableauDeBord(),
    queryFn: lireTableauDeBord,
    staleTime: 30_000,
  });
}
