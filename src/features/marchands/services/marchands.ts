import { ErreurApi } from "@/lib/erreurs";
import { simulerReponse } from "@/lib/latence";
import {
  EMPREINTES_LEGALES,
  FICHES_MARCHAND,
  MARCHANDS,
} from "@/mocks/marchands";
import type {
  FicheMarchand,
  Marchand,
  ResultatRechercheLegale,
  TypeIdentifiantLegal,
} from "../types";

/*
 * Couche service de la section Marchand.
 * Seul module du domaine qui connait l'origine des donnees.
 */

export async function listerMarchands(): Promise<Marchand[]> {
  return simulerReponse(MARCHANDS);
}

export async function lireFicheMarchand(id: string): Promise<FicheMarchand> {
  const fiche = FICHES_MARCHAND[id];
  if (!fiche) {
    throw new ErreurApi(
      "introuvable",
      "Ce marchand n'existe pas ou son dossier a été supprimé.",
      404,
    );
  }
  return simulerReponse(fiche);
}

/**
 * Normalise un identifiant legal avant recherche : casse, espaces et
 * separateurs ne doivent pas faire echouer une correspondance qui est par
 * ailleurs exacte.
 */
function normaliser(valeur: string) {
  return valeur.trim().toUpperCase().replace(/\s+/g, "");
}

/**
 * Recherche par identifiant legal.
 *
 * Les identifiants sont chiffres au repos : le serveur ne compare que des
 * empreintes a cle, jamais les valeurs en clair. La recherche est donc
 * exacte par construction, il n'existe pas de recherche partielle, et la
 * valeur cherchee n'est jamais exposee ni renvoyee.
 *
 * Cote reel :
 *   const { data } = await api.post("/marchands/recherche-legale", {
 *     type, empreinte: await empreinte(valeur),
 *   });
 */
export async function rechercherParIdentifiantLegal(
  _type: TypeIdentifiantLegal,
  valeur: string,
): Promise<ResultatRechercheLegale> {
  const idMarchand = EMPREINTES_LEGALES[normaliser(valeur)];
  const marchand = idMarchand
    ? (MARCHANDS.find((m) => m.id === idMarchand) ?? null)
    : null;

  return simulerReponse({ marchand });
}

export async function renouvelerCleApplication(idApplication: string): Promise<void> {
  if (!idApplication) {
    throw new ErreurApi("validation", "Aucune application désignée.", 400);
  }
  await simulerReponse(null);
}

export async function testerWebhook(idWebhook: string): Promise<{ succes: boolean; message: string }> {
  if (!idWebhook) {
    throw new ErreurApi("validation", "Aucune adresse désignée.", 400);
  }
  return simulerReponse({
    succes: true,
    message: "Le serveur du marchand a répondu 200 en 340 ms.",
  });
}
