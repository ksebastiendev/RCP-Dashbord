import { Skeleton } from "@/components/ui/skeleton";
import { Bandeau } from "@/components/shared/bandeau";
import { Carte } from "@/components/shared/carte";
import { CorpsEcran, EnTeteEcran } from "@/components/shared/coque-application";
import { EtatErreur } from "@/components/shared/etat-erreur";
import { formatEntier } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useTableauDeBord } from "../hooks/use-accueil";
import type { ChiffreMatin, Rappel } from "../types";
import {
  CarteIndicateurAccueil,
  SqueletteIndicateur,
} from "./carte-indicateur-accueil";
import { EtatPreparation } from "./etat-preparation";

/*
 * Accueil. Releve dans BCP/Accueil.png.
 *
 * L'ecran ne calcule rien : il rend un constat produit par la plateforme.
 * Le nombre d'etapes validees, les indicateurs et les chiffres du matin
 * viennent tous de la meme requete.
 */
export function EcranAccueil() {
  const { data, isPending, error, refetch } = useTableauDeBord();

  if (error) {
    return (
      <CorpsEcran>
        <EnTeteEcran
          titre="Accueil"
          description="L'état réel de la plateforme, constaté automatiquement, et ce qui reste à faire avant d'encaisser de l'argent réel."
        />
        <EtatErreur erreur={error} onReessayer={() => refetch()} />
      </CorpsEcran>
    );
  }

  return (
    <CorpsEcran>
      <EnTeteEcran
        titre="Accueil"
        description="L'état réel de la plateforme, constaté automatiquement, et ce qui reste à faire avant d'encaisser de l'argent réel."
      />

      {isPending || !data ? (
        <Skeleton className="h-[92px] w-full rounded-lg" />
      ) : (
        <Bandeau
          genre={data.constat.genre}
          titre={data.constat.titre}
          description={data.constat.description}
        />
      )}

      {/* Cinq tuiles, largeurs et gouttiere relevees dans la maquette. */}
      <div className="grid gap-[18px] sm:grid-cols-2 xl:grid-cols-5">
        {isPending || !data
          ? Array.from({ length: 5 }, (_, index) => (
              <SqueletteIndicateur key={`squelette-${index}`} />
            ))
          : data.indicateurs.map((indicateur) => (
              <CarteIndicateurAccueil key={indicateur.cle} indicateur={indicateur} />
            ))}
      </div>

      <div className="grid items-start gap-[18px] xl:grid-cols-[minmax(0,1fr)_310px]">
        <EtatPreparation preparation={data?.preparation} chargement={isPending} />

        <div className="flex flex-col gap-[18px]">
          <ChiffresDuMatin chiffres={data?.chiffresMatin} chargement={isPending} />
          <CarteRappel rappel={data?.rappel} chargement={isPending} />
        </div>
      </div>
    </CorpsEcran>
  );
}

/*
 * Les chiffres qu'on regarde en premier, sans ouvrir d'ecran.
 * Une valeur rapportee a un total s'ecrit "31 sur 62" : le chiffre seul ne
 * dirait pas s'il est grand ou petit.
 */
function ChiffresDuMatin({
  chiffres,
  chargement,
}: {
  chiffres: ChiffreMatin[] | undefined;
  chargement: boolean;
}) {
  return (
    <Carte avecBordure={false} className="px-5 py-5">
      <h2 className="text-section font-semibold text-fg-primary">Les chiffres du matin</h2>
      <p className="mt-0.5 text-mention text-fg-secondary">
        Ce qu'on regarde en premier, sans ouvrir d'écran.
      </p>

      <dl className="mt-4 flex flex-col">
        {chargement || !chiffres
          ? Array.from({ length: 5 }, (_, index) => (
              <div
                key={`squelette-${index}`}
                className="flex items-center justify-between gap-4 py-2"
              >
                <Skeleton className="h-3.5 w-40" />
                <Skeleton className="h-3.5 w-10" />
              </div>
            ))
          : chiffres.map((chiffre) => (
              <div
                key={chiffre.cle}
                className="flex items-center justify-between gap-4 py-2"
              >
                <dt className="truncate text-mention text-fg-secondary">
                  {chiffre.libelle}
                </dt>
                <dd
                  className={cn(
                    "tabular shrink-0 text-mention font-medium",
                    chiffre.alerte ? "text-danger-fg" : "text-fg-primary",
                  )}
                >
                  {chiffre.total === null ? (
                    formatEntier(chiffre.valeur)
                  ) : (
                    <>
                      <span aria-hidden="true">
                        {formatEntier(chiffre.valeur)}/{formatEntier(chiffre.total)}
                      </span>
                      <span className="sr-only">
                        {formatEntier(chiffre.valeur)} sur{" "}
                        {formatEntier(chiffre.total)}
                      </span>
                    </>
                  )}
                </dd>
              </div>
            ))}
      </dl>
    </Carte>
  );
}

function CarteRappel({
  rappel,
  chargement,
}: {
  rappel: Rappel | undefined;
  chargement: boolean;
}) {
  return (
    <Carte avecBordure={false} className="px-5 py-5">
      {chargement || !rappel ? (
        <>
          <Skeleton className="h-5 w-24" />
          <Skeleton className="mt-3 h-3.5 w-full" />
          <Skeleton className="mt-1.5 h-3.5 w-full" />
          <Skeleton className="mt-1.5 h-3.5 w-3/4" />
        </>
      ) : (
        <>
          <h2 className="text-section font-semibold text-fg-primary">{rappel.titre}</h2>
          <p className="mt-2 text-mention leading-relaxed text-fg-secondary">
            {rappel.texte}
          </p>
        </>
      )}
    </Carte>
  );
}
