import { cn } from "@/lib/utils";

/*
 * Pastille d'etat.
 *
 * Le libelle ecrit est obligatoire : la couleur ne transporte jamais
 * l'information a elle seule. Un utilisateur qui ne distingue pas le vert du
 * rouge doit lire l'etat, pas le deviner.
 */

export type GenreEtat = "succes" | "danger" | "attente" | "neutre";

const CLASSES: Record<GenreEtat, string> = {
  succes: "bg-success-bg text-success-fg",
  danger: "bg-danger-bg text-danger-fg",
  attente: "bg-warning-bg text-warning-text",
  neutre: "bg-neutral-bg text-neutral-fg",
};

export function PastilleEtat({
  genre,
  libelle,
  className,
}: {
  genre: GenreEtat;
  /** Toujours renseigne. Il n'existe pas de pastille sans texte. */
  libelle: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center rounded-sm px-2 py-1 text-mention font-medium",
        CLASSES[genre],
        className,
      )}
    >
      <span className="truncate">{libelle}</span>
    </span>
  );
}
