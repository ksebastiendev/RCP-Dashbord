import { create } from "zustand";
import { persist } from "zustand/middleware";

/*
 * Preferences d'affichage. Etat purement client : rien ici ne vient du
 * serveur et rien ici n'y retourne.
 *
 * Persiste dans le stockage local parce qu'un exploitant qui replie la
 * navigation ne s'attend pas a la retrouver depliee au rechargement.
 */

type EtatPreferences = {
  navigationRepliee: boolean;
  /* Sections dont le sous-menu est ouvert, par identifiant de section. */
  sectionsOuvertes: string[];

  basculerNavigation: () => void;
  basculerSection: (idSection: string) => void;
  ouvrirSection: (idSection: string) => void;
};

export const usePreferences = create<EtatPreferences>()(
  persist(
    (set, get) => ({
      navigationRepliee: false,
      sectionsOuvertes: [],

      basculerNavigation: () =>
        set((e) => ({ navigationRepliee: !e.navigationRepliee })),

      basculerSection: (idSection) =>
        set((e) => ({
          sectionsOuvertes: e.sectionsOuvertes.includes(idSection)
            ? e.sectionsOuvertes.filter((id) => id !== idSection)
            : [...e.sectionsOuvertes, idSection],
        })),

      ouvrirSection: (idSection) => {
        if (get().sectionsOuvertes.includes(idSection)) return;
        set((e) => ({ sectionsOuvertes: [...e.sectionsOuvertes, idSection] }));
      },
    }),
    { name: "bcp-preferences" },
  ),
);
