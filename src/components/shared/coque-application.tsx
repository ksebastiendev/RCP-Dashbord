import { Suspense, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { NavigationLaterale } from "./navigation-laterale";
import { BarreSuperieure } from "./barre-superieure";

/*
 * Coque applicative : navigation laterale, barre superieure, zone de contenu.
 * Les ecrans sont montes dans l'Outlet et ne connaissent ni la navigation ni
 * la barre superieure.
 *
 * Sous 1024 px la navigation quitte le flux : elle ne prend plus de place a
 * cote du contenu, elle glisse par dessus, appelee depuis la barre
 * superieure. Une colonne de 72 px sur un ecran de 400 en mangeait le
 * cinquieme sans rien donner d'utilisable.
 *
 * L'ouverture du tiroir est un etat de vue, ephemere : il ne va pas dans le
 * magasin des preferences, un tiroir ne doit pas se retrouver ouvert au
 * rechargement.
 *
 * La hauteur est en dvh et non en vh : sur mobile, la barre d'adresse du
 * navigateur se retire et se remet, et vh ne suit pas ce mouvement, ce qui
 * laissait la navigation plus courte que l'ecran.
 */
export function CoqueApplication() {
  const { pathname } = useLocation();

  /* Naviguer ferme le tiroir : sur mobile, la destination est cachee
     derriere lui. L'etat est indexe sur le chemin plutot que remis a zero
     par un effet, ce qui evite un second rendu a chaque navigation. */
  const [ouvertDepuis, setOuvertDepuis] = useState<string | null>(null);
  const tiroirOuvert = ouvertDepuis === pathname;
  const setTiroirOuvert = (ouvert: boolean) =>
    setOuvertDepuis(ouvert ? pathname : null);

  useEffect(() => {
    if (!tiroirOuvert) return;
    const auClavier = (evenement: KeyboardEvent) => {
      if (evenement.key === "Escape") setOuvertDepuis(null);
    };
    window.addEventListener("keydown", auClavier);
    return () => window.removeEventListener("keydown", auClavier);
  }, [tiroirOuvert]);

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <NavigationLaterale
        tiroirOuvert={tiroirOuvert}
        onFermerTiroir={() => setTiroirOuvert(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <BarreSuperieure onOuvrirNavigation={() => setTiroirOuvert(true)} />

        {/* La zone de contenu est le seul element qui defile : la navigation
            et la barre superieure restent en place.

            Les ecrans sont charges a la demande : le temps que le fichier
            arrive, l'attente prend la forme d'un ecran de liste plutot que
            celle d'un rotateur, comme partout ailleurs dans le projet. */}
        <main id="contenu" className="flex-1 overflow-y-auto">
          <Suspense fallback={<AttenteEcran />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

function AttenteEcran() {
  return (
    <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <Skeleton className="h-10 w-72 max-w-full" />
      <Skeleton className="h-4 w-[520px] max-w-full" />
      <Skeleton className="h-[92px] w-full rounded-lg" />
      <Skeleton className="h-96 w-full rounded-lg" />
    </div>
  );
}

/*
 * Gabarit d'ecran. Titre, phrase d'explication et action principale sont
 * poses ici une seule fois pour que deux ecrans du meme gabarit ne divergent
 * pas en espacement.
 */
export function EnTeteEcran({
  titre,
  description,
  action,
}: {
  titre: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:gap-8">
      <div className="min-w-0">
        <h1 className="text-ecran font-semibold text-fg-primary">{titre}</h1>
        {description && (
          <p className="mt-2 max-w-[640px] text-corps leading-relaxed text-fg-secondary">
            {description}
          </p>
        )}
      </div>
      {action && <div className="w-full shrink-0 sm:w-auto">{action}</div>}
    </div>
  );
}

/** Corps d'ecran : la largeur et les marges de contenu, definies une fois. */
export function CorpsEcran({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      {children}
    </div>
  );
}
