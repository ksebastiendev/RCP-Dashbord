import { simulerReponse } from "@/lib/latence";
import { ADMINISTRATION } from "@/mocks/administration";
import type { Administration } from "../types";

/* Couche service de l'Administration. */
export async function lireAdministration(): Promise<Administration> {
  return simulerReponse(ADMINISTRATION);
}
