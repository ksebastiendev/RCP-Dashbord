import { Copy, KeyRound, RefreshCw, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carte } from "@/components/shared/carte";
import { EtatVide } from "@/components/shared/etat-vide";
import { PastilleEtat } from "@/components/shared/pastille-etat";
import { Tableau, type Colonne } from "@/components/shared/tableau";
import { CLASSES_CONTROLE_MONTANT } from "@/components/shared/classes-controle";
import { ChampFormulaire } from "@/components/shared/champ-formulaire";
import { DateValeur, Montant, Texte } from "@/components/shared/valeur";
import {
  formatDateHeure,
  formatPourcentage,
  type CodeDevise,
  type Incertain,
} from "@/lib/format";
import { TRAIT_ICONE } from "@/lib/icones";
import { cn } from "@/lib/utils";
import type {
  Application,
  EchelonTarif,
  FicheMarchand,
  Webhook,
} from "../types";
import {
  EXPLICATION_MODE,
  GENRE_MODE,
  GENRE_PIECE,
  LIBELLE_MODE,
  LIBELLE_NIVEAU_TARIF,
  LIBELLE_PIECE,
  ORIGINE_TARIF,
} from "./libelles";

/* --- Onglet Dossier --- */

export function OngletDossier({ fiche }: { fiche: FicheMarchand }) {
  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="flex flex-col gap-6">
        <Carte avecBordure={false} className="overflow-hidden">
          <h2 className="px-6 py-5 text-section font-semibold text-fg-primary">
            Pièces justificatives
          </h2>
          <ul>
            {fiche.pieces.map((piece) => (
              <li
                key={piece.id}
                className="flex items-center justify-between gap-4 border-t border-table-row-separator px-6 py-4"
              >
                <span className="min-w-0 truncate text-corps text-fg-primary">
                  {piece.libelle}
                </span>
                <PastilleEtat
                  genre={GENRE_PIECE[piece.statut]}
                  libelle={LIBELLE_PIECE[piece.statut]}
                />
              </li>
            ))}
          </ul>
        </Carte>

        <Carte avecBordure={false} className="overflow-hidden">
          <h2 className="px-6 py-5 text-section font-semibold text-fg-primary">
            Historique de conformité
          </h2>
          <ul>
            {fiche.historique.map((evenement) => (
              <li
                key={evenement.id}
                className="flex items-center gap-6 border-t border-table-row-separator px-6 py-3"
              >
                <DateValeur
                  valeur={evenement.date}
                  className="w-32 shrink-0 text-mention text-fg-secondary"
                />
                <span className="min-w-0 flex-1 truncate text-corps text-fg-primary">
                  {evenement.evenement}
                </span>
                <span className="shrink-0 text-mention text-fg-muted">
                  {evenement.auteur}
                </span>
              </li>
            ))}
          </ul>
        </Carte>
      </div>

      <Carte avecBordure={false} className="px-6 py-6">
        <h2 className="text-section font-semibold text-fg-primary">Dirigeants</h2>
        <ul className="mt-4 flex flex-col gap-4">
          {fiche.dirigeants.map((dirigeant) => (
            <li key={dirigeant.id}>
              <p className="text-corps font-medium text-fg-primary">
                {dirigeant.nom}
              </p>
              <p className="text-mention text-fg-secondary">{dirigeant.fonction}</p>
            </li>
          ))}
        </ul>

        <dl className="mt-6 flex flex-col gap-4 border-t border-table-row-separator pt-5">
          <div>
            <dt className="text-mention text-fg-secondary">Raison sociale</dt>
            <dd className="mt-0.5 text-corps text-fg-primary">
              <Texte valeur={fiche.raisonSociale} />
            </dd>
          </div>
          <div>
            <dt className="text-mention text-fg-secondary">Inscription</dt>
            <dd className="mt-0.5 text-corps text-fg-primary">
              <DateValeur valeur={fiche.inscription} />
            </dd>
          </div>
        </dl>
      </Carte>
    </div>
  );
}

/* --- Onglet Applications --- */

