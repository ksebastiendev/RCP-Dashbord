import { create } from "zustand";
import { definirGestionExpiration, definirJeton } from "@/lib/jeton";

/*
 * Etat client transverse : qui est connecte et avec quel role.
 * Aucune donnee serveur ici. Les listes, fiches et mutations passent
 * exclusivement par TanStack Query.
 */

export type Role =
  | "administrateur"
  | "exploitant"
  | "lecteur";

export type Utilisateur = {
  id: string;
  nom: string;
  role: Role;
  urlAvatar: string | null;
};

type EtatSession = {
  utilisateur: Utilisateur | null;
  sessionExpiree: boolean;
  ouvrirSession: (utilisateur: Utilisateur, jeton: string) => void;
  fermerSession: () => void;
  marquerExpiree: () => void;
};

export const useSession = create<EtatSession>((set) => ({
  utilisateur: null,
  sessionExpiree: false,

  ouvrirSession: (utilisateur, jeton) => {
    definirJeton(jeton);
    set({ utilisateur, sessionExpiree: false });
  },

  fermerSession: () => {
    definirJeton(null);
    set({ utilisateur: null, sessionExpiree: false });
  },

  marquerExpiree: () => {
    definirJeton(null);
    set({ utilisateur: null, sessionExpiree: true });
  },
}));

/* L'intercepteur Axios ne connait pas le store : c'est le store qui lui
   fournit le rappel a declencher sur un 401. */
definirGestionExpiration(() => {
  useSession.getState().marquerExpiree();
});

/** Verification de droit, cote affichage uniquement. Le serveur reste
    l'autorite : ceci masque une action, cela ne la protege pas. */
export function useRole(): Role | null {
  return useSession((e) => e.utilisateur?.role ?? null);
}
