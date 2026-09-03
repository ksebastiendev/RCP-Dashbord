import type { TableauDeBord } from "@/features/accueil/types";

/*
 * Donnees de simulation de l'Accueil.
 *
 * Les maquettes affichent 40 689 dans les cinq tuiles : une valeur de
 * remplissage. Les valeurs ci-dessous sont differenciees et plausibles, pour
 * que la lecture de l'ecran soit eprouvee pour de vrai, y compris le cas
 * d'un indicateur que la plateforme n'a pas encore su calculer.
 */

export const TABLEAU_DE_BORD: TableauDeBord = {
  constat: {
    genre: "attente",
    titre: "Deux points bloquent la mise en service",
    description:
      "Constaté automatiquement à partir de l'état réel de la plateforme. Tant que ces points ne sont pas levés, aucun encaissement réel ne peut être approuvé.",
  },

  indicateurs: [
    {
      cle: "paiements-a-traiter",
      libelle: "Paiements à traiter",
      genre: "compte",
      ton: "attente",
      valeur: 187,
      devise: null,
      tendance: {
        pourcentage: 8.5,
        sens: "hausse",
        comparaison: "depuis hier",
        /* Plus de paiements sans issue est une mauvaise nouvelle. */
        lecture: "defavorable",
      },
      chemin: "/exploitation/paiement",
    },
    {
      cle: "ecart-rapprochement",
      libelle: "Écart de rapprochement",
      genre: "montant",
      ton: "neutre",
      valeur: 1_284_500,
      devise: "XOF",
      tendance: {
        pourcentage: 12.4,
        sens: "baisse",
        comparaison: "depuis hier",
        lecture: "favorable",
      },
      chemin: "/exploitation/rapprochement",
    },
    {
      cle: "dossiers-a-examiner",
      libelle: "Dossiers à examiner",
      genre: "compte",
      ton: "information",
      valeur: 23,
      devise: null,
      tendance: {
        pourcentage: 4.3,
        sens: "baisse",
        comparaison: "depuis hier",
        lecture: "favorable",
      },
      chemin: "/marchand/dossiers",
    },
    {
      cle: "notifications-echec",
      libelle: "Notifications en échec",
      genre: "compte",
      ton: "danger",
      valeur: 41,
      devise: null,
      tendance: {
        pourcentage: 8.5,
        sens: "hausse",
        comparaison: "depuis hier",
        lecture: "defavorable",
      },
      chemin: "/exploitation/notifications",
    },
    {
      cle: "marge-du-mois",
      libelle: "Marge du mois",
      genre: "montant",
      ton: "succes",
      /* La marge du mois n'est pas encore consolidee : la plateforme ne
         connait pas la valeur, elle ne vaut pas zero. */
      valeur: undefined,
      devise: "XOF",
      tendance: null,
      chemin: "/tarification/couts",
    },
  ],

  preparation: {
    validees: 2,
    total: 7,
    etapes: [
      {
        id: "e-1",
        titre: "Plusieurs comptes d'administration",
        description:
          "L'approbation d'un dossier marchand exige deux administrateurs distincts. Il n'en existe qu'un seul, aucun marchand ne peut donc être approuvé.",
        statut: "a-faire",
        action: { libelle: "Créer un second compte", chemin: "/administration/comptes" },
      },
      {
        id: "e-2",
        titre: "67 routes actives",
        description:
          "Ces routes viennent de capacités techniques, pas d'accords commerciaux. Personne n'a vérifié quels opérateurs sont réellement conventionnés. Revoyez-les avant toute mise en service.",
        statut: "a-faire",
        action: { libelle: "Ouvrir la table de routage", chemin: "/aiguillage/routage" },
      },
      {
        id: "e-3",
        titre: "Grille tarifaire renseignée",
        description:
          "Chaque destination ouverte porte une règle de prélèvement. Aucun paiement ne partira sans savoir ce qu'il coûte.",
        statut: "valide",
        action: null,
      },
      {
        id: "e-4",
        titre: "Devises et décimales déclarées",
        description:
          "Les sept devises servies déclarent leur nombre de décimales. Les montants affichés aux marchands ne peuvent plus être lus de travers d'un facteur cent.",
        statut: "valide",
        action: null,
      },
      {
        id: "e-5",
        titre: "31 plafonds inconnus",
        description:
          "Ces bornes refusent silencieusement les paiements au-delà du plafond par défaut, sans message explicite au marchand.",
        statut: "a-faire",
        action: { libelle: "Ouvrir les montants autorisés", chemin: "/referentiel/montants" },
      },
      {
        id: "e-6",
        titre: "Adresses de notification vérifiées",
        description:
          "Quatre marchands déclarent une adresse en clair, sans chiffrement. Un secret qui transite par une page non chiffrée est un secret qu'on peut intercepter.",
        statut: "a-faire",
        action: { libelle: "Ouvrir les webhooks", chemin: "/marchand/webhooks" },
      },
      {
        id: "e-7",
        titre: "Rapprochement du jour clôturé",
        description:
          "Le relevé de la veille n'est pas encore importé. Tant qu'il manque, l'écart affiché ne veut rien dire.",
        statut: "a-faire",
        action: { libelle: "Ouvrir le rapprochement", chemin: "/exploitation/rapprochement" },
      },
    ],
  },

  chiffresMatin: [
    { cle: "routes", libelle: "Routes actives", valeur: 67, total: null, alerte: false },
    { cle: "fournisseurs", libelle: "Fournisseurs intégrés", valeur: 22, total: null, alerte: false },
    { cle: "comptes", libelle: "Comptes d'administration", valeur: 1, total: null, alerte: true },
    { cle: "regles", libelle: "Règles tarifaires", valeur: 129, total: null, alerte: false },
    { cle: "plafonds", libelle: "Plafonds inconnus", valeur: 31, total: 62, alerte: true },
  ],

  rappel: {
    titre: "Rappel",
    texte:
      "Les identifiants des fournisseurs de paiement ne se saisissent pas dans cette interface : ils sont installés sur le serveur. Un secret qui transite par une page web est un secret qu'on peut intercepter.",
  },
};
