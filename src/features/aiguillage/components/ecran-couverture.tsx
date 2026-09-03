import { useMemo } from "react";
import { Check, Lock, SquareDashed } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BarreFiltres, ChampRecherche, GroupeBascule } from "@/components/shared/barre-filtres";
import { Carte } from "@/components/shared/carte";
import { CorpsEcran, EnTeteEcran } from "@/components/shared/coque-application";
import { Drapeau } from "@/components/shared/drapeau";
import { EtatVide } from "@/components/shared/etat-vide";
import { Tableau, type Colonne } from "@/components/shared/tableau";
import { formatEntier } from "@/lib/format";
import { TRAIT_ICONE } from "@/lib/icones";
import { cn } from "@/lib/utils";
import { useDestinations, useIndicateursCouverture } from "../hooks/use-aiguillage";
import { useAiguillage } from "../store";
import type { CaseCouverture, Destination } from "../types";

/*
 * Carte de couverture. Relevee dans BCP/carte de couverture.png.
 *
 * L'ecran existe pour montrer ce que la plateforme ne sait pas faire. Les
 * trois etats d'une case sont donc rendus avec le meme soin, et chacun porte
 * son libelle ecrit : "servi", "a ouvrir" et "ferme" ne se distinguent pas
 * par la seule couleur du fond.
 */

const APPARENCE = {
  servi: {
    icone: Check,
    classe: "bg-success-subtle text-success-fg",
    lecture: "Servi",
  },
  ouvrable: {
    icone: SquareDashed,
    classe: "bg-warning-subtle text-warning-text",
    lecture: "À ouvrir",
  },
  ferme: {
    icone: Lock,
    classe: "bg-muted text-fg-secondary",
    lecture: "Fermé",
  },
} as const;

export function EcranCouverture() {
  const destinations = useDestinations();
  const indicateurs = useIndicateursCouverture();

  const recherche = useAiguillage((e) => e.rechercheCouverture);
  const definirRecherche = useAiguillage((e) => e.definirRechercheCouverture);
  const filtre = useAiguillage((e) => e.filtreCouverture);
  const definirFiltre = useAiguillage((e) => e.definirFiltreCouverture);

  const lignes = useMemo(() => {
    if (!destinations.data) return undefined;
    const terme = recherche.trim().toLowerCase();
    return destinations.data.filter((d) => {
      if (filtre !== "tous") {
        /* Une destination est retenue des qu'un de ses deux sens porte
           l'etat cherche : encaisser et decaisser se decident separement. */
        const etats = [d.encaissement.etat, d.decaissement.etat];
        if (!etats.includes(filtre)) return false;
      }
      if (!terme) return true;
      return (
        d.portefeuille.toLowerCase().includes(terme) ||
        d.precision.toLowerCase().includes(terme)
      );
    });
  }, [destinations.data, recherche, filtre]);

  const colonnes: Colonne<Destination>[] = [
    {
      cle: "destination",
      entete: "Destination",
      largeur: "32%",
      squelette: "70%",
      cellule: (d) => (
        <span className="flex min-w-0 items-center gap-3">
          <Drapeau code={d.pays} />
          <span className="min-w-0">
            <span className="block truncate text-fg-primary">{d.portefeuille}</span>
            <span className="block truncate text-[13px] text-fg-secondary">
              {d.precision}
            </span>
          </span>
        </span>
      ),
    },
    {
      cle: "encaissement",
      entete: "Encaissement",
      largeur: "34%",
      squelette: "85%",
      cellule: (d) => <Case valeur={d.encaissement} />,
    },
    {
      cle: "decaissement",
      entete: "Décaissement",
      largeur: "34%",
      squelette: "85%",
      cellule: (d) => <Case valeur={d.decaissement} />,
    },
  ];

  return (
    <CorpsEcran>
      <EnTeteEcran
        titre="Carte de couverture"
        description="Ce que la plateforme sait faire, et où. Les cases vides comptent autant que les autres : elles disent où élargir."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <IndicateurCouverture
          etiquette="Vide ouvrable"
          valeur={indicateurs.data?.videOuvrable}
          precision="Un fournisseur déjà intégré sait servir ces croisements. Dix secondes de travail."
          etat="ouvrable"
          chargement={indicateurs.isPending}
        />
        <IndicateurCouverture
          etiquette="Vide fermé"
          valeur={indicateurs.data?.videFerme}
          precision="Aucun fournisseur intégré ne sait les servir. Des semaines et une négociation."
          etat="ferme"
          chargement={indicateurs.isPending}
        />
        <IndicateurCouverture
          etiquette="Croisements servis"
          valeur={indicateurs.data?.croisementsServis}
          precision="Croisements déjà couverts, les deux sens confondus."
          etat="servi"
          chargement={indicateurs.isPending}
        />
      </div>

      <BarreFiltres
        recherche={
          <ChampRecherche
            libelle="Rechercher une destination"
            indication="Portefeuille, pays, opérateur"
            valeur={recherche}
            onChangement={definirRecherche}
          />
        }
        bascule={
          <GroupeBascule
            libelleGroupe="Filtrer les destinations par couverture"
            valeur={filtre}
            onChangement={definirFiltre}
            options={[
              { valeur: "tous", libelle: "Tous" },
              { valeur: "servi", libelle: "Servi" },
              { valeur: "ouvrable", libelle: "Ouvrable" },
              { valeur: "ferme", libelle: "Fermé" },
            ]}
          />
        }
      />

      <Tableau
        titre={
          lignes === undefined
            ? undefined
            : `${formatEntier(lignes.length)} ${lignes.length === 1 ? "destination" : "destinations"}`
        }
        sousTitre="Encaisser et décaisser se décident séparément."
        colonnes={colonnes}
        lignes={lignes}
        cleLigne={(d) => d.id}
        chargement={destinations.isPending}
        erreur={destinations.error}
        onReessayer={() => destinations.refetch()}
        lignesSquelette={10}
        etatVide={
          recherche.trim() || filtre !== "tous" ? (
            <EtatVide
              raison="aucun-resultat"
              titre="Aucune destination ne correspond"
              description="Aucune destination ne correspond à la recherche et au filtre actifs. Videz-les pour revoir la carte complète."
            />
          ) : (
            <EtatVide
              raison="aucune-donnee"
              titre="Aucune destination connue"
              description="Le référentiel ne décrit aucune destination. La carte de couverture n'a rien à montrer tant qu'aucun portefeuille n'est déclaré."
            />
          )
        }
      />
    </CorpsEcran>
  );
}

