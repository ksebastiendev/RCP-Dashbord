import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { usePreferences } from "@/stores/preferences";
import { appliquerTheme, REQUETE_SOMBRE } from "@/lib/theme";
import { useRequeteMedia } from "@/lib/media";
import { TRAIT_ICONE } from "@/lib/icones";

/*
 * Bascule du theme, dans la barre superieure.
 *
 * Un seul bouton, qui montre ou l'on va et non ou l'on est : la lune en
 * clair, le soleil en sombre. Une barre superieure de back-office n'est
 * pas un panneau de reglages, et un troisieme bouton "suivre le systeme"
 * y demandait de comprendre un mode avant de pouvoir changer de couleur.
 *
 * Le mode systeme n'a pas disparu pour autant : c'est le defaut, tant que
 * personne n'a touche au bouton. Le premier appui le remplace par un choix
 * explicite, qui tient jusqu'a ce qu'on en change.
 */

export function ChoixTheme() {
  const theme = usePreferences((e) => e.theme);
  const definirTheme = usePreferences((e) => e.definirTheme);

  /* Tant que le mode reste "systeme", l'interface suit le poste. Le suivre
     par une requete de media plutot que par un simple abonnement fait que
     le bouton change d'icone en meme temps que l'interface change de fond,
     au lieu de rester sur l'ancienne. */
  const systemeSombre = useRequeteMedia(REQUETE_SOMBRE);
  const sombre = theme === "sombre" || (theme === "systeme" && systemeSombre);

  /* Le script en ligne de index.html a deja pose la classe avant le premier
     rendu. Cette ligne rattrape le stockage local indisponible, vide entre
     temps, ou le reglage du poste qui bouge en cours de session. */
  useEffect(() => appliquerTheme(theme), [theme, sombre]);

  const libelle = sombre ? "Passer au thème clair" : "Passer au thème sombre";

  return (
    <button
      type="button"
      onClick={() => definirTheme(sombre ? "clair" : "sombre")}
      aria-label={libelle}
      title={libelle}
      className="grid size-9 shrink-0 place-items-center rounded-md text-topbar-fg transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {sombre ? (
        <Sun className="size-5" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
      ) : (
        <Moon className="size-5" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
      )}
    </button>
  );
}
