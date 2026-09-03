import { create } from "zustand";

/* Etat client de la Tarification : quelle modale est ouverte. */

export type ModaleTarification = "aucune" | "ajouter-regle" | "declarer-cout";

type EtatTarification = {
  modale: ModaleTarification;
  ouvrirModale: (modale: ModaleTarification) => void;
  fermerModale: () => void;
};

export const useTarification = create<EtatTarification>((set) => ({
  modale: "aucune",
  ouvrirModale: (modale) => set({ modale }),
  fermerModale: () => set({ modale: "aucune" }),
}));
