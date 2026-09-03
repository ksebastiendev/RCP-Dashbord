import { create } from "zustand";
import type { TypeFournisseur } from "./types";

/*
 * Etat client du Referentiel : filtres actifs, onglet courant, modale
 * ouverte. Rien d'autre.
 *
 * Aucune liste, aucune fiche, aucun decompte ici. Ces donnees viennent du
 * serveur et vivent dans TanStack Query. Ce store ne contient que ce que
 * l'utilisateur a choisi de regarder, ce qui explique qu'il puisse etre
 * remis a zero sans rien perdre.
 */

/* Les maquettes Fournisseurs affichent un filtre "Tous les sens /
   Encaissement / Decaissement", identique a celui de Tables de routage et
   accompagne du meme bandeau : un report de la maquette Aiguillage. Un
   fournisseur n'a pas de sens, ses destinations en ont un. Le filtre porte
   donc sur le type, qui est la seule dimension que la liste possede. */
export type FiltreTypeFournisseur = "tous" | TypeFournisseur;
export type FiltreBornes = "tout" | "plafond-inconnu";
export type OngletMontants = "montants" | "champs";

/** Identifie la modale ouverte et la ligne qu'elle concerne. */
export type ModaleReferentiel =
  | { type: "aucune" }
  | { type: "renommer-operateur"; idOperateur: string; nomActuel: string }
  | { type: "retirer-borne"; idBorne: string; destination: string }
  | { type: "retirer-portefeuille"; idPortefeuille: string; nom: string }
  | { type: "renseigner-plafond"; idBorne: string; destination: string; devise: string }
  | { type: "declarer-fournisseur" }
  | { type: "declarer-marque" }
  | { type: "declarer-operateur" }
  | { type: "ouvrir-presence" }
  | { type: "exiger-champ" };

type EtatReferentiels = {
  /* Un terme de recherche par ecran : passer des fournisseurs aux
     operateurs ne doit pas trainer le filtre precedent. */
  rechercheFournisseurs: string;
  recherchePortefeuilles: string;
  rechercheOperateurs: string;
  recherchePresences: string;
  rechercheBornes: string;

  filtreTypeFournisseur: FiltreTypeFournisseur;
  filtreBornes: FiltreBornes;
  ongletMontants: OngletMontants;

  modale: ModaleReferentiel;

  definirRecherche: (
    ecran:
      | "rechercheFournisseurs"
      | "recherchePortefeuilles"
      | "rechercheOperateurs"
      | "recherchePresences"
      | "rechercheBornes",
    terme: string,
  ) => void;
  definirFiltreTypeFournisseur: (filtre: FiltreTypeFournisseur) => void;
  definirFiltreBornes: (filtre: FiltreBornes) => void;
  definirOngletMontants: (onglet: OngletMontants) => void;
  ouvrirModale: (modale: ModaleReferentiel) => void;
  fermerModale: () => void;
};

export const useReferentiels = create<EtatReferentiels>((set) => ({
  rechercheFournisseurs: "",
  recherchePortefeuilles: "",
  rechercheOperateurs: "",
  recherchePresences: "",
  rechercheBornes: "",

  filtreTypeFournisseur: "tous",
  filtreBornes: "tout",
  ongletMontants: "montants",

  modale: { type: "aucune" },

  definirRecherche: (ecran, terme) => set({ [ecran]: terme } as never),
  definirFiltreTypeFournisseur: (filtre) => set({ filtreTypeFournisseur: filtre }),
  definirFiltreBornes: (filtre) => set({ filtreBornes: filtre }),
  definirOngletMontants: (onglet) => set({ ongletMontants: onglet }),
  ouvrirModale: (modale) => set({ modale }),
  fermerModale: () => set({ modale: { type: "aucune" } }),
}));
