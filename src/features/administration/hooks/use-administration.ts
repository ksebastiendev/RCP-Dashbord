import { useQuery } from "@tanstack/react-query";
import { lireAdministration } from "../services/administration";

export const clesAdministration = {
  racine: () => ["administration"] as const,
};

export function useAdministration() {
  return useQuery({
    queryKey: clesAdministration.racine(),
    queryFn: lireAdministration,
  });
}
