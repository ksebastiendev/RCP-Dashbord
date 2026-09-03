import { ActionLigne, GroupeActions } from "@/components/shared/actions-ligne";
import { CarteIndicateur } from "@/components/shared/carte-indicateur";
import { CellulePays } from "@/components/shared/drapeau";
import { EtatVide } from "@/components/shared/etat-vide";
import { Tableau, type Colonne } from "@/components/shared/tableau";
import { Nombre } from "@/components/shared/valeur";
import { formatEntier } from "@/lib/format";
import {
  useDevises,
  useIndicateursBornes,
  usePays,
} from "../hooks/use-referentiels";
import type { Devise, PaysServi } from "../types";
import { GabaritListe, RangeeIndicateurs } from "./gabarit-liste";

/*
 * Devises et pays. Releve dans BCP/Referentiels/Montants autorisés-3.png.
 *
 * Deux tableaux cote a cote : les devises et leur nombre de decimales, les
 * pays et leur devise d'encaissement.
 */
export function EcranDevises() {
  const devises = useDevises();
  const pays = usePays();
  const indicateurs = useIndicateursBornes();

  const colonnesDevises: Colonne<Devise>[] = [
    {
      cle: "code",
      entete: "Devise",
      largeur: "24%",
      squelette: "60%",
      /* Le code seul, comme dans la maquette. Le nom en clair tenait sur une
         seconde ligne mais elargissait la colonne au point que les deux
         tableaux ne tenaient plus cote a cote en 1440. */
      cellule: (d) => (
        <span className="tabular font-medium text-fg-primary" title={d.nom}>
          {d.code}
        </span>
      ),
    },
    {
      cle: "decimales",
      entete: "Décimales",
      largeur: "17%",
      alignement: "droite",
      squelette: "40%",
      cellule: (d) => <Nombre valeur={d.decimales} />,
    },
    {
      cle: "pays",
      entete: "Pays",
      largeur: "13%",
      alignement: "droite",
      squelette: "40%",
      cellule: (d) => <Nombre valeur={d.nombrePays} libelleZero="Aucun" />,
    },
    {
      cle: "actions",
      entete: "",
      largeur: "46%",
      squelette: "70%",
      cellule: () => (
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
            desactive
            motif="Le retrait d'une devise arrive avec le lot des modales."
          />
        </GroupeActions>
      ),
    },
  ];

  const colonnesPays: Colonne<PaysServi>[] = [
    {
      cle: "pays",
      entete: "Pays",
      largeur: "34%",
      squelette: "60%",
      cellule: (p) => <CellulePays code={p.code} nom={p.nom} />,
    },
    {
      cle: "devise",
      entete: "Encaissement",
      largeur: "24%",
      squelette: "50%",
      /* Pas de drapeau ici : une devise n'est pas un pays. XOF couvre huit
         pays, y accoler le drapeau du pays de la ligne laisserait croire a
         une devise nationale. */
      cellule: (p) => (
        <span className="tabular font-medium text-fg-primary">
          {p.deviseEncaissement}
        </span>
      ),
    },
    {
      cle: "indicatif",
      entete: "Indicatif",
      largeur: "18%",
      alignement: "droite",
      squelette: "50%",
      cellule: (p) => (
        <span className="tabular whitespace-nowrap">
          +{formatEntier(p.indicatif)}
        </span>
      ),
    },
    {
      cle: "actions",
      entete: "",
      largeur: "24%",
      squelette: "70%",
      cellule: () => (
        <GroupeActions>
          <ActionLigne
            libelle="Modifier"
            onClick={() => {}}
            desactive
            motif="Le formulaire de modification arrive avec le lot des modales."
          />
        </GroupeActions>
      ),
    },
  ];

  return (
    <GabaritListe
      titre="Devises et pays"
      description="Le nombre de décimales commande la lecture de tous les montants de la plateforme. Un pays ouvert n'exige encore rien de particulier."
      indicateurs={
        <RangeeIndicateurs>
          <CarteIndicateur
            etiquette="Devises déclarées"
            valeur={devises.data?.length}
            precision="Chaque montant affiché est formaté selon les décimales de sa devise."
            chargement={devises.isPending}
          />
          <CarteIndicateur
            etiquette="Pays servis"
            valeur={pays.data?.length}
            precision="Pays pour lesquels au moins une présence existe."
            chargement={pays.isPending}
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
      <div className="grid items-start gap-6 xl:grid-cols-2">
        <Tableau
          titre={
            devises.data === undefined
              ? undefined
              : `${formatEntier(devises.data.length)} ${devises.data.length === 1 ? "devise" : "devises"}`
          }
          sousTitre="Le nombre de décimales commande la lecture de tous les montants."
          colonnes={colonnesDevises}
          lignes={devises.data}
          cleLigne={(d) => d.code}
          chargement={devises.isPending}
          erreur={devises.error}
          onReessayer={() => devises.refetch()}
          lignesSquelette={6}
          etatVide={
            <EtatVide
              raison="aucune-donnee"
              titre="Aucune devise déclarée"
              description="Aucun montant ne peut être formaté tant qu'aucune devise n'est déclarée."
            />
          }
        />

        <Tableau
          titre={
            pays.data === undefined
              ? undefined
              : `${formatEntier(pays.data.length)} ${pays.data.length === 1 ? "pays" : "pays"}`
          }
          sousTitre="Un pays ouvert n'exige encore rien de particulier."
          colonnes={colonnesPays}
          lignes={pays.data}
          cleLigne={(p) => p.code}
          chargement={pays.isPending}
          erreur={pays.error}
          onReessayer={() => pays.refetch()}
          lignesSquelette={6}
          etatVide={
            <EtatVide
              raison="aucune-donnee"
              titre="Aucun pays servi"
              description="Aucune présence ne peut être ouverte tant qu'aucun pays n'est déclaré."
            />
          }
        />
      </div>
    </GabaritListe>
  );
}
