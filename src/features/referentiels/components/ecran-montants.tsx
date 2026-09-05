import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ActionLigne,
  ActionRetrait,
  GroupeActions,
} from "@/components/shared/actions-ligne";
import { Bandeau } from "@/components/shared/bandeau";
import {
  BarreFiltres,
  ChampRecherche,
  GroupeBascule,
} from "@/components/shared/barre-filtres";
import { CarteIndicateur } from "@/components/shared/carte-indicateur";
import { GroupeOnglets } from "@/components/shared/groupe-onglets";
import { EtatVide } from "@/components/shared/etat-vide";
import { ModaleConfirmation } from "@/components/shared/modale";
import { PastilleEtat } from "@/components/shared/pastille-etat";
import {
  CelluleAvecVignette,
  Tableau,
  type Colonne,
} from "@/components/shared/tableau";
import { Montant, Texte } from "@/components/shared/valeur";
import { formatEntier, formatMontant } from "@/lib/format";
import { TRAIT_ICONE } from "@/lib/icones";
import {
  useBornes,
  useIndicateursBornes,
  useRetirerBorne,
} from "../hooks/use-referentiels";
import { useReferentiels, type OngletMontants } from "../store";
import type { Borne } from "../types";
import { GabaritListe, RangeeIndicateurs } from "./gabarit-liste";
import { ModaleExigerChamp, ModaleRenseignerPlafond } from "./modales";

/*
 * Montants autorises. Releve dans BCP/Referentiels/Montants autorisés.png.
 *
 * L'ecran a deux onglets dans les maquettes, "Montant autorises" et
 * "Champs exiges". Le tableau du second onglet est coupe hors cadre dans
 * les quatre captures : il n'est pas integre, faute de maquette.
 */

const LIBELLE_SENS = {
  encaissement: "Encaissement",
  decaissement: "Décaissement",
} as const;

