import { ErreurApi } from "@/lib/erreurs";
import { simulerReponse } from "@/lib/latence";
import { CODE_ATTENDU, COMPTES_CONNUS } from "@/mocks/authentification";
import type { DefiSecondFacteur, SessionOuverte } from "../types";

/*
 * Couche service de l'authentification.
 *
 * Deux precautions que le vrai backend devra tenir, et que la simulation
 * respecte deja pour que l'interface soit ecrite en consequence :
 *
 * Un identifiant inconnu et un mot de passe faux renvoient exactement le
 * meme message. Les distinguer transformerait l'ecran de connexion en outil
 * de verification d'adresses.
 *
 * Le nombre d'essais du code est compte cote serveur. Un compteur cote
 * client ne protege de rien, il suffit de recharger la page.
 */

const ESSAIS_MAXIMUM = 5;
const essaisParDefi = new Map<string, number>();

export async function seConnecter(
  courriel: string,
  motDePasse: string,
): Promise<DefiSecondFacteur> {
  const normalise = courriel.trim().toLowerCase();
  const connu = COMPTES_CONNUS[normalise] !== undefined;

  /* Le mot de passe n'est pas verifie ici : la simulation accepte toute
     saisie non vide pour un compte connu, et refuse tout le reste avec un
     message unique. */
  if (!connu || motDePasse.trim().length === 0) {
    throw new ErreurApi(
      "authentification",
      "Adresse électronique ou mot de passe incorrect.",
      401,
    );
  }

  const jetonDefi = crypto.randomUUID();
  essaisParDefi.set(jetonDefi, 0);

  const [avant, apres] = normalise.split("@");
  const masque =
    avant.slice(0, 2) + "•".repeat(Math.max(1, avant.length - 2)) + "@" + apres;

  return simulerReponse({
    jetonDefi,
    destinationMasquee: masque,
    longueurCode: CODE_ATTENDU.length,
    delaiRenvoiSecondes: 30,
  });
}

export async function verifierCode(
  jetonDefi: string,
  code: string,
  courriel: string,
): Promise<SessionOuverte> {
  const essais = essaisParDefi.get(jetonDefi);
  if (essais === undefined) {
    throw new ErreurApi(
      "authentification",
      "Cette demande de connexion a expiré. Recommencez depuis l'écran de connexion.",
      401,
    );
  }

  if (essais >= ESSAIS_MAXIMUM) {
    essaisParDefi.delete(jetonDefi);
    throw new ErreurApi(
      "authentification",
      "Trop de codes erronés. Recommencez depuis l'écran de connexion.",
      401,
    );
  }

  if (code !== CODE_ATTENDU) {
    essaisParDefi.set(jetonDefi, essais + 1);
    const restants = ESSAIS_MAXIMUM - essais - 1;
    throw new ErreurApi(
      "authentification",
      restants > 0
        ? `Code incorrect. ${restants} ${restants === 1 ? "essai restant" : "essais restants"}.`
        : "Code incorrect. Recommencez depuis l'écran de connexion.",
      401,
    );
  }

  essaisParDefi.delete(jetonDefi);
  const utilisateur = COMPTES_CONNUS[courriel.trim().toLowerCase()];

  return simulerReponse({
    utilisateur,
    jeton: `jeton-${crypto.randomUUID()}`,
  });
}

export async function renvoyerCode(jetonDefi: string): Promise<void> {
  if (!essaisParDefi.has(jetonDefi)) {
    throw new ErreurApi(
      "authentification",
      "Cette demande de connexion a expiré. Recommencez depuis l'écran de connexion.",
      401,
    );
  }
  await simulerReponse(null);
}
