import { useMemo } from "react";
import { Bandeau } from "@/components/shared/bandeau";
import { BarreFiltres, ChampRecherche, GroupeBascule } from "@/components/shared/barre-filtres";
import { CorpsEcran, EnTeteEcran } from "@/components/shared/coque-application";
import { EtatVide } from "@/components/shared/etat-vide";
import { PastilleEtat } from "@/components/shared/pastille-etat";
import { CelluleAvecVignette, Tableau, type Colonne } from "@/components/shared/tableau";
import { DateValeur, Texte } from "@/components/shared/valeur";
import { formatEntier } from "@/lib/format";
import { useRoutes } from "../hooks/use-aiguillage";
import { useAiguillage } from "../store";
import type { Route } from "../types";

/*
 * Tables de routage. Releve dans BCP/Tables de routage.png.
 *
 * Chaque ligne decide par ou passe l'argent reellement.
 */

const LIBELLE_SENS = {
  encaissement: "Encaissement",
  decaissement: "Décaissement",
} as const;

export function EcranRoutage() {
  const { data, isPending, error, refetch } = useRoutes();

  const recherche = useAiguillage((e) => e.rechercheRoutes);
  const definirRecherche = useAiguillage((e) => e.definirRechercheRoutes);
  const filtre = useAiguillage((e) => e.filtreSens);
  const definirFiltre = useAiguillage((e) => e.definirFiltreSens);

  const lignes = useMemo(() => {
    if (!data) return undefined;
    const terme = recherche.trim().toLowerCase();
    return data.filter((r) => {
      if (filtre !== "tous" && r.sens !== filtre) return false;
      if (!terme) return true;
      return (
        r.destination.toLowerCase().includes(terme) ||
        r.fournisseur.toLowerCase().includes(terme)
      );
    });
  }, [data, recherche, filtre]);

  /* Une route sans repli fait qu'un echec est definitif. Le compte de ces
     routes est l'information la plus utile du bandeau, il se calcule sur la
     donnee plutot que d'etre ecrit en dur. */
  const sansRepli = data?.filter((r) => r.acheminement === null).length;

  const colonnes: Colonne<Route>[] = [
    {
      cle: "destination",
      entete: "Destination",
      largeur: "24%",
      squelette: "65%",
      cellule: (r) => (
        <CelluleAvecVignette urlVignette={r.logoUrl} libelle={r.destination} />
      ),
    },
    {
      cle: "sens",
      entete: "Sens",
      largeur: "16%",
      squelette: "75%",
      cellule: (r) => (
        <PastilleEtat
          genre={r.sens === "encaissement" ? "succes" : "attente"}
          libelle={LIBELLE_SENS[r.sens]}
        />
      ),
    },
    {
      cle: "fournisseur",
      entete: "Fournisseur",
      largeur: "20%",
      squelette: "70%",
      cellule: (r) => <Texte valeur={r.fournisseur} />,
    },
    {
      cle: "acheminement",
      entete: "Acheminement de repli",
      largeur: "22%",
      squelette: "60%",
      cellule: (r) =>
        /* Pas de repli n'est pas une valeur inconnue : c'est un fait, et il
           a une consequence que le tiret seul ne dirait pas. */
        r.acheminement === null ? (
          <span className="text-fg-muted">
            <span aria-hidden="true">Aucun repli</span>
            <span className="sr-only">
              Aucun acheminement de repli, tout échec est définitif
            </span>
          </span>
        ) : (
          <Texte valeur={r.acheminement} />
        ),
    },
    {
      cle: "vigueur",
      entete: "En vigueur depuis",
      largeur: "18%",
      squelette: "70%",
      cellule: (r) => <DateValeur valeur={r.enVigueurDepuis} />,
    },
  ];

  return (
    <CorpsEcran>
      <EnTeteEcran
        titre="Tables de routage"
        description="Chaque ligne décide par où passe l'argent réellement."
      />

      <Bandeau
        genre="attente"
        titre="Ces routes viennent de capacités techniques, pas d'accords commerciaux"
        description={
          sansRepli === undefined
            ? "Elles sont posées à partir de ce que les connecteurs savent faire. Personne n'a vérifié quels opérateurs sont réellement conventionnés. Revoyez-les avant toute mise en service."
            : `Elles sont posées à partir de ce que les connecteurs savent faire, sans vérifier quels opérateurs sont réellement conventionnés. ${formatEntier(sansRepli)} ${sansRepli === 1 ? "route n'a" : "routes n'ont"} aucun repli : tout échec y est définitif.`
        }
      />

      <Tableau
        outils={
          <BarreFiltres
            recherche={
              <ChampRecherche
                libelle="Rechercher une route"
                indication="Destination, fournisseur"
                valeur={recherche}
                onChangement={definirRecherche}
              />
            }
            bascule={
              <GroupeBascule
                libelleGroupe="Filtrer les routes par sens"
                valeur={filtre}
                onChangement={definirFiltre}
                options={[
                  { valeur: "tous", libelle: "Tous les sens" },
                  { valeur: "encaissement", libelle: "Encaissement" },
                  { valeur: "decaissement", libelle: "Décaissement" },
                ]}
              />
            }
          />
        }
        titre={
          lignes === undefined
            ? undefined
            : `${formatEntier(lignes.length)} ${lignes.length === 1 ? "route active" : "routes actives"}`
        }
        colonnes={colonnes}
        lignes={lignes}
        cleLigne={(r) => r.id}
        chargement={isPending}
        erreur={error}
        onReessayer={() => refetch()}
        lignesSquelette={10}
        etatVide={
          recherche.trim() || filtre !== "tous" ? (
            <EtatVide
              raison="aucun-resultat"
              titre="Aucune route ne correspond"
              description="Aucune route ne correspond à la recherche et au filtre actifs. Videz-les pour revoir la table complète."
            />
          ) : (
            <EtatVide
              raison="aucune-donnee"
              titre="Aucune route active"
              description="Aucun paiement ne peut aboutir tant qu'aucune route n'est ouverte. Ouvrez une destination depuis la carte de couverture."
            />
          )
        }
      />
    </CorpsEcran>
  );
}
