import { create } from "zustand";
import type { DefiSecondFacteur } from "./types";

/*
 * Etat client de l'authentification : la tentative en cours.
 *
 * Le defi vit ici et non dans TanStack Query : il ne represente pas une
 * ressource du serveur qu'on relit, mais une etape que l'utilisateur est en
 * train de traverser. Il disparait des que la session est ouverte.
 */

type EtatAuthentification = {
  courriel: string;
  defi: DefiSecondFacteur | null;

  definirCourriel: (courriel: string) => void;
  demarrerDefi: (courriel: string, defi: DefiSecondFacteur) => void;
  abandonnerDefi: () => void;
};

export const useAuthentification = create<EtatAuthentification>((set) => ({
  courriel: "",
  defi: null,

  definirCourriel: (courriel) => set({ courriel }),
  demarrerDefi: (courriel, defi) => set({ courriel, defi }),
  abandonnerDefi: () => set({ defi: null }),
}));
