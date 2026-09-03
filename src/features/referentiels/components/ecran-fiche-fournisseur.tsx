import { Link, useParams } from "react-router-dom";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronLeft,
  CircleHelp,
  FileText,
} from "lucide-react";
import { Bandeau } from "@/components/shared/bandeau";
import { CorpsEcran } from "@/components/shared/coque-application";
import { CellulePays } from "@/components/shared/drapeau";
import { EtatErreur } from "@/components/shared/etat-erreur";
import { EtatVide } from "@/components/shared/etat-vide";
import { PastilleEtat } from "@/components/shared/pastille-etat";
import { Tableau, type Colonne } from "@/components/shared/tableau";
import { Skeleton } from "@/components/ui/skeleton";
import { formatEntier } from "@/lib/format";
import { TRAIT_ICONE } from "@/lib/icones";
import { cn } from "@/lib/utils";
import { useFicheFournisseur } from "../hooks/use-referentiels";
import type { DestinationServie, Fiabilite } from "../types";

/*
 * Fiche fournisseur. Releve dans BCP/Referentiels/Fournisseurs-1.png.
 *
 * La colonne de fiabilite est le coeur de cet ecran : elle dit d'ou vient
 * l'information de couverture, pas si la destination fonctionne. La
 * maquette le precise elle-meme sous le tableau, et cette phrase est
 * conservee.
 */

const FIABILITE = {
  "releve-fournisseur": {
    libelle: "Relevé fournisseur",
    icone: FileText,
    classe: "text-success-fg",
    niveau: 3,
    /* Le niveau est aussi ecrit, pour ne pas dependre de la seule lecture
       des trois segments. */
    lecture: "Fiabilité élevée, 3 sur 3",
  },
  "hypothese-non-verifiee": {
    libelle: "Hypothèse non vérifiée",
    icone: CircleHelp,
    classe: "text-warning-text",
    niveau: 1,
    lecture: "Fiabilité faible, 1 sur 3",
  },
} as const satisfies Record<Fiabilite, unknown>;

const LIBELLE_SENS = {
  encaissement: { libelle: "Encaissement", icone: ArrowDownLeft },
  decaissement: { libelle: "Décaissement", icone: ArrowUpRight },
} as const;

export function EcranFicheFournisseur() {
  const { id = "" } = useParams();
  const { data, isPending, error, refetch } = useFicheFournisseur(id);

  const colonnes: Colonne<DestinationServie>[] = [
    {
      cle: "pays",
      entete: "Pays",
      largeur: "22%",
      squelette: "60%",
      cellule: (d) => <CellulePays code={d.pays} nom={d.nomPays} />,
    },
    {
      cle: "portefeuille",
      entete: "Portefeuille",
      largeur: "22%",
      squelette: "55%",
      cellule: (d) => <span className="truncate">{d.portefeuille}</span>,
    },
    {
      cle: "sens",
      entete: "Sens",
      largeur: "18%",
      squelette: "60%",
      cellule: (d) => {
        const sens = LIBELLE_SENS[d.sens];
        const Icone = sens.icone;
        return (
          <span className="flex items-center gap-2">
            <Icone
              className="size-4 shrink-0 text-fg-muted"
              strokeWidth={TRAIT_ICONE}
              aria-hidden="true"
            />
            <span>{sens.libelle}</span>
          </span>
        );
      },
    },
    {
      cle: "fiabilite",
      entete: "Fiabilité de l'information",
      largeur: "26%",
      squelette: "75%",
      cellule: (d) => {
        const fiabilite = FIABILITE[d.fiabilite];
        const Icone = fiabilite.icone;
        return (
          <span className={cn("flex items-center gap-2", fiabilite.classe)}>
            <Icone className="size-4 shrink-0" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
            <span className="truncate">{fiabilite.libelle}</span>
          </span>
        );
      },
    },
    {
      cle: "niveau",
      entete: "Niveau",
      largeur: "12%",
      alignement: "droite",
      squelette: "60%",
      cellule: (d) => <JaugeNiveau fiabilite={d.fiabilite} />,
    },
  ];

  if (error) {
    return (
      <CorpsEcran>
        <LienRetour />
        <EtatErreur erreur={error} onReessayer={() => refetch()} />
      </CorpsEcran>
    );
  }

  return (
    <CorpsEcran>
      <LienRetour />

      <div className="flex items-start justify-between gap-8">
        <div className="min-w-0">
          {isPending ? (
            <>
              <Skeleton className="h-10 w-64" />
              <Skeleton className="mt-3 h-4 w-80" />
            </>
          ) : (
            <>
              <h1 className="text-ecran font-semibold text-fg-primary">
                {data.nom}
              </h1>
              <p className="mt-2 text-corps text-fg-secondary">
                {data.type === "agregateur" ? "Agrégateur" : "Connecteur direct"}
                {" · "}
                {data.routesActives === 0
                  ? "aucune route active ne repose dessus"
                  : `${formatEntier(data.routesActives)} ${data.routesActives === 1 ? "route active repose" : "routes actives reposent"} dessus`}
              </p>
            </>
          )}
        </div>

        {!isPending && (
          <PastilleEtat
            genre={data.raccorde ? "succes" : "neutre"}
            libelle={data.raccorde ? "Raccordé" : "Non raccordé"}
          />
        )}
      </div>

      <Bandeau
        genre="information"
        titre="Identifiants"
        description="Les identifiants sont installés sur le serveur. Cet écran ne les affiche jamais et n'en demande aucun."
      />

      <Tableau
        titre="Destinations servies"
        sousTitre={
          data
            ? `${formatEntier(data.destinations.length)} ${data.destinations.length === 1 ? "destination" : "destinations"}`
            : undefined
        }
        colonnes={colonnes}
        lignes={data?.destinations}
        cleLigne={(d) => d.id}
        chargement={isPending}
        lignesSquelette={5}
        etatVide={
          <EtatVide
            raison="aucune-donnee"
            titre="Aucune destination servie"
            description="Ce fournisseur est déclaré mais ne sert aucune destination. Aucune route ne peut passer par lui en l'état."
          />
        }
        pied={
          <p className="px-6 py-4 text-mention text-fg-secondary">
            « Relevé » et « hypothèse » sont deux niveaux de fiabilité de
            l'information, pas deux états de la destination.
          </p>
        }
      />
    </CorpsEcran>
  );
}

function LienRetour() {
  return (
    <Link
      to="/referentiel/fournisseurs"
      className="-mb-2 flex w-fit items-center gap-2 rounded-sm text-corps font-medium text-warning-text hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <ChevronLeft className="size-4" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
      Tous les fournisseurs
    </Link>
  );
}

/*
 * Jauge de fiabilite en trois segments, relevee dans la maquette.
 * Elle double une information deja ecrite en clair dans la colonne
 * precedente : elle est donc masquee aux lecteurs d'ecran, qui recoivent le
 * niveau en mots.
 */
function JaugeNiveau({ fiabilite }: { fiabilite: Fiabilite }) {
  const { niveau, lecture } = FIABILITE[fiabilite];

  return (
    <span className="flex items-center justify-end gap-1">
      <span className="sr-only">{lecture}</span>
      {[1, 2, 3].map((segment) => (
        <span
          key={segment}
          aria-hidden="true"
          className={cn(
            "h-1.5 w-3 rounded-full",
            segment > niveau
              ? "bg-border"
              : niveau === 3
                ? "bg-success-fg"
                : "bg-warning-fg",
          )}
        />
      ))}
    </span>
  );
}
