import { useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Carte } from "@/components/shared/carte";
import { CLASSES_CONTROLE } from "@/components/shared/classes-controle";
import { CorpsEcran, EnTeteEcran } from "@/components/shared/coque-application";
import { EtatErreur } from "@/components/shared/etat-erreur";
import { ModaleConfirmation } from "@/components/shared/modale";
import { TRAIT_ICONE } from "@/lib/icones";
import { cn } from "@/lib/utils";
import {
  useFicheMarchand,
  useMarchands,
  useRenouvelerCle,
} from "../hooks/use-marchands";
import { useMarchandsStore } from "../store";
import type { ModeApplication } from "../types";
import { EXPLICATION_MODE, LIBELLE_MODE } from "./libelles";
import { CarteApplication } from "./onglets-fiche";

/*
 * Applications et cles. Releve dans BCP/Marchand/Applications et clés.png.
 *
 * L'ecran porte les cles d'un marchand a la fois, choisi dans un selecteur.
 * Les deux bandeaux de legende sont permanents dans la maquette, et ils
 * meritent de l'etre : confondre une application de demonstration avec une
 * application reelle coute cher dans les deux sens.
 */
export function EcranApplications() {
  const marchands = useMarchands();
  const choisi = useMarchandsStore((e) => e.marchandChoisi);
  const definirChoisi = useMarchandsStore((e) => e.definirMarchandChoisi);
  const modale = useMarchandsStore((e) => e.modale);
  const ouvrirModale = useMarchandsStore((e) => e.ouvrirModale);
  const fermerModale = useMarchandsStore((e) => e.fermerModale);

  const renouveler = useRenouvelerCle();

  /* Les marchands dont la fiche existe sont les seuls a pouvoir etre
     ouverts : le selecteur ne propose pas des fiches introuvables. */
  const selectionnables = marchands.data?.filter((m) => m.nombreApplications > 0);

  useEffect(() => {
    if (!choisi && selectionnables && selectionnables.length > 0) {
      definirChoisi(selectionnables[0].id);
    }
  }, [choisi, selectionnables, definirChoisi]);

  const fiche = useFicheMarchand(choisi ?? "");

  return (
    <CorpsEcran>
      <EnTeteEcran
        titre="Applications et clés"
        description="Chaque application porte son mode en permanence. Une clé secrète ne se voit qu'une fois."
      />

      <div className="w-[320px] max-w-full">
        <label htmlFor="marchand-choisi" className="sr-only">
          Choisir le marchand dont on regarde les applications
        </label>
        {marchands.isPending ? (
          <Skeleton className="h-12 w-full rounded-md" />
        ) : (
          <select
            id="marchand-choisi"
            value={choisi ?? ""}
            onChange={(evenement) => definirChoisi(evenement.target.value)}
            className={CLASSES_CONTROLE}
          >
            {selectionnables?.map((marchand) => (
              <option key={marchand.id} value={marchand.id}>
                {marchand.nom}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <LegendeMode mode="reel" />
        <LegendeMode mode="demonstration" />
      </div>

      <div className="flex justify-end">
        <Button type="button" onClick={() => ouvrirModale({ type: "nouvelle-application" })}>
          <Plus className="size-4" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
          Nouvelle application
        </Button>
      </div>

      {marchands.error ? (
        <EtatErreur erreur={marchands.error} onReessayer={() => marchands.refetch()} />
      ) : fiche.error ? (
        <EtatErreur erreur={fiche.error} onReessayer={() => fiche.refetch()} />
      ) : fiche.isPending || !fiche.data ? (
        <div className="flex flex-col gap-5">
          {Array.from({ length: 2 }, (_, index) => (
            <Carte key={`squelette-${index}`} avecBordure={false} className="px-6 py-5">
              <Skeleton className="h-6 w-56" />
              <Skeleton className="mt-2 h-4 w-80" />
              <Skeleton className="mt-4 h-12 w-full rounded-md" />
            </Carte>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {fiche.data.applications.map((application) => (
            <CarteApplication
              key={application.id}
              application={application}
              onRenouveler={() =>
                ouvrirModale({
                  type: "renouveler-cle",
                  idApplication: application.id,
                  nomApplication: application.nom,
                })
              }
            />
          ))}
        </div>
      )}

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

/*
 * Legende de mode, permanente comme dans la maquette.
 * Le mot en capitales porte le sens, la couleur ne fait que l'accompagner.
 */
function LegendeMode({ mode }: { mode: ModeApplication }) {
  return (
    <p
      className={cn(
        "flex flex-wrap items-baseline gap-4 rounded-lg px-5 py-3.5 text-sm",
        mode === "reel" ? "bg-success-subtle" : "bg-warning-subtle",
      )}
    >
      <span
        className={cn(
          "shrink-0 text-[13px] font-semibold tracking-wide uppercase",
          mode === "reel" ? "text-success-fg" : "text-warning-text",
        )}
      >
        Mode {LIBELLE_MODE[mode] === "Démo" ? "démonstration" : "réel"}
      </span>
      <span className={mode === "reel" ? "text-success-fg" : "text-warning-text"}>
        {EXPLICATION_MODE[mode]}
      </span>
    </p>
  );
}
