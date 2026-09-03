import { useMemo, useState } from "react";
import { ChevronRight, ShieldPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Bandeau } from "@/components/shared/bandeau";
import { BarreFiltres, ChampRecherche, GroupeBascule } from "@/components/shared/barre-filtres";
import { CorpsEcran, EnTeteEcran } from "@/components/shared/coque-application";
import { EtatVide } from "@/components/shared/etat-vide";
import { PastilleEtat } from "@/components/shared/pastille-etat";
import { Tableau, type Colonne } from "@/components/shared/tableau";
import { ActionLigne, GroupeActions } from "@/components/shared/actions-ligne";
import { formatAnciennete, formatDateHeure, formatEntier } from "@/lib/format";
import { TRAIT_ICONE } from "@/lib/icones";
import { LIBELLE_ROLE } from "@/lib/libelles";
import type { Role } from "@/stores/session";
import { useAdministration } from "../hooks/use-administration";
import { useAdministrationStore } from "../store";
import { ModaleCreerCompte } from "./modales";
import type { Compte, DescriptionRole } from "../types";

/*
 * Comptes et droits. Releve dans BCP/compte et role.png.
 *
 * La colonne du milieu n'affiche pas seulement le nom du role : elle dit ce
 * qu'il permet. Savoir qu'un compte est "Exploitant" n'apprend rien a qui ne
 * connait pas la matrice de droits par coeur.
 */

type FiltreRole = "tous" | Role;

/* La maquette n'offre pas de filtre "Support" alors qu'elle annonce quatre
   roles. Il est ajoute ici, sans quoi deux comptes seraient introuvables. */
const FILTRES: Array<{ valeur: FiltreRole; libelle: string }> = [
  { valeur: "tous", libelle: "Tous" },
  { valeur: "administrateur", libelle: "Admin" },
  { valeur: "exploitant", libelle: "Exploitant" },
  { valeur: "support", libelle: "Support" },
  { valeur: "lecture-seule", libelle: "Lecture seule" },
];

const GENRE_ROLE: Record<Role, "succes" | "neutre"> = {
  administrateur: "succes",
  exploitant: "neutre",
  support: "neutre",
  "lecture-seule": "neutre",
};

