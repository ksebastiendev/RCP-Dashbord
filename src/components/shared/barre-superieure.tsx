import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { Bell, Menu, RefreshCw, Search } from "lucide-react";
import { Avatar } from "./navigation-laterale";
import { ChoixTheme } from "./choix-theme";
import { LIBELLE_ROLE } from "@/lib/libelles";
import { useSession } from "@/stores/session";
import { formatDate, formatHeure } from "@/lib/format";
import { cn } from "@/lib/utils";
import { TRAIT_ICONE } from "@/lib/icones";

/*
 * Barre superieure. Composant partage de la coque, monte une fois.
 * L'horodatage n'est pas decoratif : il indique la fraicheur reelle des
 * donnees affichees, donc il est derive de TanStack Query et non d'une
 * horloge qui avancerait toute seule.
 *
 * Au retrecissement, chaque element cede dans l'ordre de son utilite : la
 * phrase d'horodatage tombe la premiere, puis le nom et le role, puis la
 * recherche. Le bouton d'actualisation, les notifications et l'avatar
 * restent jusqu'au bout, et le bouton de navigation apparait.
 */

export function BarreSuperieure({
  onOuvrirNavigation,
}: {
  onOuvrirNavigation?: () => void;
}) {
  const utilisateur = useSession((e) => e.utilisateur);

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-topbar-border bg-topbar-bg px-4 sm:gap-5 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onOuvrirNavigation}
        aria-label="Ouvrir la navigation"
        className="grid size-9 shrink-0 place-items-center rounded-md text-topbar-fg transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none lg:hidden"
      >
        <Menu className="size-5" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
      </button>

      <RechercheGlobale />

      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        <Actualisation />
        <ChoixTheme />
        <LienNotifications />
        <div
          className="hidden h-8 w-px bg-topbar-border sm:block"
          aria-hidden="true"
        />
        {utilisateur && (
          <div className="flex items-center gap-3">
            <div className="hidden text-right md:block">
              <div className="text-mention font-medium text-fg-primary">
                {utilisateur.nom}
              </div>
              <div className="text-mention text-fg-secondary">
                {LIBELLE_ROLE[utilisateur.role]}
              </div>
            </div>
            <Avatar utilisateur={utilisateur} />
          </div>
        )}
      </div>
    </header>
  );
}

function RechercheGlobale() {
  const [terme, setTerme] = useState("");

  return (
    <form
      role="search"
      className="hidden w-full max-w-[390px] sm:block"
      onSubmit={(evenement) => {
        evenement.preventDefault();
        /* La recherche globale n'a pas encore de destination : elle attend
           l'ecran de resultats, qui n'existe pas dans les maquettes. */
      }}
    >
      <label htmlFor="recherche-globale" className="sr-only">
        Rechercher dans le back-office
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-muted"
          strokeWidth={TRAIT_ICONE}
          aria-hidden="true"
        />
        <input
          id="recherche-globale"
          type="search"
          value={terme}
          onChange={(evenement) => setTerme(evenement.target.value)}
          placeholder="Rechercher"
          className="h-10 w-full rounded-md border border-border bg-card pr-3 pl-9 text-mention text-fg-primary placeholder:text-fg-placeholder focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
        />
      </div>
    </form>
  );
}

function Actualisation() {
  const queryClient = useQueryClient();
  const nombreEnCours = useIsFetching();
  const [derniereActualisation, setDerniereActualisation] =
    useState<Date | null>(null);
  const precedent = useRef(nombreEnCours);

  /* Horodater la fin d'un chargement, pas son debut : ce que la barre
     annonce, c'est l'age de la donnee reellement affichee. */
  useEffect(() => {
    if (precedent.current > 0 && nombreEnCours === 0) {
      setDerniereActualisation(new Date());
    }
    precedent.current = nombreEnCours;
  }, [nombreEnCours]);

  const enCours = nombreEnCours > 0;

  return (
    <div className="flex items-center gap-2 text-mention text-topbar-fg">
      <button
        type="button"
        onClick={() => queryClient.invalidateQueries()}
        disabled={enCours}
        aria-label="Actualiser les données"
        className="grid size-8 place-items-center rounded-md transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-60"
      >
        <RefreshCw
          className={cn("size-4", enCours && "animate-spin")}
          strokeWidth={TRAIT_ICONE}
          aria-hidden="true"
        />
      </button>
      {/* La phrase est le premier element a ceder : sur un ecran etroit,
          savoir que les donnees sont fraiches compte moins que pouvoir les
          rafraichir. Le bouton, lui, reste. */}
      <span aria-live="polite" className="hidden xl:inline">
        {enCours
          ? "Actualisation en cours"
          : derniereActualisation
            ? `Actualisé à ${formatHeure(derniereActualisation)} · ${formatDate(derniereActualisation)}`
            : "Pas encore actualisé"}
      </span>
    </div>
  );
}

function LienNotifications() {
  return (
    <Link
      to="/exploitation/notifications"
      aria-label="Notifications envoyées"
      className="grid size-9 place-items-center rounded-md text-topbar-fg transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <Bell className="size-5" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
      {/* Les maquettes montrent une pastille rouge sur la cloche. Elle n'est
          pas rendue tant qu'aucune source ne fournit le nombre d'envois en
          echec : afficher un point permanent reviendrait a signaler une
          alerte inconnue comme si elle etait connue. */}
    </Link>
  );
}
