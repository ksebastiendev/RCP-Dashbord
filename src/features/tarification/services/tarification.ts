import { simulerReponse } from "@/lib/latence";
import {
  COUTS_FOURNISSEURS,
  INDICATEURS_TARIFICATION,
  REGLES_TARIFAIRES,
} from "@/mocks/tarification";
import type {
  CoutFournisseur,
  IndicateursTarification,
  RegleTarifaire,
} from "../types";

/* Couche service de la Tarification. */

export async function lireIndicateurs(): Promise<IndicateursTarification> {
  return simulerReponse(INDICATEURS_TARIFICATION);
}

export async function listerRegles(): Promise<RegleTarifaire[]> {
  return simulerReponse(REGLES_TARIFAIRES);
}

export async function listerCouts(): Promise<CoutFournisseur[]> {
  return simulerReponse(COUTS_FOURNISSEURS);
}