/*
 * Case de couverture.
 *
 * Trois etats, trois libelles ecrits. "Aucun fournisseur intégré" et
 * "À ouvrir" disent deux choses opposees et ne doivent jamais se lire au
 * seul contraste des fonds.
 */
function Case({ valeur }: { valeur: CaseCouverture }) {
  const apparence = APPARENCE[valeur.etat];
  const Icone = apparence.icone;

  const libelle =
    valeur.etat === "servi"
      ? valeur.fournisseur
      : valeur.etat === "ouvrable"
        ? `À ouvrir · ${formatEntier(valeur.candidats)} ${valeur.candidats === 1 ? "candidat" : "candidats"}`
        : "Aucun fournisseur intégré";

  return (
    <span
      className={cn(
        "flex min-w-0 items-center gap-2 rounded-md px-3 py-2 text-sm",
        apparence.classe,
      )}
    >
      <Icone className="size-4 shrink-0" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
      <span className="sr-only">{apparence.lecture} : </span>
      <span className="truncate">{libelle}</span>
    </span>
  );
}

function IndicateurCouverture({
  etiquette,
  valeur,
  precision,
  etat,
  chargement,
}: {
  etiquette: string;
  valeur: number | undefined;
  precision: string;
  etat: keyof typeof APPARENCE;
  chargement: boolean;
}) {
  const apparence = APPARENCE[etat];
  const Icone = apparence.icone;

  return (
    <Carte className="flex flex-col gap-3 px-6 py-6">
      <p className="flex items-center gap-2 text-[15px] text-fg-secondary">
        <span
          aria-hidden="true"
          className={cn("grid size-6 place-items-center rounded-sm", apparence.classe)}
        >
          <Icone className="size-3.5" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
        </span>
        {etiquette}
      </p>

      {chargement ? (
        <Skeleton className="h-9 w-24" />
      ) : (
        <p
          className={cn(
            "tabular text-[34px] leading-none font-semibold",
            etat === "ouvrable" && "text-warning-text",
            etat === "servi" && "text-success-fg",
            etat === "ferme" && "text-fg-primary",
          )}
        >
          {formatEntier(valeur)}
        </p>
      )}

      <p className="text-sm leading-relaxed text-fg-secondary">{precision}</p>
    </Carte>
  );
}
