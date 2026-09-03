import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as service from "../services/referentiels";

/*
 * Hooks de donnees du Referentiel.
 *
 * Toute la donnee serveur du domaine passe par ici. Un ecran n'appelle
 * jamais la couche service directement, et rien de ce qui vient d'ici
 * n'atterrit dans Zustand : le cache, la revalidation et l'etat de
 * chargement sont l'affaire de TanStack Query.
 */

/* Prefixe de cle unique du domaine, pour pouvoir invalider tout le
   Referentiel d'un coup sans toucher aux autres sections. */
const RACINE = ["referentiels"] as const;

export const clesReferentiels = {
  fournisseurs: () => [...RACINE, "fournisseurs"] as const,
  fournisseur: (id: string) => [...RACINE, "fournisseurs", id] as const,
  portefeuilles: () => [...RACINE, "portefeuilles"] as const,
  operateurs: () => [...RACINE, "operateurs"] as const,
  presences: () => [...RACINE, "presences"] as const,
  bornes: () => [...RACINE, "bornes"] as const,
  indicateursBornes: () => [...RACINE, "bornes", "indicateurs"] as const,
  devises: () => [...RACINE, "devises"] as const,
  pays: () => [...RACINE, "pays"] as const,
};

export function useFournisseurs() {
  return useQuery({
    queryKey: clesReferentiels.fournisseurs(),
    queryFn: service.listerFournisseurs,
  });
}

export function useFicheFournisseur(id: string) {
  return useQuery({
    queryKey: clesReferentiels.fournisseur(id),
    queryFn: () => service.lireFicheFournisseur(id),
    enabled: id.length > 0,
  });
}

export function usePortefeuilles() {
  return useQuery({
    queryKey: clesReferentiels.portefeuilles(),
    queryFn: service.listerPortefeuilles,
  });
}

export function useOperateurs() {
  return useQuery({
    queryKey: clesReferentiels.operateurs(),
    queryFn: service.listerOperateurs,
  });
}

export function usePresences() {
  return useQuery({
    queryKey: clesReferentiels.presences(),
    queryFn: service.listerPresences,
  });
}

export function useBornes() {
  return useQuery({
    queryKey: clesReferentiels.bornes(),
    queryFn: service.listerBornes,
  });
}

export function useIndicateursBornes() {
  return useQuery({
    queryKey: clesReferentiels.indicateursBornes(),
    queryFn: service.lireIndicateursBornes,
  });
}

export function useDevises() {
  return useQuery({
    queryKey: clesReferentiels.devises(),
    queryFn: service.listerDevises,
  });
}

export function usePays() {
  return useQuery({
    queryKey: clesReferentiels.pays(),
    queryFn: service.listerPays,
  });
}

/* --- Mutations --- */

export function useRenommerOperateur() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, nouveauNom }: { id: string; nouveauNom: string }) =>
      service.renommerOperateur(id, nouveauNom),
    onSuccess: () => {
      /* Renommer un operateur change son ancien nom, donc les presences
         qui l'affichent aussi. */
      queryClient.invalidateQueries({ queryKey: clesReferentiels.operateurs() });
      queryClient.invalidateQueries({ queryKey: clesReferentiels.presences() });
    },
  });
}

export function useRetirerBorne() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => service.retirerBorne(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clesReferentiels.bornes() });
    },
  });
}

export function useRetirerPortefeuille() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => service.retirerPortefeuille(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clesReferentiels.portefeuilles() });
    },
  });
}
