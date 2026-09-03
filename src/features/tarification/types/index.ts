import type { CodeDevise, Incertain } from "@/lib/format";
import type { Sens } from "@/features/aiguillage/types";

/* Contrats de donnees de la Tarification. */

export type IndicateursTarification = {
  reglesGenerales: number;
  destinationsCouvertes: number;
  plafondsInconnus: number;
  bornesConnuesTotal: number;
};

export type RegleTarifaire = {
  id: string;
  portefeuille: string;
  sens: Sens;
  devise: CodeDevise;
  /** Part proportionnelle, en pour-cent. */
  taux: number;
  /** Part fixe, dans la devise de la regle. 0 quand il n'y en a pas. */
  partFixe: number;
};

export type CoutFournisseur = {
  id: string;
  fournisseur: string;
  portefeuille: string;
  sens: Sens;
  devise: CodeDevise;
  /** Ce que le fournisseur nous facture, en pour-cent. */
  tauxFournisseur: Incertain<number>;
  partFixeFournisseur: Incertain<number>;
  /** Ce que nous facturons au marchand. */
  tauxFacture: number;
  depuis: string;
};

/** Resultat d'une simulation de prelevement. */
export type Simulation = {
  regle: RegleTarifaire | null;
  montant: number;
  prelevement: number;
  recuParLeMarchand: number;
  payeParLeClient: number;
};
