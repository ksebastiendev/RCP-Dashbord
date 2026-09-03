import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as service from "../services/marchands";
import type { TypeIdentifiantLegal } from "../types";

/*
 * Hooks de donnees de la section Marchand.
 * Aucune de ces donnees ne transite par Zustand.
 */

const RACINE = ["marchands"] as const;

export const clesMarchands = {
  liste: () => [...RACINE, "liste"] as const,
  fiche: (id: string) => [...RACINE, "fiche", id] as const,
  rechercheLegale: (type: TypeIdentifiantLegal, valeur: string) =>
    [...RACINE, "recherche-legale", type, valeur] as const,
};

export function useMarchands() {
  return useQuery({
    queryKey: clesMarchands.liste(),
    queryFn: service.listerMarchands,
  });
}

export function useFicheMarchand(id: string) {
  return useQuery({
    queryKey: clesMarchands.fiche(id),
    queryFn: () => service.lireFicheMarchand(id),
    enabled: id.length > 0,
  });
}

/**
 * Recherche par identifiant legal.
 *
 * `enabled` porte la regle metier : la recherche ne part que sur une saisie
 * validee par l'utilisateur, jamais a la frappe. Interroger le serveur a
 * chaque caractere reviendrait a lui envoyer, une par une, toutes les
 * valeurs partielles d'un identifiant qu'on prend justement soin de ne
 * jamais exposer.
 */
export function useRechercheLegale(
  type: TypeIdentifiantLegal,
  valeur: string,
  active: boolean,
) {
  return useQuery({
    queryKey: clesMarchands.rechercheLegale(type, valeur),
    queryFn: () => service.rechercherParIdentifiantLegal(type, valeur),
    enabled: active && valeur.trim().length > 0,
    /* Une empreinte ne change pas : le resultat se garde. */
    staleTime: 5 * 60_000,
  });
}

export function useRenouvelerCle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idApplication: string) =>
      service.renouvelerCleApplication(idApplication),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RACINE });
    },
  });
}

export function useTesterWebhook() {
  return useMutation({
    mutationFn: (idWebhook: string) => service.testerWebhook(idWebhook),
  });
}
