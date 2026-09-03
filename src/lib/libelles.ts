import type { Role } from "@/stores/session";

/*
 * Libelles d'interface partages. Un role s'affiche partout avec les memes
 * mots : la navigation, la barre superieure, l'ecran des comptes et la
 * modale de creation lisent cette table, aucun ne reecrit le texte.
 */
export const LIBELLE_ROLE: Record<Role, string> = {
  administrateur: "Administrateur",
  exploitant: "Exploitant",
  support: "Support",
  "lecture-seule": "Lecture seule",
};

/* Ce que chaque role permet. Texte releve dans Container-12.png. */
export const DESCRIPTION_ROLE: Record<Role, string> = {
  administrateur:
    "Gère les comptes, les rôles et les paramètres de la plateforme. Approuve les dossiers marchands et modifie les routes d'aiguillage.",
  exploitant:
    "Traite les paiements sans issue et le rapprochement quotidien. Ouvre et bascule des routes, renomme des présences.",
  support:
    "Consulte les paiements et relance les notifications en échec. Ne modifie ni les routes, ni les montants, ni les comptes.",
  "lecture-seule":
    "Consulte l'ensemble des écrans sans aucune action possible. Utile pour l'audit et les partenaires externes.",
};
