import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatEntier } from "@/lib/format";
import { TRAIT_ICONE } from "@/lib/icones";
import { cn } from "@/lib/utils";

/*
 * Pagination.
 *
 * Aucune maquette ne la definit : les listes relevees affichent 56 ou 62
 * lignes sans pagineur. Ce composant est donc une proposition, construite
 * uniquement sur les tokens existants, a valider ou a remplacer.
 *
 * Il annonce la position dans le total plutot qu'une simple suite de
 * numeros : sur un back-office de paiement, savoir qu'on regarde 20 lignes
 * sur 1 248 compte plus que de pouvoir sauter a la page 7.
 */

const TAILLES = [20, 50, 100] as const;

export function Pagination({
  page,
  taillePage,
  total,
  onChangementPage,
  onChangementTaille,
}: {
  /** Numerotee a partir de 1. */
  page: number;
  taillePage: number;
  /** undefined quand le serveur ne renvoie pas de total. */
  total: number | undefined;
  onChangementPage: (page: number) => void;
  onChangementTaille?: (taille: number) => void;
}) {
  const premier = (page - 1) * taillePage + 1;
  const dernier = total === undefined ? page * taillePage : Math.min(page * taillePage, total);
  const dernierePage = total === undefined ? undefined : Math.max(1, Math.ceil(total / taillePage));

  const peutReculer = page > 1;
  const peutAvancer = dernierePage === undefined ? true : page < dernierePage;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
      <p className="text-sm text-fg-secondary">
        {total === undefined ? (
          <>
            Lignes {formatEntier(premier)} à {formatEntier(dernier)}, total inconnu
          </>
        ) : total === 0 ? (
          "Aucune ligne"
        ) : (
          <>
            Lignes {formatEntier(premier)} à {formatEntier(dernier)} sur{" "}
            <span className="font-medium text-fg-primary">{formatEntier(total)}</span>
          </>
        )}
      </p>

      <div className="flex items-center gap-4">
        {onChangementTaille && (
          <label className="flex items-center gap-2 text-sm text-fg-secondary">
            Lignes par page
            <select
              value={taillePage}
              onChange={(evenement) =>
                onChangementTaille(Number(evenement.target.value))
              }
              className="h-9 rounded-md border border-border bg-card px-2 text-sm text-fg-primary focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
            >
              {TAILLES.map((taille) => (
                <option key={taille} value={taille}>
                  {taille}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="flex items-center gap-2">
          <BoutonPage
            libelle="Page précédente"
            actif={peutReculer}
            onClick={() => onChangementPage(page - 1)}
          >
            <ChevronLeft className="size-4" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
          </BoutonPage>

          <span className="tabular text-sm text-fg-secondary" aria-live="polite">
            Page {formatEntier(page)}
            {dernierePage !== undefined && <> sur {formatEntier(dernierePage)}</>}
          </span>

          <BoutonPage
            libelle="Page suivante"
            actif={peutAvancer}
            onClick={() => onChangementPage(page + 1)}
          >
            <ChevronRight className="size-4" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
          </BoutonPage>
        </div>
      </div>
    </div>
  );
}

function BoutonPage({
  libelle,
  actif,
  onClick,
  children,
}: {
  libelle: string;
  actif: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!actif}
      aria-label={libelle}
      className={cn(
        "grid size-9 place-items-center rounded-md border border-border bg-card text-fg-primary transition-colors",
        "hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:text-fg-muted disabled:hover:bg-card",
      )}
    >
      {children}
    </button>
  );
}
