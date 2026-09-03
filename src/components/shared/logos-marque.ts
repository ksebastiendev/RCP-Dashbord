import type { CodeDevise } from "@/lib/format";

/*
 * Resolution des vignettes de marque.
 *
 * Les logos sont resolus par le nom plutot que stockes ligne par ligne : une
 * marque s'ecrit "MTN MoMo" ici et "MTN Bénin" la, mais c'est le meme logo.
 */

const LOGOS: Array<{ motif: RegExp; fichier: string }> = [
  { motif: /\bmtn\b/i, fichier: "mtn" },
  { motif: /\bmoov\b/i, fichier: "moov" },
  { motif: /\bwave\b/i, fichier: "wave" },
  { motif: /\bairtel\b/i, fichier: "airtel" },
  { motif: /m[\s-]?pesa/i, fichier: "mpesa" },
];

export function trouverLogo(nom: string): string | null {
  const trouve = LOGOS.find((entree) => entree.motif.test(nom));
  return trouve ? `/marque/operateurs/${trouve.fichier}.png` : null;
}

/*
 * Symboles de devise. Seuls le franc CFA et le naira sont fournis : les
 * autres devises affichent leur code, ce qui reste juste. Un symbole
 * approchant serait pire qu'aucun symbole.
 */
export const SYMBOLES: Partial<Record<CodeDevise, string>> = {
  XOF: "/marque/devises/xof.png",
  XAF: "/marque/devises/xof.png",
  NGN: "/marque/devises/ngn.png",
};

