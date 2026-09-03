import { Search } from "lucide-react";
import { TRAIT_ICONE } from "@/lib/icones";
import { cn } from "@/lib/utils";

/*
 * Barre de filtres. Un champ de recherche, un groupe de bascule, et
 * eventuellement une action a droite.
 *
 * Le groupe de bascule sert deux usages releves dans les maquettes : le
 * filtre d'etat d'une liste et le basculement entre deux vues d'un meme
 * ecran. Meme composant, meme apparence, un seul endroit a corriger.
 */

export type OptionBascule<V extends string> = {
  valeur: V;
  libelle: string;
  /** Decompte affiche a cote du libelle. Omis tant qu'il n'est pas connu. */
  nombre?: number;
};

export function GroupeBascule<V extends string>({
  libelleGroupe,
  options,
  valeur,
  onChangement,
  className,
}: {
  /** Lu par les technologies d'assistance, pas affiche. */
  libelleGroupe: string;
  options: OptionBascule<V>[];
  valeur: V;
  onChangement: (valeur: V) => void;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={libelleGroupe}
      className={cn("flex flex-wrap items-center gap-3", className)}
    >
      {options.map((option) => {
        const actif = option.valeur === valeur;
        return (
          <button
            key={option.valeur}
            type="button"
            aria-pressed={actif}
            onClick={() => onChangement(option.valeur)}
            className={cn(
              "h-11 rounded-md px-5 text-[15px] transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              actif
                ? "bg-primary font-medium text-primary-foreground"
                : "border border-border bg-card text-fg-primary hover:bg-muted",
            )}
          >
            {option.libelle}
            {option.nombre !== undefined && (
              <span className={cn("tabular ml-2", !actif && "text-fg-secondary")}>
                {option.nombre}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function ChampRecherche({
  libelle,
  indication,
  valeur,
  onChangement,
  className,
}: {
  /** Lu par les technologies d'assistance. L'indication ne remplace pas une etiquette. */
  libelle: string;
  indication: string;
  valeur: string;
  onChangement: (valeur: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <label htmlFor="recherche-liste" className="sr-only">
        {libelle}
      </label>
      <Search
        className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-fg-muted"
        strokeWidth={TRAIT_ICONE}
        aria-hidden="true"
      />
      <input
        id="recherche-liste"
        type="search"
        value={valeur}
        onChange={(evenement) => onChangement(evenement.target.value)}
        placeholder={indication}
        className="h-11 w-full rounded-md border border-border bg-card pr-4 pl-10 text-[15px] text-fg-primary placeholder:text-fg-placeholder focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
      />
    </div>
  );
}

export function BarreFiltres({
  recherche,
  bascule,
  action,
}: {
  recherche?: React.ReactNode;
  bascule?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {recherche && <div className="w-[368px] max-w-full">{recherche}</div>}
      {bascule}
      {action && <div className="ml-auto">{action}</div>}
    </div>
  );
}
