import { useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionLigne, ActionRetrait, GroupeActions } from "@/components/shared/actions-ligne";
import { BarreFiltres, ChampRecherche } from "@/components/shared/barre-filtres";
import { CellulePays } from "@/components/shared/drapeau";
import { EtatVide } from "@/components/shared/etat-vide";
import { PastilleEtat } from "@/components/shared/pastille-etat";
import { CelluleAvecVignette, Tableau, type Colonne } from "@/components/shared/tableau";
import { Texte } from "@/components/shared/valeur";
import { formatEntier } from "@/lib/format";
import { TRAIT_ICONE } from "@/lib/icones";
import { usePresences } from "../hooks/use-referentiels";
import { useReferentiels } from "../store";
import type { Presence } from "../types";
import { GabaritListe } from "./gabarit-liste";

/*
 * Presences. Releve dans BCP/Referentiels/Operateur-1.png, dont la
 * navigation laterale designe bien Presences et non Operateurs.
 *
 * Une presence est le couple operateur et pays tel que le marchand le voit.
 * La fermer ne la supprime pas : elle cesse d'etre proposee.
 */
export function EcranPresences() {
  const { data, isPending, error, refetch } = usePresences();

  const recherche = useReferentiels((e) => e.recherchePresences);
  const definirRecherche = useReferentiels((e) => e.definirRecherche);

  const lignes = useMemo(() => {
    if (!data) return undefined;
    const terme = recherche.trim().toLowerCase();
    if (!terme) return data;
    return data.filter(
      (p) =>
        p.libelleVu.toLowerCase().includes(terme) ||
        p.nomPays.toLowerCase().includes(terme) ||
        (p.ancienNom?.toLowerCase().includes(terme) ?? false),
    );
  }, [data, recherche]);

  const colonnes: Colonne<Presence>[] = [
    {
      cle: "libelle",
      entete: "Libellé vu",
      largeur: "34%",
      squelette: "60%",
      cellule: (p) => (
        <CelluleAvecVignette urlVignette={p.logoUrl} libelle={p.libelleVu} />
      ),
    },
    {
      cle: "pays",
      entete: "Pays",
      largeur: "22%",
      squelette: "50%",
      cellule: (p) => <CellulePays code={p.pays} nom={p.nomPays} />,
    },
    {
      cle: "ancien",
      entete: "Ancien nom",
      largeur: "22%",
      squelette: "45%",
      cellule: (p) =>
        p.ancienNom ? (
          <PastilleEtat genre="neutre" libelle={p.ancienNom} />
        ) : (
          <Texte valeur={null} />
        ),
    },
    {
      cle: "actions",
      entete: "",
      largeur: "22%",
      squelette: "70%",
      cellule: (p) => (
        <GroupeActions>
          <ActionLigne
            libelle="Renommer"
            onClick={() => {}}
            desactive
            motif="Le formulaire de renommage arrive avec le lot des modales."
          />
          <ActionRetrait
            libelle={p.ouverte ? "Fermer" : "Ouvrir"}
            onClick={() => {}}
            desactive
          />
        </GroupeActions>
      ),
    },
  ];

  return (
    <GabaritListe
      titre="Présences"
      description="Le couple opérateur et pays tel que le marchand le voit. Fermer une présence ne la supprime pas : elle cesse d'être proposée aux marchands."
      action={
        <Button type="button">
          <Plus className="size-4" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
          Ouvrir une présence
        </Button>
      }
      filtres={
        <BarreFiltres
          recherche={
            <ChampRecherche
              libelle="Rechercher une présence"
              indication="Opérateur, pays, anciens noms"
              valeur={recherche}
              onChangement={(terme) => definirRecherche("recherchePresences", terme)}
            />
          }
        />
      }
    >
      <Tableau
        titre={
          lignes === undefined
            ? undefined
            : `${formatEntier(lignes.length)} ${lignes.length === 1 ? "présence" : "présences"}`
        }
        colonnes={colonnes}
        lignes={lignes}
        cleLigne={(p) => p.id}
        chargement={isPending}
        erreur={error}
        onReessayer={() => refetch()}
        lignesSquelette={10}
        etatVide={
          recherche.trim() ? (
            <EtatVide
              raison="aucun-resultat"
              titre="Aucune présence ne correspond"
              description="Aucune présence ne porte ce libellé, dans ce pays, ni sous cet ancien nom. Videz la recherche pour revoir la liste complète."
            />
          ) : (
            <EtatVide
              raison="aucune-donnee"
              titre="Aucune présence ouverte"
              description="Aucun marchand ne peut choisir de destination tant qu'aucune présence n'est ouverte."
              action={<Button type="button">Ouvrir une présence</Button>}
            />
          )
        }
      />
    </GabaritListe>
  );
}
