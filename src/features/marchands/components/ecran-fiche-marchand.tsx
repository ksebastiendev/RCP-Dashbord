import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { ModaleNouvelleApplication } from "./modales";
import { Skeleton } from "@/components/ui/skeleton";
import { Bandeau } from "@/components/shared/bandeau";
import { Carte } from "@/components/shared/carte";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GroupeOnglets } from "@/components/shared/groupe-onglets";
import { CorpsEcran } from "@/components/shared/coque-application";
import { EtatErreur } from "@/components/shared/etat-erreur";
import { ModaleConfirmation } from "@/components/shared/modale";
import { PastilleEtat } from "@/components/shared/pastille-etat";
import { formatMontant, formatPourcentage } from "@/lib/format";
import { TRAIT_ICONE } from "@/lib/icones";
import { cn } from "@/lib/utils";
import {
  useFicheMarchand,
  useRenouvelerCle,
  useTesterWebhook,
} from "../hooks/use-marchands";
import { useMarchandsStore } from "../store";
import type { FicheMarchand } from "../types";
import {
  CONSEQUENCE_STATUT,
  GENRE_STATUT,
  LIBELLE_FRAIS,
  LIBELLE_STATUT,
} from "./libelles";
import {
  OngletActivite,
  OngletApplications,
  OngletDossier,
  OngletTarification,
  OngletWebhooks,
} from "./onglets-fiche";

/*
 * Fiche marchand. Relevee dans BCP/Marchand/liste des marchand-1 a -4.
 * Cinq onglets, dont Activite qui n'a pas de maquette.
 */

type OngletFiche =
  "dossier" | "applications" | "tarification" | "webhooks" | "activite";

/* L'onglet Dossier est servi par le chemin de la fiche elle-meme : une
   adresse sans segment, plutot qu'un /dossier redondant. */
const ONGLETS: Array<{ valeur: OngletFiche; libelle: string }> = [
  { valeur: "dossier", libelle: "Dossier" },
  { valeur: "applications", libelle: "Applications" },
  { valeur: "tarification", libelle: "Tarification" },
  { valeur: "webhooks", libelle: "Webhooks" },
  { valeur: "activite", libelle: "Activité" },
];

export function EcranFicheMarchand() {
  const { id = "", onglet: segment } = useParams();
  const { data, isPending, error, refetch } = useFicheMarchand(id);

  /* Un segment inconnu, tape ou vieilli, ramene au Dossier plutot que de
     rendre une fiche sans contenu. */
  const onglet: OngletFiche =
    ONGLETS.find((o) => o.valeur === segment)?.valeur ?? "dossier";
  const modale = useMarchandsStore((e) => e.modale);
  const ouvrirModale = useMarchandsStore((e) => e.ouvrirModale);
  const fermerModale = useMarchandsStore((e) => e.fermerModale);

  const renouveler = useRenouvelerCle();
  const tester = useTesterWebhook();
  const [idTeste, setIdTeste] = useState<string | null>(null);
  const [resultatTest, setResultatTest] = useState<string | null>(null);

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

      <EnTeteFiche fiche={data} chargement={isPending} />

      <RangeeStatistiques fiche={data} chargement={isPending} />

      {isPending || !data ? (
        <Skeleton className="h-[92px] w-full rounded-lg" />
      ) : (
        <Bandeau
          genre={data.constat.genre}
          titre={data.constat.titre}
          description={data.constat.description}
        />
      )}

      <GroupeOnglets
        libelleGroupe="Vues de la fiche marchand"
        onglets={ONGLETS.map(({ valeur, libelle }) => ({
          chemin:
            valeur === "dossier"
              ? `/marchand/liste/${id}`
              : `/marchand/liste/${id}/${valeur}`,
          libelle,
          exact: valeur === "dossier",
        }))}
      />

      {resultatTest && (
        <Bandeau
          genre="succes"
          titre="Test envoyé"
          description={resultatTest}
        />
      )}

      {isPending || !data ? (
        <Skeleton className="h-72 w-full rounded-lg" />
      ) : (
        <>
          {onglet === "dossier" && <OngletDossier fiche={data} />}
          {onglet === "applications" && (
            <div className="flex flex-col gap-5">
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={() => ouvrirModale({ type: "nouvelle-application" })}
                >
                  <Plus
                    className="size-4"
                    strokeWidth={TRAIT_ICONE}
                    aria-hidden="true"
                  />
                  Nouvelle application
                </Button>
              </div>
              <OngletApplications
                applications={data.applications}
                onRenouveler={(application) =>
                  ouvrirModale({
                    type: "renouveler-cle",
                    idApplication: application.id,
                    nomApplication: application.nom,
                  })
                }
              />
            </div>
          )}
          {onglet === "tarification" && <OngletTarification fiche={data} />}
          {onglet === "webhooks" && (
            <OngletWebhooks
              fiche={data}
              idEnCours={idTeste}
              onTester={(webhook) => {
                setIdTeste(webhook.id);
                setResultatTest(null);
                tester.mutate(webhook.id, {
                  onSuccess: (resultat) => setResultatTest(resultat.message),
                  onSettled: () => setIdTeste(null),
                });
              }}
            />
          )}
          {onglet === "activite" && <OngletActivite />}
        </>
      )}

      <ModaleNouvelleApplication
        ouverte={modale.type === "nouvelle-application"}
        onFermer={fermerModale}
      />

      {modale.type === "renouveler-cle" && (
        <ModaleConfirmation
          ouverte
          onChangementOuverture={(ouverte) => {
            if (!ouverte) fermerModale();
          }}
          titre={`Renouveler la clé de ${modale.nomApplication} ?`}
          consequences={`L'ancienne clé cesse de fonctionner immédiatement. Tous les paiements envoyés par ${modale.nomApplication} avec l'ancienne clé seront refusés tant que le marchand n'aura pas déployé la nouvelle.`}
          avertissement="La nouvelle clé secrète ne s'affiche qu'une fois, au moment du renouvellement. Elle ne pourra plus être relue ensuite."
          libelleAction="Renouveler la clé"
          enCours={renouveler.isPending}
          onConfirmer={() =>
            renouveler.mutate(modale.idApplication, { onSuccess: fermerModale })
          }
        />
      )}
    </CorpsEcran>
  );
}

