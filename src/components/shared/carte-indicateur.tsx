import { Skeleton } from "@/components/ui/skeleton";
import { Carte } from "./carte";
import { formatEntier } from "@/lib/format";
import { cn } from "@/lib/utils";

/*
 * Carte d'indicateur.
 *
 * Le nombre n'est jamais nu de sens : la phrase sous le chiffre dit sur quoi
 * il porte. `alerte` met le chiffre en ambre quand il designe un risque,
 * comme les plafonds inconnus, mais la phrase dit la meme chose en mots :
 * la couleur ne porte pas l'information seule.
 *
 * Le chargement rend un squelette aux dimensions du chiffre, la carte ne
 * change donc pas de hauteur a l'arrivee des donnees.
 */
export function CarteIndicateur({
  etiquette,
  valeur,
  precision,
  alerte = false,
  chargement = false,
}: {
  etiquette: string;
  /** undefined quand la valeur n'est pas connue : jamais remplacee par zero. */
  valeur: number | undefined;
  precision: string;
  /**
   * Le chiffre designe un probleme reel, pas un simple point de vigilance :
   * il se lit alors en rouge. L'ambre a ete essaye et vire au beige en gros
   * corps, ou il ne signale plus rien. La phrase sous le chiffre dit de
   * toute facon la meme chose en mots.
   */
  alerte?: boolean;
  chargement?: boolean;
}) {
  return (
    <Carte className="flex flex-col gap-3 px-6 py-6">
      <p className="text-corps text-fg-secondary">{etiquette}</p>

      {chargement ? (
        <Skeleton className="h-9 w-24" />
      ) : (
        <p
          className={cn(
            "tabular text-ecran font-semibold",
            alerte ? "text-danger-fg" : "text-fg-primary",
          )}
        >
          {formatEntier(valeur)}
        </p>
      )}

      {chargement ? (
        <Skeleton className="h-4 w-full max-w-[240px]" />
      ) : (
        <p className="text-mention leading-relaxed text-fg-secondary">{precision}</p>
      )}
    </Carte>
  );
}
