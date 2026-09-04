import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionLigne, GroupeActions } from "@/components/shared/actions-ligne";
import { Bandeau } from "@/components/shared/bandeau";
import {
  BarreFiltres,
  ChampRecherche,
  GroupeBascule,
} from "@/components/shared/barre-filtres";
import { EtatVide } from "@/components/shared/etat-vide";
import { PastilleEtat } from "@/components/shared/pastille-etat";
import { CelluleAvecVignette, Tableau, type Colonne } from "@/components/shared/tableau";
import { Nombre, Texte } from "@/components/shared/valeur";
import { TRAIT_ICONE } from "@/lib/icones";
import { useFournisseurs } from "../hooks/use-referentiels";
import { useReferentiels } from "../store";
import type { Fournisseur } from "../types";
import { GabaritListe } from "./gabarit-liste";
import { ModaleDeclarerFournisseur } from "./modales";

/*
 * Fournisseurs. Releve dans BCP/Referentiels/Fournisseurs.png.
 */

const LIBELLE_TYPE = {
  direct: "Direct",
  agregateur: "Agrégateur",
} as const;

export function EcranFournisseurs() {
  const { data, isPending, error, refetch } = useFournisseurs();

  const recherche = useReferentiels((e) => e.rechercheFournisseurs);
  const definirRecherche = useReferentiels((e) => e.definirRecherche);
  const filtreType = useReferentiels((e) => e.filtreTypeFournisseur);
  const modale = useReferentiels((e) => e.modale);
  const ouvrirModale = useReferentiels((e) => e.ouvrirModale);
  const fermerModale = useReferentiels((e) => e.fermerModale);
  const definirFiltreType = useReferentiels((e) => e.definirFiltreTypeFournisseur);

  /* Le filtrage porte sur la donnee du cache, il ne la copie pas dans le
     store : le store ne garde que le terme saisi. */
  const lignes = useMemo(() => {
    if (!data) return undefined;
    const terme = recherche.trim().toLowerCase();
    return data.filter((f) => {
      if (filtreType !== "tous" && f.type !== filtreType) return false;
      if (!terme) return true;
      return (
        f.nom.toLowerCase().includes(terme) ||
        f.raccordement.toLowerCase().includes(terme)
      );
    });
  }, [data, recherche, filtreType]);

  const colonnes: Colonne<Fournisseur>[] = [
    {
      cle: "nom",
      entete: "Fournisseur",
      largeur: "26%",
      squelette: "65%",
      cellule: (f) => (
        <Link
          to={`/referentiel/fournisseurs/${f.id}`}
          className="rounded-sm hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <CelluleAvecVignette urlVignette={f.logoUrl} libelle={f.nom} />
        </Link>
      ),
    },
    {
      cle: "type",
      entete: "Type",
      largeur: "16%",
      squelette: "55%",
      cellule: (f) => (
        <PastilleEtat
          genre={f.type === "direct" ? "succes" : "attente"}
          libelle={LIBELLE_TYPE[f.type]}
        />
      ),
    },
    {
      cle: "raccordement",
      entete: "Raccordement",
      largeur: "20%",
      squelette: "60%",
      cellule: (f) => <Texte valeur={f.raccordement} />,
    },
    {
      cle: "routes",
      entete: "Routes actives",
      largeur: "18%",
      squelette: "40%",
      cellule: (f) => (
        /* Zero route active se lit "Aucune", comme dans la maquette. Ce
           n'est ni une valeur absente ni une valeur inconnue. */
        <Nombre valeur={f.routesActives} libelleZero="Aucune" className="text-left" />
      ),
    },
    {
      cle: "actions",
      entete: "",
      largeur: "20%",
      squelette: "70%",
      cellule: (f) => (
        <GroupeActions>
          <ActionLigne
            libelle="Modifier"
            onClick={() => {}}
            desactive
            motif="Le formulaire de modification arrive avec le lot des modales."
          />
          <ActionLigne
            libelle="Retirer"
            ton="danger"
            onClick={() => {}}
            /* Un fournisseur qui porte des routes actives ne se retire pas :
               le retrait couperait les paiements qui passent par lui. */
            desactive
            motif={
              f.routesActives > 0
                ? "Ce fournisseur porte des routes actives. Fermez les routes avant de le retirer."
                : "La confirmation de retrait arrive avec le lot des modales."
            }
          />
        </GroupeActions>
      ),
    },
  ];

  return (
    <GabaritListe
      titre="Fournisseurs"
      description="Les intermédiaires par lesquels la plateforme joint les portefeuilles. Un agrégateur en sert beaucoup par une intégration unique, un connecteur direct un seul."
      action={
        <Button type="button" onClick={() => ouvrirModale({ type: "declarer-fournisseur" })}>
          <Plus className="size-4" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
          Déclarer un fournisseur
        </Button>
      }
      bandeau={
        <Bandeau
          genre="attente"
          titre="Ces routes viennent de capacités techniques, pas d'accords commerciaux"
          description="Elles sont posées à partir de ce que les connecteurs savent faire. Personne n'a vérifié quels opérateurs sont réellement conventionnés, ni à quelles conditions. Revoyez-les avant toute mise en service."
        />
      }
    >
      <Tableau
        outils={
          <BarreFiltres
            recherche={
              <ChampRecherche
                libelle="Rechercher un fournisseur"
                indication="Nom du fournisseur, raccordement"
                valeur={recherche}
                onChangement={(terme) => definirRecherche("rechercheFournisseurs", terme)}
              />
            }
            bascule={
              <GroupeBascule
                libelleGroupe="Filtrer par type de fournisseur"
                valeur={filtreType}
                onChangement={definirFiltreType}
                options={[
                  { valeur: "tous", libelle: "Tous" },
                  { valeur: "direct", libelle: "Direct" },
                  { valeur: "agregateur", libelle: "Agrégateur" },
                ]}
              />
            }
          />
        }
        titre={
          lignes === undefined
            ? undefined
            : `${lignes.length} ${lignes.length === 1 ? "fournisseur" : "fournisseurs"}`
        }
        sousTitre="Les identifiants se saisissent sur le serveur, ils ne se renseignent pas ici."
        colonnes={colonnes}
        lignes={lignes}
        cleLigne={(f) => f.id}
        chargement={isPending}
        erreur={error}
        onReessayer={() => refetch()}
        lignesSquelette={8}
        etatVide={
          recherche.trim() || filtreType !== "tous" ? (
            <EtatVide
              raison="aucun-resultat"
              titre="Aucun fournisseur ne correspond"
              description="Aucun fournisseur ne correspond à la recherche et au filtre actifs. Videz-les pour revoir la liste complète."
            />
          ) : (
            <EtatVide
              raison="aucune-donnee"
              titre="Aucun fournisseur déclaré"
              description="Sans fournisseur déclaré, aucune route ne peut être ouverte et aucun paiement ne peut aboutir."
              action={
                <Button
                  type="button"
                  onClick={() => ouvrirModale({ type: "declarer-fournisseur" })}
                >
                  Déclarer un fournisseur
                </Button>
              }
            />
          )
        }
      />

      <ModaleDeclarerFournisseur
        ouverte={modale.type === "declarer-fournisseur"}
        onFermer={fermerModale}
      />
    </GabaritListe>
  );
}
