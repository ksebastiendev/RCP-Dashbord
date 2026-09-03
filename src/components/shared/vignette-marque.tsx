import { cn } from "@/lib/utils";
import type { CodeDevise } from "@/lib/format";
import { SYMBOLES, trouverLogo } from "./logos-marque";

/*
 * Vignettes de marque.
 *
 * Les logos d'opérateur et les symboles de devise sont fournis dans
 * BCP-marquettes-ui/. Ils sont resolus par le nom de la marque plutot que
 * stockes ligne par ligne : une marque s'ecrit "MTN MoMo" ici et "MTN Bénin"
 * la, mais c'est le meme logo.
 *
 * La vignette est decorative. Le nom ecrit a cote porte l'information, y
 * compris pour qui ne reconnait pas le logo, et elle est donc masquee aux
 * technologies d'assistance.
 */

export function Vignette({
  nom,
  taille = 28,
  className,
}: {
  nom: string;
  taille?: number;
  className?: string;
}) {
  const logo = trouverLogo(nom);

  if (logo) {
    return (
      <img
        src={logo}
        alt=""
        aria-hidden="true"
        style={{ width: taille, height: taille }}
        className={cn("shrink-0 rounded-full object-contain", className)}
      />
    );
  }

  /* Sans logo, l'initiale sur fond neutre : elle ne pretend pas etre une
     marque, elle occupe la place et garde l'alignement des colonnes. */
  return (
    <span
      aria-hidden="true"
      style={{ width: taille, height: taille }}
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-muted text-etiquette font-medium text-fg-secondary",
        className,
      )}
    >
      {nom.charAt(0).toUpperCase()}
    </span>
  );
}

export function VignetteDevise({
  devise,
  taille = 24,
  className,
}: {
  devise: CodeDevise;
  taille?: number;
  className?: string;
}) {
  const symbole = SYMBOLES[devise];
  if (!symbole) return null;

  return (
    <img
      src={symbole}
      alt=""
      aria-hidden="true"
      style={{ width: taille, height: taille }}
      className={cn("shrink-0 rounded-full object-contain", className)}
    />
  );
}