function LienRetour() {
  return (
    <Link
      to="/marchand/liste"
      className="-mb-2 flex w-fit items-center gap-2 rounded-sm text-corps font-medium text-warning-text hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <ChevronLeft
        className="size-4"
        strokeWidth={TRAIT_ICONE}
        aria-hidden="true"
      />
      Tous les marchands
    </Link>
  );
}

function EnTeteFiche({
  fiche,
  chargement,
}: {
  fiche: FicheMarchand | undefined;
  chargement: boolean;
}) {
  if (chargement || !fiche) {
    return (
      <div>
        <Skeleton className="h-10 w-72" />
        <Skeleton className="mt-3 h-4 w-[520px] max-w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-start justify-between gap-6">
      <div className="min-w-0">
        <h1 className="text-ecran font-semibold text-fg-primary">
          {fiche.nom}
        </h1>
        {/* La consequence du statut est ecrite sous le nom : savoir qu'un
            dossier est "en examen" ne dit pas qu'aucun encaissement n'est
            possible. */}
        <p className="mt-2 max-w-[640px] text-corps leading-relaxed text-fg-secondary">
          {CONSEQUENCE_STATUT[fiche.statut]}
        </p>
      </div>
      <PastilleEtat
        genre={GENRE_STATUT[fiche.statut]}
        libelle={LIBELLE_STATUT[fiche.statut]}
        className="mt-2"
      />
    </div>
  );
}

/*
 * Rangee de statistiques de la fiche.
 *
 * Troisieme gabarit de carte des maquettes : etiquette en capitales, valeur
 * coloree selon ce qu'elle designe. Les deux premiers gabarits sont la carte
 * d'indicateur du Referentiel et la tuile de l'Accueil.
 */
function RangeeStatistiques({
  fiche,
  chargement,
}: {
  fiche: FicheMarchand | undefined;
  chargement: boolean;
}) {
  const statistiques = fiche
    ? [
        {
          cle: "volume",
          etiquette: "Volume ce mois",
          valeur: formatMontant(fiche.volumeCeMois, fiche.devise),
          ton: "succes" as const,
        },
        {
          cle: "tarif",
          etiquette: "Tarif effectif",
          valeur: formatPourcentage(fiche.tauxEffectif, 2),
          ton: "neutre" as const,
        },
        {
          cle: "applications",
          etiquette: "Applications",
          valeur: String(fiche.applications.length),
          ton: "neutre" as const,
        },
        {
          cle: "frais",
          etiquette: "Frais à la charge de",
          valeur: LIBELLE_FRAIS[fiche.fraisALaChargeDe],
          ton: "neutre" as const,
        },
      ]
    : [];

  return (
    <div className="grid gap-[18px] sm:grid-cols-2 xl:grid-cols-4">
      {chargement || !fiche
        ? Array.from({ length: 4 }, (_, index) => (
            <Carte key={`squelette-${index}`} className="px-5 py-5">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="mt-3 h-6 w-40" />
            </Carte>
          ))
        : statistiques.map((statistique) => (
            <Carte key={statistique.cle} className="overflow-hidden px-5 py-5">
              <p className="text-etiquette font-medium tracking-wide text-fg-muted uppercase">
                {statistique.etiquette}
              </p>
              <p
                className={cn(
                  "tabular mt-2 text-titre font-semibold break-words",
                  statistique.ton === "succes" && "text-success-fg",
                  statistique.ton === "neutre" && "text-fg-primary",
                )}
              >
                {statistique.valeur}
              </p>
            </Carte>
          ))}
    </div>
  );
}
