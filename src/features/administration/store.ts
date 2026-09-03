import { create } from "zustand";

/* Etat client de l'Administration : quelle modale est ouverte. */

export type ModaleAdministration = "aucune" | "creer-compte";

type EtatAdministration = {
  modale: ModaleAdministration;
  ouvrirModale: (modale: ModaleAdministration) => void;
  fermerModale: () => void;
};

export const useAdministrationStore = create<EtatAdministration>((set) => ({
  modale: "aucune",
  ouvrirModale: (modale) => set({ modale }),
  fermerModale: () => set({ modale: "aucune" }),
}));
