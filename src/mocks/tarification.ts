import type {
  CoutFournisseur,
  IndicateursTarification,
  RegleTarifaire,
} from "@/features/tarification/types";

/*
 * Donnees de simulation de la Tarification.
 *
 * Les couts fournisseurs sont volontairement vides : la maquette de l'ecran
 * "Couts et marge" ne montre que ses deux etats vides, et la marge ne peut
 * pas se calculer tant qu'aucun cout n'est declare. C'est aussi la situation
 * reelle d'une plateforme qui n'a pas encore negocie ses conditions.
 */

export const INDICATEURS_TARIFICATION: IndicateursTarification = {
  reglesGenerales: 129,
  destinationsCouvertes: 129,
  plafondsInconnus: 31,
  bornesConnuesTotal: 172,
};

const PORTEFEUILLES = [
  "MTN MoMo",
  "Moov Money",
  "Orange Money",
  "Wave",
  "Airtel Money",
  "M-Pesa",
  "Free Money",
  "Vodafone Cash",
];

/* Une regle par portefeuille et par sens, en francs CFA de l'UEMOA, plus
   quelques regles dans les autres devises servies. */
export const REGLES_TARIFAIRES: RegleTarifaire[] = PORTEFEUILLES.flatMap(
  (portefeuille, index) => [
    {
      id: `rt-${index}-e`,
      portefeuille,
      sens: "encaissement" as const,
      devise: "XOF" as const,
      taux: [1.8, 1.5, 2.1, 1.2, 1.9, 2.4, 1.6, 2.0][index],
      partFixe: index % 3 === 0 ? 50 : 0,
    },
    {
      id: `rt-${index}-d`,
      portefeuille,
      sens: "decaissement" as const,
      devise: "XOF" as const,
      taux: [1.1, 0.9, 1.4, 0.8, 1.2, 1.6, 1.0, 1.3][index],
      partFixe: 0,
    },
  ],
);

/* Aucun cout fournisseur declare : la marge est donc inconnue, pas nulle. */
export const COUTS_FOURNISSEURS: CoutFournisseur[] = [];
