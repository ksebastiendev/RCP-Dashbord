import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarreFiltres, ChampRecherche, GroupeBascule } from "@/components/shared/barre-filtres";
import { CorpsEcran, EnTeteEcran } from "@/components/shared/coque-application";
import { CellulePays } from "@/components/shared/drapeau";
import { EtatVide } from "@/components/shared/etat-vide";
import { PastilleEtat } from "@/components/shared/pastille-etat";
import { CelluleAvecVignette, Tableau, type Colonne } from "@/components/shared/tableau";
import { DateValeur, Nombre } from "@/components/shared/valeur";
import { formatEntier } from "@/lib/format";
import { useMarchands } from "../hooks/use-marchands";
import { useMarchandsStore, type FiltreStatut } from "../store";
import type { Marchand } from "../types";
import { GENRE_STATUT, LIBELLE_STATUT } from "./libelles";
import { RechercheLegale } from "./recherche-legale";

/*
 * Liste des marchands. Releve dans BCP/Marchand/liste des marchand.png.
 */

const FILTRES: Array<{ valeur: FiltreStatut; libelle: string }> = [
  { valeur: "tous", libelle: "Tous" },
  { valeur: "en-examen", libelle: "En examen" },
  { valeur: "approuve", libelle: "Approuvés" },
  { valeur: "refuse", libelle: "Refusés" },
  { valeur: "suspendu", libelle: "Suspendus" },
];

export function EcranListeMarchands() {
  const { data, isPending, error, refetch } = useMarchands();

  const recherche = useMarchandsStore((e) => e.rechercheNom);
  const definirRecherche = useMarchandsStore((e) => e.definirRechercheNom);
  const filtre = useMarchandsStore((e) => e.filtreStatut);
  const definirFiltre = useMarchandsStore((e) => e.definirFiltreStatut);

  const lignes = useMemo(() => {
    if (!data) return undefined;
    const terme = recherche.trim().toLowerCase();
    return data.filter((m) => {
      if (filtre !== "tous" && m.statut !== filtre) return false;
      if (!terme) return true;
      return m.nom.toLowerCase().includes(terme);
    });
  }, [data, recherche, filtre]);

  /* Les decomptes des pastilles de filtre viennent de la liste complete, pas
     de la liste filtree : sinon chaque filtre afficherait son propre total. */
  const decomptes = useMemo(() => {
    if (!data) return undefined;
    return FILTRES.map((f) => ({
      ...f,
      nombre:
        f.valeur === "tous"
          ? data.length
          : data.filter((m) => m.statut === f.valeur).length,
    }));
  }, [data]);

  const colonnes: Colonne<Marchand>[] = [
    {
      cle: "nom",
      entete: "Marchand",
      largeur: "24%",
      squelette: "65%",
      cellule: (m) => (
        <Link
          to={`/marchand/liste/${m.id}`}
          className="rounded-sm hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <CelluleAvecVignette urlVignette={m.logoUrl} libelle={m.nom} />
        </Link>
      ),
    },
    {
      cle: "pays",
      entete: "Pays",
      largeur: "16%",
      squelette: "55%",
      cellule: (m) => <CellulePays code={m.pays} nom={m.nomPays} />,
    },
    {
      cle: "statut",
      entete: "Statut du dossier",
      largeur: "17%",
      squelette: "60%",
      cellule: (m) => (
        <PastilleEtat genre={GENRE_STATUT[m.statut]} libelle={LIBELLE_STATUT[m.statut]} />
      ),
    },
    {
      cle: "inscription",
      entete: "Inscription",
      largeur: "17%",
      squelette: "70%",
      cellule: (m) => <DateValeur valeur={m.inscription} />,
    },
    {
      cle: "applications",
      entete: "Applications",
      largeur: "13%",
      alignement: "droite",
      squelette: "35%",
      cellule: (m) => <Nombre valeur={m.nombreApplications} libelleZero="Aucune" />,
    },
    {
      cle: "actions",
      entete: "",
      largeur: "13%",
      squelette: "60%",
      cellule: (m) => (
        <span className="flex justify-end">
          <Link
            to={`/marchand/liste/${m.id}`}
            className="rounded-sm text-corps font-medium text-warning-text hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            Voir la fiche
          </Link>
        </span>
      ),
    },
  ];

  return (
    <CorpsEcran>
      <EnTeteEcran
        titre="Listes marchands"
        description="Le point d'entrée de tout ce qui concerne la clientèle. Un marchand non validé ne peut rien encaisser."
      />

      <RechercheLegale />

      <BarreFiltres
        recherche={
          <ChampRecherche
            libelle="Rechercher un marchand par nom"
            indication="Nom de l'entreprise"
            valeur={recherche}
            onChangement={definirRecherche}
          />
        }
        bascule={
          <GroupeBascule
            libelleGroupe="Filtrer par statut de dossier"
            valeur={filtre}
            onChangement={definirFiltre}
            options={decomptes ?? FILTRES}
          />
        }
      />

      <Tableau
        titre={
          lignes === undefined
            ? undefined
            : `${formatEntier(lignes.length)} ${lignes.length === 1 ? "marchand" : "marchands"}`
        }
        colonnes={colonnes}
        lignes={lignes}
        cleLigne={(m) => m.id}
        chargement={isPending}
        erreur={error}
        onReessayer={() => refetch()}
        lignesSquelette={10}
        etatVide={
          recherche.trim() || filtre !== "tous" ? (
            <EtatVide
              raison="aucun-resultat"
              titre="Aucun marchand ne correspond"
              description="Aucun marchand ne correspond à la recherche et au filtre actifs. Videz-les pour revoir la liste complète."
            />
          ) : (
            <EtatVide
              raison="aucune-donnee"
              titre="Aucun marchand inscrit"
              description="Aucune entreprise n'est encore inscrite sur la plateforme. Rien ne peut être encaissé tant qu'aucun dossier n'est approuvé."
              action={
                <Button type="button" asChild>
                  <Link to="/marchand/dossiers">Ouvrir les dossiers</Link>
                </Button>
              }
            />
          )
        }
      />
    </CorpsEcran>
  );
}
