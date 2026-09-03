import { simulerReponse } from "@/lib/latence";
import { ErreurApi } from "@/lib/erreurs";
import {
  BORNES,
  DEVISES,
  FICHES_FOURNISSEUR,
  FOURNISSEURS,
  INDICATEURS_BORNES,
  OPERATEURS,
  PAYS,
  PORTEFEUILLES,
  PRESENCES,
} from "@/mocks/referentiels";
import type {
  Borne,
  Devise,
  FicheFournisseur,
  Fournisseur,
  IndicateursBornes,
  Operateur,
  PaysServi,
  Portefeuille,
  Presence,
} from "../types";

/*
 * Couche service du Referentiel.
 *
 * C'est le seul endroit du domaine qui connait l'origine des donnees.
 * Le jour ou le backend existe, chaque fonction passe de
 *   return simulerReponse(FOURNISSEURS)
 * a
 *   const { data } = await api.get<Fournisseur[]>("/referentiels/fournisseurs");
 *   return data;
 * Les hooks, les ecrans et les types ne changent pas.
 */

export async function listerFournisseurs(): Promise<Fournisseur[]> {
  return simulerReponse(FOURNISSEURS);
}

export async function lireFicheFournisseur(id: string): Promise<FicheFournisseur> {
  const fiche = FICHES_FOURNISSEUR[id];
  if (!fiche) {
    /* Meme forme d'erreur qu'un 404 renvoye par l'intercepteur Axios :
       l'ecran ne fait pas la difference entre absence simulee et reelle. */
    throw new ErreurApi("introuvable", "Ce fournisseur n'existe pas ou a été retiré.", 404);
  }
  return simulerReponse(fiche);
}

export async function listerPortefeuilles(): Promise<Portefeuille[]> {
  return simulerReponse(PORTEFEUILLES);
}

export async function listerOperateurs(): Promise<Operateur[]> {
  return simulerReponse(OPERATEURS);
}

export async function listerPresences(): Promise<Presence[]> {
  return simulerReponse(PRESENCES);
}

export async function listerBornes(): Promise<Borne[]> {
  return simulerReponse(BORNES);
}

export async function lireIndicateursBornes(): Promise<IndicateursBornes> {
  return simulerReponse(INDICATEURS_BORNES);
}

export async function listerDevises(): Promise<Devise[]> {
  return simulerReponse(DEVISES);
}

export async function listerPays(): Promise<PaysServi[]> {
  return simulerReponse(PAYS);
}

/* --- Mutations --- */

export async function renommerOperateur(
  id: string,
  nouveauNom: string,
): Promise<Operateur> {
  const operateur = OPERATEURS.find((o) => o.id === id);
  if (!operateur) {
    throw new ErreurApi("introuvable", "Cet opérateur n'existe plus.", 404);
  }
  return simulerReponse({
    ...operateur,
    ancienNom: operateur.nom,
    nom: nouveauNom,
  });
}

export async function retirerBorne(id: string): Promise<void> {
  const borne = BORNES.find((b) => b.id === id);
  if (!borne) {
    throw new ErreurApi("introuvable", "Cette borne a déjà été retirée.", 404);
  }
  await simulerReponse(null);
}

export async function retirerPortefeuille(id: string): Promise<void> {
  const portefeuille = PORTEFEUILLES.find((p) => p.id === id);
  if (!portefeuille) {
    throw new ErreurApi("introuvable", "Cette marque a déjà été retirée.", 404);
  }
  if (!portefeuille.retirable) {
    throw new ErreurApi(
      "conflit",
      "Cette marque porte des routes actives. Fermez les routes avant de la retirer.",
      409,
    );
  }
  await simulerReponse(null);
}
