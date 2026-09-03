import type { Administration } from "@/features/administration/types";

/*
 * Donnees de simulation de l'Administration.
 *
 * Un seul administrateur, comme l'annonce la maquette : c'est ce qui bloque
 * l'approbation des dossiers marchands, qui en exige deux distincts.
 */

const MAINTENANT = Date.now();
const minutes = (n: number) => new Date(MAINTENANT - n * 60_000).toISOString();
const jours = (n: number) => new Date(MAINTENANT - n * 86_400_000).toISOString();

export const ADMINISTRATION: Administration = {
  droitsElementaires: 61,

  comptes: [
    { id: "c-1", nom: "O. Diallo", courriel: "o.diallo@bestcashpay.com", role: "administrateur", derniereConnexion: minutes(4), actif: true },
    { id: "c-2", nom: "F. Koné", courriel: "f.kone@bestcashpay.com", role: "exploitant", derniereConnexion: minutes(22), actif: true },
    { id: "c-3", nom: "A. Sow", courriel: "a.sow@bestcashpay.com", role: "exploitant", derniereConnexion: minutes(180), actif: true },
    { id: "c-4", nom: "M. Traoré", courriel: "m.traore@bestcashpay.com", role: "support", derniereConnexion: jours(1), actif: true },
    { id: "c-5", nom: "K. Adjovi", courriel: "k.adjovi@bestcashpay.com", role: "support", derniereConnexion: jours(3), actif: true },
    { id: "c-6", nom: "S. Bamba", courriel: "s.bamba@bestcashpay.com", role: "lecture-seule", derniereConnexion: jours(12), actif: true },
    /* Compte cree mais jamais utilise : la derniere connexion n'est pas
       inconnue, elle n'existe pas. */
    { id: "c-7", nom: "Audit externe", courriel: "audit@cabinet-exemple.com", role: "lecture-seule", derniereConnexion: null, actif: false },
  ],

  roles: [
    {
      role: "administrateur",
      nombreDroits: 61,
      nombreComptes: 1,
      permissions: [
        "Gère les comptes, les rôles et les paramètres de la plateforme.",
        "Approuve les dossiers marchands et modifie les routes d'aiguillage.",
        "Renseigne les plafonds de montants et la tarification.",
      ],
    },
    {
      role: "exploitant",
      nombreDroits: 34,
      nombreComptes: 2,
      permissions: [
        "Traite les paiements sans issue et le rapprochement quotidien.",
        "Ouvre et bascule des routes, renomme des présences.",
        "Ne gère ni les comptes, ni les rôles.",
      ],
    },
    {
      role: "support",
      nombreDroits: 18,
      nombreComptes: 2,
      permissions: [
        "Consulte les paiements et relance les notifications en échec.",
        "Ne modifie ni les routes, ni les montants, ni les comptes.",
      ],
    },
    {
      role: "lecture-seule",
      nombreDroits: 12,
      nombreComptes: 2,
      permissions: [
        "Consulte l'ensemble des écrans sans aucune action possible.",
        "Utile pour l'audit et les partenaires externes.",
      ],
    },
  ],
};
