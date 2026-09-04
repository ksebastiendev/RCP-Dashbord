import { create } from "zustand";
import { persist } from "zustand/middleware";
import { appliquerTheme, type ModeTheme } from "@/lib/theme";

/*
 * Preferences d'affichage. Etat purement client : rien ici ne vient du
 * serveur et rien ici n'y retourne.
 *
 * Persiste dans le stockage local parce qu'un exploitant qui replie la
 * navigation ne s'attend pas a la retrouver depliee au rechargement.
 *
 * Le nom de la cle de persistance, CLE_PREFERENCES, est lu tel quel par le
 * script en ligne de index.html, qui pose la classe de theme avant le
 * premier rendu pour eviter l'eclair blanc. C'est la seule dependance a ce
 * nom hors de ce fichier, et elle est volontaire : le theme reste stocke
 * une seule fois, ici.
 */

export const CLE_PREFERENCES = "bcp-preferences";

type EtatPreferences = {
  navigationRepliee: boolean;
  /* Sections dont le sous-menu est ouvert, par identifiant de section. */
  sectionsOuvertes: string[];
  /* Theme demande. "systeme" est le defaut : tant que rien n'est choisi,
     l'interface suit le reglage du poste. */
  theme: ModeTheme;

  definirTheme: (mode: ModeTheme) => void;
  basculerNavigation: () => void;
  basculerSection: (idSection: string) => void;
  ouvrirSection: (idSection: string) => void;
};

export const usePreferences = create<EtatPreferences>()(
  persist(
    (set, get) => ({
      navigationRepliee: false,
      sectionsOuvertes: [],
      theme: "systeme",

      definirTheme: (mode) => {
        appliquerTheme(mode);
        set({ theme: mode });
      },

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
    { name: CLE_PREFERENCES },
  ),
);
