import { Link } from "react-router-dom";
import { ArrowRight, CircleCheck, TriangleAlert } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Carte } from "@/components/shared/carte";
import { PastilleEtat } from "@/components/shared/pastille-etat";
import { formatEntier } from "@/lib/format";
import { TRAIT_ICONE } from "@/lib/icones";
import type { EtapePreparation, Preparation } from "../types";

/*
 * Etat de preparation.
 *
 * La liste dit ce qui reste a faire avant d'encaisser de l'argent reel.
 * Chaque etape nomme sa consequence, pas son objet technique, et porte
 * l'action qui la leve.
 */
export function EtatPreparation({
  preparation,
  chargement,
}: {
  preparation: Preparation | undefined;
  chargement: boolean;
}) {
  return (
    <Carte avecBordure={false} className="overflow-hidden">
      <div className="flex items-start justify-between gap-4 px-6 py-5">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-fg-primary">
            État de préparation
          </h2>
          <p className="mt-1 text-[13px] text-fg-secondary">
            Constaté automatiquement à partir de l'état réel de la plateforme.
          </p>
        </div>

        {chargement || !preparation ? (
          <Skeleton className="h-8 w-14 rounded-md" />
        ) : (
          <span className="tabular rounded-md bg-primary px-3 py-1.5 text-[15px] font-semibold text-primary-foreground">
            <span aria-hidden="true">
              {formatEntier(preparation.validees)}/{formatEntier(preparation.total)}
            </span>
            <span className="sr-only">
              {formatEntier(preparation.validees)} étapes validées sur{" "}
              {formatEntier(preparation.total)}
            </span>
          </span>
        )}
      </div>

      <ul>
        {chargement || !preparation
          ? Array.from({ length: 4 }, (_, index) => (
              <li
                key={`squelette-${index}`}
                className="border-t border-table-row-separator px-6 py-5"
              >
                <SqueletteEtape />
              </li>
            ))
          : preparation.etapes.map((etape) => (
              <li
                key={etape.id}
                className="border-t border-table-row-separator px-6 py-5"
              >
                <Etape etape={etape} />
              </li>
            ))}
      </ul>
    </Carte>
  );
}

function Etape({ etape }: { etape: EtapePreparation }) {
  const validee = etape.statut === "valide";
  const Icone = validee ? CircleCheck : TriangleAlert;

  return (
    <div className="flex items-start gap-4">
      <span
        aria-hidden="true"
        className={
          validee
            ? "grid size-8 shrink-0 place-items-center rounded-md bg-success-bg text-success-fg"
            : "grid size-8 shrink-0 place-items-center rounded-md bg-warning-bg text-warning-text"
        }
      >
        <Icone className="size-4" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-medium text-fg-primary">{etape.titre}</p>
        <p className="mt-1 text-sm leading-relaxed text-fg-secondary">
          {etape.description}
        </p>

        {etape.action && (
          <Link
            to={etape.action.chemin}
            className="mt-2 inline-flex items-center gap-2 rounded-sm text-[15px] font-medium text-warning-text hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {etape.action.libelle}
            <ArrowRight className="size-4" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
          </Link>
        )}
      </div>

      {/* La pastille porte son libelle ecrit : l'etat ne se devine pas a la
          seule couleur de l'icone. */}
      <PastilleEtat
        genre={validee ? "succes" : "attente"}
        libelle={validee ? "Validé" : "À faire"}
        className="mt-0.5 shrink-0"
      />
    </div>
  );
}

function SqueletteEtape() {
  return (
    <div className="flex items-start gap-4">
      <Skeleton className="size-8 shrink-0 rounded-md" />
      <div className="min-w-0 flex-1">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="mt-2 h-3.5 w-full max-w-[420px]" />
        <Skeleton className="mt-1.5 h-3.5 w-full max-w-[320px]" />
        <Skeleton className="mt-3 h-4 w-40" />
      </div>
      <Skeleton className="mt-0.5 h-6 w-16 shrink-0 rounded-sm" />
    </div>
  );
}
