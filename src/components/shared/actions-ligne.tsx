import { cn } from "@/lib/utils";

/*
 * Actions de ligne de tableau.
 *
 * Deux formes relevees dans les maquettes, que les variantes shadcn ne
 * couvrent pas : l'action de correction en texte orange, et le retrait en
 * rouge sur fond rouge clair. La variante `destructive` de shadcn est un
 * fond rouge plein, absent des maquettes, et components/ui n'est pas
 * modifie.
 */

export function ActionLigne({
  libelle,
  onClick,
  desactive = false,
  /**
   * "action" pour une correction ou un renommage, "danger" pour un retrait.
   * Les maquettes montrent les deux tons en texte simple, en plus de la
   * forme en pastille de ActionRetrait.
   */
  ton = "action",
  /** Raison affichee a la place de l'action quand elle n'est pas disponible. */
  raisonIndisponible,
  /** Pourquoi l'action est desactivee, au survol et pour les lecteurs d'ecran. */
  motif,
}: {
  libelle: string;
  onClick: () => void;
  desactive?: boolean;
  ton?: "action" | "danger";
  raisonIndisponible?: string;
  motif?: string;
}) {
  if (desactive && raisonIndisponible) {
    return <span className="text-mention text-fg-muted">{raisonIndisponible}</span>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={desactive}
      title={desactive ? motif : undefined}
      className={cn(
        "rounded-sm text-corps font-medium underline-offset-4 transition-colors",
        ton === "danger" ? "text-danger-fg" : "text-warning-text",
        "hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:text-fg-muted disabled:hover:no-underline",
      )}
    >
      {libelle}
    </button>
  );
}

/**
 * Action de retrait. Ne declenche jamais l'action elle-meme : elle ouvre la
 * modale de confirmation, qui dit ce que le retrait produit reellement.
 */
export function ActionRetrait({
  libelle = "Retirer",
  onClick,
  desactive = false,
}: {
  libelle?: string;
  onClick: () => void;
  desactive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={desactive}
      className={cn(
        "h-9 rounded-md bg-danger-subtle px-4 text-corps font-medium text-danger-fg transition-colors",
        "hover:bg-danger-bg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:bg-muted disabled:text-fg-muted",
      )}
    >
      {libelle}
    </button>
  );
}

/** Groupe d'actions en fin de ligne, aligne a droite. */
export function GroupeActions({ children }: { children: React.ReactNode }) {
  return <span className="flex items-center justify-end gap-4">{children}</span>;
}
