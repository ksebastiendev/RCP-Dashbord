import { useEffect, useState } from "react";
import { Plus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bandeau } from "@/components/shared/bandeau";
import { BarreFiltres, ChampRecherche } from "@/components/shared/barre-filtres";
import { Carte } from "@/components/shared/carte";
import { CLASSES_CONTROLE } from "@/components/shared/classes-controle";
import { CorpsEcran, EnTeteEcran } from "@/components/shared/coque-application";
import { EtatErreur } from "@/components/shared/etat-erreur";
import { EtatVide } from "@/components/shared/etat-vide";
import { TRAIT_ICONE } from "@/lib/icones";
import {
  useFicheMarchand,
  useMarchands,
  useTesterWebhook,
} from "../hooks/use-marchands";
import { useMarchandsStore } from "../store";
import { ModaleEnregistrerAdresse } from "./modales";
import { TableauWebhooks } from "./onglets-fiche";

/*
 * Webhooks. Releve dans BCP/Marchand/webhooks.png.
 *
 * La capture de cet ecran ne montre que l'etat vide. Le tableau des
 * notifications, lui, est entierement visible dans l'onglet Webhooks de la
 * fiche marchand : c'est le meme composant qui est reutilise ici, aucune
 * colonne n'est inventee.
 */
export function EcranWebhooks() {
  const marchands = useMarchands();
  const choisi = useMarchandsStore((e) => e.marchandChoisi);
  const definirChoisi = useMarchandsStore((e) => e.definirMarchandChoisi);
  const modale = useMarchandsStore((e) => e.modale);
  const ouvrirModale = useMarchandsStore((e) => e.ouvrirModale);
  const fermerModale = useMarchandsStore((e) => e.fermerModale);
  const recherche = useMarchandsStore((e) => e.rechercheNom);
  const definirRecherche = useMarchandsStore((e) => e.definirRechercheNom);

  const tester = useTesterWebhook();
  const [idTeste, setIdTeste] = useState<string | null>(null);
  const [resultatTest, setResultatTest] = useState<string | null>(null);

  const selectionnables = marchands.data?.filter((m) => m.nombreApplications > 0);

  useEffect(() => {
    if (!choisi && selectionnables && selectionnables.length > 0) {
      definirChoisi(selectionnables[0].id);
    }
  }, [choisi, selectionnables, definirChoisi]);

  const fiche = useFicheMarchand(choisi ?? "");
  const groupes = fiche.data?.webhooksParApplication ?? [];

  return (
    <CorpsEcran>
      <EnTeteEcran
        titre="Webhooks"
        description="Notifications envoyées à chaque application, en langage clair. Tester est toujours à un clic."
        action={
          <Button
            type="button"
            onClick={() => ouvrirModale({ type: "nouvelle-adresse" })}
          >
            <Plus className="size-4" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
            Nouvelle adresse
          </Button>
        }
      />

      {/* Le selecteur ne gouverne pas un tableau mais l'ecran entier :
          il porte le marchand dont on regarde les notifications, et
          plusieurs tableaux en decoulent. Il reste donc au dessus, dans
          sa propre carte, plutot que dans la barre d'outils de l'un
          d'eux. */}
      <Carte avecBordure={false} className="px-6 py-4">
        <BarreFiltres
          recherche={
            <ChampRecherche
              libelle="Rechercher un marchand"
              indication="Nom de l'entreprise"
              valeur={recherche}
              onChangement={definirRecherche}
            />
          }
          bascule={
            marchands.isPending ? (
              <Skeleton className="h-12 w-[280px] rounded-md" />
            ) : (
              <div className="w-[280px]">
                <label htmlFor="marchand-webhooks" className="sr-only">
                  Choisir le marchand dont on regarde les notifications
                </label>
                <select
                  id="marchand-webhooks"
                  value={choisi ?? ""}
                  onChange={(evenement) => definirChoisi(evenement.target.value)}
                  className={CLASSES_CONTROLE}
                >
                  {selectionnables
                    ?.filter((m) =>
                      m.nom.toLowerCase().includes(recherche.trim().toLowerCase()),
                    )
                    .map((marchand) => (
                      <option key={marchand.id} value={marchand.id}>
                        {marchand.nom}
                      </option>
                    ))}
                </select>
              </div>
            )
          }
        />
      </Carte>

      {resultatTest && (
        <Bandeau genre="succes" titre="Test envoyé" description={resultatTest} />
      )}

      {marchands.error ? (
        <EtatErreur erreur={marchands.error} onReessayer={() => marchands.refetch()} />
      ) : fiche.error ? (
        <EtatErreur erreur={fiche.error} onReessayer={() => fiche.refetch()} />
      ) : fiche.isPending ? (
        <Carte avecBordure={false} className="px-6 py-6">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="mt-4 h-[46px] w-full" />
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="mt-2 h-14 w-full" />
          ))}
        </Carte>
      ) : groupes.length === 0 ? (
        <Carte avecBordure={false}>
          <EtatVide
            raison="aucune-donnee"
            titre="Aucun webhook"
            description="Aucune notification n'est configurée pour ce marchand. Il ne sera prévenu d'aucun paiement, d'aucun remboursement, d'aucun litige."
            icone={Send}
            action={
              <Button
                type="button"
                onClick={() => ouvrirModale({ type: "nouvelle-adresse" })}
              >
                Nouvelle adresse
              </Button>
            }
          />
        </Carte>
      ) : (
        <div className="flex flex-col gap-6">
          {groupes.map((groupe) => (
            <TableauWebhooks
              key={groupe.application.id}
              titre={groupe.application.nom}
              mode={groupe.application.mode}
              webhooks={groupe.webhooks}
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
          ))}
        </div>
      )}

      <ModaleEnregistrerAdresse
        ouverte={modale.type === "nouvelle-adresse"}
        onFermer={fermerModale}
        applications={fiche.data?.applications ?? []}
      />
    </CorpsEcran>
  );
}
