import { useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionLigne, GroupeActions } from "@/components/shared/actions-ligne";
import { BarreFiltres, ChampRecherche } from "@/components/shared/barre-filtres";
import { EtatVide } from "@/components/shared/etat-vide";
import { PastilleEtat } from "@/components/shared/pastille-etat";
import { CelluleAvecVignette, Tableau, type Colonne } from "@/components/shared/tableau";
import { ModaleConfirmation } from "@/components/shared/modale";
import { Nombre } from "@/components/shared/valeur";
import { formatEntier } from "@/lib/format";
import { TRAIT_ICONE } from "@/lib/icones";
import { usePortefeuilles, useRetirerPortefeuille } from "../hooks/use-referentiels";
import { useReferentiels } from "../store";
import type { Portefeuille } from "../types";
import { GabaritListe } from "./gabarit-liste";
import { ModaleDeclarerMarque } from "./modales";

/*
 * Portefeuilles. Releve dans BCP/Referentiels/Portefeuil.png.
 *
 * Le referentiel couvre plus large que ce que la plateforme sert : une
 * marque sans route active n'est pas une anomalie, c'est le cas normal.
 */

const LIBELLE_NATURE = {
  "operateur-telecom": "Opérateur télécom",
  banque: "Banque",
  agregateur: "Agrégateur",
} as const;

export function EcranPortefeuilles() {
  const { data, isPending, error, refetch } = usePortefeuilles();
  const retirer = useRetirerPortefeuille();

  const recherche = useReferentiels((e) => e.recherchePortefeuilles);
  const definirRecherche = useReferentiels((e) => e.definirRecherche);
  const modale = useReferentiels((e) => e.modale);
  const ouvrirModale = useReferentiels((e) => e.ouvrirModale);
  const fermerModale = useReferentiels((e) => e.fermerModale);

  const lignes = useMemo(() => {
    if (!data) return undefined;
    const terme = recherche.trim().toLowerCase();
    if (!terme) return data;
    return data.filter((p) => p.nom.toLowerCase().includes(terme));
  }, [data, recherche]);

  /* Sous-titre releve dans la maquette : il compte ce qui est reellement
     servi face a ce qui est seulement connu. Les deux nombres viennent de la
     donnee, ils ne sont pas ecrits en dur. */
  const sousTitre = useMemo(() => {
    if (!data) return undefined;
    const servies = data.filter((p) => p.routesActives !== null).length;
    return `${formatEntier(data.length)} marques · ${formatEntier(servies)} réellement servies, ${formatEntier(data.length - servies)} seulement connues`;
  }, [data]);

  const colonnes: Colonne<Portefeuille>[] = [
    {
      cle: "nom",
      entete: "Portefeuille",
      largeur: "28%",
      squelette: "65%",
      cellule: (p) => <CelluleAvecVignette urlVignette={p.logoUrl} libelle={p.nom} />,
    },
    {
      cle: "nature",
      entete: "Nature",
      largeur: "20%",
      squelette: "70%",
      cellule: (p) => (
        <PastilleEtat genre="neutre" libelle={LIBELLE_NATURE[p.nature]} />
      ),
    },
    {
      cle: "pays",
      entete: "Pays",
      largeur: "12%",
      squelette: "30%",
      cellule: (p) => (
        <Nombre valeur={p.nombrePays} libelleZero="Aucun" className="text-left" />
      ),
    },
    {
      cle: "routes",
      entete: "Routes actives",
      largeur: "20%",
      squelette: "45%",
      cellule: (p) => (
        /* Trois cas distincts dans cette seule colonne : un nombre,
           "Aucune" pour zero, et "Non servi" pour une marque que le
           referentiel connait mais qu'aucun fournisseur ne sert. */
        <Nombre
          valeur={p.routesActives}
          libelleZero="Aucune"
          libelleAbsent="Non servi"
          className="text-left"
        />
      ),
    },
    {
      cle: "actions",
      entete: "",
      largeur: "20%",
      squelette: "70%",
      cellule: (p) => (
        <GroupeActions>
          <ActionLigne
            libelle="Modifier"
            onClick={() => ouvrirModale({ type: "declarer-marque" })}
          />
          <ActionLigne
            libelle="Retirer"
            ton="danger"
            onClick={() =>
              ouvrirModale({
                type: "retirer-portefeuille",
                idPortefeuille: p.id,
                nom: p.nom,
              })
            }
            desactive={!p.retirable}
            motif="Cette marque porte des routes actives. Fermez les routes avant de la retirer."
          />
        </GroupeActions>
      ),
    },
  ];

  return (
    <GabaritListe
      titre="Portefeuilles"
      description="Les marques de portefeuille mobile que la plateforme connaît. Une marque servie nulle part n'est pas une anomalie : le référentiel couvre plus que ce que nous servons."
      action={
        <Button type="button" onClick={() => ouvrirModale({ type: "declarer-marque" })}>
          <Plus className="size-4" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
          Déclarer une marque
        </Button>
      }
      filtres={
        <BarreFiltres
          recherche={
            <ChampRecherche
              libelle="Rechercher une marque de portefeuille"
              indication="Nom de la marque"
              valeur={recherche}
              onChangement={(terme) =>
                definirRecherche("recherchePortefeuilles", terme)
              }
            />
          }
        />
      }
    >
      <Tableau
        titre={
          lignes === undefined
            ? undefined
            : `${formatEntier(lignes.length)} ${lignes.length === 1 ? "portefeuille" : "portefeuilles"}`
        }
        sousTitre={sousTitre}
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
              titre="Aucune marque ne correspond"
              description="Aucune marque de portefeuille ne porte ce nom. Videz la recherche pour revoir la liste complète."
            />
          ) : (
            <EtatVide
              raison="aucune-donnee"
              titre="Aucune marque déclarée"
              description="Le référentiel des portefeuilles est vide. Aucune destination ne peut être décrite tant qu'aucune marque n'est déclarée."
              action={
                <Button
                  type="button"
                  onClick={() => ouvrirModale({ type: "declarer-marque" })}
                >
                  Déclarer une marque
                </Button>
              }
            />
          )
        }
      />

      <ModaleDeclarerMarque
        ouverte={modale.type === "declarer-marque"}
        onFermer={fermerModale}
      />

      {modale.type === "retirer-portefeuille" && (
        <ModaleConfirmation
          ouverte
          onChangementOuverture={(ouverte) => {
            if (!ouverte) fermerModale();
          }}
          titre={`Retirer la marque ${modale.nom} ?`}
          consequences={`${modale.nom} disparaît du référentiel. Les écrans de tarification et de montants autorisés ne proposeront plus cette destination, et les marchands qui la nomment dans leurs formulaires verront leurs paiements refusés.`}
          avertissement="Les plafonds et les justificatifs renseignés pour cette marque sont supprimés avec elle. Il faudra les ressaisir si la marque est redéclarée."
          libelleAction="Retirer la marque"
          enCours={retirer.isPending}
          onConfirmer={() =>
            retirer.mutate(modale.idPortefeuille, { onSuccess: fermerModale })
          }
        />
      )}
    </GabaritListe>
  );
}
