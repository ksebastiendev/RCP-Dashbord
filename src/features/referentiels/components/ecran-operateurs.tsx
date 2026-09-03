import { useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionLigne, GroupeActions } from "@/components/shared/actions-ligne";
import { BarreFiltres, ChampRecherche } from "@/components/shared/barre-filtres";
import { CellulePays } from "@/components/shared/drapeau";
import { EtatVide } from "@/components/shared/etat-vide";
import { PastilleEtat } from "@/components/shared/pastille-etat";
import { CelluleAvecVignette, Tableau, type Colonne } from "@/components/shared/tableau";
import { Texte } from "@/components/shared/valeur";
import { formatEntier } from "@/lib/format";
import { TRAIT_ICONE } from "@/lib/icones";
import { useOperateurs } from "../hooks/use-referentiels";
import { useReferentiels } from "../store";
import type { Operateur } from "../types";
import { GabaritListe } from "./gabarit-liste";

/*
 * Operateurs. Releve dans BCP/Referentiels/Operateur.png.
 *
 * A ne pas confondre avec les portefeuilles : l'operateur est l'entreprise
 * qui exploite le portefeuille. Yas Togo exploite Mix by Yass.
 */
export function EcranOperateurs() {
  const { data, isPending, error, refetch } = useOperateurs();

  const recherche = useReferentiels((e) => e.rechercheOperateurs);
  const definirRecherche = useReferentiels((e) => e.definirRecherche);
  const ouvrirModale = useReferentiels((e) => e.ouvrirModale);

  const lignes = useMemo(() => {
    if (!data) return undefined;
    const terme = recherche.trim().toLowerCase();
    if (!terme) return data;
    return data.filter(
      (o) =>
        o.nom.toLowerCase().includes(terme) ||
        o.nomPays.toLowerCase().includes(terme) ||
        (o.ancienNom?.toLowerCase().includes(terme) ?? false),
    );
  }, [data, recherche]);

  const colonnes: Colonne<Operateur>[] = [
    {
      cle: "nom",
      entete: "Opérateur",
      largeur: "32%",
      squelette: "60%",
      cellule: (o) => <CelluleAvecVignette urlVignette={o.logoUrl} libelle={o.nom} />,
    },
    {
      cle: "pays",
      entete: "Pays",
      largeur: "24%",
      squelette: "50%",
      cellule: (o) => <CellulePays code={o.pays} nom={o.nomPays} />,
    },
    {
      cle: "ancien",
      entete: "Ancien nom",
      largeur: "24%",
      squelette: "45%",
      cellule: (o) =>
        /* Un ancien nom se lit comme un etat passe, d'ou la pastille neutre
           relevee dans la maquette. Son absence reste un tiret, pas un vide. */
        o.ancienNom ? (
          <PastilleEtat genre="neutre" libelle={o.ancienNom} />
        ) : (
          <Texte valeur={null} />
        ),
    },
    {
      cle: "actions",
      entete: "",
      largeur: "20%",
      squelette: "50%",
      cellule: (o) => (
        <GroupeActions>
          <ActionLigne
            libelle="Renommer"
            onClick={() =>
              ouvrirModale({
                type: "renommer-operateur",
                idOperateur: o.id,
                nomActuel: o.nom,
              })
            }
            desactive
            motif="Le formulaire de renommage arrive avec le lot des modales."
          />
        </GroupeActions>
      ),
    },
  ];

  return (
    <GabaritListe
      titre="Opérateurs"
      description="Les entreprises qui exploitent les portefeuilles, à ne pas confondre avec les marques de portefeuille. Yas Togo exploite Mix by Yass."
      action={
        <Button type="button">
          <Plus className="size-4" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
          Déclarer un opérateur
        </Button>
      }
      filtres={
        <BarreFiltres
          recherche={
            <ChampRecherche
              libelle="Rechercher un opérateur"
              indication="Opérateur, pays, anciens noms"
              valeur={recherche}
              onChangement={(terme) => definirRecherche("rechercheOperateurs", terme)}
            />
          }
        />
      }
    >
      <Tableau
        titre={
          lignes === undefined
            ? undefined
            : `${formatEntier(lignes.length)} ${lignes.length === 1 ? "opérateur" : "opérateurs"}`
        }
        colonnes={colonnes}
        lignes={lignes}
        cleLigne={(o) => o.id}
        chargement={isPending}
        erreur={error}
        onReessayer={() => refetch()}
        lignesSquelette={10}
        etatVide={
          recherche.trim() ? (
            <EtatVide
              raison="aucun-resultat"
              titre="Aucun opérateur ne correspond"
              description="Aucun opérateur ne porte ce nom, dans ce pays, ni sous cet ancien nom. Videz la recherche pour revoir la liste complète."
            />
          ) : (
            <EtatVide
              raison="aucune-donnee"
              titre="Aucun opérateur déclaré"
              description="Tant qu'aucun opérateur n'est déclaré, aucune présence ne peut être ouverte."
              action={<Button type="button">Déclarer un opérateur</Button>}
            />
          )
        }
      />
    </GabaritListe>
  );
}
