import type { CodeDevise, Incertain } from "@/lib/format";
import type { CodePays } from "@/features/referentiels/types";

/*
 * Contrats de donnees de la section Marchand.
 *
 * Note d'architecture : ce module reprend `CodePays` du Referentiel. C'est
 * la seule dependance entre les deux domaines, et elle porte sur un type de
 * vocabulaire, pas sur un composant ni sur un hook. Si elle devait s'etendre,
 * `CodePays` remonterait dans `lib/`.
 */

export type StatutDossier =
  | "brouillon"
  | "depose"
  | "en-examen"
  | "approuve"
  | "refuse"
  | "suspendu";

export type Marchand = {
  id: string;
  nom: string;
  logoUrl: string | null;
  pays: CodePays;
  nomPays: string;
  statut: StatutDossier;
  /** Date d'inscription. */
  inscription: string;
  nombreApplications: number;
};

/* --- Fiche marchand --- */

export type QuiPaieLesFrais = "client-final" | "marchand";

export type StatutPiece = "verifiee" | "expiree" | "manquante" | "en-attente";

export type PieceJustificative = {
  id: string;
  libelle: string;
  statut: StatutPiece;
};

export type EvenementConformite = {
  id: string;
  date: string;
  evenement: string;
  /** Qui a produit l'evenement : le marchand, un administrateur, la plateforme. */
  auteur: string;
};

export type Dirigeant = {
  id: string;
  nom: string;
  fonction: string;
};

/** D'ou vient le tarif applique, du plus general au plus precis. */
export type NiveauTarif = "general" | "marchand" | "application";

export type EchelonTarif = {
  niveau: NiveauTarif;
  libelle: string;
  /** undefined quand aucun tarif n'est defini a ce niveau. */
  taux: Incertain<number>;
  applique: boolean;
};

export type ModeApplication = "reel" | "demonstration";

export type Application = {
  id: string;
  nom: string;
  mode: ModeApplication;
  /** null quand l'application n'a jamais servi. */
  derniereActivite: string | null;
  taux: Incertain<number>;
  niveauTarif: NiveauTarif;
  /** La cle publique s'affiche en clair. La cle secrete ne s'affiche jamais. */
  clePublique: string;
};

export type Webhook = {
  id: string;
  evenement: string;
  adresse: string;
  /** null quand aucune notification n'a encore ete envoyee. */
  dernierEnvoi: string | null;
  /**
   * Part d'echecs sur les envois recents, en pour-cent. undefined quand il
   * n'y a pas assez d'envois pour que le taux veuille dire quelque chose :
   * un taux calcule sur deux envois n'est pas une sante.
   */
  tauxEchecsRecents: Incertain<number>;
};

export type WebhooksApplication = {
  application: Pick<Application, "id" | "nom" | "mode">;
  webhooks: Webhook[];
};

export type FicheMarchand = Marchand & {
  raisonSociale: string;
  dirigeants: Dirigeant[];

  volumeCeMois: Incertain<number>;
  devise: CodeDevise;
  tauxEffectif: Incertain<number>;
  fraisALaChargeDe: QuiPaieLesFrais;

  constat: {
    genre: "succes" | "attente" | "danger";
    titre: string;
    description: string;
  };

  pieces: PieceJustificative[];
  historique: EvenementConformite[];
  cascadeTarif: EchelonTarif[];
  applications: Application[];
  webhooksParApplication: WebhooksApplication[];
};

/* --- Recherche par identifiant legal --- */

/**
 * Les identifiants legaux sont chiffres au repos. La recherche porte sur
 * leur empreinte, jamais sur la valeur en clair : elle est donc exacte, et
 * ne peut pas etre approximative.
 */
export type TypeIdentifiantLegal =
  | "immatriculation"
  | "identifiant-fiscal"
  | "numero-tva";

export type ResultatRechercheLegale = {
  /** null quand aucun marchand ne porte cet identifiant. */
  marchand: Marchand | null;
};