export function OngletApplications({
  applications,
  onRenouveler,
}: {
  applications: Application[];
  onRenouveler: (application: Application) => void;
}) {
  if (applications.length === 0) {
    return (
      <Carte avecBordure={false}>
        <EtatVide
          raison="aucune-donnee"
          titre="Aucune application"
          description="Ce marchand n'a déclaré aucune application. Sans application, il n'a aucune clé et ne peut envoyer aucun paiement."
          icone={KeyRound}
        />
      </Carte>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {applications.map((application) => (
        <CarteApplication
          key={application.id}
          application={application}
          onRenouveler={() => onRenouveler(application)}
        />
      ))}
    </div>
  );
}

export function CarteApplication({
  application,
  onRenouveler,
}: {
  application: Application;
  onRenouveler: () => void;
}) {
  return (
    <Carte avecBordure={false} className="px-6 py-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-section font-semibold text-fg-primary">
              {application.nom}
            </h3>
            {/* Le mode est porte en permanence : confondre une application de
                demonstration avec une application reelle est la confusion la
                plus couteuse de cet ecran. */}
            <PastilleEtat
              genre={GENRE_MODE[application.mode]}
              libelle={LIBELLE_MODE[application.mode]}
            />
          </div>

          <p className="mt-1 text-mention text-fg-secondary">
            {application.derniereActivite === null ? (
              "Aucune activité à ce jour"
            ) : (
              <>Dernière activité le {formatDateHeure(application.derniereActivite)}</>
            )}
            {" · "}
            {application.taux === undefined ? (
              "tarif inconnu"
            ) : (
              <>
                tarif {formatPourcentage(application.taux, 2)} (
                {ORIGINE_TARIF[application.niveauTarif]})
              </>
            )}
          </p>
        </div>

        <Button type="button" variant="outline" onClick={onRenouveler}>
          <RefreshCw className="size-4" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
          Renouveler la clé
        </Button>
      </div>

      <ClePublique valeur={application.clePublique} />
    </Carte>
  );
}

/*
 * Cle publique.
 *
 * Elle s'affiche en clair : c'est son role, le marchand la publie dans son
 * code. La cle secrete, elle, n'est jamais affichee et n'a pas de champ ici.
 */
function ClePublique({ valeur }: { valeur: string }) {
  return (
    <div className="mt-4 flex items-center gap-4 rounded-md bg-muted px-4 py-3">
      <span className="shrink-0 text-etiquette font-medium tracking-wide text-fg-muted uppercase">
        Clé publique
      </span>
      <code className="min-w-0 flex-1 truncate font-mono text-mention text-fg-primary">
        {valeur}
      </code>
      <button
        type="button"
        onClick={() => navigator.clipboard?.writeText(valeur)}
        className="flex shrink-0 items-center gap-2 rounded-sm text-mention font-medium text-warning-text hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <Copy className="size-4" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
        Copier
        <span className="sr-only"> la clé publique</span>
      </button>
    </div>
  );
}

/* --- Onglet Tarification --- */

export function OngletTarification({ fiche }: { fiche: FicheMarchand }) {
  const echelonApplique = fiche.cascadeTarif.find((e) => e.applique);

  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <Carte avecBordure={false} className="px-6 py-6">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="text-section font-semibold text-fg-primary">Tarif effectif</h2>
          <p className="text-mention text-fg-secondary">
            {echelonApplique
              ? ORIGINE_TARIF[echelonApplique.niveau].replace(/^h/, "H")
              : "Aucun tarif applicable"}
          </p>
        </div>

        <p className="mt-3 flex flex-wrap items-baseline gap-3">
          <span className="tabular text-ecran font-semibold text-fg-primary">
            {formatPourcentage(fiche.tauxEffectif, 2)}
          </span>
          <span className="text-corps text-fg-secondary">
            par transaction · frais à la charge{" "}
            {fiche.fraisALaChargeDe === "client-final" ? "du client final" : "du marchand"}
          </span>
        </p>

        <h3 className="mt-6 text-etiquette font-medium tracking-wide text-fg-muted uppercase">
          Cascade d'héritage
        </h3>
        <ul className="mt-3 flex flex-col gap-2">
          {fiche.cascadeTarif.map((echelon) => (
            <EchelonCascade key={echelon.niveau} echelon={echelon} />
          ))}
        </ul>
      </Carte>

      <SimulateurPrix taux={fiche.tauxEffectif} devise={fiche.devise} />
    </div>
  );
}

