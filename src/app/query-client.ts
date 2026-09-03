import { QueryClient } from "@tanstack/react-query";
import { estErreurApi } from "@/lib/erreurs";

/*
 * Client TanStack Query unique.
 * Il porte toute la donnee serveur du back-office : listes, fiches, mutations.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /* Un back-office se consulte par a-coups : garder la donnee fraiche
         une minute evite de recharger un tableau a chaque aller-retour. */
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: (nombreEchecs, erreur) => {
        /* Rejouer un 403 ou un 404 ne sert a rien et retarde l'affichage
           de l'ecran d'erreur. Seules les pannes transitoires sont rejouees. */
        if (estErreurApi(erreur)) {
          if (erreur.genre === "reseau" || erreur.genre === "serveur") {
            return nombreEchecs < 2;
          }
          return false;
        }
        return false;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
