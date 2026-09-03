import { Link } from "react-router-dom";
import {
  BarChart3,
  Bell,
  CreditCard,
  Percent,
  Scale,
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Carte } from "@/components/shared/carte";
import { formatEntier, formatMontant, formatPourcentage } from "@/lib/format";
import { TRAIT_ICONE } from "@/lib/icones";
import { cn } from "@/lib/utils";
import type { Indicateur, TonIndicateur } from "../types";

/*
 * Tuile d'indicateur de l'Accueil.
 *
 * Les cartes des maquettes n'ont pas de bordure ici, contrairement a celles
 * de Montants autorises. Le trait sous la valeur separe le chiffre de sa
 * variation.
 */

const ICONES: Record<string, LucideIcon> = {
  "paiements-a-traiter": CreditCard,
  "ecart-rapprochement": Scale,
  "dossiers-a-examiner": BarChart3,
  "notifications-echec": Bell,
  "marge-du-mois": Percent,
};

/*
 * Teintes de la vignette d'icone.
 *
 * Les maquettes posent un bleu #0848b0 sur #ebf3fe pour "Dossiers a
 * examiner". Cette couleur n'existe pas dans la palette fournie et la
 * palette ne se modifie pas : la tuile prend la teinte neutre. Aucune
 * information n'est perdue, le libelle de la tuile dit ce qu'elle compte.
 */
const TEINTES: Record<TonIndicateur, string> = {
  attente: "bg-warning-bg text-warning-text",
  neutre: "bg-muted text-fg-secondary",
  information: "bg-neutral-bg text-neutral-fg",
  danger: "bg-danger-bg text-danger-fg",
  succes: "bg-success-bg text-success-fg",
};

export function CarteIndicateurAccueil({ indicateur }: { indicateur: Indicateur }) {
  const Icone = ICONES[indicateur.cle] ?? BarChart3;

  const valeur =
    indicateur.genre === "montant"
      ? formatMontant(indicateur.valeur, indicateur.devise)
      : formatEntier(indicateur.valeur);

  const contenu = (
    <Carte avecBordure={false} className="flex h-full min-w-0 flex-col overflow-hidden px-5 py-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] leading-snug text-fg-secondary">
          {indicateur.libelle}
        </p>
        <span
          aria-hidden="true"
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-md",
            TEINTES[indicateur.ton],
          )}
        >
          <Icone className="size-[18px]" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
        </span>
      </div>

      {/* Un montant porte toujours sa devise, un compte n'en a pas. Les deux
          sont en chiffres tabulaires pour que cinq tuiles alignees se lisent
          d'un coup d'oeil.

          Un montant est plus long qu'un compte : il prend un corps plus
          petit et se replie sur deux lignes plutot que de deborder. Il n'est
          jamais tronque, un montant coupe se lit de travers. */}
      <p
        className={cn(
          "tabular mt-3 font-semibold break-words text-fg-primary",
          indicateur.genre === "montant"
            ? "text-[20px] leading-tight"
            : "text-[26px] leading-none",
        )}
      >
        {valeur}
      </p>

      <div className="mt-auto pt-4">
        <div className="border-t border-table-row-separator pt-3">
          <Variation indicateur={indicateur} />
        </div>
      </div>
    </Carte>
  );

  if (!indicateur.chemin) return contenu;

  return (
    <Link
      to={indicateur.chemin}
      className="rounded-lg transition-colors hover:brightness-[0.99] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {contenu}
    </Link>
  );
}

/*
 * Variation par rapport a la periode precedente.
 *
 * Une hausse n'est pas une bonne nouvelle en soi : plus de paiements sans
 * issue est mauvais, plus de marge est bon. La couleur suit donc la lecture
 * metier, pas le signe, et la phrase ecrite dit la meme chose.
 */
function Variation({ indicateur }: { indicateur: Indicateur }) {
  const { tendance } = indicateur;

  if (!tendance) {
    return (
      <p className="text-[13px] text-fg-muted">
        Aucune comparaison disponible
      </p>
    );
  }

  const Fleche = tendance.sens === "hausse" ? TrendingUp : TrendingDown;
  const couleur =
    tendance.lecture === "favorable"
      ? "text-success-fg"
      : tendance.lecture === "defavorable"
        ? "text-danger-fg"
        : "text-fg-secondary";

  return (
    <p className="flex flex-wrap items-center gap-x-1.5 text-[13px] text-fg-secondary">
      <span className="flex items-center gap-1.5">
        <Fleche
          className={cn("size-4 shrink-0", couleur)}
          strokeWidth={TRAIT_ICONE}
          aria-hidden="true"
        />
        <span className={cn("tabular font-medium whitespace-nowrap", couleur)}>
          {formatPourcentage(tendance.pourcentage)}
        </span>
      </span>
      <span>
        {tendance.sens === "hausse" ? "en hausse" : "en baisse"} {tendance.comparaison}
      </span>
    </p>
  );
}

/** Squelette aux dimensions exactes de la tuile, pour que rien ne bouge. */
export function SqueletteIndicateur() {
  return (
    <Carte avecBordure={false} className="flex h-full flex-col px-5 py-5">
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="size-9 rounded-md" />
      </div>
      <Skeleton className="mt-3 h-[26px] w-24" />
      <div className="mt-auto pt-4">
        <div className="border-t border-table-row-separator pt-3">
          {/* Deux lignes, comme la variation chargee : la tuile garde la
              meme hauteur avant et apres l'arrivee des donnees. */}
          <Skeleton className="h-4 w-20" />
          <Skeleton className="mt-1.5 h-4 w-36" />
        </div>
      </div>
    </Carte>
  );
}
