import type { Utilisateur } from "@/stores/session";

/*
 * Donnees de simulation de l'authentification.
 *
 * Les mots de passe ne sont evidemment pas stockes ainsi cote serveur : ici
 * la couche service simule seulement le verdict, elle ne compare rien.
 */

export const COMPTES_CONNUS: Record<string, Utilisateur> = {
  "o.diallo@bestcashpay.com": {
    id: "c-1",
    nom: "O. Diallo",
    role: "administrateur",
    urlAvatar: null,
  },
  "f.kone@bestcashpay.com": {
    id: "c-2",
    nom: "F. Koné",
    role: "exploitant",
    urlAvatar: null,
  },
  "m.traore@bestcashpay.com": {
    id: "c-4",
    nom: "M. Traoré",
    role: "support",
    urlAvatar: null,
  },
  "s.bamba@bestcashpay.com": {
    id: "c-6",
    nom: "S. Bamba",
    role: "lecture-seule",
    urlAvatar: null,
  },
};

/** Code accepte par la simulation. Le vrai code est envoye hors interface. */
export const CODE_ATTENDU = "482913";
