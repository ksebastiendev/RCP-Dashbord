import type { CodeDevise, Incertain } from "@/lib/format";

/*
 * Contrats de donnees du Referentiel.
 *
 * La convention d'incertitude de lib/format est portee par les types
 * eux-memes : un champ `Incertain<T>` annonce qu'il peut valoir inconnu ou
 * sans objet, et l'affichage traitera les deux cas differemment. Un champ
 * qui ne peut pas manquer n'est pas `Incertain`.
 */

export type CodePays =
  | "BJ" | "TG" | "GH" | "GN" | "SN" | "ML" | "CM" | "CI"
  | "CG" | "TD" | "NG" | "LR" | "SL" | "GW" | "BF" | "NE";

export type Sens = "encaissement" | "decaissement";

/* --- Fournisseurs --- */

export type TypeFournisseur = "direct" | "agregateur";

export type Fournisseur = {
  id: string;
  nom: string;
  logoUrl: string | null;
  type: TypeFournisseur;
  /** Connecteur par lequel la plateforme joint le fournisseur. */
  raccordement: string;
  /** 0 signifie aucune route, ce qui n'est pas la meme chose qu'inconnu. */
  routesActives: number;
  raccorde: boolean;
};

/** Niveau de fiabilite d'une information de couverture, pas un etat de la destination. */
export type Fiabilite = "releve-fournisseur" | "hypothese-non-verifiee";

export type DestinationServie = {
  id: string;
  pays: CodePays;
  nomPays: string;
  portefeuille: string;
  sens: Sens;
  fiabilite: Fiabilite;
};

export type FicheFournisseur = Fournisseur & {
  destinations: DestinationServie[];
};

/* --- Portefeuilles --- */

export type NaturePortefeuille = "operateur-telecom" | "banque" | "agregateur";

export type Portefeuille = {
  id: string;
  nom: string;
  logoUrl: string | null;
  nature: NaturePortefeuille;
  nombrePays: number;
  /**
   * null quand la marque est connue du referentiel mais n'est servie par
   * aucun fournisseur. Le referentiel couvre plus large que ce qui est servi.
   */
  routesActives: number | null;
  retirable: boolean;
};

/* --- Operateurs et presences --- */

export type Operateur = {
  id: string;
  nom: string;
  logoUrl: string | null;
  nomPays: string;
  pays: CodePays;
  /** null quand l'operateur n'a jamais change de nom. */
  ancienNom: string | null;
};

export type Presence = {
  id: string;
  /** Libelle sous lequel la presence est vue par le marchand. */
  libelleVu: string;
  logoUrl: string | null;
  nomPays: string;
  pays: CodePays;
  ancienNom: string | null;
  ouverte: boolean;
};

/* --- Montants autorises --- */

export type Borne = {
  id: string;
  destination: string;
  logoUrl: string | null;
  sens: Sens;
  devise: CodeDevise;
  /** null quand aucun minimum n'est impose. */
  minimum: number | null;
  /**
   * undefined quand le plafond n'est pas connu de la plateforme. Une borne
   * a plafond inconnu refuse silencieusement au-dela du plafond par defaut :
   * c'est l'information la plus importante de l'ecran.
   */
  maximum: Incertain<number>;
  champExige: string | null;
};

export type IndicateursBornes = {
  bornesEnregistrees: number;
  bornesConnuesTotal: number;
  destinationsCouvertes: number;
  plafondsInconnus: number;
};

/* --- Devises et pays --- */

export type Devise = {
  code: CodeDevise;
  nom: string;
  /** Nombre de decimales reellement en circulation. Commande la lecture des montants. */
  decimales: number;
  nombrePays: number;
};

export type PaysServi = {
  code: CodePays;
  nom: string;
  deviseEncaissement: CodeDevise;
  /** Indicatif telephonique international, sans le plus. */
  indicatif: number;
  ouvert: boolean;
};
