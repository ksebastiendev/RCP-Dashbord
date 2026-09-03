import { simulerReponse } from "@/lib/latence";
import {
  DESTINATIONS,
  INDICATEURS_COUVERTURE,
  ROUTES,
} from "@/mocks/aiguillage";
import type { Destination, IndicateursCouverture, Route } from "../types";

/* Couche service de l'Aiguillage. Seul module du domaine qui connait
   l'origine des donnees. */

export async function listerDestinations(): Promise<Destination[]> {
  return simulerReponse(DESTINATIONS);
}

export async function lireIndicateursCouverture(): Promise<IndicateursCouverture> {
  return simulerReponse(INDICATEURS_COUVERTURE);
}

export async function listerRoutes(): Promise<Route[]> {
  return simulerReponse(ROUTES);
}
