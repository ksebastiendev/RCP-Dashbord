import { useSession } from "@/stores/session";

/*
 * Ouverture de session de demonstration.
 *
 * Les maquettes ne comportent pas d'ecran de connexion : la coque suppose un
 * utilisateur deja identifie. Ce module ouvre donc une session locale pour
 * que la navigation et la barre superieure aient un utilisateur a afficher.
 *
 * A retirer des l'arrivee de l'ecran de connexion. Aucun autre module ne
 * doit l'importer.
 */
export function ouvrirSessionDeDemonstration() {
  if (useSession.getState().utilisateur) return;

  useSession.getState().ouvrirSession(
    {
      id: "utilisateur-demonstration",
      nom: "O. Diallo",
      role: "administrateur",
      urlAvatar: null,
    },
    "jeton-de-demonstration",
  );
}
