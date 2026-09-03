import type { Utilisateur } from "@/stores/session";

/* Contrats de donnees de l'authentification. */

/**
 * Resultat d'une tentative de connexion.
 *
 * Une connexion reussie ne rend pas de session : elle rend un defi. Le
 * second facteur n'est pas une option de l'ecran, c'est une etape du
 * protocole, et le type l'impose.
 */
export type DefiSecondFacteur = {
  /** Identifie la tentative en cours. Sans lui, aucun code ne peut etre verifie. */
  jetonDefi: string;
  /** Adresse partiellement masquee, pour que la personne sache ou regarder. */
  destinationMasquee: string;
  longueurCode: number;
  /** Secondes avant de pouvoir demander un nouveau code. */
  delaiRenvoiSecondes: number;
};

export type SessionOuverte = {
  utilisateur: Utilisateur;
  jeton: string;
};