export function EcranComptes() {
  const { data, isPending, error, refetch } = useAdministration();
  const [recherche, setRecherche] = useState("");
  const [filtre, setFiltre] = useState<FiltreRole>("tous");
  const modale = useAdministrationStore((e) => e.modale);
  const ouvrirModale = useAdministrationStore((e) => e.ouvrirModale);
  const fermerModale = useAdministrationStore((e) => e.fermerModale);

  const lignes = useMemo(() => {
    if (!data) return undefined;
    const terme = recherche.trim().toLowerCase();
    return data.comptes.filter((c) => {
      if (filtre !== "tous" && c.role !== filtre) return false;
      if (!terme) return true;
      return (
        c.nom.toLowerCase().includes(terme) ||
        c.courriel.toLowerCase().includes(terme)
      );
    });
  }, [data, recherche, filtre]);

  const options = useMemo(() => {
    if (!data) return FILTRES;
    return FILTRES.map((f) => ({
      ...f,
      nombre:
        f.valeur === "tous"
          ? data.comptes.length
          : data.comptes.filter((c) => c.role === f.valeur).length,
    }));
  }, [data]);

  const administrateurs =
    data?.comptes.filter((c) => c.role === "administrateur" && c.actif).length ?? 0;

  const parRole = useMemo(() => {
    const table = new Map<Role, DescriptionRole>();
    for (const role of data?.roles ?? []) table.set(role.role, role);
    return table;
  }, [data]);

  const colonnes: Colonne<Compte>[] = [
    {
      cle: "compte",
      entete: "Compte",
      largeur: "26%",
      squelette: "70%",
      cellule: (c) => (
        <span className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden="true"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-mention font-medium text-primary-foreground"
          >
            {c.nom
              .split(/\s+/)
              .slice(0, 2)
              .map((mot) => mot.charAt(0).toUpperCase())
              .join("")}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-fg-primary">{c.nom}</span>
            <span className="block truncate text-mention text-fg-secondary">
              {c.courriel}
            </span>
          </span>
        </span>
      ),
    },
    {
      cle: "role",
      entete: "Rôle et ce qu'il permet",
      largeur: "44%",
      squelette: "90%",
      cellule: (c) => {
        const description = parRole.get(c.role);
        return (
          <div className="py-1">
            <PastilleEtat genre={GENRE_ROLE[c.role]} libelle={LIBELLE_ROLE[c.role]} />
            {description && (
              <>
                <ul className="mt-2 flex flex-col gap-1">
                  {description.permissions.map((permission) => (
                    <li
                      key={permission}
                      className="flex gap-2 text-mention leading-relaxed text-fg-secondary"
                    >
                      <span aria-hidden="true" className="text-fg-muted">
                        ·
                      </span>
                      <span>{permission}</span>
                    </li>
                  ))}
                </ul>
                <span className="mt-2 inline-flex items-center gap-1 text-mention font-medium text-warning-text">
                  <ChevronRight className="size-4" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
                  {formatEntier(description.nombreDroits)} droits élémentaires
                </span>
              </>
            )}
          </div>
        );
      },
    },
    {
      cle: "connexion",
      entete: "Dernière connexion",
      largeur: "18%",
      squelette: "60%",
      cellule: (c) =>
        /* Jamais connecte n'est pas une date inconnue : c'est un fait, et il
           dit qu'un compte a ete cree sans jamais servir. */
        c.derniereConnexion === null ? (
          <span className="text-fg-muted">
            <span aria-hidden="true">Jamais connecté</span>
            <span className="sr-only">Ce compte ne s'est jamais connecté</span>
          </span>
        ) : (
          <span
            className="text-fg-secondary"
            title={formatDateHeure(c.derniereConnexion)}
          >
            {formatAnciennete(c.derniereConnexion)}
          </span>
        ),
    },
    {
      cle: "actions",
      entete: "",
      largeur: "12%",
      squelette: "60%",
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
    <CorpsEcran>
      <EnTeteEcran
        titre="Comptes et droits"
        description={
          data
            ? `${formatEntier(data.comptes.length)} comptes · ${formatEntier(data.roles.length)} rôles · ${formatEntier(data.droitsElementaires)} droits élémentaires`
            : "Qui accède à la plateforme, et ce que chacun peut y faire."
        }
        action={
          <Button type="button" onClick={() => ouvrirModale("creer-compte")}>
            <ShieldPlus className="size-4" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
            Ajouter un administrateur
          </Button>
        }
      />

      {!isPending && administrateurs < 2 && (
        <Bandeau
          genre="attente"
          titre="Aucun marchand ne peut être approuvé pour l'instant"
          description={`L'approbation d'un dossier marchand exige deux administrateurs distincts. Il n'en existe qu'un seul (${formatEntier(administrateurs)}). Créez un second administrateur pour débloquer les validations.`}
        />
      )}

      <BarreFiltres
        recherche={
          <ChampRecherche
            libelle="Rechercher un compte"
            indication="Nom, adresse électronique"
            valeur={recherche}
            onChangement={setRecherche}
          />
        }
        bascule={
          <GroupeBascule
            libelleGroupe="Filtrer les comptes par rôle"
            valeur={filtre}
            onChangement={setFiltre}
            options={options}
          />
        }
      />

      <Tableau
        titre={
          lignes === undefined
            ? undefined
            : `${formatEntier(lignes.length)} ${lignes.length === 1 ? "compte" : "comptes"}`
        }
        colonnes={colonnes}
        lignes={lignes}
        cleLigne={(c) => c.id}
        chargement={isPending}
        erreur={error}
        onReessayer={() => refetch()}
        lignesSquelette={5}
        /* Les cellules de role portent trois lignes de texte : le squelette
           doit avoir la meme hauteur que la ligne chargee. */
        hauteurLigne="h-[152px]"
        etatVide={
          <EtatVide
            raison={recherche.trim() || filtre !== "tous" ? "aucun-resultat" : "aucune-donnee"}
            titre="Aucun compte ne correspond"
            description="Aucun compte ne correspond à la recherche et au filtre actifs. Videz-les pour revoir la liste complète."
          />
        }
      />

      <ModaleCreerCompte
        ouverte={modale === "creer-compte"}
        onFermer={fermerModale}
      />
    </CorpsEcran>
  );
}
