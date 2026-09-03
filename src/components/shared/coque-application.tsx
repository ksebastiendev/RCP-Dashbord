import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { NavigationLaterale } from "./navigation-laterale";
import { BarreSuperieure } from "./barre-superieure";

/*
 * Coque applicative : navigation laterale, barre superieure, zone de contenu.
 * Les ecrans sont montes dans l'Outlet et ne connaissent ni la navigation ni
 * la barre superieure.
 */
export function CoqueApplication() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <NavigationLaterale />

      <div className="flex min-w-0 flex-1 flex-col">
        <BarreSuperieure />

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
    <div className="flex flex-col gap-6 px-8 py-10">
      <Skeleton className="h-10 w-72" />
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
    <div className="flex items-start justify-between gap-8">
      <div className="min-w-0">
        <h1 className="text-[34px] leading-tight font-semibold text-fg-primary">
          {titre}
        </h1>
        {description && (
          <p className="mt-2 max-w-[640px] text-[15px] leading-relaxed text-fg-secondary">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/** Corps d'ecran : la largeur et les marges de contenu, definies une fois. */
export function CorpsEcran({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-6 px-8 py-10">{children}</div>;
}
