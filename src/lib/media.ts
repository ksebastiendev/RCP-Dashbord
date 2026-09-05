import { useEffect, useState } from "react";

/*
 * Abonnement a une requete de media.
 *
 * Sert a distinguer le bureau du mobile la ou la difference n'est pas
 * qu'une affaire de classes : la navigation laterale se replie en colonne
 * d'icones sur grand ecran, mais en tiroir pleine largeur sur petit, et
 * ce sont deux arbres differents, pas deux mises en forme du meme.
 */

export function useRequeteMedia(requete: string) {
  const [correspond, setCorrespond] = useState(
    () => window.matchMedia(requete).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(requete);
    const suivre = () => setCorrespond(media.matches);
    suivre();
    media.addEventListener("change", suivre);
    return () => media.removeEventListener("change", suivre);
  }, [requete]);

  return correspond;
}

/** Seuil au dela duquel la navigation laterale tient a cote du contenu. */
export const REQUETE_BUREAU = "(min-width: 1024px)";

export function useEstBureau() {
  return useRequeteMedia(REQUETE_BUREAU);
}