function EchelonCascade({ echelon }: { echelon: EchelonTarif }) {
  return (
    <li
      className={cn(
        "flex flex-wrap items-center gap-4 rounded-md border px-4 py-3",
        echelon.applique ? "border-border bg-card" : "border-transparent bg-muted",
      )}
    >
      <span className="w-24 shrink-0 text-etiquette font-medium tracking-wide text-fg-muted uppercase">
        {LIBELLE_NIVEAU_TARIF[echelon.niveau]}
      </span>
      <span
        className={cn(
          "min-w-0 flex-1 truncate text-corps",
          echelon.applique ? "text-fg-primary" : "text-fg-muted",
        )}
      >
        {echelon.libelle}
      </span>
      <span
        className={cn(
          "tabular shrink-0 text-corps font-medium",
          echelon.applique ? "text-fg-primary" : "text-fg-muted",
        )}
      >
        {echelon.taux === undefined ? "non défini" : formatPourcentage(echelon.taux, 2)}
      </span>
      {/* L'echelon applique est signale par un mot, pas seulement par un
          fond plus clair. */}
      <span className="w-20 shrink-0 text-right text-mention">
        {echelon.applique ? (
          <span className="font-medium text-success-fg">appliqué</span>
        ) : (
          <span className="text-fg-muted">ignoré</span>
        )}
      </span>
    </li>
  );
}

/*
 * Simulateur de prix.
 *
 * Il ne fait aucun appel : il applique le taux effectif deja charge. Ce qui
 * compte est qu'il montre les trois montants separement, ce que le marchand
 * facture, ce que la plateforme preleve, ce que le marchand recoit.
 */
function SimulateurPrix({
  taux,
  devise,
}: {
  taux: Incertain<number>;
  devise: CodeDevise;
}) {
  const MONTANT_EXEMPLE = 25_000;

  if (taux === undefined || taux === null) {
    return (
      <Carte avecBordure={false} className="px-6 py-6">
        <h2 className="text-section font-semibold text-fg-primary">Simuler un prix</h2>
        <p className="mt-2 text-mention leading-relaxed text-fg-secondary">
          Aucun tarif n'est applicable à ce marchand. La simulation reprendra
          quand une règle sera renseignée.
        </p>
      </Carte>
    );
  }

  const frais = Math.round((MONTANT_EXEMPLE * taux) / 100);

  return (
    <Carte avecBordure={false} className="px-6 py-6">
      <h2 className="text-section font-semibold text-fg-primary">Simuler un prix</h2>

      <div className="mt-4">
        <ChampFormulaire etiquette={`Montant de la transaction (${devise})`}>
          {(attributs) => (
            <input
              {...attributs}
              type="text"
              inputMode="numeric"
              defaultValue={MONTANT_EXEMPLE}
              readOnly
              className={CLASSES_CONTROLE_MONTANT}
            />
          )}
        </ChampFormulaire>
      </div>

      <dl className="mt-5 flex flex-col gap-3 border-t border-table-row-separator pt-4">
        <LigneSimulation etiquette="Le client paie">
          <Montant valeur={MONTANT_EXEMPLE + frais} devise={devise} />
        </LigneSimulation>
        <LigneSimulation etiquette={`Frais (${formatPourcentage(taux, 2)})`}>
          <Montant valeur={frais} devise={devise} />
        </LigneSimulation>
        <LigneSimulation etiquette="Le marchand reçoit">
          <Montant valeur={MONTANT_EXEMPLE} devise={devise} />
        </LigneSimulation>
      </dl>

      <p className="mt-4 text-mention leading-relaxed text-fg-secondary">
        Simulation indicative, calculée sur le tarif effectif affiché. Elle ne
        tient pas compte des plafonds de la destination.
      </p>
    </Carte>
  );
}

function LigneSimulation({
  etiquette,
  children,
}: {
  etiquette: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-mention text-fg-secondary">{etiquette}</dt>
      <dd className="text-corps font-medium text-fg-primary">{children}</dd>
    </div>
  );
}

/* --- Onglet Webhooks --- */

