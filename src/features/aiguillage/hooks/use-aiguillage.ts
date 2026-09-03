import { useQuery } from "@tanstack/react-query";
import * as service from "../services/aiguillage";

const RACINE = ["aiguillage"] as const;

export const clesAiguillage = {
  destinations: () => [...RACINE, "destinations"] as const,
  indicateurs: () => [...RACINE, "indicateurs"] as const,
  routes: () => [...RACINE, "routes"] as const,
};

export function useDestinations() {
  return useQuery({
    queryKey: clesAiguillage.destinations(),
    queryFn: service.listerDestinations,
  });
}

export function useIndicateursCouverture() {
  return useQuery({
    queryKey: clesAiguillage.indicateurs(),
    queryFn: service.lireIndicateursCouverture,
  });
}

export function useRoutes() {
  return useQuery({
    queryKey: clesAiguillage.routes(),
    queryFn: service.listerRoutes,
  });
}
