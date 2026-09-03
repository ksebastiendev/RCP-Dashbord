/*
 * Utilitaire de formatage unique du projet.
 * Aucun composant ne formate un montant, une date ou un pourcentage lui-meme.
 *
 * Convention d'absence, appliquee partout :
 *   undefined -> la valeur n'est pas connue du systeme   -> "Inconnu"
 *   null      -> la valeur ne s'applique pas a cette ligne -> "-"
 *   0         -> la valeur vaut zero                      -> "0 XOF"
 * Ces trois cas ne doivent jamais produire le meme affichage, et aucun ne
 * doit produire une cellule vide.
 */

export const ABSENT = "-";
export const INCONNU = "Inconnu";

/** undefined = inconnu, null = sans objet. */
export type Incertain<T> = T | null | undefined;

export type CodeDevise = "XOF" | "XAF" | "GHS" | "GNF" | "NGN" | "EUR" | "USD";

/* Nombre de decimales reellement utilisees par chaque devise.
   Les francs CFA et le franc guineen n'ont pas de subdivision en circulation. */
const DECIMALES: Record<CodeDevise, number> = {
  XOF: 0,
  XAF: 0,
  GNF: 0,
  GHS: 2,
  NGN: 2,
  EUR: 2,
  USD: 2,
};

const LOCALE = "fr-FR";

const cacheMontants = new Map<string, Intl.NumberFormat>();

function formatteurMontant(devise: CodeDevise): Intl.NumberFormat {
  const cle = devise;
  let f = cacheMontants.get(cle);
  if (!f) {
    const d = DECIMALES[devise] ?? 2;
    f = new Intl.NumberFormat(LOCALE, {
      style: "currency",
      currency: devise,
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    });
    cacheMontants.set(cle, f);
  }
  return f;
}

/**
 * Formate un montant avec sa devise. Un montant ne s'affiche jamais nu.
 * L'alignement a droite et les chiffres tabulaires sont portes par le
 * composant d'affichage, pas par cette fonction.
 */
export function formatMontant(
  valeur: Incertain<number>,
  devise: Incertain<CodeDevise>,
): string {
  if (valeur === undefined || devise === undefined) return INCONNU;
  if (valeur === null || devise === null) return ABSENT;
  if (!Number.isFinite(valeur)) return INCONNU;
  return formatteurMontant(devise).format(valeur);
}

/** Entier de comptage : nombre de lignes, de routes, de comptes. Sans devise. */
export function formatEntier(valeur: Incertain<number>): string {
  if (valeur === undefined) return INCONNU;
  if (valeur === null) return ABSENT;
  if (!Number.isFinite(valeur)) return INCONNU;
  return new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 }).format(valeur);
}

/**
 * Pourcentage. `valeur` est exprimee en pour-cent (4.3 et non 0.043),
 * comme dans les maquettes.
 */
export function formatPourcentage(
  valeur: Incertain<number>,
  decimales = 1,
): string {
  if (valeur === undefined) return INCONNU;
  if (valeur === null) return ABSENT;
  if (!Number.isFinite(valeur)) return INCONNU;
  return new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(valeur) + " %";
}

function versDate(valeur: Incertain<string | number | Date>): Date | null | undefined {
  if (valeur === undefined) return undefined;
  if (valeur === null) return null;
  const d = valeur instanceof Date ? valeur : new Date(valeur);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

/** Date seule : "21 aout 2026". */
export function formatDate(valeur: Incertain<string | number | Date>): string {
  const d = versDate(valeur);
  if (d === undefined) return INCONNU;
  if (d === null) return ABSENT;
  return new Intl.DateTimeFormat(LOCALE, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}

/** Date et heure : "21 aout 2026 a 04:43". */
export function formatDateHeure(valeur: Incertain<string | number | Date>): string {
  const d = versDate(valeur);
  if (d === undefined) return INCONNU;
  if (d === null) return ABSENT;
  return new Intl.DateTimeFormat(LOCALE, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/** Heure seule, pour la mention "Actualise a 04:43" de la barre superieure. */
export function formatHeure(valeur: Incertain<string | number | Date>): string {
  const d = versDate(valeur);
  if (d === undefined) return INCONNU;
  if (d === null) return ABSENT;
  return new Intl.DateTimeFormat(LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/** Texte libre venant du serveur : distingue vide, absent et inconnu. */
export function formatTexte(valeur: Incertain<string>): string {
  if (valeur === undefined) return INCONNU;
  if (valeur === null) return ABSENT;
  const t = valeur.trim();
  return t.length === 0 ? ABSENT : t;
}
