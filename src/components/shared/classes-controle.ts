import { cn } from "@/lib/utils";

/*
 * Classes des controles de saisie, communes au champ texte, au nombre, a la
 * liste deroulante et a la zone de texte. Definies une fois pour que deux
 * formulaires ne divergent pas en hauteur ni en bordure.
 */
export const CLASSES_CONTROLE =
  "h-12 w-full rounded-md border border-border bg-card px-4 text-corps text-fg-primary placeholder:text-fg-placeholder focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none aria-invalid:border-danger-fg disabled:cursor-not-allowed disabled:bg-muted disabled:text-fg-muted";

/** Un montant se saisit en chiffres tabulaires, aligne comme il s'affiche. */
export const CLASSES_CONTROLE_MONTANT = cn(CLASSES_CONTROLE, "tabular text-right");
