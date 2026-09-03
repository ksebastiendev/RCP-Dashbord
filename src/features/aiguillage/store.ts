import { create } from "zustand";
import type { Sens } from "./types";

/* Etat client de l'Aiguillage : filtres et recherche. Aucune donnee serveur. */

export type FiltreCouverture = "tous" | "servi" | "ouvrable" | "ferme";
export type FiltreSens = "tous" | Sens;

type EtatAiguillage = {
  rechercheCouverture: string;
  filtreCouverture: FiltreCouverture;
  rechercheRoutes: string;
  filtreSens: FiltreSens;

  definirRechercheCouverture: (terme: string) => void;
  definirFiltreCouverture: (filtre: FiltreCouverture) => void;
  definirRechercheRoutes: (terme: string) => void;
  definirFiltreSens: (filtre: FiltreSens) => void;
};

export const useAiguillage = create<EtatAiguillage>((set) => ({
  rechercheCouverture: "",
  filtreCouverture: "tous",
  rechercheRoutes: "",
  filtreSens: "tous",

  definirRechercheCouverture: (terme) => set({ rechercheCouverture: terme }),
  definirFiltreCouverture: (filtre) => set({ filtreCouverture: filtre }),
  definirRechercheRoutes: (terme) => set({ rechercheRoutes: terme }),
  definirFiltreSens: (filtre) => set({ filtreSens: filtre }),
}));
