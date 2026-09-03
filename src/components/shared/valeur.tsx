import {
  ABSENT,
  INCONNU,
  formatDate,
  formatDateHeure,
  formatEntier,
  formatMontant,
  formatTexte,
  type CodeDevise,
  type Incertain,
} from "@/lib/format";
import { cn } from "@/lib/utils";

/*
 * Affichage des valeurs de cellule.
 *
 * Trois cas ne se confondent jamais :
 *   valeur connue -> la valeur formatee, en texte normal
 *   valeur absente -> le tiret, en gris, avec une lecture vocale explicite
 *   valeur inconnue -> le mot "Inconnu", qui n'est pas la meme information
 *
 * Aucune cellule ne reste vide : une cellule vide se lit comme un defaut
 * d'affichage, pas comme une absence de donnee.
 */

function Manquant({ texte, lecture }: { texte: string; lecture: string }) {
  return (
    <span className="text-fg-muted">
      <span aria-hidden="true">{texte}</span>
      <span className="sr-only">{lecture}</span>
    </span>
  );
}

function rendreManquant(rendu: string) {
  if (rendu === ABSENT) {
    return <Manquant texte={ABSENT} lecture="Sans objet" />;
  }
  if (rendu === INCONNU) {
    return <Manquant texte={INCONNU} lecture="Valeur inconnue" />;
  }
  return null;
}

/**
 * Montant. Toujours accompagne de sa devise, aligne a droite et en chiffres
 * tabulaires pour que les ordres de grandeur s'empilent lisiblement d'une
 * ligne a l'autre.
 */
export function Montant({
  valeur,
  devise,
  className,
}: {
  valeur: Incertain<number>;
  devise: Incertain<CodeDevise>;
  className?: string;
}) {
  const rendu = formatMontant(valeur, devise);
  const manquant = rendreManquant(rendu);

  return (
    <span className={cn("tabular block text-right whitespace-nowrap", className)}>
      {manquant ?? rendu}
    </span>
  );
}

/**
 * Entier de comptage. Aligne a droite comme un montant, mais sans devise.
 *
 * `libelleZero` et `libelleAbsent` permettent de nommer ces deux cas dans
 * les mots du domaine, comme le font les maquettes avec "Aucune" pour zero
 * route active et "Non servi" pour une marque connue mais servie par
 * personne. Les trois cas restent distincts : nommer n'est pas confondre.
 */
export function Nombre({
  valeur,
  libelleZero,
  libelleAbsent,
  className,
}: {
  valeur: Incertain<number>;
  libelleZero?: string;
  libelleAbsent?: string;
  className?: string;
}) {
  const classes = cn("tabular block text-right whitespace-nowrap", className);

  if (valeur === null && libelleAbsent) {
    return (
      <span className={cn(classes, "text-fg-muted italic")}>{libelleAbsent}</span>
    );
  }

  if (valeur === 0 && libelleZero) {
    return <span className={classes}>{libelleZero}</span>;
  }

  const rendu = formatEntier(valeur);
  const manquant = rendreManquant(rendu);

  return <span className={classes}>{manquant ?? rendu}</span>;
}

export function Texte({
  valeur,
  className,
}: {
  valeur: Incertain<string>;
  className?: string;
}) {
  const rendu = formatTexte(valeur);
  return (
    <span className={cn("block truncate", className)} title={rendu}>
      {rendreManquant(rendu) ?? rendu}
    </span>
  );
}

export function DateValeur({
  valeur,
  avecHeure = false,
  className,
}: {
  valeur: Incertain<string | number | Date>;
  avecHeure?: boolean;
  className?: string;
}) {
  const rendu = avecHeure ? formatDateHeure(valeur) : formatDate(valeur);
  const manquant = rendreManquant(rendu);

  return (
    <span className={cn("tabular whitespace-nowrap", className)}>
      {manquant ?? rendu}
    </span>
  );
}
