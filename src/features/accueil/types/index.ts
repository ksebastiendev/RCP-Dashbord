import type { CodeDevise, Incertain } from "@/lib/format";

/*
 * Contrats de donnees de l'Accueil.
 *
 * L'ecran ne calcule rien : il affiche des constats produits par la
 * plateforme. Les types disent donc ce qui est connu, ce qui ne l'est pas,
 * et ce qui n'a pas de sens pour une ligne donnee.
 */

export type GenreIndicateur =
  /* Un compte d'objets : des paiements, des dossiers, des notifications. */
  | "compte"
  /* Une somme d'argent, qui ne s'affiche jamais sans sa devise. */
  | "montant";

export type TonIndicateur = "attente" | "neutre" | "information" | "danger" | "succes";

export type Tendance = {
  /** Variation en pour-cent, toujours positive. Le sens porte le signe. */
  pourcentage: number;
  sens: "hausse" | "baisse";
  /** Periode de comparaison, ecrite en clair. */
  comparaison: string;
  /**
   * Une hausse n'est pas toujours une bonne nouvelle : plus de paiements a
   * traiter est mauvais, plus de marge est bon. Ce champ dit comment lire
   * la variation, il n'est pas deduit du sens.
   */
  lecture: "favorable" | "defavorable" | "neutre";
};

export type Indicateur = {
  cle: string;
  libelle: string;
  genre: GenreIndicateur;
  ton: TonIndicateur;
  /** undefined quand la plateforme n'a pas encore pu calculer la valeur. */
  valeur: Incertain<number>;
  /** Renseignee pour les montants, null pour les comptes. */
  devise: CodeDevise | null;
  /** null quand aucune comparaison n'est disponible, par exemple au premier jour. */
  tendance: Tendance | null;
  /** Ecran vers lequel l'indicateur renvoie, quand il en existe un. */
  chemin: string | null;
};

export type StatutPreparation = "valide" | "a-faire";

export type EtapePreparation = {
  id: string;
  titre: string;
  /** Ce que l'etape implique reellement, pas sa definition technique. */
  description: string;
  statut: StatutPreparation;
  /** Action a mener quand l'etape reste a faire. null quand elle est validee. */
  action: { libelle: string; chemin: string } | null;
};

export type Preparation = {
  etapes: EtapePreparation[];
  /* Le decompte vient du serveur : le recalculer cote client ferait diverger
     l'affichage du constat reel si les deux logiques s'ecartent. */
  validees: number;
  total: number;
};

export type ChiffreMatin = {
  cle: string;
  libelle: string;
  valeur: Incertain<number>;
  /**
   * Renseigne quand le chiffre n'a de sens que rapporte a un total, comme
   * les plafonds inconnus sur l'ensemble des bornes.
   */
  total: number | null;
  /** Le chiffre designe un risque et se lit en ambre. */
  alerte: boolean;
};

export type Rappel = {
  titre: string;
  texte: string;
};

export type TableauDeBord = {
  /** Constat global affiche en bandeau, calcule par la plateforme. */
  constat: {
    genre: "succes" | "attente" | "danger";
    titre: string;
    description: string;
  };
  indicateurs: Indicateur[];
  preparation: Preparation;
  chiffresMatin: ChiffreMatin[];
  rappel: Rappel;
};
