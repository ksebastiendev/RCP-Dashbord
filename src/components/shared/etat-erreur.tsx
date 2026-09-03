import { Link } from "react-router-dom";
import { LockKeyhole, RefreshCw, ServerCrash, SearchX, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { estErreurApi, MESSAGE_PAR_GENRE, type GenreErreur } from "@/lib/erreurs";
import { TRAIT_ICONE } from "@/lib/icones";

/*
 * Composant unique d'erreur et d'acces refuse.
 *
 * Un seul composant pour les deux cas, reutilise partout : ecran entier,
 * corps de carte, corps de tableau. Un ecran ne redige pas son propre
 * message d'erreur et ne lit jamais un statut HTTP.
 */

const APPARENCE: Record<
  GenreErreur,
  { icone: typeof ServerCrash; titre: string; rejouable: boolean }
> = {
  reseau: {
    icone: WifiOff,
    titre: "Plateforme injoignable",
    rejouable: true,
  },
  authentification: {
    icone: LockKeyhole,
    titre: "Session expirée",
    rejouable: false,
  },
  droits: {
    icone: LockKeyhole,
    titre: "Accès refusé",
    rejouable: false,
  },
  introuvable: {
    icone: SearchX,
    titre: "Introuvable",
    rejouable: false,
  },
  validation: {
    icone: ServerCrash,
    titre: "Demande refusée",
    rejouable: false,
  },
  conflit: {
    icone: RefreshCw,
    titre: "Modifié entre-temps",
    rejouable: true,
  },
  serveur: {
    icone: ServerCrash,
    titre: "Erreur de la plateforme",
    rejouable: true,
  },
};

export function EtatErreur({
  erreur,
  onReessayer,
  compact = false,
}: {
  erreur: unknown;
  /** Fourni par l'appelant, typiquement le `refetch` de la requete. */
  onReessayer?: () => void;
  /** Version reduite, pour un corps de carte plutot qu'un ecran entier. */
  compact?: boolean;
}) {
  const genre: GenreErreur = estErreurApi(erreur) ? erreur.genre : "serveur";
  const message = estErreurApi(erreur) ? erreur.message : MESSAGE_PAR_GENRE.serveur;
  const apparence = APPARENCE[genre];
  const Icone = apparence.icone;

  return (
    <div
      role="alert"
      className={
        compact
          ? "flex flex-col items-center gap-3 px-6 py-12 text-center"
          : "flex flex-col items-center gap-4 px-6 py-20 text-center"
      }
    >
      <span className="grid size-12 place-items-center rounded-full bg-danger-bg text-danger-fg">
        <Icone className="size-6" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
      </span>

      <div className="max-w-[420px]">
        <p className="text-section font-semibold text-fg-primary">{apparence.titre}</p>
        <p className="mt-1 text-mention leading-relaxed text-fg-secondary">{message}</p>
      </div>

      <div className="flex items-center gap-3">
        {apparence.rejouable && onReessayer && (
          <Button type="button" onClick={onReessayer}>
            <RefreshCw
              className="size-4"
              strokeWidth={TRAIT_ICONE}
              aria-hidden="true"
            />
            Réessayer
          </Button>
        )}
        {genre === "droits" && (
          <Button type="button" variant="outline" asChild>
            <Link to="/accueil">Revenir à l'accueil</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
