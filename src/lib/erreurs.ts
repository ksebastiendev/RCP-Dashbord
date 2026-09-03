/*
 * Typage unique des erreurs remontees par la couche service.
 * Le composant d'erreur et d'acces refuse partage se branche sur `genre`,
 * jamais sur un code HTTP lu dans un ecran.
 */

export type GenreErreur =
  | "reseau" /* pas de reponse : hors ligne, DNS, delai depasse */
  | "authentification" /* 401 : session expiree, il faut se reconnecter */
  | "droits" /* 403 : connecte mais non autorise sur cette ressource */
  | "introuvable" /* 404 */
  | "validation" /* 400 / 422 : la saisie est refusee */
  | "conflit" /* 409 : etat concurrent */
  | "serveur"; /* 5xx et tout le reste */

export class ErreurApi extends Error {
  readonly genre: GenreErreur;
  readonly statut: number | null;
  /** Erreurs par champ, renseignees seulement pour le genre "validation". */
  readonly champs: Record<string, string> | null;

  constructor(
    genre: GenreErreur,
    message: string,
    statut: number | null = null,
    champs: Record<string, string> | null = null,
  ) {
    super(message);
    this.name = "ErreurApi";
    this.genre = genre;
    this.statut = statut;
    this.champs = champs;
  }
}

export function estErreurApi(e: unknown): e is ErreurApi {
  return e instanceof ErreurApi;
}

/** Message par defaut affiche quand le serveur n'en fournit pas. */
export const MESSAGE_PAR_GENRE: Record<GenreErreur, string> = {
  reseau: "La plateforme est injoignable. Verifiez votre connexion.",
  authentification: "Votre session a expire. Reconnectez-vous pour continuer.",
  droits: "Vous n'avez pas les droits necessaires pour consulter cet ecran.",
  introuvable: "Cet element n'existe pas ou a ete supprime.",
  validation: "Les informations saisies ont ete refusees.",
  conflit: "Cet element a ete modifie entre-temps. Rechargez avant de reessayer.",
  serveur: "Une erreur est survenue du cote de la plateforme.",
};