export function EcranMontants() {
  const bornes = useBornes();
  const indicateurs = useIndicateursBornes();
  const retirer = useRetirerBorne();

  const recherche = useReferentiels((e) => e.rechercheBornes);
  const definirRecherche = useReferentiels((e) => e.definirRecherche);
  const filtre = useReferentiels((e) => e.filtreBornes);
  const definirFiltre = useReferentiels((e) => e.definirFiltreBornes);
  /* Les deux vues de l'ecran sont deux adresses. Un lien vers les champs
     exiges ouvre les champs exiges, et le bouton de retour ramene aux
     montants plutot que de quitter l'ecran. */
  const { onglet: segment } = useParams();
  const onglet: OngletMontants = segment === "champs" ? "champs" : "montants";
  const modale = useReferentiels((e) => e.modale);
  const ouvrirModale = useReferentiels((e) => e.ouvrirModale);
  const fermerModale = useReferentiels((e) => e.fermerModale);

  const lignes = useMemo(() => {
    if (!bornes.data) return undefined;
    const terme = recherche.trim().toLowerCase();
    return bornes.data.filter((b) => {
      /* Le filtre porte sur ce qui compte reellement : une borne dont le
         plafond est inconnu refuse silencieusement au-dela du plafond par
         defaut, c'est la seule que l'exploitant cherche a isoler. */
      if (filtre === "plafond-inconnu" && b.maximum !== undefined) return false;
      if (!terme) return true;
      return b.destination.toLowerCase().includes(terme);
    });
  }, [bornes.data, recherche, filtre]);

  const colonnes: Colonne<Borne>[] = [
    {
      cle: "destination",
      entete: "Destination",
      largeur: "22%",
      squelette: "60%",
      cellule: (b) => (
        <CelluleAvecVignette urlVignette={b.logoUrl} libelle={b.destination} />
      ),
    },
    {
      cle: "sens",
      entete: "Sens",
      largeur: "15%",
      squelette: "75%",
      cellule: (b) => (
        <PastilleEtat
          genre={b.sens === "encaissement" ? "succes" : "attente"}
          libelle={LIBELLE_SENS[b.sens]}
        />
      ),
    },
    {
      cle: "minimum",
      entete: "Minimum",
      largeur: "14%",
      alignement: "droite",
      squelette: "70%",
      cellule: (b) => <Montant valeur={b.minimum} devise={b.devise} />,
    },
    {
      cle: "maximum",
      entete: "Maximum",
      largeur: "16%",
      alignement: "droite",
      squelette: "80%",
      cellule: (b) =>
        /* Un plafond inconnu n'est pas un plafond absent. La maquette le dit
           en pastille neutre plutot qu'en tiret, et c'est plus juste : le
           mot ecrit nomme l'ignorance au lieu de la laisser deviner. */
        b.maximum === undefined ? (
          <span className="flex justify-end">
            <PastilleEtat genre="neutre" libelle="Plafond inconnu" />
          </span>
        ) : (
          <Montant valeur={b.maximum} devise={b.devise} />
        ),
    },
    {
      cle: "champ",
      entete: "Champ exigé",
      largeur: "15%",
      squelette: "55%",
      cellule: (b) => <Texte valeur={b.champExige} />,
    },
    {
      cle: "actions",
      entete: "",
      largeur: "18%",
      squelette: "80%",
      cellule: (b) => (
        <GroupeActions>
          <ActionLigne
            libelle="Corriger"
            onClick={() =>
              ouvrirModale({
                type: "renseigner-plafond",
                idBorne: b.id,
                destination: `${b.destination} · ${LIBELLE_SENS[b.sens]}`,
                devise: b.devise,
              })
            }
          />
          <ActionRetrait
            onClick={() =>
              ouvrirModale({
                type: "retirer-borne",
                idBorne: b.id,
                destination: b.destination,
              })
            }
          />
        </GroupeActions>
      ),
    },
  ];

  const borneRetiree =
    modale.type === "retirer-borne"
      ? bornes.data?.find((b) => b.id === modale.idBorne)
      : undefined;

  return (
    <GabaritListe
      titre="Montants autorisés et informations demandées"
      description="Appliqués à chaque paiement et publiés aux marchands pour qu'ils construisent leurs formulaires."
      action={
        <Button
          type="button"
          onClick={() =>
            onglet === "montants"
              ? ouvrirModale({
                  type: "renseigner-plafond",
                  idBorne: "",
                  destination: "Nouvelle borne",
                  devise: "XOF",
                })
              : ouvrirModale({ type: "exiger-champ" })
          }
        >
          <Plus
            className="size-4"
            strokeWidth={TRAIT_ICONE}
            aria-hidden="true"
          />
          {onglet === "montants" ? "Poser une borne" : "Exiger un champ"}
        </Button>
      }
      onglets={
        <GroupeOnglets
          libelleGroupe="Vues des montants autorisés"
          onglets={[
            {
              chemin: "/referentiel/montants",
              libelle: "Montants autorisés",
              exact: true,
            },
            {
              chemin: "/referentiel/montants/champs",
              libelle: "Champs exigés",
            },
          ]}
        />
      }
      bandeau={
        <Bandeau
          genre="attente"
          titre="Un plafond inconnu n'est pas un plafond absent"
          description="Une borne sans plafond connu refuse silencieusement les paiements au-delà du plafond par défaut. Tant qu'aucun fournisseur n'a communiqué la valeur, chaque dossier demande une décision humaine explicite, motif écrit à l'appui."
        />
      }
      indicateurs={
        <RangeeIndicateurs>
          <CarteIndicateur
            etiquette="Bornes enregistrées"
            valeur={indicateurs.data?.bornesEnregistrees}
            precision={
              indicateurs.data
                ? `Bornes connues sur ${formatEntier(indicateurs.data.bornesConnuesTotal)} au total.`
                : "Bornes connues sur le total des destinations."
            }
            chargement={indicateurs.isPending}
          />
          <CarteIndicateur
            etiquette="Destinations couvertes"
            valeur={indicateurs.data?.destinationsCouvertes}
            precision="Destinations pour lesquelles au moins une borne est posée."
            chargement={indicateurs.isPending}
          />
          <CarteIndicateur
            etiquette="Plafonds inconnus"
            valeur={indicateurs.data?.plafondsInconnus}
            precision="Ces bornes refusent silencieusement les paiements au-delà du plafond par défaut."
            alerte
            chargement={indicateurs.isPending}
          />
        </RangeeIndicateurs>
      }
    >
      {onglet === "montants" ? (
        <Tableau
          outils={
            <BarreFiltres
              recherche={
                <ChampRecherche
                  libelle="Rechercher une borne"
                  indication="Opérateur, pays, anciens noms"
                  valeur={recherche}
                  onChangement={(terme) =>
                    definirRecherche("rechercheBornes", terme)
                  }
                />
              }
              bascule={
                <GroupeBascule
                  libelleGroupe="Filtrer les bornes"
                  valeur={filtre}
                  onChangement={definirFiltre}
                  options={[
                    { valeur: "tout", libelle: "Tout" },
                    {
                      valeur: "plafond-inconnu",
                      libelle: "Plafond inconnu",
                      nombre: indicateurs.data?.plafondsInconnus,
                    },
                  ]}
                />
              }
            />
          }
          titre={
            lignes === undefined
              ? undefined
              : `${formatEntier(lignes.length)} ${lignes.length === 1 ? "borne" : "bornes"}`
          }
          colonnes={colonnes}
          lignes={lignes}
          cleLigne={(b) => b.id}
          chargement={bornes.isPending}
          erreur={bornes.error}
          onReessayer={() => bornes.refetch()}
          lignesSquelette={10}
          etatVide={
            recherche.trim() || filtre !== "tout" ? (
              <EtatVide
                raison="aucun-resultat"
                titre="Aucune borne ne correspond"
                description="Aucune borne ne correspond à la recherche et au filtre actifs. Videz-les pour revoir la liste complète."
              />
            ) : (
              <EtatVide
                raison="aucune-donnee"
                titre="Aucune borne posée"
                description="Sans borne, chaque destination applique le plafond par défaut de la plateforme et refuse tout paiement au-delà."
                action={
                  <Button
                    type="button"
                    onClick={() =>
                      ouvrirModale({
                        type: "renseigner-plafond",
                        idBorne: "",
                        destination: "Nouvelle borne",
                        devise: "XOF",
                      })
                    }
                  >
                    Poser une borne
                  </Button>
                }
              />
            )
          }
        />
      ) : (
        <OngletChampsExiges />
      )}

      {modale.type === "renseigner-plafond" && (
        <ModaleRenseignerPlafond
          ouverte
          onFermer={fermerModale}
          destination={modale.destination}
          devise={modale.devise}
          onMarquerInconnu={fermerModale}
        />
      )}

      <ModaleExigerChamp
        ouverte={modale.type === "exiger-champ"}
        onFermer={fermerModale}
      />

      {modale.type === "retirer-borne" && borneRetiree && (
        <ModaleConfirmation
          ouverte
          onChangementOuverture={(ouverte) => {
            if (!ouverte) fermerModale();
          }}
          titre={`Retirer la borne ${modale.destination} ?`}
          consequences={
            /* La consequence est chiffree avec le plafond reel de la borne :
               une confirmation qui dit "supprimer l'entite" ne renseigne
               personne sur ce qui va changer pour les marchands. */
            borneRetiree.maximum === undefined
              ? `Les paiements ${LIBELLE_SENS[borneRetiree.sens].toLowerCase()} vers ${modale.destination} repasseront au plafond par défaut de la plateforme. Cette borne n'avait déjà pas de plafond connu, les refus resteront silencieux pour le marchand.`
              : `Les paiements ${LIBELLE_SENS[borneRetiree.sens].toLowerCase()} vers ${modale.destination} ne seront plus limités à ${formatMontant(borneRetiree.maximum, borneRetiree.devise)} mais au plafond par défaut de la plateforme.`
          }
          avertissement="La borne et ses valeurs sont supprimées. Il faudra les ressaisir à la main pour rétablir la limite."
          libelleAction="Retirer la borne"
          enCours={retirer.isPending}
          onConfirmer={() =>
            retirer.mutate(modale.idBorne, { onSuccess: fermerModale })
          }
        />
      )}
    </GabaritListe>
  );
}

/*
 * Onglet "Champs exiges".
 *
 * Les quatre captures qui montrent cet onglet sont coupees juste avant son
 * tableau : ses colonnes ne sont visibles nulle part. Deviner un tableau
 * jamais vu serait pire qu'annoncer qu'il manque.
 */
function OngletChampsExiges() {
  return (
    <EtatVide
      raison="aucune-donnee"
      titre="Vue en cours de préparation"
      description="Les champs qu'une destination exige à la saisie ne se consultent pas encore ici. Les bornes de montant, elles, sont dans l'onglet précédent."
    />
  );
}
