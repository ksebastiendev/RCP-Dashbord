import { Inbox, TriangleAlert, type LucideIcon } from "lucide-react";
import { TRAIT_ICONE } from "@/lib/icones";
import { cn } from "@/lib/utils";

/*
 * Etat vide d'un ecran de liste.
 *
 * Trois situations a ne pas confondre, portees par `raison`. Un vide n'est
 * pas un etat, c'est trois etats, et dire lequel est ce qui separe une
 * liste integree d'une liste inachevee.
 *
 *   "aucune-donnee"  -> rien n'a encore ete cree. C'est attendu, et la
 *                       sortie est de creer.
 *   "aucun-resultat" -> la liste a du contenu, le filtre ne renvoie rien.
 *                       Le vide vient de la saisie, pas des donnees, et la
 *                       sortie est de lever le filtre.
 *   "attendu-absent" -> des donnees etaient attendues et ne sont pas la.
 *                       Ce n'est pas normal, il n'y a pas de sortie a
 *                       proposer, et la mention le dit en clair.
 *
 * `ton` suit les maquettes, qui distinguent un vide neutre d'un vide qui est
 * une bonne nouvelle : aucun dossier en instance signifie qu'il n'y a rien a
 * examiner, et la vignette y est verte.
 */

const TONS = {
  alerte: "bg-danger-bg text-danger-fg",
  neutre: "bg-muted text-fg-muted",
  succes: "bg-success-bg text-success-fg",
  attente: "bg-warning-bg text-warning-text",
} as const;

export type RaisonVide = "aucune-donnee" | "aucun-resultat" | "attendu-absent";

const LECTURE: Record<RaisonVide, string> = {
  "aucune-donnee": "Aucune donnée enregistrée",
  "aucun-resultat": "Aucun résultat pour les filtres actifs",
  "attendu-absent": "Anomalie : des données étaient attendues et sont absentes",
};

export function EtatVide({
  raison,
  titre,
  description,
  action,
  ton,
  icone: Icone,
}: {
  raison: RaisonVide;
  titre: string;
  description: string;
  action?: React.ReactNode;
  ton?: keyof typeof TONS;
  icone?: LucideIcon;
}) {
  /* Un vide anormal ne se distingue pas de deux vides ordinaires par la
     seule teinte de la vignette : sa description est ecrite en rouge, et
     la lecture pour les technologies d'assistance dit "anomalie". */
  const anomalie = raison === "attendu-absent";
  const tonEffectif = ton ?? (anomalie ? "alerte" : "neutre");
  const IconeEffective = Icone ?? (anomalie ? TriangleAlert : Inbox);

  return (
    <div className="flex flex-col items-center gap-4 px-6 py-20 text-center">
      <span
        className={cn(
          "grid size-12 place-items-center rounded-lg",
          TONS[tonEffectif],
        )}
      >
        <IconeEffective
          className="size-6"
          strokeWidth={TRAIT_ICONE}
          aria-hidden="true"
        />
      </span>

      <div className="max-w-[420px]">
        <p className="text-section font-semibold text-fg-primary">{titre}</p>
        <p
          className={cn(
            "mt-1 text-mention leading-relaxed",
            anomalie ? "text-danger-fg" : "text-fg-secondary",
          )}
        >
          {description}
        </p>
      </div>

      {action && <div>{action}</div>}
      <span className="sr-only">{LECTURE[raison]}</span>
    </div>
  );
}
