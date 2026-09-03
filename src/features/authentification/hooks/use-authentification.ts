import { useMutation } from "@tanstack/react-query";
import * as service from "../services/authentification";

/*
 * Hooks d'authentification.
 *
 * Ce sont des mutations, pas des requetes : se connecter n'est pas lire une
 * ressource, et le resultat ne doit jamais etre mis en cache ni rejoue.
 */

export function useConnexion() {
  return useMutation({
    mutationFn: ({
      courriel,
      motDePasse,
    }: {
      courriel: string;
      motDePasse: string;
    }) => service.seConnecter(courriel, motDePasse),
  });
}

export function useVerificationCode() {
  return useMutation({
    mutationFn: ({
      jetonDefi,
      code,
      courriel,
    }: {
      jetonDefi: string;
      code: string;
      courriel: string;
    }) => service.verifierCode(jetonDefi, code, courriel),
  });
}

export function useRenvoiCode() {
  return useMutation({
    mutationFn: (jetonDefi: string) => service.renvoyerCode(jetonDefi),
  });
}
