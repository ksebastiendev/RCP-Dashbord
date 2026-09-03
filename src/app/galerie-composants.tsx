import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionLigne, ActionRetrait, GroupeActions } from "@/components/shared/actions-ligne";
import { Bandeau, BandeauCompact } from "@/components/shared/bandeau";
import { BarreFiltres, ChampRecherche, GroupeBascule } from "@/components/shared/barre-filtres";
import { Carte } from "@/components/shared/carte";
import { CartesRadio, ChampFormulaire } from "@/components/shared/champ-formulaire";
import {
  CLASSES_CONTROLE,
  CLASSES_CONTROLE_MONTANT,
} from "@/components/shared/classes-controle";
import { CorpsEcran, EnTeteEcran } from "@/components/shared/coque-application";
import { EtatVide } from "@/components/shared/etat-vide";
import { EtatErreur } from "@/components/shared/etat-erreur";
import { Modale, ModaleConfirmation, BoutonAnnuler } from "@/components/shared/modale";
import { Pagination } from "@/components/shared/pagination";
import { PastilleEtat } from "@/components/shared/pastille-etat";
import { CelluleAvecVignette, Tableau, type Colonne } from "@/components/shared/tableau";
import { Montant, Nombre, Texte } from "@/components/shared/valeur";
import { ErreurApi } from "@/lib/erreurs";
import { TRAIT_ICONE } from "@/lib/icones";
import type { CodeDevise, Incertain } from "@/lib/format";

/*
 * Galerie de verification des composants partages.
 *
 * Echafaudage de developpement, pas un ecran du produit : elle sert a
 * eprouver chaque etat sans attendre qu'une section soit integree. A retirer
 * quand toutes les sections sont livrees.
 */

type Ligne = {
  id: string;
  destination: string;
  sens: string;
  minimum: Incertain<number>;
  maximum: Incertain<number>;
  devise: Incertain<CodeDevise>;
  champExige: Incertain<string>;
};

/* Les trois cas d'absence sont representes exprès : valeur connue,
   valeur sans objet, valeur inconnue. */
const LIGNES: Ligne[] = [
  { id: "1", destination: "MTN MoMo", sens: "Décaissement", minimum: 50, maximum: undefined, devise: "XOF", champExige: null, },
  { id: "2", destination: "Moov Money", sens: "Encaissement", minimum: 0, maximum: 500_000, devise: "XOF", champExige: "Pièce d'identité" },
  { id: "3", destination: "Orange Money", sens: "Décaissement", minimum: null, maximum: null, devise: "XOF", champExige: undefined },
  { id: "4", destination: "M-Pesa", sens: "Encaissement", minimum: 1_000, maximum: 2_500_000, devise: "GHS", champExige: null },
];

const COLONNES: Colonne<Ligne>[] = [
  {
    cle: "destination",
    entete: "Destination",
    largeur: "22%",
    squelette: "60%",
    cellule: (l) => <CelluleAvecVignette urlVignette={null} libelle={l.destination} />,
  },
  {
    cle: "sens",
    entete: "Sens",
    largeur: "16%",
    squelette: "70%",
    cellule: (l) => (
      <PastilleEtat
        genre={l.sens === "Encaissement" ? "succes" : "attente"}
        libelle={l.sens}
      />
    ),
  },
  {
    cle: "minimum",
    entete: "Minimum",
    largeur: "16%",
    alignement: "droite",
    squelette: "60%",
    cellule: (l) => <Montant valeur={l.minimum} devise={l.devise} />,
  },
  {
    cle: "maximum",
    entete: "Maximum",
    largeur: "16%",
    alignement: "droite",
    squelette: "60%",
    cellule: (l) => <Montant valeur={l.maximum} devise={l.devise} />,
  },
  {
    cle: "champ",
    entete: "Champ exigé",
    largeur: "14%",
    squelette: "50%",
    cellule: (l) => <Texte valeur={l.champExige} />,
  },
  {
    cle: "actions",
    entete: "",
    largeur: "18%",
    squelette: "80%",
    cellule: () => (
      <GroupeActions>
        <ActionLigne libelle="Corriger" onClick={() => {}} />
        <ActionRetrait onClick={() => {}} />
      </GroupeActions>
    ),
  },
];

