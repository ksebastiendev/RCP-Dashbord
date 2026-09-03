import { Inbox, type LucideIcon } from "lucide-react";
import { TRAIT_ICONE } from "@/lib/icones";
import { cn } from "@/lib/utils";

/*
 * Etat vide d'un ecran de liste.
 *
 * Deux situations a ne pas confondre, portees par `raison` :
 *   "aucune-donnee" -> la liste est reellement vide
 *   "aucun-resultat" -> la liste a du contenu, mais le filtre ne renvoie rien
 * Le second cas propose de lever le filtre, le premier propose de creer.
 *
 * `ton` suit les maquettes, qui distinguent un vide neutre d'un vide qui est
 * une bonne nouvelle : aucun dossier en instance signifie qu'il n'y a rien a
 * examiner, et la vignette y est verte.
 */

const TONS = {
  neutre: "bg-muted text-fg-muted",
  succes: "bg-success-bg text-success-fg",
  attente: "bg-warning-bg text-warning-text",
} as const;

export function EtatVide({
  raison,
  titre,
  description,
  action,
  ton = "neutre",
  icone: Icone = Inbox,
}: {
  raison: "aucune-donnee" | "aucun-resultat";
  titre: string;
  description: string;
  action?: React.ReactNode;
  ton?: keyof typeof TONS;
  icone?: LucideIcon;
}) {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-20 text-center">
      <span
        className={cn("grid size-12 place-items-center rounded-lg", TONS[ton])}
      >
        <Icone className="size-6" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
      </span>

      <div className="max-w-[420px]">
        <p className="text-lg font-semibold text-fg-primary">{titre}</p>
        <p className="mt-1 text-sm leading-relaxed text-fg-secondary">
          {description}
        </p>
      </div>

      {action && <div>{action}</div>}
      <span className="sr-only">
        {raison === "aucun-resultat"
          ? "Aucun résultat pour les filtres actifs"
          : "Aucune donnée enregistrée"}
      </span>
    </div>
  );
}
