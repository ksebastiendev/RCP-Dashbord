import { useEffect } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { usePreferences } from "@/stores/preferences";
import { appliquerTheme, suivreLeSysteme, type ModeTheme } from "@/lib/theme";
import { TRAIT_ICONE } from "@/lib/icones";
import { cn } from "@/lib/utils";

/*
 * Choix du theme, dans la barre superieure.
 *
 * Trois modes exposes cote a cote plutot qu'un bouton qui les fait defiler :
 * un bouton cyclique oblige a cliquer deux fois pour revenir en arriere, et
 * ne dit jamais quel mode est actif avant d'avoir ete actionne.
 *
 * L'etat actif n'est pas porte par la seule couleur du fond : le bouton
 * actif porte aria-checked, et son libelle accessible dit "actif".
 */

const MODES: { valeur: ModeTheme; libelle: string; icone: typeof Sun }[] = [
  { valeur: "clair", libelle: "Thème clair", icone: Sun },
  { valeur: "sombre", libelle: "Thème sombre", icone: Moon },
  { valeur: "systeme", libelle: "Suivre le système", icone: Monitor },
];

export function ChoixTheme() {
  const theme = usePreferences((e) => e.theme);
  const definirTheme = usePreferences((e) => e.definirTheme);

  /* Le mode "systeme" n'est pas une valeur figee : il suit le poste et doit
     donc rester a l'ecoute tant qu'il est choisi. */
  useEffect(
    () => suivreLeSysteme(theme, () => appliquerTheme(theme)),
    [theme],
  );

  /* Le script en ligne de index.html a deja pose la classe avant le premier
     rendu. Cette ligne rattrape le cas ou le stockage local est indisponible
     ou a ete vide entre-temps. */
  useEffect(() => appliquerTheme(theme), [theme]);

  return (
    <div
      role="radiogroup"
      aria-label="Thème de l'interface"
      className="flex items-center gap-0.5 rounded-md border border-topbar-border p-0.5"
    >
      {MODES.map(({ valeur, libelle, icone: Icone }) => {
        const actif = theme === valeur;
        return (
          <button
            key={valeur}
            type="button"
            role="radio"
            aria-checked={actif}
            aria-label={actif ? `${libelle}, actif` : libelle}
            title={libelle}
            onClick={() => definirTheme(valeur)}
            className={cn(
              "grid size-7 place-items-center rounded-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              actif
                ? "bg-primary text-primary-foreground"
                : "text-topbar-fg hover:bg-muted",
            )}
          >
            <Icone
              className="size-4"
              strokeWidth={TRAIT_ICONE}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
}