export function GalerieComposants() {
  const [filtre, setFiltre] = useState<"tout" | "inconnu">("tout");
  const [recherche, setRecherche] = useState("");
  const [page, setPage] = useState(1);
  const [taillePage, setTaillePage] = useState(20);
  const [mode, setMode] = useState<"demonstration" | "reel" | null>(null);
  const [modaleOuverte, setModaleOuverte] = useState(false);
  const [confirmationOuverte, setConfirmationOuverte] = useState(false);

  return (
    <CorpsEcran>
      <EnTeteEcran
        titre="Galerie des composants"
        description="Échafaudage de vérification des composants partagés. Chaque état est rendu ici pour être éprouvé avant l'intégration des sections."
        action={
          <Button type="button" onClick={() => setModaleOuverte(true)}>
            <Plus className="size-4" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
            Ouvrir la modale
          </Button>
        }
      />

      <Section titre="Bandeaux">
        <Bandeau
          genre="succes"
          titre="Aucun point bloquant"
          description="Constaté automatiquement à partir de l'état réel de la plateforme."
        />
        <Bandeau
          genre="attente"
          titre="Un plafond inconnu n'est pas un plafond absent"
          description="Tant qu'aucun fournisseur n'est branché, chaque dossier demande une décision humaine explicite, motif écrit à l'appui."
        />
        <BandeauCompact
          genre="danger"
          message="Faso Énergie et Kinshasa Stream échouent en série : leur serveur ne répond plus."
        />
      </Section>

      <Section titre="Pastilles d'état">
        <div className="flex flex-wrap items-center gap-3">
          <PastilleEtat genre="succes" libelle="Validé" />
          <PastilleEtat genre="danger" libelle="Rejeté" />
          <PastilleEtat genre="attente" libelle="En examen" />
          <PastilleEtat genre="neutre" libelle="Plafond inconnu" />
        </div>
      </Section>

      <Section titre="Barre de filtres">
        <BarreFiltres
          recherche={
            <ChampRecherche
              libelle="Rechercher une destination"
              indication="Opérateur, pays, anciens noms"
              valeur={recherche}
              onChangement={setRecherche}
            />
          }
          bascule={
            <GroupeBascule
              libelleGroupe="Filtrer les bornes"
              valeur={filtre}
              onChangement={setFiltre}
              options={[
                { valeur: "tout", libelle: "Tout" },
                { valeur: "inconnu", libelle: "Plafond inconnu", nombre: 43 },
              ]}
            />
          }
        />
      </Section>

      <Section titre="Tableau, état plein et pagination">
        <Tableau
          titre="4 Bornes"
          colonnes={COLONNES}
          lignes={LIGNES}
          cleLigne={(l) => l.id}
          pied={
            <Pagination
              page={page}
              taillePage={taillePage}
              total={62}
              onChangementPage={setPage}
              onChangementTaille={(t) => {
                setTaillePage(t);
                setPage(1);
              }}
            />
          }
        />
      </Section>

      <Section titre="Tableau, état de chargement">
        <Tableau
          titre=""
          colonnes={COLONNES}
          lignes={undefined}
          cleLigne={(l) => l.id}
          chargement
          lignesSquelette={4}
        />
      </Section>

      <Section titre="Tableau, état vide">
        <Tableau
          titre="0 Borne"
          colonnes={COLONNES}
          lignes={[]}
          cleLigne={(l) => l.id}
          etatVide={
            <EtatVide
              raison="aucune-donnee"
              titre="Aucune borne posée"
              description="Tant qu'aucune borne n'est posée, les paiements sont refusés au-delà du plafond par défaut."
              action={<Button type="button">Poser une borne</Button>}
            />
          }
        />
      </Section>

      <Section titre="Tableau, état d'erreur">
        <Tableau
          titre="Bornes"
          colonnes={COLONNES}
          lignes={undefined}
          cleLigne={(l) => l.id}
          erreur={new ErreurApi("reseau", "La plateforme est injoignable. Vérifiez votre connexion.")}
          onReessayer={() => {}}
        />
      </Section>

      <Section titre="Erreur et accès refusé, composant unique">
        <Carte>
          <EtatErreur
            erreur={new ErreurApi("droits", "Vous n'avez pas les droits nécessaires pour consulter cet écran.", 403)}
          />
        </Carte>
      </Section>

      <Section titre="Champs de formulaire">
        <Carte className="p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <ChampFormulaire etiquette="Nom de l'application" requis>
              {(attributs) => (
                <input
                  {...attributs}
                  type="text"
                  placeholder="Site e-commerce"
                  className={CLASSES_CONTROLE}
                />
              )}
            </ChampFormulaire>

            <ChampFormulaire
              etiquette="Minimum"
              requis
              aide="Exprimé dans la devise du portefeuille."
            >
              {(attributs) => (
                <input
                  {...attributs}
                  type="text"
                  inputMode="numeric"
                  placeholder="1 000"
                  className={CLASSES_CONTROLE_MONTANT}
                />
              )}
            </ChampFormulaire>

            <ChampFormulaire
              etiquette="Adresse"
              requis
              erreur="L'adresse doit commencer par https."
            >
              {(attributs) => (
                <input
                  {...attributs}
                  type="url"
                  defaultValue="http://marchand.exemple/webhooks"
                  className={CLASSES_CONTROLE}
                />
              )}
            </ChampFormulaire>

            <ChampFormulaire
              etiquette="Secret partagé"
              aide="Ne sera plus affiché après l'enregistrement."
            >
              {(attributs) => (
                <input {...attributs} type="password" className={CLASSES_CONTROLE} />
              )}
            </ChampFormulaire>
          </div>

          <div className="mt-8">
            <CartesRadio
              libelleGroupe="Mode"
              valeur={mode}
              onChangement={setMode}
              options={[
                {
                  valeur: "demonstration",
                  titre: "Démonstration",
                  description: "Argent fictif. Aucun paiement réel n'est encaissé.",
                },
                {
                  valeur: "reel",
                  titre: "Réel",
                  description: "Argent réel. Chaque paiement est encaissé et reversé pour de vrai.",
                },
              ]}
            />
          </div>
        </Carte>
      </Section>

      <Section titre="Valeurs alignées">
        <Carte className="p-8">
          <dl className="grid max-w-md gap-3">
            <LigneValeur etiquette="Montant connu">
              <Montant valeur={1_250_000} devise="XOF" />
            </LigneValeur>
            <LigneValeur etiquette="Montant nul">
              <Montant valeur={0} devise="XOF" />
            </LigneValeur>
            <LigneValeur etiquette="Montant sans objet">
              <Montant valeur={null} devise="XOF" />
            </LigneValeur>
            <LigneValeur etiquette="Montant inconnu">
              <Montant valeur={undefined} devise="XOF" />
            </LigneValeur>
            <LigneValeur etiquette="Nombre">
              <Nombre valeur={1248} />
            </LigneValeur>
          </dl>
        </Carte>
      </Section>

      <Section titre="Actions irréversibles">
        <Button
          type="button"
          variant="outline"
          onClick={() => setConfirmationOuverte(true)}
        >
          Ouvrir la confirmation de retrait
        </Button>
      </Section>

      <Modale
        ouverte={modaleOuverte}
        onChangementOuverture={setModaleOuverte}
        titre="Renseigner un plafond"
        sousTitre="Bizao Wallet · Bénin · Décaissement"
        dispositionPied="barre"
        pied={
          <>
            <ActionLigne libelle="Marquer inconnu" onClick={() => {}} />
            <span className="ml-auto flex items-center gap-3">
              <BoutonAnnuler />
              <Button type="button">Enregistrer le plafond</Button>
            </span>
          </>
        }
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <ChampFormulaire etiquette="Minimum (XOF)">
            {(attributs) => (
              <input
                {...attributs}
                type="text"
                inputMode="numeric"
                defaultValue="1000"
                className={CLASSES_CONTROLE_MONTANT}
              />
            )}
          </ChampFormulaire>
          <ChampFormulaire etiquette="Maximum (XOF)">
            {(attributs) => (
              <input
                {...attributs}
                type="text"
                inputMode="numeric"
                defaultValue="500000"
                className={CLASSES_CONTROLE_MONTANT}
              />
            )}
          </ChampFormulaire>
        </div>
      </Modale>

      <ModaleConfirmation
        ouverte={confirmationOuverte}
        onChangementOuverture={setConfirmationOuverte}
        titre="Retirer la borne MTN MoMo ?"
        consequences="Les décaissements vers MTN MoMo repasseront au plafond par défaut de la plateforme. Les paiements au-delà de ce plafond seront refusés sans message explicite au marchand."
        avertissement="La borne et son historique de modifications sont supprimés. Il faudra la reposer à la main."
        libelleAction="Retirer la borne"
        onConfirmer={() => setConfirmationOuverte(false)}
      />
    </CorpsEcran>
  );
}

function Section({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold tracking-wide text-fg-muted uppercase">
        {titre}
      </h2>
      {children}
    </section>
  );
}

function LigneValeur({
  etiquette,
  children,
}: {
  etiquette: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-8 border-b border-border pb-2">
      <dt className="text-sm text-fg-secondary">{etiquette}</dt>
      <dd className="w-40 text-[15px] text-fg-primary">{children}</dd>
    </div>
  );
}