export function OngletWebhooks({
  fiche,
  onTester,
  idEnCours,
}: {
  fiche: FicheMarchand;
  onTester: (webhook: Webhook) => void;
  idEnCours: string | null;
}) {
  if (fiche.webhooksParApplication.length === 0) {
    return (
      <Carte avecBordure={false}>
        <EtatVide
          raison="aucune-donnee"
          titre="Aucun webhook"
          description="Aucune notification n'est configurée pour ce marchand. Il ne sera prévenu d'aucun paiement, d'aucun remboursement, d'aucun litige."
          icone={Send}
        />
      </Carte>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {fiche.webhooksParApplication.map((groupe) => (
        <TableauWebhooks
          key={groupe.application.id}
          titre={groupe.application.nom}
          mode={groupe.application.mode}
          webhooks={groupe.webhooks}
          onTester={onTester}
          idEnCours={idEnCours}
        />
      ))}
    </div>
  );
}

export function TableauWebhooks({
  titre,
  mode,
  webhooks,
  onTester,
  idEnCours,
}: {
  titre: string;
  mode: Application["mode"];
  webhooks: Webhook[];
  onTester: (webhook: Webhook) => void;
  idEnCours: string | null;
}) {
  const colonnes: Colonne<Webhook>[] = [
    {
      cle: "evenement",
      entete: "Événement",
      largeur: "20%",
      squelette: "70%",
      cellule: (w) => <span className="truncate text-fg-primary">{w.evenement}</span>,
    },
    {
      cle: "adresse",
      entete: "Adresse",
      largeur: "28%",
      squelette: "90%",
      cellule: (w) => (
        <code className="block truncate font-mono text-mention" title={w.adresse}>
          {w.adresse}
        </code>
      ),
    },
    {
      cle: "envoi",
      entete: "Dernier envoi",
      largeur: "17%",
      squelette: "60%",
      cellule: (w) =>
        w.dernierEnvoi === null ? (
          <span className="text-fg-muted">
            <span aria-hidden="true">Jamais envoyé</span>
            <span className="sr-only">Aucune notification envoyée à ce jour</span>
          </span>
        ) : (
          <DateValeur valeur={w.dernierEnvoi} className="text-fg-secondary" />
        ),
    },
    {
      cle: "sante",
      entete: "Santé",
      largeur: "20%",
      squelette: "75%",
      cellule: (w) => <SanteWebhook taux={w.tauxEchecsRecents} />,
    },
    {
      cle: "test",
      entete: "Test",
      largeur: "15%",
      squelette: "70%",
      cellule: (w) => (
        <span className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onTester(w)}
            disabled={idEnCours === w.id}
          >
            <Send className="size-4" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
            {idEnCours === w.id ? "Envoi..." : "Tester"}
          </Button>
        </span>
      ),
    },
  ];

  return (
    <Tableau
      titre={titre}
      sousTitre={`${LIBELLE_MODE[mode]} · ${EXPLICATION_MODE[mode]}`}
      colonnes={colonnes}
      lignes={webhooks}
      cleLigne={(w) => w.id}
      etatVide={
        <EtatVide
          raison="aucune-donnee"
          titre="Aucune adresse pour cette application"
          description="Aucune notification n'est envoyée pour cette application."
          icone={Send}
        />
      }
    />
  );
}

/*
 * Sante d'une adresse de notification.
 *
 * Le seuil est ecrit dans le libelle plutot que suggere par la couleur, et
 * un taux non calculable se dit, il ne se remplace pas par zero : "0 %
 * d'echecs" et "pas assez d'envois" sont deux constats opposes.
 */
function SanteWebhook({ taux }: { taux: Incertain<number> }) {
  if (taux === undefined) {
    return (
      <PastilleEtat genre="neutre" libelle="Pas assez d'envois" />
    );
  }
  if (taux === null) {
    return <Texte valeur={null} />;
  }

  const genre = taux >= 25 ? "danger" : taux >= 5 ? "attente" : "succes";

  return (
    <PastilleEtat
      genre={genre}
      libelle={`${formatPourcentage(taux, 0)} d'échecs récents`}
    />
  );
}

/* --- Onglet Activite --- */

/*
 * L'onglet Activite existe dans les maquettes mais aucune capture ne montre
 * son contenu. Il n'est donc pas integre : deviner un ecran jamais vu serait
 * pire que dire qu'il manque.
 */
export function OngletActivite() {
  return (
    <Carte avecBordure={false}>
      <EtatVide
        raison="aucune-donnee"
        titre="Onglet non intégré, faute de maquette"
        description="L'onglet Activité apparaît dans la barre d'onglets des quatre captures de la fiche marchand, mais aucune ne montre son contenu."
      />
    </Carte>
  );
}
