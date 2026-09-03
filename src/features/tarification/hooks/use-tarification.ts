import { useQuery } from "@tanstack/react-query";
import * as service from "../services/tarification";

const RACINE = ["tarification"] as const;

export const clesTarification = {
  indicateurs: () => [...RACINE, "indicateurs"] as const,
  regles: () => [...RACINE, "regles"] as const,
  couts: () => [...RACINE, "couts"] as const,
};

export function useIndicateursTarification() {
  return useQuery({
    queryKey: clesTarification.indicateurs(),
    queryFn: service.lireIndicateurs,
  });
}

export function useReglesTarifaires() {
  return useQuery({
    queryKey: clesTarification.regles(),
    queryFn: service.listerRegles,
  });
}

export function useCoutsFournisseurs() {
  return useQuery({
    queryKey: clesTarification.couts(),
    queryFn: service.listerCouts,
  });
}
