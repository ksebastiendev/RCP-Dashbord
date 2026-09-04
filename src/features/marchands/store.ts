import { create } from "zustand";
import type { StatutDossier, TypeIdentifiantLegal } from "./types";

/*
 * Etat client de la section Marchand.
 * Filtres et modale ouverte. Aucune donnee serveur.
 *
 * L'onglet de la fiche n'est plus ici : il est porte par l'adresse, pour
 * qu'un lien vers la tarification d'un marchand ouvre la tarification.
 */

export type FiltreStatut = "tous" | StatutDossier;

export type ModaleMarchand =
  | { type: "aucune" }
  | { type: "renouveler-cle"; idApplication: string; nomApplication: string }
  | { type: "nouvelle-application" }
  | { type: "nouvelle-adresse" };

type EtatMarchands = {
  rechercheNom: string;
  filtreStatut: FiltreStatut;

  /* Recherche par identifiant legal. La saisie reste locale tant que
     l'utilisateur n'a pas valide : voir useRechercheLegale. */
  typeIdentifiant: TypeIdentifiantLegal;
  saisieIdentifiant: string;
  /** Valeur reellement soumise, celle sur laquelle la requete est armee. */
  identifiantSoumis: string;

  /** Marchand choisi dans le selecteur d'Applications et clés. */
  marchandChoisi: string | null;
  modale: ModaleMarchand;

  definirRechercheNom: (terme: string) => void;
  definirFiltreStatut: (filtre: FiltreStatut) => void;
  definirTypeIdentifiant: (type: TypeIdentifiantLegal) => void;
  definirSaisieIdentifiant: (valeur: string) => void;
  soumettreIdentifiant: () => void;
  effacerRechercheLegale: () => void;
  definirMarchandChoisi: (id: string | null) => void;
  ouvrirModale: (modale: ModaleMarchand) => void;
  fermerModale: () => void;
};

export const useMarchandsStore = create<EtatMarchands>((set, get) => ({
  rechercheNom: "",
  filtreStatut: "tous",

  typeIdentifiant: "immatriculation",
  saisieIdentifiant: "",
  identifiantSoumis: "",

  marchandChoisi: null,
  modale: { type: "aucune" },

  definirRechercheNom: (terme) => set({ rechercheNom: terme }),
  definirFiltreStatut: (filtre) => set({ filtreStatut: filtre }),
  definirTypeIdentifiant: (type) =>
    /* Changer de type invalide le resultat precedent : une empreinte ne vaut
       que pour le type sur lequel elle a ete calculee. */
    set({ typeIdentifiant: type, identifiantSoumis: "" }),
  definirSaisieIdentifiant: (valeur) => set({ saisieIdentifiant: valeur }),
  soumettreIdentifiant: () => set({ identifiantSoumis: get().saisieIdentifiant }),
  effacerRechercheLegale: () => set({ saisieIdentifiant: "", identifiantSoumis: "" }),
  definirMarchandChoisi: (id) => set({ marchandChoisi: id }),
  ouvrirModale: (modale) => set({ modale }),
  fermerModale: () => set({ modale: { type: "aucune" } }),
}));
