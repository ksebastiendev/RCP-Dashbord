import type { CodePays } from "@/features/referentiels/types";

/*
 * Contrats de donnees de l'Aiguillage.
 *
 * L'idee centrale de la section : une case vide compte autant qu'une case
 * pleine. Le type `CaseCouverture` refuse donc de confondre "personne ne
 * sert cette destination" avec "un fournisseur pourrait la servir demain".
 */

export type Sens = "encaissement" | "decaissement";

export type CaseCouverture =
  /* Un fournisseur sert deja ce croisement. */
  | { etat: "servi"; fournisseur: string }
  /*
   * Aucun fournisseur ne sert le croisement, mais au moins un sait le faire.
   * C'est dix secondes de travail, pas une negociation.
   */
  | { etat: "ouvrable"; candidats: number }
  /* Aucun fournisseur ne sait le faire. Il faut integrer quelqu'un. */
  | { etat: "ferme" };

export type Destination = {
  id: string;
  portefeuille: string;
  logoUrl: string | null;
  pays: CodePays;
  /** Precision relevee dans la maquette : "Bénin, sans opérateur". */
  precision: string;
  encaissement: CaseCouverture;
  decaissement: CaseCouverture;
};

export type IndicateursCouverture = {
  videOuvrable: number;
  videFerme: number;
  croisementsServis: number;
};

/* --- Tables de routage --- */

export type Route = {
  id: string;
  destination: string;
  logoUrl: string | null;
  sens: Sens;
  fournisseur: string;
  /**
   * Fournisseur de repli. null quand la route n'en a pas : tout echec y est
   * alors definitif, ce qui est l'information la plus utile de la ligne.
   */
  acheminement: string | null;
  enVigueurDepuis: string;
  active: boolean;
};
