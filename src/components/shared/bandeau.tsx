import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import { TRAIT_ICONE } from "@/lib/icones";
import { cn } from "@/lib/utils";

/*
 * Bandeau pleine largeur. Sert a poser un constat en haut d'un ecran :
 * ce qui va, ce qui bloque, ce qui merite un coup d'oeil.
 *
 * Le fond utilise le token `subtle` du genre, le texte le token de texte
 * accessible. L'icone accompagne le propos, elle ne le porte pas : le titre
 * dit la meme chose en mots.
 */

export type GenreBandeau = "succes" | "danger" | "attente" | "information";

const APPARENCE = {
  succes: {
    icone: CircleCheck,
    fond: "bg-success-subtle",
    pastille: "bg-success-bg text-success-fg",
    texte: "text-success-fg",
    lecture: "Constat favorable",
  },
  danger: {
    icone: CircleAlert,
    fond: "bg-danger-subtle",
    pastille: "bg-danger-bg text-danger-fg",
    texte: "text-danger-fg",
    lecture: "Alerte",
  },
  attente: {
    icone: TriangleAlert,
    fond: "bg-warning-subtle",
    pastille: "bg-warning-bg text-warning-text",
    texte: "text-warning-text",
    lecture: "Point de vigilance",
  },
  information: {
    icone: Info,
    fond: "bg-muted",
    pastille: "bg-neutral-bg text-neutral-fg",
    texte: "text-fg-secondary",
    lecture: "Information",
  },
} as const;

export function Bandeau({
  genre,
  titre,
  description,
  action,
  className,
}: {
  genre: GenreBandeau;
  titre: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  const apparence = APPARENCE[genre];
  const Icone = apparence.icone;

  return (
    <div
      role={genre === "danger" ? "alert" : undefined}
      className={cn(
        "flex items-start gap-4 rounded-lg px-6 py-5",
        apparence.fond,
        className,
      )}
    >
      <span
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-full",
          apparence.pastille,
        )}
      >
        <Icone className="size-4" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-corps font-semibold text-fg-primary">
          <span className="sr-only">{apparence.lecture} : </span>
          {titre}
        </p>
        {description && (
          <p className="mt-1 text-mention leading-relaxed text-fg-secondary">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/**
 * Bandeau court, sur une seule ligne, tel qu'il apparait sur l'ecran des
 * notifications en echec : pas de titre distinct, le message porte tout.
 */
export function BandeauCompact({
  genre,
  message,
  className,
}: {
  genre: GenreBandeau;
  message: string;
  className?: string;
}) {
  const apparence = APPARENCE[genre];
  const Icone = apparence.icone;

  return (
    <div
      role={genre === "danger" ? "alert" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg px-5 py-4",
        apparence.fond,
        className,
      )}
    >
      <Icone
        className={cn("size-5 shrink-0", apparence.texte)}
        strokeWidth={TRAIT_ICONE}
        aria-hidden="true"
      />
      <p className={cn("text-mention", apparence.texte)}>
        <span className="sr-only">{apparence.lecture} : </span>
        {message}
      </p>
    </div>
  );
}
